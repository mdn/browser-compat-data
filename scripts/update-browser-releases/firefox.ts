/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import * as fs from 'node:fs';

import { compareVersions } from 'compare-versions';

import { updateBrowserEntry, newBrowserEntry } from './utils.js';

import type { ReleaseStatement } from '../../types/types.js';

const indentStep = '  '; // Constant with the indent step that sortStringify should use

/**
 * sortStringify - Stringify an object using a mixed lexicographic-semver order
 * @param {object} obj The object to stringify
 * @param {string} indent The indentation to add, as a string
 * @returns {string} The URL of the release notes or the empty string if not found
 */
const sortStringify = (obj, indent) => {
  const sortedKeys = Object.keys(obj).sort((a, b) => {
    // If they both start with a number, convert to float (so that 1.5 < 10)
    // and apply number comparison
    if (a[0] >= '0' && a[0] <= '9' && b[0] >= '0' && b[0] <= '9') {
      return compareVersions(a, b);
    }

    // Normal string comparison: lexicographic order
    if (a === b) {
      return 0;
    }
    return a > b ? 1 : -1;
  });

  let result = '{\n'; // obj is an object, it must be enclosed in braces
  for (let i = 0; i < sortedKeys.length; i++) {
    const key = sortedKeys[i];
    let value = obj[key];

    if (value instanceof Object) {
      // An object: recursively call this method
      value = `${sortStringify(value, indent + indentStep)}`;
    } else {
      // A value or an array: call the regulare JSON.stringify function
      value = `${JSON.stringify(value)}`;
    }

    // Add it to the result
    result += `${indent}${indentStep}"${key}": ${value}`;

    // Check if this is the last entry or not: if not, add a comma
    if (i != sortedKeys.length - 1) {
      result += ',';
    }

    // We always need a carriage return
    result += '\n';
  }
  return `${result}${indent}}`; // Close the brace and return the string
};

/**
 * getFirefoxReleaseNotesURL - Guess the URL of the release notes
 * @param {string} version release version
 * @returns {string} The URL of the release notes or the empty string if not found
 */
const getFirefoxReleaseNotesURL = async (version) => {
  if (version === '1') {
    return 'https://website-archive.mozilla.org/www.mozilla.org/firefox_releasenotes/en-US/firefox/releases/1.0.html';
  }
  return `https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/${version}`;
};

/**
 * updateFirefoxFile - Update the json file listing the browser version of a chromium entry
 * @param {object} options The list of options for this type of chromiums.
 */
export const updateFirefoxReleases = async (options) => {
  //
  // Get the firefox.json from the local BCD
  //
  const file = fs.readFileSync(`${options.bcdFile}`);
  const firefoxBCD = JSON.parse(file.toString());

  //
  // Update the three channels
  //
  const channels = new Map([
    ['current', options.releaseBranch],
    ['beta', options.betaBranch],
    ['nightly', options.nightlyBranch],
  ]);
  const data = {};

  let stableRelease = 1; // We will need this info afterwards; it will be calculated in the loop.

  for (const [key, value] of channels) {
    let releaseNotesURL;
    // Extract version and release date
    if (key !== 'current') {
      // Get the JSON for the given train
      const trainInfo = await fetch(`${options.firefoxScheduleURL}${value}`);
      const train = await trainInfo.json();

      releaseNotesURL = await getFirefoxReleaseNotesURL(
        parseFloat(train.version).toString(),
      );

      data[value] = {};
      data[value].version = parseFloat(train.version).toString();
      data[value].releaseDate = train.release.substring(0, 10); // Remove the time part
    } else {
      // Get the JSON with all released versions and their dates
      const firefoxVersions = await fetch(options.firefoxReleaseDateURL);
      const releasedFirefoxVersions = await firefoxVersions.json();

      // Extract the current stable version and its release date

      Object.entries(releasedFirefoxVersions).forEach(([key]) => {
        if (parseFloat(key) > stableRelease) {
          stableRelease = parseFloat(key);
        }
      });
      releaseNotesURL = await getFirefoxReleaseNotesURL(stableRelease);

      data[value] = {};
      data[value].version = stableRelease;
      data[value].releaseDate = releasedFirefoxVersions[stableRelease + '.0'];
    }

    if (firefoxBCD.browsers[options.bcdBrowserName].releases[key]) {
      updateBrowserEntry(
        firefoxBCD.browsers[options.bcdBrowserName].releases[key],
        data[value].releaseDate,
        key,
        releaseNotesURL,
      );
    } else {
      // New entry
      newBrowserEntry(
        firefoxBCD,
        options.bcdBrowserName,
        data[value].version,
        key,
        'Gecko',
        data[value].releaseDate,
        releaseNotesURL,
      );
    }
  }

  //
  // Set all older releases are 'retired' (and the current ESR to 'esr')
  //

  // Find latest ESR

  // Get the JSON with all released versions and their dates
  const firefoxESRVersions = await fetch(options.firefoxESRDateURL);
  const esrFirefoxVersions = await firefoxESRVersions.json();

  // Extract the current esr version
  let esrRelease = 1;

  Object.entries(esrFirefoxVersions).forEach(([key]) => {
    if (parseInt(key) > esrRelease) {
      esrRelease = parseInt(key);
    }
  });

  // Replace all old entries with 'retired' or 'esr'
  Object.entries(
    firefoxBCD.browsers[options.bcdBrowserName].releases as {
      [version: string]: ReleaseStatement;
    },
  ).forEach(([key, entry]) => {
    if (key === String(esrRelease)) {
      entry.status = 'esr';
    } else if (parseFloat(key) < stableRelease) {
      entry.status = 'retired';
    }
  });

  //
  // Add a planned version entry
  //
  const planned = stableRelease + 3;
  // Get the JSON for the planned version train
  const trainInfo = await fetch(`${options.firefoxScheduleURL}${planned}`);
  const train = await trainInfo.json();

  if (firefoxBCD.browsers[options.bcdBrowserName].releases[planned]) {
    firefoxBCD.browsers[options.bcdBrowserName].releases[planned].release_date =
      train.release.substring(0, 10); // Remove the time part
    firefoxBCD.browsers[options.bcdBrowserName].releases[planned].status =
      'planned';
  } else {
    // New entry
    newBrowserEntry(
      firefoxBCD,
      options.bcdBrowserName,
      planned,
      'planned',
      'Gecko',
      train.release.substring(0, 10), // Remove the time part
      await getFirefoxReleaseNotesURL(planned),
    );
  }

  //
  // Write the JSON back into chrome.json
  //
  fs.writeFileSync(`./${options.bcdFile}`, sortStringify(firefoxBCD, '') + '\n');
  console.log(`File generated succesfully: ${options.bcdFile}`);
};
