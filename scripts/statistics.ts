/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import bcd from '../index.js';
import {
  BrowserName,
  CompatStatement,
  SupportStatement,
  Identifier,
} from '../types/types.js';

import { getRefDate } from './release/utils.js';

type VersionStatsEntry = {
  all: number;
  true: number;
  null: number;
  range: number;
  real: number;
};

type VersionStats = { [k: string]: VersionStatsEntry };

const webextensionsBrowsers: BrowserName[] = [
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
 * @param {SupportStatement} supportData The support statement to check
 * @param {string|boolean|null} type What type of support (true, null, ranged)
 * @returns {boolean} If the support statement has the type
 */
const checkSupport = (
  supportData: SupportStatement | undefined,
  type: string | boolean | null,
): boolean => {
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
 * Iterate through all of the browsers and count the number of true, null, real, and ranged values for each browser
 * @param {CompatStatement} data The data to process and count stats for
 * @param {BrowserName[]} browsers The browsers to test
 * @param {{[key: string]: VersionStats}} stats The stats object to update
 */
const processData = (
  data: CompatStatement,
  browsers: BrowserName[],
  stats: VersionStats,
): void => {
  if (data.support) {
    browsers.forEach((browser) => {
      stats[browser].all++;
      stats.total.all++;
      if (!data.support[browser]) {
        stats[browser].null++;
        stats.total.null++;
      } else if (checkSupport(data.support[browser], null)) {
        stats[browser].null++;
        stats.total.null++;
      } else if (checkSupport(data.support[browser], true)) {
        stats[browser].true++;
        stats.total.true++;
      } else if (checkSupport(data.support[browser], '≤')) {
        stats[browser].range++;
        stats.total.range++;
      } else {
        stats[browser].real++;
        stats.total.real++;
      }
    });
  }
};

/**
 * Iterate through all of the data and process statistics
 * @param {Identifier} data The compat data to iterate
 * @param {BrowserName[]} browsers The browsers to test
 * @param {{[key: string]: VersionStats}} stats The stats object to update
 */
const iterateData = (data, browsers: BrowserName[], stats: VersionStats) => {
  for (const key in data) {
    if (key === '__compat') {
      processData(data[key], browsers, stats);
    } else {
      iterateData(data[key], browsers, stats);
    }
  }
};

/**
 * Get all of the stats
 * @param {string} folder The folder to show statistics for (or all folders if blank)
 * @param {boolean} allBrowsers If true, get stats for all browsers, not just main eight
 * @returns {{[key: string]: VersionStats}?} The statistics
 */
const getStats = (
  folder: string,
  allBrowsers: boolean,
): VersionStats | null => {
  /** @constant {string[]} */
  const browsers: BrowserName[] = allBrowsers
    ? (Object.keys(bcd.browsers) as (keyof typeof bcd.browsers)[])
    : folder === 'webextensions'
    ? webextensionsBrowsers
    : ([
        'chrome',
        'chrome_android',
        'edge',
        'firefox',
        'safari',
        'safari_ios',
        'webview_android',
      ] as BrowserName[]);

  const stats: VersionStats = {
    total: { all: 0, true: 0, null: 0, range: 0, real: 0 },
  };
  browsers.forEach((browser) => {
    stats[browser] = { all: 0, true: 0, null: 0, range: 0, real: 0 };
  });

  if (folder) {
    if (folder === 'webextensions') {
      iterateData(bcd[folder], webextensionsBrowsers, stats);
    } else if (bcd[folder]) {
      iterateData(bcd[folder], browsers, stats);
    } else {
      console.error(chalk`{red.bold Folder "${folder}/" doesn't exist!}`);
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
 * @param {string} type The type of statistic to obtain
 * @param {boolean} counts Whether to return the integer itself
 * @returns {string} The percentage or count
 */
const getStat = (
  stats: VersionStatsEntry,
  type: keyof VersionStatsEntry,
  counts: boolean,
): string | number =>
  counts ? stats[type] : `${((stats[type] / stats.all) * 100).toFixed(2)}%`;

/**
 * Print statistics of BCD
 * @param {VersionStats} stats The stats object to print from
 * @param {string} folder The folder to show statistics for (or all folders if blank)
 * @param {boolean} counts Whether to display a count vs. a percentage
 */
const printStats = (
  stats: VersionStats | null,
  folder: string,
  counts: boolean,
): void => {
  if (!stats) {
    console.error(`No stats${folder ? ` for folder ${folder}` : ''}!`);
    return;
  }

  const releaseDate = getRefDate('v' + process.env.npm_package_version).slice(
    0,
    'YYYY-MM-DD'.length,
  );

  console.log(
    chalk`{bold Status as of version ${
      process.env.npm_package_version
    } (released on ${releaseDate}) for ${
      folder ? `the \`${folder}/\` directory` : 'web platform features'
    }}: \n`,
  );

  let table = `| browser | real values | ranged values | \`true\` values | \`null\` values |
| --- | --- | --- | --- | --- |
`;

  Object.keys(stats).forEach((entry) => {
    table += `| ${entry.replace('_', ' ')} | `;
    table += `${getStat(stats[entry], 'real', counts)} | `;
    table += `${getStat(stats[entry], 'range', counts)} | `;
    table += `${getStat(stats[entry], 'true', counts)} | `;
    table += `${getStat(stats[entry], 'null', counts)} |
`;
  });

  console.log(table);
};

if (esMain(import.meta)) {
  const { argv }: { argv } = yargs(hideBin(process.argv)).command(
    '$0 [folder]',
    'Print a markdown-formatted table displaying the statistics of real, ranged, true, and null values for each browser',
    (yargs) => {
      yargs
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
        });
    },
  );

  printStats(getStats(argv.folder, argv.all), argv.folder, argv.counts);
}

export default getStats;
