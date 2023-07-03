/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { compare } from 'compare-versions';
import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import {
  BrowserName,
  SimpleSupportStatement,
  CompatStatement,
} from '../types/types.js';
import bcd from '../index.js';
import { IS_WINDOWS } from '../test/utils.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Get the earliest version number from an array of versions
 * @param {string[]} args The version numbers to check
 * @returns {string} The earliest of the version numbers
 */
const getEarliestVersion = (...args: string[]): string => {
  const versions = args
    .filter((version) => typeof version === 'string' && version !== 'preview')
    .map((version) => version.replace('≤', ''));

  let earliestVersion;

  for (const version of versions) {
    if (
      !earliestVersion ||
      earliestVersion === 'preview' ||
      (version !== 'preview' && compare(earliestVersion, version, '>'))
    ) {
      earliestVersion = version;
    }
  }

  return earliestVersion;
};

/**
 * Removes redundant flags from the compatibility data
 * @param {string} key The object key (make sure it's '__compat')
 * @param {CompatStatement} value The compatibility statement to test
 * @param {BrowserName?} limitBrowser If flags should only be removed from a specific browser
 * @returns {CompatStatement} The compatibility statement with all of the flags removed
 */
export const removeRedundantFlags = (
  key: string,
  value: CompatStatement,
  limitBrowser: BrowserName | null,
): CompatStatement => {
  if (key === '__compat') {
    for (const [browser, rawSupportData] of Object.entries(value.support)) {
      if (limitBrowser && browser != limitBrowser) {
        continue;
      }

      const supportData = Array.isArray(rawSupportData)
        ? rawSupportData
        : [rawSupportData];
      const result: SimpleSupportStatement[] = [];

      const simpleStatement = supportData.find((statement) => {
        const ignoreKeys = new Set([
          'version_removed',
          'notes',
          'partial_implementation',
        ]);
        const keys = Object.keys(statement).filter(
          (key) => !ignoreKeys.has(key),
        );
        return keys.length === 1;
      });

      for (let i = 0; i < supportData.length; i++) {
        let addData = true;

        if (supportData[i].flags) {
          const versionToCheck = getEarliestVersion(
            (supportData[i].version_removed as string) ||
              ((simpleStatement && simpleStatement.version_added) as string),
            (simpleStatement && simpleStatement.version_added) as string,
          );

          if (typeof versionToCheck === 'string') {
            const releaseDate =
              bcd.browsers[browser as BrowserName]?.releases[versionToCheck]
                ?.release_date;

            if (
              releaseDate &&
              (!(simpleStatement && simpleStatement.version_removed) ||
                compare(
                  (supportData[i].version_added as string).replace('≤', ''),
                  (simpleStatement.version_removed as string).replace('≤', ''),
                  '<',
                ))
            ) {
              addData = false;
            }
          }
        }

        if (addData) {
          result.push(supportData[i]);
        }
      }

      if (result.length == 1) {
        value.support[browser] = result[0];
      } else if (result.length == 0) {
        value.support[browser] = { version_added: false };
      } else {
        value.support[browser] = result;
      }
    }
  }
  return value;
};

/**
 * Removes redundant flags from the compatibility data of a specified file
 * @param {string} filename The filename containing compatibility info
 * @param {BrowserName?} limitBrowser If flags should only be removed from a specific browser
 */
export const fixRedundantFlags = (
  filename: string,
  limitBrowser: BrowserName | null,
): void => {
  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(
    JSON.parse(actual, (k, v) => removeRedundantFlags(k, v, limitBrowser)),
    null,
    2,
  );

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
  }

  if (actual !== expected) {
    fs.writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

/**
 * Removes redundant flags from the compatibility data of specified files/folders
 * @param {string[]} files_or_folders The files and/or folders to run removal on
 * @param {BrowserName?} browser If flags should only be removed from a specific
 */
const main = (
  files_or_folders: string[],
  browser: BrowserName | null,
): void => {
  for (let file of files_or_folders) {
    if (file.indexOf(dirname) !== 0) {
      file = path.resolve(dirname, '..', file);
    }

    if (!fs.existsSync(file)) {
      continue; // Ignore non-existent files
    }

    if (fs.statSync(file).isFile()) {
      if (path.extname(file) === '.json') {
        fixRedundantFlags(file, browser);
      }

      continue;
    }

    const subFiles = fs
      .readdirSync(file)
      .map((subfile) => path.join(file, subfile));

    main(subFiles, browser);
  }
};

if (esMain(import.meta)) {
  const { argv } = yargs(hideBin(process.argv)).command(
    '$0 [file]',
    'Remove data for redundant flags',
    (yargs) => {
      yargs
        .positional('file', {
          describe: 'The file(s) and/or folder(s) to test',
          type: 'string',
          array: true,
          default: [
            'api',
            'css',
            'html',
            'http',
            'svg',
            'javascript',
            'mathml',
            'test',
            'webassembly',
            'webdriver',
            'webextensions',
          ],
        })
        .option('browser', {
          alias: 'b',
          describe: 'The browser to test for',
          type: 'string',
          default: null,
        });
    },
  );

  main((argv as any).file, (argv as any).browser);
}
