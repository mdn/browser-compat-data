/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import * as fs from 'node:fs';

import { newBrowserEntry } from './utils.js';

/**
 * getFirefoxReleaseNotesURL - Guess the URL of the release notes
 *
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
 *
 * @param {object} options The list of options for this type of chromiums.
 */
export const updateFirefoxFile = async (options) => {
  //
  // Get the JSON with the versions from chromestatus
  //
  const firefoxVersions = await fetch(options.firefoxReleaseDateURL);
  const releasedFirefoxVersions = await firefoxVersions.json();

  //
  // Extract the current stable version and its release date
  //
  let stableRelease = 1;
  Object.entries(releasedFirefoxVersions).forEach((key) => {
    if (parseFloat(key) > stableRelease) {
      stableRelease = parseFloat(key);
    }
  });

  const stable = stableRelease.toString();
  const stableReleaseDate = releasedFirefoxVersions[stableRelease.toFixed(1)];

  //
  // Get the JSON with the current train info
  //
  const currentTrainInfo = await fetch(options.firefoxScheduleURL);
  const currentTrain = await currentTrainInfo.json();

  //
  // Get the JSON with the nightly train info
  //
  const nightlyTrainInfo = await fetch(options.firefoxNightlyScheduleURL);
  const nightlyTrain = await nightlyTrainInfo.json();

  //
  // Extract the current beta version and its release date
  //
  const beta = parseFloat(currentTrain.version).toString();
  const betaReleaseDate = currentTrain.release.substring(0, 10); // Remove the time part

  //
  // Extract the current nightly version and its release date
  //
  const nightly = parseFloat(nightlyTrain.version).toString();
  const nightlyReleaseDate = nightlyTrain.release.substring(0, 10); // Remove the time part

  //
  // Extract the current planned version and its release date
  //
  const planned = (Number(nightlyTrain.version) + 1).toString();
  const plannedTrainInfo = await fetch(
    `${options.firefoxSpecificScheduleURL}${planned}`,
  );
  const plannedTrain = await plannedTrainInfo.json();
  const plannedReleaseDate = plannedTrain.release.substring(0, 10); // Remove the time part

  //
  // Get the firefox.json from the local BCD
  //
  const file = fs.readFileSync(`./${options.bcdFile}`);
  const firefoxBCD = JSON.parse(file.toString());

  //
  // Update the JSON in memory
  //

  // Update the stable version entry
  const releaseNotesURL = await getFirefoxReleaseNotesURL(stable);
  if (firefoxBCD.browsers[options.bcdBrowserName].releases[stable]) {
    firefoxBCD.browsers[options.bcdBrowserName].releases[stable].release_date =
      stableReleaseDate;
    firefoxBCD.browsers[options.bcdBrowserName].releases[stable].release_notes =
      releaseNotesURL;
    firefoxBCD.browsers[options.bcdBrowserName].releases[stable].status =
      'current';
  } else {
    // New entry
    newBrowserEntry(
      firefoxBCD,
      options.bcdBrowserName,
      stable,
      'current',
      'Gecko',
      stableReleaseDate,
      releaseNotesURL,
    );
  }

  // Set all older releases are 'retired'
  Object.entries(firefoxBCD.browsers[options.bcdBrowserName].releases).forEach(
    ([key, entry]) => {
      if (parseFloat(key) < parseFloat(stable)) {
        entry.status = 'retired';
      }
    },
  );

  // Update the beta version entry
  if (firefoxBCD.browsers[options.bcdBrowserName].releases[beta]) {
    firefoxBCD.browsers[options.bcdBrowserName].releases[beta].release_date =
      betaReleaseDate;
    firefoxBCD.browsers[options.bcdBrowserName].releases[beta].status = 'beta';
  } else {
    // New entry
    newBrowserEntry(
      firefoxBCD,
      options.bcdBrowserName,
      beta,
      'beta',
      'Gecko',
      betaReleaseDate,
      await getFirefoxReleaseNotesURL(beta),
    );
  }

  // Update the nightly version entry
  if (firefoxBCD.browsers[options.bcdBrowserName].releases[nightly]) {
    firefoxBCD.browsers[options.bcdBrowserName].releases[nightly].release_date =
      nightlyReleaseDate;
    firefoxBCD.browsers[options.bcdBrowserName].releases[nightly].status =
      'nightly';
  } else {
    // New entry
    newBrowserEntry(
      firefoxBCD,
      options.bcdBrowserName,
      nightly,
      'nightly',
      'Gecko',
      nightlyReleaseDate,
      await getFirefoxReleaseNotesURL(nightly),
    );
  }

  // Add a planned version entry
  if (firefoxBCD.browsers[options.bcdBrowserName].releases[planned]) {
    firefoxBCD.browsers[options.bcdBrowserName].releases[planned].release_date =
      plannedReleaseDate;
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
      plannedReleaseDate,
      await getFirefoxReleaseNotesURL(planned),
    );
  }

  //
  // Write the JSON back into chrome.json
  //
  fs.writeFileSync(`./${options.bcdFile}`, JSON.stringify(firefoxBCD, null, 2));
  console.log(`File generated succesfully: ${options.bcdFile}`);
};
