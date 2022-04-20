/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';

const fs = require('fs');
const path = require('path');
const { platform } = require('os');

const compareVersions = require('compare-versions');

const bcd = require('..');

/** Determines if the OS is Windows */
const IS_WINDOWS = platform() === 'win32';

let twoYearsAgo;
if (
  process.env.npm_lifecycle_event &&
  process.env.npm_lifecycle_event.includes('mocha')
) {
  // When running test, use a specific time for consistent testing
  twoYearsAgo = Date.parse('2019-01-01T00:00Z');
} else {
  twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
}

const getEarliestVersion = (...args) => {
  const versions = args
    .filter(version => typeof version === 'string')
    .map(version => version.replace('≤', ''));

  let earliestVersion = versions[0];

  for (const version of versions) {
    if (
      earliestVersion === 'preview' ||
      (version !== 'preview' &&
        compareVersions.compare(earliestVersion, version, '>'))
    )
      earliestVersion = version;
  }

  return earliestVersion;
};

const removeRedundantFlags = (key, value, limitBrowser) => {
  if (key === '__compat') {
    for (const [browser, rawSupportData] of Object.entries(value.support)) {
      if (limitBrowser && browser != limitBrowser) continue;

      if (rawSupportData !== undefined) {
        const supportData = Array.isArray(rawSupportData)
          ? rawSupportData
          : [rawSupportData];
        const result = [];

        const simpleStatement = supportData.find(statement => {
          const ignoreKeys = new Set([
            'version_removed',
            'notes',
            'partial_implementation',
          ]);
          const keys = Object.keys(statement).filter(
            key => !ignoreKeys.has(key),
          );
          return keys.length === 1;
        });

        for (let i = 0; i < supportData.length; i++) {
          let addData = true;

          if (supportData[i].flags) {
            const versionToCheck = getEarliestVersion(
              supportData[i].version_removed ||
                (simpleStatement && simpleStatement.version_added),
              simpleStatement && simpleStatement.version_added,
            );

            if (typeof versionToCheck === 'string') {
              const releaseDate = new Date(
                bcd.browsers[browser].releases[
                  versionToCheck.replace('≤', '')
                ].release_date,
              );

              if (
                (!(simpleStatement && simpleStatement.version_removed) ||
                  compareVersions.compare(
                    supportData[i].version_added.replace('≤', ''),
                    simpleStatement.version_removed.replace('≤', ''),
                    '<',
                  )) &&
                releaseDate <= twoYearsAgo
              ) {
                addData = false;
              }
            }
          }

          if (addData) result.push(supportData[i]);
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
  }
  return value;
};

/**
 * @param {Promise<void>} filename
 */
const fixRedundantFlags = (filename, limitBrowser) => {
  const actual = fs.readFileSync(filename, 'utf-8').trim();
  const expected = JSON.stringify(
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

const main = (files_or_folders, browser) => {
  /**
   * @param {string[]} files
   */
  function load(...files) {
    for (let file of files) {
      if (file.indexOf(__dirname) !== 0) {
        file = path.resolve(__dirname, '..', file);
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

      const subFiles = fs.readdirSync(file).map(subfile => {
        return path.join(file, subfile);
      });

      load(...subFiles);
    }
  }

  load(...files_or_folders);
};

if (require.main === module) {
  const { argv } = require('yargs').command(
    '$0 [file]',
    'Remove data for flags that have been removed two years back or more',
    yargs => {
      yargs
        .positional('file', {
          describe: 'The file(s) and/or folder(s) to test',
          type: 'array',
          default: [
            'api',
            'css',
            'html',
            'http',
            'svg',
            'javascript',
            'mathml',
            'test',
            'webdriver',
            'webextensions',
          ],
        })
        .option('browser', {
          alias: 'b',
          describe: 'The browser to test for',
          type: 'string',
        });
    },
  );

  main(argv.file, argv.browser);
}

module.exports = { removeRedundantFlags, fixRedundantFlags };
