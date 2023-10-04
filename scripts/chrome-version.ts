/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */
export {};

const releaseBranch = 'stable';
const betaBranch = 'beta';
const nightlyBranch = 'canary';

/**
 * newChromeEntry - Add a new Chrome entry in the JSON list for Chrome browsers
 *
 * @param {object} json json file to update
 * @param {string} version new version to add
 * @param {string} status new status
 * @param {string} releaseDate new release date
 * @param {string} releaseNotesURL url of the release notes
 */
const newChromeEntry = (
  json,
  version,
  status,
  releaseDate,
  releaseNotesURL,
) => {
  const release = (json.browsers.chrome.releases[version] = new Object());
  if (releaseDate) {
    release['release_date'] = releaseDate;
  }
  if (releaseNotesURL) {
    release['release_notes'] = releaseNotesURL;
  }
  release['status'] = status;
  release['engine'] = 'Blink';
  release['engine_version'] = version;
};

/**
 * getReleaseNotesURL - Guess the URL of the release notes
 *
 * @param {string} date Date in the format YYYYMMDD
 * @returns {string} The URL of the release notes or the empty string if not found
 */
const getReleaseNotesURL = async (date) => {
  const dateObj = new Date(date);
  const year = dateObj.getUTCFullYear();
  const month = `0${dateObj.getUTCMonth() + 1}`.slice(-2);
  const day = `0${dateObj.getUTCDate()}`.slice(-2);

  // First possibility
  let url = `https://chromereleases.googleblog.com/${year}/${month}/stable-channel-update-for-desktop_${day}.html`;
  let releaseNote = await fetch(url);

  if (releaseNote.status == 200) {
    return url;
  }

  // Second possibility (less reliable)
  url = `https://chromereleases.googleblog.com/${year}/${month}/stable-channel-update-for-desktop.html`;

  releaseNote = await fetch(url);

  if (releaseNote.status == 200) {
    return url;
  }
  console.log('Release note not found');
  return '';
};

//
// Get the JSON with the versions from Google
//
const googleVersions = await fetch('https://chromestatus.com/api/v0/channels');

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
const stable = versions[releaseBranch].version;
const stableReleaseDate = versions[releaseBranch].stable_date.substring(0, 10); // Remove the time part

// Get current beta version
const beta = versions[betaBranch].version;
const betaReleaseDate = versions[betaBranch].stable_date.substring(0, 10); // Remove the time part

// Get current nightly (= canary) version
const canary = versions[nightlyBranch].version;
const canaryReleaseDate = versions[nightlyBranch].stable_date.substring(0, 10); // Remove the time part

//
// Get the chrome.json from the local BCD
//
import * as fs from 'node:fs';
const file = fs.readFileSync('./chrome.json');
const chromeBCD = JSON.parse(file.toString());

//
// Update the JSON in memory
//

// Update the stable version entry
const releaseNotesURL = await getReleaseNotesURL(stableReleaseDate);
if (chromeBCD.browsers.chrome.releases[stable]) {
  chromeBCD.browsers.chrome.releases[stable].release_date = stableReleaseDate;
  chromeBCD.browsers.chrome.releases[stable].release_notes = releaseNotesURL;
  chromeBCD.browsers.chrome.releases[stable].status = 'current';
} else {
  // New entry
  newChromeEntry(
    chromeBCD,
    stable,
    'current',
    stableReleaseDate,
    releaseNotesURL,
  );
}

// Check that all older releases are 'retired'
for (let i = 1; i < stable; i++) {
  if (chromeBCD.browsers.chrome.releases[i.toString()]) {
    chromeBCD.browsers.chrome.releases[i.toString()].status = 'retired';
  } else {
    console.log(`WARNING: Chrome ${i} is missing.`);
  }
}

// Update the beta version entry
if (chromeBCD.browsers.chrome.releases[beta]) {
  chromeBCD.browsers.chrome.releases[beta].release_date = betaReleaseDate;
  chromeBCD.browsers.chrome.releases[beta].status = 'beta';
} else {
  // New entry
  newChromeEntry(chromeBCD, beta, 'beta', betaReleaseDate, '');
}

// Update the nightly version (canary) entry
if (chromeBCD.browsers.chrome.releases[canary]) {
  chromeBCD.browsers.chrome.releases[canary].release_date = canaryReleaseDate;
  chromeBCD.browsers.chrome.releases[canary].status = 'nightly';
} else {
  // New entry
  newChromeEntry(chromeBCD, canary, 'nightly', canaryReleaseDate, '');
}

// Add a planned version entry
if (chromeBCD.browsers.chrome.releases[(canary + 1).toString()]) {
  chromeBCD.browsers.chrome.releases[(canary + 1).toString()].status =
    'planned';
} else {
  // New entry
  newChromeEntry(chromeBCD, (canary + 1).toString(), 'planned', '', '');
}

//
// Write the JSON back into chrome.json
//
fs.writeFileSync('./chrome.json', JSON.stringify(chromeBCD));
console.log('File written successfully\n');
