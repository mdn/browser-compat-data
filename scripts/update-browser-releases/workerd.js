/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {CompatData} from '../../types/types.js' */

/**
 * @typedef {object} WorkerdLatestMetadata
 * @property {string} version The published npm package version.
 * @property {string} [gitHead] The source commit published to npm.
 */

/**
 * @typedef {null | boolean | number | string | object | object[]} JSONValue
 */

/**
 * @typedef {object} WorkerdSupportFlag
 * @property {string} [name] The runtime flag name.
 */

/**
 * @typedef {object} WorkerdSupportData
 * @property {string | boolean | null} [version_added] The added version.
 * @property {string | boolean | null} [version_removed] The removed version.
 * @property {WorkerdSupportFlag[]} [flags] The support flags.
 */

import fs from 'node:fs/promises';

import { compareVersions } from 'compare-versions';

import stringify from '../lib/stringify-and-order-properties.js';

import {
  createOrUpdateBrowserEntry,
  gfmNoteblock,
  updateBrowserEntry,
} from './utils.js';

const WORKERD_NPM_LATEST_API = 'https://registry.npmjs.org/workerd/latest';
const WORKERD_RAW_BASE = 'https://raw.githubusercontent.com/cloudflare/workerd';
const WORKERD_INITIAL_COMPATIBILITY_DATE = '2022-09-27';
const WORKERD_LAUNCH_BLOG =
  'https://blog.cloudflare.com/workerd-open-source-workers-runtime/';
const WORKERD_COMPATIBILITY_FLAGS_DOC =
  'https://developers.cloudflare.com/workers/configuration/compatibility-flags/';
const USER_AGENT =
  'MDN-Browser-Release-Update-Bot/1.0 (+https://developer.mozilla.org/)';

const dashedDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const dottedDatePattern = /^\d{4}\.\d{2}\.\d{2}$/;

/**
 * Returns the earlier of two ISO dates.
 * @param {string} first The first date.
 * @param {string} second The second date.
 * @returns {string} The earlier date.
 */
const minDate = (first, second) => (first < second ? first : second);

/**
 * Fetches text with a consistent release updater user agent.
 * @param {string} url The URL to fetch.
 * @returns {Promise<string>} The response text.
 */
const fetchText = async (url) => {
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/plain',
    },
  });

  if (!res.ok) {
    throw new Error(`Fetch failed for ${url}: HTTP ${res.status}`);
  }

  return await res.text();
};

/**
 * Fetches latest workerd package metadata from npm.
 * @returns {Promise<WorkerdLatestMetadata>} The latest package metadata.
 */
const fetchLatestMetadata = async () => {
  const res = await fetch(WORKERD_NPM_LATEST_API, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(
      `Fetch failed for ${WORKERD_NPM_LATEST_API}: HTTP ${res.status}`,
    );
  }

  const metadata = /** @type {Partial<WorkerdLatestMetadata>} */ (
    await res.json()
  );

  if (!metadata.version) {
    throw new Error('workerd npm metadata did not include a version');
  }

  return {
    version: metadata.version,
    gitHead: metadata.gitHead,
  };
};

/**
 * Fetches a source file from the latest published workerd package tag or commit.
 * @param {WorkerdLatestMetadata} metadata The latest package metadata.
 * @param {string} sourcePath The path within the workerd repository.
 * @returns {Promise<string>} The source file contents.
 */
const fetchLatestSourceFile = async (metadata, sourcePath) => {
  const refs = [`v${metadata.version}`];

  if (metadata.gitHead) {
    refs.push(metadata.gitHead);
  }

  let lastErrorMessage = '';
  for (const ref of refs) {
    try {
      return await fetchText(`${WORKERD_RAW_BASE}/${ref}/${sourcePath}`);
    } catch (error) {
      lastErrorMessage = error instanceof Error ? error.message : String(error);
    }
  }

  throw new Error(
    `Failed to fetch ${sourcePath} for workerd@${metadata.version}: ${lastErrorMessage}`,
  );
};

/**
 * Converts a workerd compatibility date to a BCD version key.
 * @param {string} date A `YYYY-MM-DD` date.
 * @returns {string} The BCD dotted date key.
 */
