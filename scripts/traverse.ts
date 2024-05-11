/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { BrowserName, Identifier } from '../types/types.js';
import { InternalSupportStatement } from '../types/index.js';
import bcd, { dataFolders } from '../index.js';

/**
 * Traverse all of the features within a specified object and find all features that have one of the specified values
 * @param obj The compat data to traverse through
 * @param browsers The browsers to test for
 * @param values The values to test for
 * @param depth The depth to traverse
 * @param tag The tag to filter results with
 * @param identifier The identifier of the current object
 * @yields {string} The feature identifier
 */
export function* iterateFeatures(
  obj: Identifier,
  browsers: BrowserName[],
  values: string[],
  depth: number,
  tag: string,
  identifier: string,
): IterableIterator<string> {
  depth--;
  if (depth >= 0) {
    for (const i in obj) {
      if (!!obj[i] && typeof obj[i] == 'object' && i !== '__compat') {
        if (obj[i].__compat) {
          if (tag) {
            const tags = obj[i].__compat?.tags;
            if (tags && tags.includes(tag)) {
              yield `${identifier}${i}`;
            }
          } else {
            const comp = obj[i].__compat?.support;
            if (!comp) {
              continue;
            }
            for (const browser of browsers) {
              let browserData = comp[browser];

              if (!browserData) {
                if (values.length == 0 || values.includes('null')) {
                  yield `${identifier}${i}`;
                }
                continue;
              }
              if (!Array.isArray(browserData)) {
                browserData = [browserData];
              }

              for (const range in browserData) {
                if (
                  (browserData[range] as InternalSupportStatement) === 'mirror'
                ) {
                  if (values.includes('mirror')) {
                    yield `${identifier}${i}`;
                  }
                } else if (values.includes('nonmirror')) {
                  // If checking for non-mirrored data and it's not mirrored
                  yield `${identifier}${i}`;
                } else if (browserData[range] === undefined) {
                  if (values.length == 0 || values.includes('null')) {
                    yield `${identifier}${i}`;
                  }
                } else if (
                  values.length == 0 ||
                  values.includes(String(browserData[range].version_added)) ||
                  values.includes(String(browserData[range].version_removed))
                ) {
                  let f = `${identifier}${i}`;
                  if (browserData[range].prefix) {
                    f += ` (${browserData[range].prefix} prefix)`;
                  }
                  if (browserData[range].alternative_name) {
                    f += ` (as ${browserData[range].alternative_name})`;
                  }
                  yield f;
                }
              }
            }
          }
        }
        yield* iterateFeatures(
          obj[i],
          browsers,
          values,
          depth,
          tag,
          identifier + i + '.',
        );
      }
    }
  }
}

/**
 * Traverse all of the features within a specified object and find all features that have one of the specified values
 * @param obj The compat data to traverse through
 * @param browsers The browsers to traverse for
 * @param values The version values to traverse for
 * @param depth The depth to traverse
 * @param tag The tag to filter results with
 * @param identifier The identifier of the current object
 * @returns An array of the features
 */
const traverseFeatures = (
  obj: Identifier,
  browsers: BrowserName[],
  values: string[],
  depth: number,
  tag: string,
  identifier: string,
): string[] => {
  const features = Array.from(
    iterateFeatures(obj, browsers, values, depth, tag, identifier),
  );

  return features.filter((item, pos) => features.indexOf(item) == pos);
};

/**
 * Traverse the features within BCD
 * @param folders The folders to traverse
 * @param browsers The browsers to traverse for
 * @param values The version values to traverse for
 * @param depth The depth to traverse
 * @param tag The tag to filter results with
 * @returns The list of features
 */
const main = (
  folders = dataFolders.concat('webextensions'),
  browsers: BrowserName[] = Object.keys(bcd.browsers) as BrowserName[],
  values = ['null', 'true'],
  depth = 100,
  tag = '',
): string[] => {
  const features: string[] = [];

  for (const folder in folders) {
    features.push(
      ...traverseFeatures(
        bcd[folders[folder]],
        browsers,
        values,
        depth,
        tag,
        folders[folder] + '.',
      ),
    );
  }

  return features;
};

if (esMain(import.meta)) {
  const { argv }: { argv } = yargs(hideBin(process.argv)).command(
    '$0 [folder...]',
    'Print feature names in the folder (and optionally filter features to specific browser or version values)',
    (yargs) => {
      yargs
        .positional('folder', {
          describe: 'The folder(s) to traverse',
          type: 'string',
          array: true,
          default: Object.keys(bcd).filter((k) => k !== 'browsers'),
        })
        .option('browser', {
          alias: 'b',
          describe: 'Filter by a browser. May repeat.',
          type: 'array',
          nargs: 1,
          default: Object.keys(bcd.browsers),
        })
        .option('filter', {
          alias: 'f',
          describe:
            'Filter by version value. May repeat. Set to "mirror" for mirrored entries, and "nonmirror" for non-mirrored entries.',
          type: 'array',
          string: true,
          nargs: 1,
          default: [],
        })
        .option('tag', {
          alias: 't',
          describe: 'Filter by tag value.',
          type: 'string',
          nargs: 1,
          default: '',
        })
        .option('non-real', {
          alias: 'n',
          describe:
            'Filter to features with non-real values. Alias for "-f true -f null"',
          type: 'boolean',
          nargs: 0,
        })
        .option('depth', {
          alias: 'd',
          describe:
            'Depth of features to traverse (ex. "2" will capture "api.CSSStyleSheet.insertRule" but not "api.CSSStyleSheet.insertRule.optional_index")',
          type: 'number',
          nargs: 1,
          default: 10,
        })
        .example(
          'npm run traverse -- --browser=safari -n',
          'Find all features containing non-real Safari entries',
        )
        .example(
          'npm run traverse -- -b webview_android -f true',
          'Find all features marked as true for WebView',
        )
        .example(
          'npm run traverse -- -b firefox -f 10',
          'Find all features marked as supported since Firefox 10',
        )
        .example(
          'npm run traverse -- -b samsunginternet_android -f mirror',
          'Find all features in Samsung Internet that mirror data from Chrome Android',
        )
        .example(
          'npm run traverse -- -t web-features:idle-detection',
          'Find all features tagged with web-features:idle-detection.',
        );
    },
  );

  const filter = [...argv.filter, ...(argv.nonReal ? ['true', 'null'] : [])];

  const features = main(
    argv.folder,
    argv.browser,
    filter,
    argv.depth,
    argv.tag,
  );
  console.log(features.join('\n'));
  console.log(features.length);
}

export default main;
