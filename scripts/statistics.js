/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { styleText } from 'node:util';

import esMain from 'es-main';
import { markdownTable } from 'markdown-table';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import bcdData from '../index.js';

import { getRefDate } from './release/utils.js';

/** @import {BrowserName, CompatStatement, SupportStatement, Identifier} from '../types/types.js' */

/**
 * @typedef {object} VersionStatsEntry
 * @property {number} all
 * @property {number} exact
 * @property {number} range
 */

/**
 * @typedef {Record<string, VersionStatsEntry>} VersionStats
 */

/** @type {BrowserName[]} */
const webextensionsBrowsers = [
  'chrome',
  'edge',
  'firefox',
  'opera',
  'safari',
  'firefox_android',
  'safari_ios',
];

/**
 * Check whether a support statement is a specified type
 * @param {SupportStatement | undefined} supportData The support statement to check
 * @param {string | boolean | null} type What type of support (true, null, ranged)
 * @returns {boolean} If the support statement has the type
 */
const checkSupport = (supportData, type) => {
  if (!supportData) {
    return type === null;
  }
  if (Array.isArray(supportData)) {
    return supportData.some((s) => checkSupport(s, type));
  }
  if (type == '≤') {
    return (
      (typeof supportData.version_added == 'string' &&
        supportData.version_added.startsWith('≤')) ||
      (typeof supportData.version_removed == 'string' &&
        supportData.version_removed.startsWith('≤'))
    );
  }
  return (
    supportData.version_added === type || supportData.version_removed === type
  );
};

/**
 * Iterate through all of the browsers and count the number of exact ranged values for each browser
 * @param {CompatStatement} data The data to process and count stats for
 * @param {BrowserName[]} browsers The browsers to test
 * @param {VersionStats} stats The stats object to update
 * @returns {void}
 */
const processData = (data, browsers, stats) => {
  if (data.support) {
    browsers.forEach((browser) => {
      stats[browser].all++;
      stats.total.all++;
      if (checkSupport(data.support[browser], '≤')) {
        stats[browser].range++;
        stats.total.range++;
      } else {
        stats[browser].exact++;
        stats.total.exact++;
      }
    });
  }
};

/**
 * Iterate through all of the data and process statistics
 * @param {Identifier} data The compat data to iterate
 * @param {BrowserName[]} browsers The browsers to test
 * @param {VersionStats} stats The stats object to update
 * @returns {void}
 */
const iterateData = (data, browsers, stats) => {
  for (const key in data) {
    if (key === '__compat') {
      // "as CompatStatement" needed because TypeScript doesn't realize key is in data
      processData(/** @type {CompatStatement} */ (data[key]), browsers, stats);
    } else {
      iterateData(data[key], browsers, stats);
    }
  }
};

/**
 * Get all of the stats
 * @param {string} folder The folder to show statistics for (or all folders if blank)
 * @param {boolean} allBrowsers If true, get stats for all browsers, not just main eight
 * @param {*} [bcd] The BCD data to use. Defaults to the main BCD data.
 * @returns {VersionStats | null} The statistics
 */
const getStats = (folder, allBrowsers, bcd = bcdData) => {
  /** @type {BrowserName[]} */
  const browsers = allBrowsers
    ? /** @type {BrowserName[]} */ (Object.keys(bcd.browsers))
    : folder === 'webextensions'
      ? webextensionsBrowsers
      : /** @type {BrowserName[]} */ ([
          'chrome',
          'chrome_android',
          'edge',
          'firefox',
          'safari',
          'safari_ios',
          'webview_android',
        ]);

  /** @type {VersionStats} */
  const stats = {
    total: { all: 0, range: 0, exact: 0 },
  };
  browsers.forEach((browser) => {
    stats[browser] = { all: 0, range: 0, exact: 0 };
  });

  if (folder) {
    if (folder === 'webextensions') {
      iterateData(bcd[folder], webextensionsBrowsers, stats);
    } else if (bcd[folder]) {
      iterateData(bcd[folder], browsers, stats);
    } else {
      if (process.env.NODE_ENV !== 'test') {
        console.error(
          styleText(['red', 'bold'], `Folder "${folder}/" doesn't exist!`),
        );
      }
      return null;
    }
  } else {
    for (const data in bcd) {
      if (data === 'webextensions') {
        iterateData(
          bcd[data],
          browsers.filter((b) => webextensionsBrowsers.includes(b)),
          stats,
        );
      } else if (data !== 'browsers') {
        iterateData(bcd[data], browsers, stats);
      }
    }
  }

  return stats;
};

/**
 * Get value as either percentage or number as requested
 * @param {VersionStatsEntry} stats The stats object to get data from
 * @param {keyof VersionStatsEntry} type The type of statistic to obtain
 * @param {boolean} counts Whether to return the integer itself
 * @returns {string | number} The percentage or count
 */
const getStat = (stats, type, counts) =>
  counts ? stats[type] : `${((stats[type] / stats.all) * 100).toFixed(2)}%`;

/**
 * Print statistics of BCD
 * @param {VersionStats | null} stats The stats object to print from
 * @param {string} folder The folder to show statistics for (or all folders if blank)
 * @param {boolean} counts Whether to display a count vs. a percentage
 * @returns {void}
 */
const printStats = (stats, folder, counts) => {
  if (!stats) {
    console.error(`No stats${folder ? ` for folder ${folder}` : ''}!`);
    return;
  }

  const releaseDate = getRefDate('v' + process.env.npm_package_version).slice(
    0,
    'YYYY-MM-DD'.length,
  );

  console.log(
    styleText(
      'bold',
      `Status as of version ${process.env.npm_package_version} (released on ${releaseDate}) for ${folder ? `the \`${folder}/\` directory` : 'web platform features'}:`,
    ) + ' \n',
  );

  const header = ['browser', 'exact', 'ranged'];
  const align = ['l', 'r', 'r'];
  const rows = Object.keys(stats).map((entry) =>
    [
      entry,
      getStat(stats[entry], 'exact', counts),
      getStat(stats[entry], 'range', counts),
    ].map(String),
  );

  const table = markdownTable([header, ...rows], { align });

  console.log(table);
};

if (esMain(import.meta)) {
  const argv = yargs(hideBin(process.argv))
    .command(
      '$0 [folder]',
      'Print a markdown-formatted table displaying the statistics of exact and values for each browser',
    )
    .positional('folder', {
      describe: 'Limit the statistics to a specific folder',
      type: 'string',
      default: '',
    })
    .option('all', {
      alias: 'a',
      describe: 'Show statistics for all browsers within BCD',
      type: 'boolean',
      nargs: 0,
    })
    .option('counts', {
      alias: 'c',
      describe: 'Show feature count rather than percentages',
      type: 'boolean',
      nargs: 0,
    })
    .parseSync();

  printStats(getStats(argv.folder, !!argv.all), argv.folder, !!argv.counts);
}

export default getStats;