const toDottedDate = (date) => date.replaceAll('-', '.');

/**
 * Converts a BCD workerd version key to a compatibility date.
 * @param {string} version A `YYYY.MM.DD` version key.
 * @returns {string} The workerd compatibility date.
 */
const toDashedDate = (version) => version.replaceAll('.', '-');

/**
 * Adds a value to a map of sets.
 * @param {Map<string, Set<string>>} map The map to update.
 * @param {string} key The key to update.
 * @param {string} value The value to add.
 * @returns {void}
 */
const addMapSetValue = (map, key, value) => {
  const values = map.get(key);

  if (values) {
    values.add(value);
  } else {
    map.set(key, new Set([value]));
  }
};

/**
 * Parses workerd compatibility flag metadata into flag-to-date mappings.
 * @param {string} source The compatibility-date.capnp source.
 * @returns {Map<string, Set<string>>} Compatibility dates keyed by runtime flag name.
 */
const parseCompatibilityFlagDates = (source) => {
  /** @type {Map<string, Set<string>>} */
  const datesByFlag = new Map();

  for (const block of source.split(';')) {
    const flagName = block.match(/\$compatEnableFlag\("([^"]+)"\)/)?.[1];

    if (!flagName) {
      continue;
    }

    const enableDate = block.match(
      /\$compatEnableDate\("(\d{4}-\d{2}-\d{2})"\)/,
    )?.[1];

    if (enableDate) {
      addMapSetValue(datesByFlag, flagName, enableDate);
    }

    const impliedDateMatches = block.matchAll(
      /\$impliedByAfterDate\([^)]*date\s*=\s*"(\d{4}-\d{2}-\d{2})"[^)]*\)/g,
    );

    for (const match of impliedDateMatches) {
      addMapSetValue(datesByFlag, flagName, match[1]);
    }
  }

  return datesByFlag;
};

/**
 * Collects workerd versions and runtime flags from support data.
 * @param {WorkerdSupportData | WorkerdSupportData[] | string} support The workerd support statement or statements.
 * @param {Set<string>} dates The dates to update.
 * @param {Set<string>} flags The flags to update.
 * @returns {void}
 */
const collectSupportStatementData = (support, dates, flags) => {
  const statements = Array.isArray(support) ? support : [support];

  for (const statement of statements) {
    if (!statement || typeof statement !== 'object') {
      continue;
    }

    const simple = /** @type {WorkerdSupportData} */ (statement);

    for (const version of [simple.version_added, simple.version_removed]) {
      if (typeof version === 'string' && dottedDatePattern.test(version)) {
        dates.add(version);
      }
    }

    if (!Array.isArray(simple.flags)) {
      continue;
    }

    for (const flag of simple.flags) {
      if (!flag || typeof flag !== 'object') {
        continue;
      }

      if (flag.name) {
        flags.add(flag.name);
      }
    }
  }
};

/**
 * Recursively collects all workerd support versions and runtime flags in BCD.
 * @param {JSONValue} node The current data node.
 * @param {Set<string>} dates The dates to update.
 * @param {Set<string>} flags The flags to update.
 * @returns {void}
 */
const collectWorkerdSupportData = (node, dates, flags) => {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      collectWorkerdSupportData(item, dates, flags);
    }
    return;
  }

  const record =
    /** @type {{ [key: string]: JSONValue } & { __compat?: { support?: { workerd?: WorkerdSupportData | WorkerdSupportData[] | string } } }} */ (
      node
    );

  if (record.__compat && typeof record.__compat === 'object') {
    const compat = record.__compat;
    if (compat.support?.workerd) {
      collectSupportStatementData(compat.support.workerd, dates, flags);
    }
  }

  for (const value of Object.values(record)) {
    collectWorkerdSupportData(value, dates, flags);
  }
};

/**
 * Returns the release notes URL for a workerd date checkpoint.
 * @param {string} version The BCD workerd version key.
 * @returns {string} The release notes URL.
 */
const releaseNotesForVersion = (version) =>
  version === toDottedDate(WORKERD_INITIAL_COMPATIBILITY_DATE)
    ? WORKERD_LAUNCH_BLOG
    : WORKERD_COMPATIBILITY_FLAGS_DOC;

