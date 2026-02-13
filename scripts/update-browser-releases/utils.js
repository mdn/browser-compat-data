/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {BrowserName, BrowserStatus, CompatData} from '../../types/types.js' */

/**
 * @typedef {object} RSSItem
 * @property {string} title
 * @property {string} pubDate
 * @property {string} description
 * @property {string} link
 */

import { styleText } from 'node:util';

import xml2js from 'xml2js';

const USER_AGENT =
  'MDN-Browser-Release-Update-Bot/1.0 (+https://developer.mozilla.org/)';

/**
 * newBrowserEntry - Add a new browser entry in the JSON list
 * @param {*} json json file to update
 * @param {string} browser the entry name where to add it in the bcd file
 * @param {string} version new version to add
 * @param {string} status new status
 * @param {string | undefined} engine name of the engine
 * @param {string | undefined} releaseDate new release date
 * @param {string | undefined} releaseNotesURL url of the release notes
 * @param {string | undefined} engineVersion the version of the engine
 * @returns {string} Text describing what has been added
 */
export const newBrowserEntry = (
  json,
  browser,
  version,
  status,
  engine,
  releaseDate,
  releaseNotesURL,
  engineVersion,
) => {
  const release = (json.browsers[browser].releases[version] = {});
  if (releaseDate) {
    release['release_date'] = releaseDate;
  }
  if (releaseNotesURL) {
    release['release_notes'] = releaseNotesURL;
  }
  release['status'] = status;
  release['engine'] = engine;
  if (engineVersion) {
    release['engine_version'] = engineVersion.toString();
  }
  return styleText(
    'yellow',
    `\n- New release detected for ${styleText('bold', browser)}: Version ${styleText('bold', version)} as a ${styleText('bold', status)} release.`,
  );
};

/**
 * updateBrowserEntry - Update browser entry in the JSON list
 * @param {*} json json file to update
 * @param {string} browser the entry name where to add it in the bcd file
 * @param {string} version new version to add
 * @param {string | undefined} releaseDate new release date
 * @param {string} status new status
 * @param {string | undefined} releaseNotesURL url of the release notes
 * @param {string | undefined} engineVersion the version of the engine
 * @returns {string} Text describing what has been updated
 */
export const updateBrowserEntry = (
  json,
  browser,
  version,
  releaseDate,
  status,
  releaseNotesURL,
  engineVersion,
) => {
  const entry = json.browsers[browser].releases[version];
  let result = '';
  if (entry['status'] !== status) {
    result += styleText(
      'cyan',
      `\n- New status for ${styleText('bold', `${browser} ${version}`)}: ${styleText('bold', status)}, previously ${entry['status']}.`,
    );
    entry['status'] = status;
  }
  if (releaseDate && entry['release_date'] !== releaseDate) {
    result += styleText(
      'cyan',
      `\n- New release date for ${styleText('bold', `${browser} ${version}`)}: ${styleText('bold', releaseDate)}, previously ${entry['release_date']}.`,
    );
    entry['release_date'] = releaseDate;
  }
  if (releaseNotesURL && entry['release_notes'] !== releaseNotesURL) {
    result += styleText(
      'cyan',
      `\n- New release notes for ${styleText('bold', `${browser} ${version}`)}: ${styleText('bold', releaseNotesURL)}, previously ${entry['release_notes']}.`,
    );
    entry['release_notes'] = releaseNotesURL;
  }

  if (engineVersion && entry['engine_version'] != engineVersion) {
    result += styleText(
      'cyan',
      `\n- New engine version for ${styleText('bold', `${browser} ${version}`)}: ${styleText('bold', String(engineVersion))}, previously ${entry['engine_version']}.`,
    );
    entry['engine_version'] = engineVersion.toString();
  }

  return result;
};

/**
 * Creates or updates a browser entry, depending on whether it already exists.
 * @param {*} json json file to update
 * @param {string} browser the entry name where to add it in the bcd file
 * @param {string} version the version to add
 * @param {'retired' | 'current' | 'beta' | 'nightly'} status the status
 * @param {string | undefined} engine the name of the engine
 * @param {string | undefined} engineVersion the version of the engine
 * @param {string | undefined} [releaseDate] the release date
 * @param {string | undefined} [releaseNotesURL] url of the release notes
 * @returns {string} Text describing what has been updated
 */
export const createOrUpdateBrowserEntry = (
  json,
  browser,
  version,
  status,
  engine,
  engineVersion,
  releaseDate = undefined,
  releaseNotesURL = undefined,
) => {
  if (json.browsers[browser].releases[version]) {
    return updateBrowserEntry(
      json,
      browser,
      version,
      releaseDate,
      status,
      releaseNotesURL,
      engineVersion,
    );
  }

  return newBrowserEntry(
    json,
    browser,
    version,
    status,
    engine,
    releaseDate,
    releaseNotesURL,
    engineVersion,
  );
};

/**
 * Updates the status of a browser release.
 * @param {CompatData} json json file to update
 * @param {BrowserName} browser the entry name where to add it in the bcd file
 * @param {string} version the version to add
 * @param {BrowserStatus} status the status
 * @returns {string} Text describing what has been updated
 */
export const setBrowserReleaseStatus = (json, browser, version, status) => {
  const release = json.browsers[browser].releases[version];

  if (release.status === status) {
    return '';
  }

  return updateBrowserEntry(
    json,
    browser,
    version,
    release.release_date,
    status,
    '',
    '',
  );
};

/**
 * Fetches an RSS feed, using a typical RSS user agent.
 * @param {string} url The URL of the RSS feed.
 * @returns {Promise<string>} Promise
 */
const fetchRSS = async (url) => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.text();
};

/**
 * Parses an RSS feed into a JSON object.
 * @param {string} rssText The content of the RSS feed.
 * @returns {Promise<RSSItem[]>} the RSS items.
 */
const parseRSS = async (rssText) => {
  const parser = new xml2js.Parser({ explicitArray: false });

  const result = await parser.parseStringPromise(rssText);

  return result.rss.channel.item;
};

/**
 * Fetches and parses an RSS feed.
 * @param {string} url The URL of the RSS feed.
 * @returns {Promise<RSSItem[]>} the RSS items.
 */
export const getRSSItems = async (url) => {
  const rssText = await fetchRSS(url);
  const items = await parseRSS(rssText);

  return Array.isArray(items) ? items : [items];
};

/**
 * Converts a message into a GFM noteblock.
 * @param {'NOTE' | 'WARNING' | 'CAUTION'} type the type of the noteblock.
 * @param {string} message the message of the noteblock.
 * @returns {string} the message as a GFM noteblock.
 */
export const gfmNoteblock = (type, message) =>
  `> [!${type}]\n${message
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n')}`;
