/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import * as fs from 'node:fs';

import chalk from 'chalk-template';

import stringify from '../lib/stringify-and-order-properties.js';

import { gfmNoteblock, newBrowserEntry, updateBrowserEntry } from './utils.js';

/**
 * getReleaseNotesURL - Guess the URL of the release notes
 * @param version Version number
 * @param date Date in the format YYYYMMDD
 * @param core The core of the name of the release note
 * @param status The status of the release
 * @returns The URL of the release notes or the empty string if not found
 * Throws a string in case of error
 */
const getReleaseNotesURL = async (version, date, core, status) => {
  // If the status isn't stable, do not give back any release notes.
  if (status !== 'stable') {
    return '';
  }

  let url;

  // Before release 54, we guess the release note
  if (version < 54) {
    const dateObj = new Date(date);
    const year = dateObj.getUTCFullYear();
    const month = `0${dateObj.getUTCMonth() + 1}`.slice(-2);
    const day = `0${dateObj.getUTCDate()}`.slice(-2);

    // First possibility
    url = `https://chromereleases.googleblog.com/${year}/${month}/${core}_${day}.html`;
    let releaseNote = await fetch(url);

    if (releaseNote.status == 200) {
      return url;
    }

    // Second possibility (less reliable)
    url = `https://chromereleases.googleblog.com/${year}/${month}/${core}.html`;

    releaseNote = await fetch(url);

    if (releaseNote.status !== 200) {
      throw chalk`{red \nRelease note not found for ${version}}.`;
    }
  }

  // After release 53, we have new-in-chrome highlight posts
  if (version > 53) {
    url = `https://developer.chrome.com/blog/new-in-chrome-${version}`;
  }

  // After release 123, we have complete release notes
  if (version > 123) {
    url = `https://developer.chrome.com/release-notes/${version}`;
  }

  const releaseNote = await fetch(url);

  if (releaseNote.status !== 200) {
    throw chalk`{red \nRelease note not found for ${version}}.`;
  }

  return url;
};

/**
 * updateChromiumReleases - Update the json file listing the browser releases of a chromium browser
 * @param options The list of options for this type of chromiums.
 * @returns The log of what has been generated (empty if nothing)
 */
export const updateChromiumReleases = async (options) => {
  let result = '';

  //
  // Get the JSON with the versions from chromestatus
  //
  const googleVersions = await fetch(options.chromestatusURL);

  // There is a bug in chromestatus: the first 4 characters are erroneous.
  // It isn't a valid JSON file.
  // So we strip these characters and manually parse it.
  // If one day, the bug is fixed, the next 3 lines can be replaced with:
  // const versions = await googleVersions.json();
  let buffer = await googleVersions.text();
  buffer = buffer.substring(5);
  const versions = JSON.parse(buffer);

  //
  // Get the chrome.json from the local BCD
  //
  const file = fs.readFileSync(`${options.bcdFile}`);
  const chromeBCD = JSON.parse(file.toString());

  //
  // Update the three channels
  //
  const channels = new Map([
    ['current', options.releaseBranch],
    ['beta', options.betaBranch],
    ['nightly', options.nightlyBranch],
  ]);
  const data = {};

  for (const [key, value] of channels) {
    // Extract the useful data
    const versionData = versions[value];

    if (versionData) {
      const version = versionData.version.toString();
      const releaseDate = versionData.stable_date.substring(0, 10);

      data[value] = {};
      data[value].version = version;
      data[value].releaseDate = releaseDate; // Remove the time part;

      if (key === 'current' && Date.now() < Date.parse(releaseDate)) {
        return gfmNoteblock(
          'NOTE',
          `**${options.browserName}**: Ignoring current version ${version}, which is not yet released (stable date is ${releaseDate}).`,
        );
      }

      // Update the JSON in memory
      let releaseNotesURL;
      try {
        releaseNotesURL = await getReleaseNotesURL(
          data[value].version,
          data[value].releaseDate,
          options.releaseNoteCore,
          value,
        );
      } catch (str) {
        result += str;
      }

      if (
        chromeBCD.browsers[options.bcdBrowserName].releases[data[value].version]
      ) {
        // The entry already exists
        result += updateBrowserEntry(
          chromeBCD,
          options.bcdBrowserName,
          data[value].version,
          data[value].releaseDate,
          key,
          releaseNotesURL,
          '',
        );
      } else {
        // New entry
        result += newBrowserEntry(
          chromeBCD,
          options.bcdBrowserName,
          data[value].version,
          key,
          options.browserEngine,
          data[value].releaseDate,
          releaseNotesURL,
          data[value].version,
        );
      }
    }
  }

  //
  // Check that all older releases are 'retired'
  //
  for (
    let i = options.firstRelease;
    i < data[options.releaseBranch].version;
    i++
  ) {
    if (!options.skippedReleases.includes(i)) {
      if (chromeBCD.browsers[options.bcdBrowserName].releases[i.toString()]) {
        result += updateBrowserEntry(
          chromeBCD,
          options.bcdBrowserName,
          i.toString(),
          chromeBCD.browsers[options.bcdBrowserName].releases[i.toString()]
            .release_date,
          'retired',
          '',
          '',
        );
      } else {
        // There is a retired version missing. Chromestatus doesn't list them.
        // There is an oddity: the version is not skipped but not in chromestatus
        result += chalk`{red \nChrome ${i} not found in Chromestatus! Add it manually or add an exception.}`;
      }
    }
  }

  //
  // Add a planned version entry
  //
  if (data[options.nightlyBranch]) {
    const plannedVersion = (
      Number(data[options.nightlyBranch].version) + 1
    ).toString();
    if (chromeBCD.browsers[options.bcdBrowserName].releases[plannedVersion]) {
      result += updateBrowserEntry(
        chromeBCD,
        options.bcdBrowserName,
        plannedVersion,
        chromeBCD.browsers[options.bcdBrowserName].releases[plannedVersion]
          .release_date,
        'planned',
        '',
        '',
      );
    } else {
      // New entry
      result += newBrowserEntry(
        chromeBCD,
        options.bcdBrowserName,
        plannedVersion,
        'planned',
        options.browserEngine,
        '',
        '',
        plannedVersion,
      );
    }
  }

  //
  // Write the update browser's json to file
  //
  fs.writeFileSync(`./${options.bcdFile}`, stringify(chromeBCD) + '\n');

  // Returns the log
  if (result) {
    result = `### Updates for ${options.browserName}\n${result}`;
  }
  return result;
};