/**
 * Updates the workerd releases.
 * @param {object} options - The options.
 * @param {'workerd'} options.bcdBrowserName - The name of the browser in the BCD file.
 * @param {string} options.bcdFile - The path to the BCD file.
 * @param {string} options.browserName - The name of the browser.
 * @returns {Promise<string>} The result.
 */
export const updateWorkerdReleases = async (options) => {
  const browser = options.bcdBrowserName;

  /** @type {string} */
  let fileText;
  try {
    fileText = await fs.readFile(options.bcdFile, 'utf-8');
  } catch {
    return gfmNoteblock(
      'NOTE',
      `**${options.browserName ?? 'workerd'}**: No browser data file found at ${options.bcdFile}. Add a seed file (e.g., browsers/workerd.json) before running updates.`,
    );
  }

  /** @type {CompatData} */
  const data = JSON.parse(fileText);

  if (!data.browsers[browser]) {
    return gfmNoteblock(
      'WARNING',
      `**${options.browserName ?? 'workerd'}**: No browser entry found for ${browser}.`,
    );
  }

  let metadata;
  let maximumCompatibilityDate;
  let releaseVersion;
  let compatibilityDateSource;

  try {
    metadata = await fetchLatestMetadata();
    maximumCompatibilityDate = (
      await fetchLatestSourceFile(
        metadata,
        'src/workerd/io/maximum-compatibility-date.txt',
      )
    ).trim();
    releaseVersion = (
      await fetchLatestSourceFile(
        metadata,
        'src/workerd/io/release-version.txt',
      )
    ).trim();
    compatibilityDateSource = await fetchLatestSourceFile(
      metadata,
      'src/workerd/io/compatibility-date.capnp',
    );
  } catch (e) {
    return gfmNoteblock(
      'WARNING',
      `**${options.browserName ?? 'workerd'}**: Failed to fetch release data (${e}).`,
    );
  }

  if (!dashedDatePattern.test(maximumCompatibilityDate)) {
    return gfmNoteblock(
      'WARNING',
      `**${options.browserName ?? 'workerd'}**: Invalid maximum compatibility date: ${maximumCompatibilityDate}.`,
    );
  }

  if (!dashedDatePattern.test(releaseVersion)) {
    return gfmNoteblock(
      'WARNING',
      `**${options.browserName ?? 'workerd'}**: Invalid release version date: ${releaseVersion}.`,
    );
  }

  // The maximum compatibility date can point at a future checkpoint that the
  // runtime refuses until that calendar date arrives. Use the published release
  // date as the current BCD checkpoint so public data never advertises a future
  // compatibility date as currently usable.
  const latestVersion = toDottedDate(
    minDate(releaseVersion, maximumCompatibilityDate),
  );
  const dates = new Set([
    toDottedDate(WORKERD_INITIAL_COMPATIBILITY_DATE),
    latestVersion,
  ]);
  const flags = new Set();

  const { default: bcd } = await import('../../index.js');
  collectWorkerdSupportData(/** @type {JSONValue} */ (bcd), dates, flags);

  const datesByFlag = parseCompatibilityFlagDates(compatibilityDateSource);
  for (const flag of flags) {
    for (const date of datesByFlag.get(flag) ?? []) {
      dates.add(toDottedDate(date));
    }
  }

  let result = '';
  const sortedDates = [...dates].sort(compareVersions);

  for (const version of sortedDates) {
    const status = version === latestVersion ? 'current' : 'retired';
    result += createOrUpdateBrowserEntry(
      data,
      browser,
      version,
      status,
      undefined,
      undefined,
      toDashedDate(version),
      releaseNotesForVersion(version),
    );
  }

  const existing = Object.keys(data.browsers[browser].releases ?? {});
  for (const version of existing) {
    if (version !== latestVersion) {
      result += updateBrowserEntry(
        data,
        browser,
        version,
        undefined,
        'retired',
        undefined,
        undefined,
      );
    }
  }

  await fs.writeFile(`./${options.bcdFile}`, stringify(data) + '\n');

  if (result) {
    result = `### Updates for ${options.browserName ?? 'workerd'}\n${result}`;
  }

  return result;
};
