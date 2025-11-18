import fs from 'node:fs/promises';

import stringify from '../lib/stringify-and-order-properties.js';

import {
  createOrUpdateBrowserEntry,
  getRSSItems,
  gfmNoteblock,
  RSSItem,
  updateBrowserEntry,
} from './utils.js';

interface Release {
  version: string;
  date: string;
  releaseNote: string;
  channel: 'current';
  engine: 'Blink';
  engineVersion: string;
}

/**
 * Extracts the latest release from the items.
 * @param items the RSS items.
 * @param titleVersionPattern the pattern to match the title and extract the version.
 * @param descriptionEngineVersionPattern the pattern to match the description and extract the engine version.
 * @returns the latest release, if found, otherwise null.
 */
const findRelease = async (
  items: RSSItem[],
  titleVersionPattern: RegExp,
  descriptionEngineVersionPattern: RegExp,
): Promise<Release | null> => {
  const item = items.find(
    (item) => titleVersionPattern.test(item.title) /* &&
      descriptionEngineVersionPattern.test(item.description)*/,
  );

  if (!item) {
    return null;
  }

  const version = (
    item.title.match(titleVersionPattern) as RegExpMatchArray
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
 * @param item the RSS item.
 * @param engineVersionPattern the pattern to match the description or content.
 * @returns the engine version, found
 * @throws {Error} if engine version cannot be found
 */
const findEngineVersion = async (
  item: RSSItem,
  engineVersionPattern: RegExp,
): Promise<string> => {
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
 * @param options The list of options for this type of Safari.
 * @returns The log of what has been generated (empty if nothing)
 */
export const updateOperaReleases = async (options) => {
  const browser = options.bcdBrowserName;

  const isDesktop = browser === 'opera';

  let result = '';

  const items = await getRSSItems(options.releaseFeedURL);

  const release = await findRelease(
    items.filter(
      (item) =>
        options.releaseFilterCreator?.includes(item['dc:creator']) ?? true,
    ),
    options.titleVersionPattern,
    options.descriptionEngineVersionPattern,
  );

  if (!release) {
    return gfmNoteblock(
      'NOTE',
      `**${options.browserName}**: No release announcement found among ${items.length} items in [this RSS feed](<${options.releaseFeedURL}>).`,
    );
  }

  const file = await fs.readFile(`${options.bcdFile}`, 'utf-8');
  const data = JSON.parse(file.toString());

  const current = structuredClone(
    data.browsers[browser].releases[release.version],
  );

  if (!release.engineVersion) {
    const currentEngineVersion = current.engine_version;
    if (!currentEngineVersion) {
      return gfmNoteblock(
        'CAUTION',
        `**${options.browserName}**: No engine version found in [this blog post](<${release.releaseNote}>).`,
      );
    }

    result += gfmNoteblock(
      'WARNING',
      `**${options.browserName}**: No engine version found in [this blog post](<${release.releaseNote}>). Using (previous engine version + 1) instead.`,
    );
    release.engineVersion = currentEngineVersion;
  }

  if (isDesktop && !current) {
    return gfmNoteblock(
      'WARNING',
      `Latest stable **${options.browserName}** release **${release.version}** not yet tracked.`,
    );
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
  const previousVersion = String(Number(release.version) - 1);
  result += updateBrowserEntry(
    data,
    browser,
    previousVersion,
    undefined,
    'retired',
    undefined,
    undefined,
  );

  if (isDesktop) {
    // 1. Set next release to "beta".
    result += createOrUpdateBrowserEntry(
      data,
      browser,
      String(Number(release.version) + 1),
      'beta',
      release.engine,
      String(Number(release.engineVersion) + 1),
    );

    // 2. Add another release as "nightly".
    result += createOrUpdateBrowserEntry(
      data,
      browser,
      String(Number(release.version) + 2),
      'nightly',
      release.engine,
      String(Number(release.engineVersion) + 2),
    );
  }

  await fs.writeFile(`./${options.bcdFile}`, stringify(data) + '\n');

  // Returns the log
  if (result) {
    result = `### Updates for ${options.browserName}\n${result}`;
  }

  return result;
};
