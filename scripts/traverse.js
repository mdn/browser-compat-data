#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const bcd = require('..');

const { argv } = require('yargs').command(
  '$0 <browser> [folder] [value]',
  'Test for specified values in any specified browser',
  yargs => {
    yargs
      .positional('browser', {
        describe: 'The browser to test for',
        type: 'string',
      })
      .positional('folder', {
        describe: 'The folder(s) to test',
        type: 'array',
        default: [
          'api',
          'css',
          'html',
          'http',
          'svg',
          'javascript',
          'mathml',
          'webdriver',
          'xpath',
          'xslt',
        ],
      })
      .positional('value', {
        describe: 'The value(s) to test against',
        type: 'array',
        default: ['null', 'true'],
      });
  },
);

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

let features = [];

/**
 * Traverse all of the features within a specified object and find all features that have one of the specified values
 *
 * @param {Identifier} obj The compat data to traverse through
 * @param {number} depth The depth to traverse
 * @param {string} identifier The identifier of the current object
 * @param {string} values The values to test for in stringified format
 * @returns {void}
 */
const traverseFeatures = (obj, depth, identifier, values) => {
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
        traverseFeatures(obj[i], depth, identifier + i + '.', values);
      }
    }
  }
};

/**
 * Traverse the features within the specified folder(s) to find features with the specified value(s) for their version, and log them to the console, followed by the number of features found
 *
 * @param {string|string[]} folder The folder(s) to traverse
 * @param {string|string[]} value The value(s) to test for in stringified format
 * @returns {void}
 */
const main = (folder, value) => {
  const folders = Array.isArray(folder) ? folder : folder.split(',');
  const values = Array.isArray(value) ? value : value.toString().split(',');

  for (const folder in folders)
    traverseFeatures(bcd[folders[folder]], 100, `${folders[folder]}.`, values);

  console.log(features.join('\n'));
  console.log('\n');
  console.log(features.length);
};

if (require.main === module) {
  main(argv.folder, argv.value);
}
