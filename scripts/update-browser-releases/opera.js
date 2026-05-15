/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {RSSItem} from './utils.js' */

/**
 * @typedef {object} Release
 * @property {string} version
 * @property {string} date
 * @property {string} releaseNote
 * @property {'current'} channel
 * @property {'Blink'} engine
 * @property {string} engineVersion
 */

import fs from 'node:fs/promises';

import stringify from '../lib/stringify-and-order-properties.js';

import {
  createOrUpdateBrowserEntry,
  getRSSItems,
  gfmNoteblock,
  updateBrowserEntry,
} from './utils.js';

/**
 * Yields RSS items across pages until there are no more items or the page limit is reached.
 * @param {string} baseURL the base URL of the RSS feed.
 * @param {number} maxPages the maximum number of pages to fetch.
 * @yields {RSSItem} the RSS items.
 */
async function* feedItems(baseURL, maxPages = 1) {
  for (let page = 1; page <= maxPages; page++) {
    const url = page === 1 ? baseURL : `${baseURL}?paged=${page}`;
    const items = await getRSSItems(url);
    if (!items.length) {
      break;
    }
    yield* items;
  }
}

/**
 * Builds a Release object from an RSS item.
 * @param {RSSItem} item the RSS item.
 * @param {RegExp} titleVersionPattern the pattern to match the title and extract the version.
 * @param {RegExp} descriptionEngineVersionPattern the pattern to match the description and extract the engine version.
 * @returns {Promise<Release>} the release.
 */
const buildRelease = async (
  item,
  titleVersionPattern,
  descriptionEngineVersionPattern,
) => {
  const version = /** @type {RegExpMatchArray} */ (
    item.title.match(titleVersionPattern)
  )[1];
  const date = new Date(item.pubDate).toISOString().split('T')[0];
  const releaseNote = item.link;
  const engineVersion = await findEngineVersion(
    item,
    descriptionEngineVersionPattern,
  );

  return {
    version,
    date,
    releaseNote,
    channel: 'current',
    engine: 'Blink',
    engineVersion,
  };
};

/**
 * Extracts the engine version from the item.
 * @param {RSSItem} item the RSS item.
 * @param {RegExp} engineVersionPattern the pattern to match the description or content.
 * @returns {Promise<string>} the engine version, found
 * @throws {Error} if engine version cannot be found
 */
const findEngineVersion = async (item, engineVersionPattern) => {
  const descriptionMatch = item.description.match(engineVersionPattern);

  if (descriptionMatch) {
    return descriptionMatch[1];
  }

  const res = await fetch(item.link);

  if (!res.ok) {
    throw Error(`Failed to fetch: ${item.link}`);
  }

  const html = await res.text();
  const text = html.replaceAll(/<[^>]*>/g, '');

  const contentMatch = text.match(engineVersionPattern);

  if (contentMatch) {
    return contentMatch[1];
  }

  return '';
};

/**
 * Updates the JSON files listing the Opera browser releases.
 * @param {*} options The list of options for this type of Safari.
 * @returns {Promise<string>} The log of what has been generated (empty if nothing)
 */
export const updateOperaReleases = async (options) => {
  const browser = options.bcdBrowserName;

  const isDesktop = browser === 'opera';

  let result = '';

  const file = await fs.readFile(`${options.bcdFile}`, 'utf-8');
  const data = JSON.parse(file.toString());

  // Find the version currently tracked as "current" to use as stopping condition.
  const [currentBCDVersion] =
    Object.entries(data.browsers[browser].releases).find(
      ([, r]) => r.status === 'current',
    ) ?? [];

  const newItems = /** @type {RSSItem[]} */ ([]);

  for await (const item of feedItems(
    options.releaseFeedURL,
    options.maxFeedPages ?? 1,
  )) {
    if (
      options.releaseFilterCreator &&
      !options.releaseFilterCreator.includes(item['dc:creator'])
    ) {
      continue;
    }
    if (!options.titleVersionPattern.test(item.title)) {
      continue;
    }
    const version = /** @type {RegExpMatchArray} */ (
      item.title.match(options.titleVersionPattern)
    )[1];
    if (currentBCDVersion && Number(version) <= Number(currentBCDVersion)) {
      break;
    }
    newItems.push(item);
  }

  if (!newItems.length) {
    return gfmNoteblock(
      'NOTE',
      `**${options.browserName}**: No new release announcements found in [this RSS feed](<${options.releaseFeedURL}>).`,
    );
  }

  // Process releases from oldest to newest.
  for (const item of newItems.reverse()) {
    const release = await buildRelease(
      item,
      options.titleVersionPattern,
      options.descriptionEngineVersionPattern,
    );

    if (!release.engineVersion) {
      const existingEngineVersion =
        data.browsers[browser].releases[release.version]?.engine_version;
      if (!existingEngineVersion) {
        result += gfmNoteblock(
          'CAUTION',
          `**${options.browserName}**: No engine version found in [this blog post](<${release.releaseNote}>).`,
        );
        continue;
      }
      result += gfmNoteblock(
        'WARNING',
        `**${options.browserName}**: No engine version found in [this blog post](<${release.releaseNote}>). Using existing engine version instead.`,
      );
      release.engineVersion = existingEngineVersion;
    }

    result += createOrUpdateBrowserEntry(
      data,
      browser,
      release.version,
      release.channel,
      release.engine,
      release.engineVersion,
      release.date,
      release.releaseNote,
    );

    // Set previous release to "retired".
    result += updateBrowserEntry(
      data,
      browser,
      String(Number(release.version) - 1),
      undefined,
      'retired',
      undefined,
      undefined,
    );
  }

  if (isDesktop) {
    // Determine the latest processed release (last item after oldest-to-newest reversal).
    const latestVersion = /** @type {RegExpMatchArray} */ (
      newItems[newItems.length - 1].title.match(options.titleVersionPattern)
    )[1];
    const latestEngineVersion =
      data.browsers[browser].releases[latestVersion]?.engine_version;

    if (latestEngineVersion) {
      // 1. Set next release to "beta".
      result += createOrUpdateBrowserEntry(
        data,
        browser,
        String(Number(latestVersion) + 1),
        'beta',
        'Blink',
        String(Number(latestEngineVersion) + 1),
      );

      // 2. Add another release as "nightly".
      result += createOrUpdateBrowserEntry(
        data,
        browser,
        String(Number(latestVersion) + 2),
        'nightly',
        'Blink',
        String(Number(latestEngineVersion) + 2),
      );
    }
  }

  await fs.writeFile(`./${options.bcdFile}`, stringify(data) + '\n');

  // Returns the log
  if (result) {
    result = `### Updates for ${options.browserName}\n${result}`;
  }

  return result;
};
