/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import * as fs from 'node:fs';

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
  console.warn('Release note not found');
  return '';
};

/**
 * updateChromiumFile - Update the json file listing the browser version of a chromium entry
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

  // Get current stable version
  const stable = versions[options.releaseBranch].version;
  const stableReleaseDate = versions[
    options.releaseBranch
  ].stable_date.substring(0, 10); // Remove the time part

  // Get current beta version
  const beta = versions[options.betaBranch].version;
  const betaReleaseDate = versions[options.betaBranch].stable_date.substring(
    0,
    10,
  ); // Remove the time part

  // Get current nightly (= canary) version
  const canary = versions[options.nightlyBranch].version;
  const canaryReleaseDate = versions[
    options.nightlyBranch
  ].stable_date.substring(0, 10); // Remove the time part

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
    stableReleaseDate,
    options.releaseNoteCore,
  );
  if (chromeBCD.browsers[options.bcdBrowserName].releases[stable]) {
    chromeBCD.browsers[options.bcdBrowserName].releases[stable].release_date =
      stableReleaseDate;
    chromeBCD.browsers[options.bcdBrowserName].releases[stable].release_notes =
      releaseNotesURL;
    chromeBCD.browsers[options.bcdBrowserName].releases[stable].status =
      'current';
  } else {
    // New entry
    newBrowserEntry(
      chromeBCD,
      options.bcdBrowserName,
      stable,
      'current',
      options.browserEngine,
      stableReleaseDate,
      releaseNotesURL,
    );
  }

  // Check that all older releases are 'retired'
  for (let i = options.firstRelease; i < stable; i++) {
    if (!options.skippedReleases.includes(i)) {
      if (chromeBCD.browsers[options.bcdBrowserName].releases[i.toString()]) {
        chromeBCD.browsers[options.bcdBrowserName].releases[
          i.toString()
        ].status = 'retired';
      } else {
        // There is a retired version missing. Chromestatus doesn't list them.
        // There is an oddity: the verison is not skipped but not in chromestatus
        console.warn(
          `Chrome ${i} not found in Chromestatus! Add it manually or add an exception.`,
        );
      }
    }
  }

  // Update the beta version entry
  if (chromeBCD.browsers[options.bcdBrowserName].releases[beta]) {
    chromeBCD.browsers[options.bcdBrowserName].releases[beta].release_date =
      betaReleaseDate;
    chromeBCD.browsers[options.bcdBrowserName].releases[beta].status = 'beta';
  } else {
    // New entry
    newBrowserEntry(
      chromeBCD,
      options.bcdBrowserName,
      beta,
      'beta',
      options.browserEngine,
      betaReleaseDate,
      '',
    );
  }

  // Update the nightly version (canary) entry
  if (chromeBCD.browsers[options.bcdBrowserName].releases[canary]) {
    chromeBCD.browsers[options.bcdBrowserName].releases[canary].release_date =
      canaryReleaseDate;
    chromeBCD.browsers[options.bcdBrowserName].releases[canary].status =
      'nightly';
  } else {
    // New entry
    newBrowserEntry(
      chromeBCD,
      options.bcdBrowserName,
      canary,
      'nightly',
      options.browserEngine,
      canaryReleaseDate,
      '',
    );
  }

  // Add a planned version entry
  if (
    chromeBCD.browsers[options.bcdBrowserName].releases[(canary + 1).toString()]
  ) {
    chromeBCD.browsers[options.bcdBrowserName].releases[
      (canary + 1).toString()
    ].status = 'planned';
  } else {
    // New entry
    newBrowserEntry(
      chromeBCD,
      options.bcdBrowserName,
      (canary + 1).toString(),
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
  console.log(`File generated succesfully: ${options.bcdFile}`);
};
