'use strict';
const bcd = require('..');

const { argv } = require('yargs').command(
  '$0 [browser] [folder] [value]',
  'Test for specified values in any specified browser',
  yargs => {
    yargs
      .positional('browser', {
        describe: 'The browser to test for',
        type: 'string',
        default: 'all',
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

function traverseFeatures(obj, depth, identifier) {
  depth--;
  if (depth >= 0) {
    for (const i in obj) {
      if (!!obj[i] && typeof obj[i] == 'object' && i !== '__compat') {
        if (obj[i].__compat) {
          const path = `${identifier}${i}`;
          const {description, mdn_url, support, status} = obj[i].__compat;
          const flatSupport = browsers.map(b => {
            let ranges = support[b];
            if (!ranges) {
              return null;
            }
            if (!Array.isArray(ranges)) {
              ranges = [ranges];
            }
            ranges = ranges.filter(r => !r.flags && !r.version_removed);
            return ranges.length;
          });
          features.push([path, ...flatSupport]);
        }
        traverseFeatures(obj[i], depth, identifier + i + '.');
      }
    }
  }
}

let features = [];
const browsers =
  argv.browser == 'all'
    ? Object.keys(bcd.browsers)
    : argv.browser.split(',');
const folders =
  argv.folder == 'all'
    ? [
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
      ]
    : argv.folder.split(',');
const values = Array.isArray(argv.value)
  ? argv.value
  : argv.value.toString().split(',');

console.log(`path,${browsers.join(',')}`);
for (const folder in folders)
  traverseFeatures(bcd[folders[folder]], argv.depth, `${folders[folder]}.`);

console.log(features.join('\n'));
