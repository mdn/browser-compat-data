/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import xml2js from 'xml2js';

import { BrowserName, BrowserStatus, CompatData } from '../../types/types.js';

const USER_AGENT =
  'MDN-Browser-Release-Update-Bot/1.0 (+https://developer.mozilla.org/)';

export interface RSSItem {
  title: string;
  pubDate: string;
  description: string;
  link: string;
}

/**
 * newBrowserEntry - Add a new browser entry in the JSON list
 * @param json json file to update
 * @param browser the entry name where to add it in the bcd file
 * @param version new version to add
 * @param status new status
 * @param engine name of the engine
 * @param releaseDate new release date
 * @param releaseNotesURL url of the release notes
 * @param engineVersion the version of the engine
 * @returns Text describing what has been added
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
  return chalk`{yellow \n- New release detected for {bold ${browser}}: Version {bold ${version}} as a {bold ${status}} release.}`;
};

/**
 * updateBrowserEntry - Update browser entry in the JSON list
 * @param json json file to update
 * @param browser the entry name where to add it in the bcd file
 * @param version new version to add
 * @param releaseDate new release date
 * @param status new status
 * @param releaseNotesURL url of the release notes
 * @param engineVersion the version of the engine
 * @returns Text describing what has been updated
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
    result += chalk`{cyan \n- New status for {bold ${browser} ${version}}: {bold ${status}}, previously ${entry['status']}.}`;
    entry['status'] = status;
  }
  if (releaseDate && entry['release_date'] !== releaseDate) {
    result += chalk`{cyan \n- New release date for {bold ${browser} ${version}}: {bold ${releaseDate}}, previously ${entry['release_date']}.}`;
    entry['release_date'] = releaseDate;
  }
  if (releaseNotesURL && entry['release_notes'] !== releaseNotesURL) {
    result += chalk`{cyan \n- New release notes for {bold ${browser} ${version}}: {bold ${releaseNotesURL}}, previously ${entry['release_notes']}.}`;
    entry['release_notes'] = releaseNotesURL;
  }

  if (engineVersion && entry['engine_version'] != engineVersion) {
    result += chalk`{cyan \n- New engine version for {bold ${browser} ${version}}: {bold ${engineVersion}}, previously ${entry['engine_version']}.}`;
    entry['engine_version'] = engineVersion.toString();
  }

  return result;
};

/**
 * Creates or updates a browser entry, depending on whether it already exists.
 * @param json json file to update
 * @param browser the entry name where to add it in the bcd file
 * @param version the version to add
 * @param status the status
 * @param engine the name of the negine
 * @param engineVersion the version of the engine
 * @param releaseDate the release date
 * @param releaseNotesURL url of the release notes
 * @returns Text describing what has been updated
 */
export const createOrUpdateBrowserEntry = (
  json,
  browser,
  version,
  status: 'retired' | 'current' | 'beta' | 'nightly',
  engine: string | undefined,
  engineVersion: string | undefined,
  releaseDate: string | undefined = undefined,
  releaseNotesURL: string | undefined = undefined,
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
 * @param json json file to update
 * @param browser the entry name where to add it in the bcd file
 * @param version the version to add
 * @param status the status
 * @returns Text describing what has been updated
 */
export const setBrowserReleaseStatus = (
  json: CompatData,
  browser: BrowserName,
  version: string,
  status: BrowserStatus,
): string => {
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
 * @param url The URL of the RSS feed.
 * @returns Promise
 */
const fetchRSS = async (url: string) => {
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
 * @param rssText The content of the RSS feed.
 * @returns the RSS items.
 */
const parseRSS = async (rssText: string): Promise<RSSItem[]> => {
  const parser = new xml2js.Parser({ explicitArray: false });

  const result = await parser.parseStringPromise(rssText);

  return result.rss.channel.item;
};

/**
 * Fetches and parses an RSS feed.
 * @param url The URL of the RSS feed.
 * @returns the RSS items.
 */
export const getRSSItems = async (url): Promise<RSSItem[]> => {
  const rssText = await fetchRSS(url);
  const items = await parseRSS(rssText);

  return Array.isArray(items) ? items : [items];
};

/**
 * Converts a message into a GFM noteblock.
 * @param type the type of the noteblock.
 * @param message the message of the noteblock.
 * @returns the message as a GFM noteblock.
 */
export const gfmNoteblock = (
  type: 'NOTE' | 'WARNING' | 'CAUTION',
  message: string,
) =>
  `> [!${type}]\n${message
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n')}`;
