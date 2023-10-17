/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import * as fs from 'node:fs';

import chalk from 'chalk-template';

import { newBrowserEntry } from './utils.js';

/**
 * getReleaseNotesURL - Guess the URL of the release notes
 *
 * @param {string} date Date in the format YYYYMMDD
 * @param {string} core The core of the name of the release note
 * @returns {string} The URL of the release notes or the empty string if not found
 */
const getReleaseNotesURL = async (date, core) => {
  const dateObj = new Date(date);
  const year = dateObj.getUTCFullYear();
  const month = `0${dateObj.getUTCMonth() + 1}`.slice(-2);
  const day = `0${dateObj.getUTCDate()}`.slice(-2);

  // First possibility
  let url = `https://chromereleases.googleblog.com/${year}/${month}/${core}_${day}.html`;
  let releaseNote = await fetch(url);

  if (releaseNote.status == 200) {
    return url;
  }

  // Second possibility (less reliable)
  url = `https://chromereleases.googleblog.com/${year}/${month}/${core}.html`;

  releaseNote = await fetch(url);

  if (releaseNote.status == 200) {
    return url;
  }
  console.warn(chalk`{yellow Release note not found}`);
  return '';
};

/**
 * updateChromiumReleases - Update the json file listing the browser releases of a chromium browser
 *
 * @param {object} options The list of options for this type of chromiums.
 */
export const updateChromiumReleases = async (options) => {
  //
  // Get the JSON with the versions from chromestatus
  //
  const googleVersions = await fetch(options.chromestatusURL);

  // There is a bug in chromestatus: the first 4 characters are erroneous.
  // It isn't a valid JSON file.
  // So we strip these characters and manually parse it.
  // If one day, the bug is fixed, the next 3 lines can be replaces with:
  // const versions = await googleVersions.json();
  let buffer = await googleVersions.text();
  buffer = buffer.substring(5);
  const versions = JSON.parse(buffer);

  //
  // Extract the useful data
  //

  const channels = [
    options.releaseBranch,
    options.betaBranch,
    options.nightlyBranch,
  ];
  const data = {};
  for (const channel of channels) {
    const versionData = versions[channel];
    data[channel] = new Object();
    data[channel].version = versionData.version;
    data[channel].releaseDate = versionData.stable_date.substring(0, 10); // Remove the time part;
  }

  //
  // Get the chrome.json from the local BCD
  //
  const file = fs.readFileSync(`${options.bcdFile}`);
  const chromeBCD = JSON.parse(file.toString());

  //
  // Update the JSON in memory
  //

  // Update the stable version entry
  const releaseNotesURL = await getReleaseNotesURL(
    data[options.releaseBranch].releaseDate,
    options.releaseNoteCore,
  );
  if (
    chromeBCD.browsers[options.bcdBrowserName].releases[
      data[options.releaseBranch].version
    ]
  ) {
    chromeBCD.browsers[options.bcdBrowserName].releases[
      data[options.releaseBranch].version
    ].release_date = data[options.releaseBranch].releaseDate;
    chromeBCD.browsers[options.bcdBrowserName].releases[
      data[options.releaseBranch].version
    ].release_notes = releaseNotesURL;
    chromeBCD.browsers[options.bcdBrowserName].releases[
      data[options.releaseBranch].version
    ].status = 'current';
  } else {
    // New entry
    newBrowserEntry(
      chromeBCD,
      options.bcdBrowserName,
      data[options.releaseBranch].version,
      'current',
      options.browserEngine,
      data[options.releaseBranch].releaseDate,
      releaseNotesURL,
    );
  }

  // Check that all older releases are 'retired'
  for (
    let i = options.firstRelease;
    i < data[options.releaseBranch].version;
    i++
  ) {
    if (!options.skippedReleases.includes(i)) {
      if (chromeBCD.browsers[options.bcdBrowserName].releases[i.toString()]) {
        chromeBCD.browsers[options.bcdBrowserName].releases[
          i.toString()
        ].status = 'retired';
      } else {
        // There is a retired version missing. Chromestatus doesn't list them.
        // There is an oddity: the version is not skipped but not in chromestatus
        console.warn(
          chalk`{yellow Chrome ${i} not found in Chromestatus! Add it manually or add an exception.}`,
        );
      }
    }
  }

  // Update the beta version entry
  if (
    chromeBCD.browsers[options.bcdBrowserName].releases[
      data[options.betaBranch].version
    ]
  ) {
    chromeBCD.browsers[options.bcdBrowserName].releases[
      data[options.betaBranch].version
    ].release_date = data[options.betaBranch].releaseDate;
    chromeBCD.browsers[options.bcdBrowserName].releases[
      data[options.betaBranch].version
    ].status = 'beta';
  } else {
    // New entry
    newBrowserEntry(
      chromeBCD,
      options.bcdBrowserName,
      data[options.betaBranch].version,
      'beta',
      options.browserEngine,
      data[options.betaBranch].releaseDate,
      '',
    );
  }

  // Update the nightly version (canary) entry
  if (
    chromeBCD.browsers[options.bcdBrowserName].releases[
      data[options.nightlyBranch].version
    ]
  ) {
    chromeBCD.browsers[options.bcdBrowserName].releases[
      data[options.nightlyBranch].version
    ].release_date = data[options.nightlyBranch].releaseDate;
    chromeBCD.browsers[options.bcdBrowserName].releases[
      data[options.nightlyBranch].version
    ].status = 'nightly';
  } else {
    // New entry
    newBrowserEntry(
      chromeBCD,
      options.bcdBrowserName,
      data[options.nightlyBranch].version,
      'nightly',
      options.browserEngine,
      data[options.nightlyBranch].releaseDate,
      '',
    );
  }

  // Add a planned version entry
  if (
    chromeBCD.browsers[options.bcdBrowserName].releases[
      (data[options.nightlyBranch].version + 1).toString()
    ]
  ) {
    chromeBCD.browsers[options.bcdBrowserName].releases[
      (data[options.nightlyBranch].version + 1).toString()
    ].status = 'planned';
  } else {
    // New entry
    newBrowserEntry(
      chromeBCD,
      options.bcdBrowserName,
      (data[options.nightlyBranch].version + 1).toString(),
      'planned',
      options.browserEngine,
      '',
      '',
    );
  }

  //
  // Write the JSON back into chrome.json
  //
  fs.writeFileSync(`./${options.bcdFile}`, JSON.stringify(chromeBCD, null, 2));
  console.log(chalk`{bold File generated successfully: ${options.bcdFile}}`);
};
