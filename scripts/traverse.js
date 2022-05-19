/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import bcd from '../index.js';

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

/**
 * Traverse all of the features within a specified object and find all features that have one of the specified values
 *
 * @param {Identifier} obj The compat data to traverse through
 * @param {number} depth The depth to traverse
 * @param {string[]} values The values to test for
 * @param {string} browser The browser to traverse
 * @param {string} identifier The identifier of the current object
 * @returns {void}
 */
function traverseFeatures(obj, depth, values, browser, identifier) {
  let features = [];
  depth--;
  if (depth >= 0) {
    for (const i in obj) {
      if (!!obj[i] && typeof obj[i] == 'object' && i !== '__compat') {
        if (obj[i].__compat) {
          const comp = obj[i].__compat.support;
          let browserData = comp[browser];
          if (!Array.isArray(browserData)) {
            browserData = [browserData];
          }
          for (const range in browserData) {
            if (browserData[range] === undefined) {
              if (values.includes('null')) features.push(`${identifier}${i}`);
            } else if (
              values.includes(String(browserData[range].version_added)) ||
              values.includes(String(browserData[range].version_removed))
            ) {
              let f = `${identifier}${i}`;
              if (browserData[range].prefix)
                f += ` (${browserData[range].prefix} prefix)`;
              if (browserData[range].alternative_name)
                f += ` (as ${browserData[range].alternative_name})`;
              features.push(f);
            }
          }
        }
        features.push(
          ...traverseFeatures(
            obj[i],
            depth,
            values,
            browser,
            identifier + i + '.',
          ),
        );
      }
    }
  }

  return features;
}

const main = (
  folder = 'all',
  value = ['null', 'true'],
  browser = '',
  depth = 100,
) => {
  let features = [];
  const folders =
    folder == 'all'
      ? [
          'api',
          'css',
          'html',
          'http',
          'svg',
          'javascript',
          'mathml',
          'webdriver',
        ]
      : folder.split(',');
  const values = Array.isArray(value) ? value : value.toString().split(',');

  for (const folder in folders)
    features.push(
      ...traverseFeatures(
        bcd[folders[folder]],
        depth,
        values,
        browser,
        `${folders[folder]}.`,
      ),
    );

  console.log(features.join('\n'));
  console.log(features.length);
};

if (esMain(import.meta)) {
  const { argv } = yargs(hideBin(process.argv)).command(
    '$0 <browser> [folder] [value]',
    'Test for specified values in any specified browser',
    (yargs) => {
      yargs
        .positional('browser', {
          describe: 'The browser to test for',
          type: 'string',
        })
        .positional('folder', {
          describe: 'The folder(s) to test (set to "all" for all folders)',
          type: 'array',
          default: 'all',
        })
        .positional('value', {
          describe: 'The value(s) to test against',
          type: 'array',
          default: ['null', 'true'],
        })
        .option('depth', {
          alias: 'd',
          describe:
            'Depth of features to traverse (ex. "2" will capture "api.CSSStyleSheet.insertRule" but not "api.CSSStyleSheet.insertRule.optional_index")',
          type: 'number',
          default: 100,
        });
    },
  );

  main(argv.folder, argv.value, argv.browser, argv.depth);
}

export default main;
