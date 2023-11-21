/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import * as fs from 'node:fs';

import chalk from 'chalk-template';

import stringify from '../lib/stringify-and-order-properties.js';

import { newBrowserEntry, updateBrowserEntry } from './utils.js';

/**
 * extractReleaseData - Extract release info from string given by Apple
 * @param {string} str The string with release inforormation
 *            E.g., Released September 18, 2023 — Version 17 (19616.1.27)
 * @returns {object} Data for the release
 */
const extractReleaseData = (str) => {
  // Note: \s is needed as some spaces in Apple source are non-breaking
  const result = /Released\s(.*)\s.*\sVersion\s(.*?)\s(beta\s)?\((.*)\)/.exec(
    str,
  );
  if (!result) {
    console.warn(chalk`{yellow A release string for Safari is not parsable (${str}'). Skipped.`);
    return null;
  }
  return {
    date: new Date(`${result[1]} UTC`).toISOString().substring(0, 10),
    version: result[2],
    beta: Boolean(result[3]),
    engine: result[4].substring(2),
    releaseNote: '',
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
  // Get the safari.json from the local BCD
  //
  const file = fs.readFileSync(`${options.bcdFile}`);
  const safariBCD = JSON.parse(file.toString());

  //
  // Read JSON of release notes
  //
  const releaseNoteFile = await fetch(`${options.releaseNoteJSON}`);
  if (releaseNoteFile.status !== 200) {
    console.error( chalk`{red \nRelease note file not found at Apple (${options.releaseNoteJSON}).}`);
    return '';
  }
  const safariRelease = JSON.parse(await releaseNoteFile.text());

  //
  // Compute stable and beta release number
  //
  let stableRelease;
  let betaRelease;

  const releases = safariRelease['references'];
  for (const id in releases) {
    if (releases[id].kind !== 'article') {
      continue;
    }
    const releaseData = extractReleaseData(releases[id].abstract[0].text);

    if (!releaseData) {
      console.warn(
        chalk`{yellow Release string from Apple not understandable (${releases[id].abstract[0].text})}`,
      );
      continue;
    }

    // Compute release note
    if (releases[id].url) {
      releaseData.releaseNote = `${options.releaseNoteURLBase}${releases[id].url}`;
    } else {
      releaseData.releaseNote = '';
    }

    if (releaseData.beta) {
      betaRelease = releaseData;
    } else if (!stableRelease || releaseData.version > stableRelease.version) {
      stableRelease = releaseData;
    } else {
      // Check old engine value (should not change, but let's check)
      if (
        !(releaseData.version in safariBCD.browsers[options.bcdBrowserName].releases)
      ) {
        if (Number(releaseData.version) > 15) { // We know that version past Safari 15 matches iOS versions too
          console.warn(
            chalk`{yellow Old version ${releaseData.version} not found in BCD file}`,
          );
        }
        continue;
      }
      const engineStored =
        safariBCD.browsers[options.bcdBrowserName].releases[releaseData.version]
          .engine_version;
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
    safariBCD.browsers[options.bcdBrowserName].releases[stableRelease.version]
  ) {
    result += updateBrowserEntry(
      safariBCD,
      options.bcdBrowserName,
      stableRelease.version,
      stableRelease.date,
      'current',
      stableRelease.releaseNote,
      stableRelease.engineVersion,
    );
  } else {
    result += newBrowserEntry(
      safariBCD,
      options.bcdBrowserName,
      stableRelease.version,
      'current',
      'WebKit',
      stableRelease.date,
      stableRelease.releaseNote,
      stableRelease.engineVersion,
    );
  }

  //
  // Update beta release
  //
  if (
    safariBCD.browsers[options.bcdBrowserName].releases[betaRelease.version]
  ) {
    result += updateBrowserEntry(
      safariBCD,
      options.bcdBrowserName,
      betaRelease.version,
      '',
      'beta',
      '',
      '',
    );
  } else {
    result += newBrowserEntry(
      safariBCD,
      options.bcdBrowserName,
      betaRelease.version,
      'beta',
      'WebKit',
      '',
      stableRelease.releaseNote,
      '',
    );
  }

  //
  // Replace all old entries with 'retired'
  //
  Object.entries(
    safariBCD.browsers[options.bcdBrowserName].releases
  ).forEach(([key, entry]) => {
    if (parseFloat(key) < stableRelease) {
      result += updateBrowserEntry(
        safariBCD,
        options.bcdBrowserName,
        key,
        entry['release_date'],
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
