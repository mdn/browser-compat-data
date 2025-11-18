/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import {
  BrowserName,
  Identifier,
  SimpleSupportStatement,
} from '../types/types.js';
import { InternalSupportStatement } from '../types/index.js';
import dataFolders from '../scripts/lib/data-folders.js';
import bcd from '../index.js';

interface StatusFilters {
  deprecated: boolean | undefined;
  standard_track: boolean | undefined;
  experimental: boolean | undefined;
}

/**
 * Traverse all of the features within a specified object and find all features that have one of the specified values
 * @param obj The compat data to traverse through
 * @param browsers The browsers to test for
 * @param values The values to test for
 * @param depth The depth to traverse
 * @param tag The tag to filter results with
 * @param identifier The identifier of the current object
 * @param status Whether to filter by status flags
 * @yields {string} The feature identifier
 */
export function* iterateFeatures(
  obj: Identifier,
  browsers: BrowserName[],
  values: string[],
  depth: number,
  tag: string,
  identifier: string,
  status: StatusFilters | null = null,
): IterableIterator<string> {
  const { deprecated, standard_track, experimental } = status ?? {};
  depth--;
  if (depth >= 0) {
    for (const i in obj) {
      if (!!obj[i] && typeof obj[i] == 'object' && i !== '__compat') {
        if (obj[i].__compat) {
          if (typeof deprecated === 'boolean') {
            if (deprecated !== obj[i].__compat.status?.deprecated) {
              continue;
            }
          }
          if (typeof standard_track === 'boolean') {
            if (standard_track !== obj[i].__compat.status?.standard_track) {
              continue;
            }
          }
          if (typeof experimental === 'boolean') {
            if (experimental !== obj[i].__compat.status?.experimental) {
              continue;
            }
          }
          if (tag) {
            const tags = obj[i].__compat?.tags;
            if ((tags && tags.includes(tag)) || (!tags && tag == 'false')) {
              yield `${identifier}${i}`;
            }
          } else {
            const comp = obj[i].__compat?.support;
            if (!comp) {
              continue;
            }
            for (const browser of browsers) {
              let browserData:
                | SimpleSupportStatement
                | SimpleSupportStatement[]
                | undefined = comp[browser];

              if (!browserData) {
                if (values.length == 0 || values.includes('null')) {
                  // Web extensions only allows specific browsers
                  if (
                    !(
                      identifier.startsWith('webextensions.') &&
                      bcd.browsers[browser].accepts_webextensions
                    )
                  ) {
                    continue;
                  }
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
                } else if (values.includes('≤') || values.includes('ranged')) {
                  if (
                    String(browserData[range].version_added).startsWith('≤') ||
                    String(browserData[range].version_removed).startsWith('≤')
                  ) {
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
          status,
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
 * @param status Whether to filter by status flags
 * @returns An array of the features
 */
const traverseFeatures = (
  obj: Identifier,
  browsers: BrowserName[],
  values: string[],
  depth: number,
  tag: string,
  identifier: string,
  status: StatusFilters,
): string[] => {
  const features = Array.from(
    iterateFeatures(obj, browsers, values, depth, tag, identifier, status),
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
 * @param status Whether to filter by status flags
 * @returns The list of features
 */
const main = (
  folders = dataFolders.concat('webextensions'),
  browsers: BrowserName[] = Object.keys(bcd.browsers).filter(
    (b) => bcd.browsers[b].type !== 'server',
  ) as BrowserName[],
  values = [],
  depth = 100,
  tag = '',
  status = {} as StatusFilters,
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
        status,
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
          default: Object.keys(bcd.browsers).filter(
            (b) => bcd.browsers[b].type !== 'server',
          ),
        })
        .option('filter', {
          alias: 'f',
          describe:
            'Filter by version value. May repeat. Set to "≤" or "ranged" for ranged values (ex. ≤58), "mirror" for mirrored entries, and "nonmirror" for non-mirrored entries.',
          type: 'array',
          string: true,
          nargs: 1,
          default: [],
        })
        .option('tag', {
          alias: 't',
          describe:
            'Filter by tag value. Set to `false` to search for features with no tags.',
          type: 'string',
          nargs: 1,
          default: '',
        })
        .option('depth', {
          alias: 'd',
          describe:
            'Depth of features to traverse (ex. "2" will capture "api.CSSStyleSheet.insertRule" but not "api.CSSStyleSheet.insertRule.optional_index")',
          type: 'number',
          nargs: 1,
          default: 10,
        })
        .option('show-count', {
          alias: 'c',
          describe: 'Show the count of features traversed at the end',
          type: 'boolean',
          default: process.stdout.isTTY,
        })
        .option('status.deprecated', {
          alias: 'x',
          describe:
            'Filter features by deprecation status. Set to `true` to only show deprecated features or `false` to only show non-deprecated features.',
          type: 'boolean',
          default: undefined,
        })
        .option('status.standard_track', {
          alias: 's',
          describe:
            'Filter features by standard_track status. Set to `true` to only show standards track features or `false` to only show non-standards track features.',
          type: 'boolean',
          default: undefined,
        })
        .option('status.experimental', {
          alias: 'e',
          describe:
            'Filter features by experimental status. Set to `true` to only show experimental features or `false` to only show non-experimental features.',
          type: 'boolean',
          default: undefined,
        })
        .example(
          'npm run traverse -- -b webview_android -f ≤37',
          'Find all features marked as ≤37 for WebView',
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
        )
        .example(
          'npm run traverse -- -t false',
          'Find all features with no tags.',
        )
        .example(
          'npm run traverse -- --status.deprecated',
          'Find all features that are deprecated.',
        )
        .example(
          'npm run traverse -- --no-status.deprecated',
          'Omit all features that are deprecated.',
        )
        .example(
          'npm run traverse -- --status.standard_track',
          'Find all features that are on the standard track.',
        )
        .example(
          'npm run traverse -- --status.experimental',
          'Find all features that are experimental.',
        );
    },
  );

  const features = main(
    argv.folder,
    argv.browser,
    argv.filter,
    argv.depth,
    argv.tag,
    argv.status,
  );
  console.log(features.join('\n'));
  if (argv.showCount) {
    console.log(features.length);
  }
}

export default main;
