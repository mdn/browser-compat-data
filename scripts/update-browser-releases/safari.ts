/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import * as fs from 'node:fs';

import chalk from 'chalk-template';

import stringify from '../lib/stringify-and-order-properties.js';

import { newBrowserEntry, updateBrowserEntry } from './utils.js';

import type { ReleaseStatement } from '../../types/types.js';

const extractReleaseData = (str) => {
  // Released September 18, 2023 — Version 17 (19616.1.27)
  console.log(str);
  const result =
    /Released (.*) .* Version (.*) (Beta )?\((.*)\)/.exec(str);
  if (!result) {
    return null;
  }
  console.log(`Date: ${result[1]}`);
  console.log(`Version: ${result[2]}`);
  console.log(`Beta: ${result[3]? true : false}`);
  console.log(`Engine version: ${result[4].substring(2)}`);
  return {
    date: result[1],
    version: result[2],
    beta: result[3]? true : false,
    engine: result[4].substring(2),
  };
};

/**
 * updateSafariFile - Update the json file listing the browser version of a safari entry
 * @param {object} options The list of options for this type of chromiums.
 * @returns {string} The log of what has been generated (empty if nothing)
 */
export const updateSafariReleases = async (options) => {
  let result = '';
  //
  // Get the firefox.json from the local BCD
  //
  const file = fs.readFileSync(`${options.bcdFile}`);
  const safariBCD = JSON.parse(file.toString());

  //
  // Read JSON of release notes
  //
  const releaseNoteFile = await fetch(`${options.releaseNoteJSON}`);
  if (releaseNoteFile.status !== 200) {
    throw chalk`{red \nRelease note file not found at Apple (${options.releaseNoteJSON}).}`;
  }
  const safariRelease = JSON.parse(await releaseNoteFile.text());

  //
  // Compute stable and beta release number
  //
  let stableRelease;
  let betaRelease;

  const releases = safariRelease['references']
  for (const id in releases) {
    const releaseData = extractReleaseData(releases[id].abstract[0].text);
    if (!releaseData) {
      console.warn(chalk`{yellow Release string from Apple not understandable (${releases[id].abstract[0].text})}`);
      continue;
    }
    if (releaseData.beta) {
      betaRelease = releaseData;
    } else if (releaseData.version > stableRelease.version) {
      stableRelease = releaseData;
    } else {
      // Check old engine value (should not change, but let's check)
      const engineStored =
        safariBCD[options.bcdBrowserName].releases[releaseData.version].engine;
      if (releaseData.engine !== engineStored) {
        // Differs!
        console.warn(
          chalk`{yellow Engine for ${releaseData.version} (${releaseData.engine}) doesn't match engine stored (${engineStored})}`,
        );
      }
    }
  }

  //
  // Update stable release
  //
  if (
    safariBCD[options.bcdBrowserName].releases[stableRelease.release].version
  ) {
    result += updateBrowserEntry(
      safariBCD,
      options.bcdBrowserName,
      stableRelease.version,
      stableRelease.release_date,
      'current',
      stableRelease.releaseNote,
      stableRelease.engineVersion,
    );
  } else {
    result += newBrowserEntry(
      safariBCD,
      options.bcdBrowserName,
      stableRelease.version,
      stableRelease.release_date,
      'current',
      stableRelease.releaseNote,
      'WebKit',
      stableRelease.engineVersion,
    );
  }

  //
  // Update beta release
  //
  if (safariBCD[options.bcdBrowserName].releases[betaRelease.release].version) {
    result += updateBrowserEntry(
      safariBCD,
      options.bcdBrowserName,
      betaRelease.version,
      betaRelease.release_date,
      'beta',
      betaRelease.releaseNote,
      betaRelease.engineVersion,
    );
  } else {
    result += newBrowserEntry(
      safariBCD,
      options.bcdBrowserName,
      betaRelease.version,
      betaRelease.release_date,
      'beta',
      betaRelease.releaseNote,
      'WebKit',
      betaRelease.engineVersion,
    );
  }

  //
  // Replace all old entries with 'retired'
  //
  Object.entries(
    safariBCD.browsers[options.bcdBrowserName].releases as {
      [version: string]: ReleaseStatement;
    },
  ).forEach(([key, entry]) => {
    if (parseFloat(key) < stableRelease) {
      result += updateBrowserEntry(
        safariBCD,
        options.bcdBrowserName,
        key,
        entry.release_date,
        'retired',
        '',
        '',
      );
    }
  });

  //
  // Write the update browser's json to file
  //
  fs.writeFileSync(`./${options.bcdFile}`, stringify(safariBCD) + '\n');

  // Returns the log
  if (result) {
    result = `### Updates for ${options.browserName}${result}`;
  }
  return result;
};
