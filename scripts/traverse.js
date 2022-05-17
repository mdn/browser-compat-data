/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

const bcd = require('..');

const { argv } = require('yargs').command(
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

/**
 * Traverse all of the features within a specified object and find all features that have one of the specified values
 *
 * @param {Identifier} obj The compat data to traverse through
 * @param {number} depth The depth to traverse
 * @param {string[]} values The values to test for
 * @param {string} identifier The identifier of the current object
 * @returns {void}
 */
function traverseFeatures(obj, depth, values, identifier) {
  let features = [];
  depth--;
  if (depth >= 0) {
    for (const i in obj) {
      if (!!obj[i] && typeof obj[i] == 'object' && i !== '__compat') {
        if (obj[i].__compat) {
          const comp = obj[i].__compat.support;
          let browser = comp[argv.browser];
          if (!Array.isArray(browser)) {
            browser = [browser];
          }
          for (const range in browser) {
            if (browser[range] === undefined) {
              if (values.includes('null')) features.push(`${identifier}${i}`);
            } else if (
              values.includes(String(browser[range].version_added)) ||
              values.includes(String(browser[range].version_removed))
            ) {
              let f = `${identifier}${i}`;
              if (browser[range].prefix)
                f += ` (${browser[range].prefix} prefix)`;
              if (browser[range].alternative_name)
                f += ` (as ${browser[range].alternative_name})`;
              features.push(f);
            }
          }
        }
        features.push(
          ...traverseFeatures(obj[i], depth, values, identifier + i + '.'),
        );
      }
    }
  }

  return features;
}

const main = (folder = 'all', value = ['null', 'true'], depth = 100) => {
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
    features = traverseFeatures(
      bcd[folders[folder]],
      depth,
      values,
      `${folders[folder]}.`,
    );

  console.log(features.join('\n'));
  console.log(features.length);
};

if (require.main === module) {
  main(argv.folder, argv.value, argv.depth);
}

module.exports = main;
