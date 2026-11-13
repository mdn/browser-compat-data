/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import * as fs from 'node:fs';
import { styleText } from 'node:util';

import stringify from '../lib/stringify-and-order-properties.js';

import { gfmNoteblock, newBrowserEntry, updateBrowserEntry } from './utils.js';

/**
 * Returns the release notes URL for Chrome 54 and later.
 * @param {string} version Version number
 * @returns {string} The URL of the release notes, or the empty string before Chrome 54
 */
export const getReleaseNotesURLForVersion = (version) => {
  const versionNumber = Number(version);

  if (versionNumber >= 155) {
    return `https://chromestatus.com/release-notes/${version}`;
  }
  if (versionNumber >= 124) {
    return `https://developer.chrome.com/release-notes/${version}`;
  }
  if (versionNumber >= 54) {
    return `https://developer.chrome.com/blog/new-in-chrome-${version}`;
  }
  return '';
};

/**
 * getReleaseNotesURL - Guess the URL of the release notes
 * @param {string} version Version number
 * @param {string} date Date in the format YYYYMMDD
 * @param {string} core The core of the name of the release note
 * @param {string} status The status of the release
 * @returns {Promise<string>} The URL of the release notes or the empty string if not found
 * Throws a string in case of error
 */
const getReleaseNotesURL = async (version, date, core, status) => {
  // Chrome Status publishes release notes ahead of the stable release.
  if (status !== 'stable' && Number(version) < 155) {
    return '';
  }

  let url = getReleaseNotesURLForVersion(version);

  // Before release 54, we guess the release note
  if (!url) {
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
      throw styleText('red', `\nRelease note not found for ${version}.`);
    }

    return url;
  }

  const releaseNote = await fetch(url);

  if (releaseNote.status !== 200) {
    throw styleText('red', `\nRelease note not found for ${version}.`);
  }

  return url;
};

/**
 * Maps each Chromestatus channel to the BCD status of its version.
 * @param {*} options The list of options for this type of chromiums.
 * @param {boolean} stableUnreleased Whether Chromestatus lists a stable version before its stable date
 * @returns {Array<[string, string]>} Pairs of Chromestatus channel and BCD status
 */
export const getChannels = (options, stableUnreleased) =>
  stableUnreleased
    ? [
        [options.releaseBranch, 'beta'],
        [options.betaBranch, 'nightly'],
        [options.nightlyBranch, 'planned'],
      ]
    : [
        [options.releaseBranch, 'current'],
        [options.betaBranch, 'beta'],
        [options.nightlyBranch, 'nightly'],
      ];

/**
 * updateChromiumReleases - Update the json file listing the browser releases of a chromium browser
 * @param {*} options The list of options for this type of chromiums.
 * @returns {Promise<string>} The log of what has been generated (empty if nothing)
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
  // Chromestatus switches `stable` to the next version before its stable date,
  // which shifts every channel down by one.
  const stableData = versions[options.releaseBranch];
  const stableUnreleased =
    stableData &&
    Date.now() < Date.parse(stableData.stable_date.substring(0, 10));
  const channels = getChannels(options, stableUnreleased);
  const data = {};

  for (const [value, key] of channels) {
    // Extract the useful data
    const versionData = versions[value];

    if (versionData) {
      const version = versionData.version.toString();
      const releaseDate = versionData.stable_date.substring(0, 10);

      data[value] = {};
      data[value].version = version;
      data[value].releaseDate = releaseDate; // Remove the time part;

      if (stableUnreleased && value === options.releaseBranch) {
        result += `\n${gfmNoteblock(
          'NOTE',
          `**${options.browserName}**: Current version ${version} is not yet released (stable date is ${releaseDate}), treating it as beta.`,
        )}\n`;
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
          key === 'planned' ? '' : data[value].releaseDate,
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
          key === 'planned' ? '' : data[value].releaseDate,
          releaseNotesURL,
          data[value].version,
        );
      }
    }
  }

  //
  // Check that all older releases are 'retired'
  //
  const currentVersion =
    Number(data[options.releaseBranch].version) - (stableUnreleased ? 1 : 0);
  for (let i = options.firstRelease; i < currentVersion; i++) {
    if (!options.skippedReleases.includes(i)) {
      const release =
        chromeBCD.browsers[options.bcdBrowserName].releases[i.toString()];
      if (release) {
        // Fill in release notes that were unavailable while the release was current
        let releaseNotesURL = '';
        if (!release.release_notes && i >= 155) {
          try {
            releaseNotesURL = await getReleaseNotesURL(
              i.toString(),
              release.release_date,
              options.releaseNoteCore,
              'retired',
            );
          } catch {
            // Leave the release notes unset
          }
        }
        result += updateBrowserEntry(
          chromeBCD,
          options.bcdBrowserName,
          i.toString(),
          release.release_date,
          'retired',
          releaseNotesURL,
          '',
        );
      } else {
        // There is a retired version missing. Chromestatus doesn't list them.
        // There is an oddity: the version is not skipped but not in chromestatus
        result += styleText(
          'red',
          `\nChrome ${i} not found in Chromestatus! Add it manually or add an exception.`,
        );
      }
    }
  }

  //
  // Add a planned version entry
  //
  if (!stableUnreleased && data[options.nightlyBranch]) {
    const plannedVersion = (
      Number(data[options.nightlyBranch].version) + 1
    ).toString();

    let plannedReleaseNotesURL;
    try {
      plannedReleaseNotesURL = await getReleaseNotesURL(
        plannedVersion,
        '',
        options.releaseNoteCore,
        'planned',
      );
    } catch (str) {
      result += str;
    }

    if (chromeBCD.browsers[options.bcdBrowserName].releases[plannedVersion]) {
      result += updateBrowserEntry(
        chromeBCD,
        options.bcdBrowserName,
        plannedVersion,
        chromeBCD.browsers[options.bcdBrowserName].releases[plannedVersion]
          .release_date,
        'planned',
        plannedReleaseNotesURL,
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
        plannedReleaseNotesURL,
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
