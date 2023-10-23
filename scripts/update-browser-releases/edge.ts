/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import * as fs from 'node:fs';

import chalk from 'chalk-template';

import { newBrowserEntry, updateBrowserEntry } from './utils.js';

/**
 * getReleaseNotesURL - Guess the URL of the release notes
 * @param {string} status The status of the release
 * @param {string} fullVersion The version of the release
 * @param {string} date The date of the release
 * @returns {string} The URL of the release notes or the empty string if not found
 */
const getReleaseNotesURL = async (status, fullVersion, date) => {
  // If the status isn't stable, do not give back any release notes.
  if (status !== 'Stable') {
    return '';
  }
  console.log(fullVersion);
  const versionStr = fullVersion.replace(/\./g, '');
  const month = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];
  const dateObj = new Date(date);
  const dateStr = `${
    month[dateObj.getMonth()]
  }-${dateObj.getDate()}-${dateObj.getFullYear()}`;
  return `https://learn.microsoft.com/en-us/deployedge/microsoft-edge-relnote-stable-channel#version-${versionStr}-${dateStr}`;
};

/**
 * updateEdgeReleases - Update the json file listing the browser releases of an Edge browser
 * @param {object} options The list of options for Edge.
 */
export const updateEdgeReleases = async (options) => {
  //
  // Get the JSON with the versions from chromestatus
  //
  const buffer = await fetch(options.edgeupdatesURL);
  const edgeVersions = JSON.parse(await buffer.text());

  //
  // Get the chrome.json from the local BCD
  //
  const file = fs.readFileSync(`${options.bcdFile}`);
  const edgeBCD = JSON.parse(file.toString());

  //
  // Update the three channels
  //
  const channels = new Map([
    ['current', options.releaseBranch],
    ['beta', options.betaBranch],
    ['nightly', options.nightlyBranch],
  ]);

  // Information store to be used outside the for loop
  const data = {};

  for (const [key, value] of channels) {
    //
    // Extract the useful data
    //

    // Find the right entry
    const entry = edgeVersions.find((e) => e['Product'] === value);

    // Get the last version
    const version = parseFloat(entry['Releases'][0]['ProductVersion']);

    // We need to find the first release with this version:
    // The full version number is needed for the release note URL
    // as well as the date
    let id = 1;
    while (
      id < entry['Releases'].length &&
      parseFloat(entry['Releases'][id]['ProductVersion']) === version
    ) {
      id++;
    }
    id--;

    data[value] = {};
    data[value].version = parseFloat(entry['Releases'][id]['ProductVersion']);
    data[value].fullVersion = entry['Releases'][id]['ProductVersion'];

    // Get published date
    data[value].versionDate = entry['Releases'][id]['PublishedTime'].substring(
      0,
      10,
    ); // Remove the time part;

    //
    // Update the JSON in memory
    //

    // Get the release notes
    const releaseNotesURL = await getReleaseNotesURL(
      value,
      data[value].fullVersion,
      data[value].versionDate,
    );

    // Update in memory
    if (
      edgeBCD.browsers[options.bcdBrowserName].releases[data[value].version]
    ) {
      // The entry already exists
      updateBrowserEntry(
        edgeBCD.browsers[options.bcdBrowserName].releases[data[value].version],
        data[value].versionDate,
        key,
        releaseNotesURL,
      );
    } else {
      // New entry
      newBrowserEntry(
        edgeBCD,
        options.bcdBrowserName,
        data[value].version,
        key,
        options.browserEngine,
        data[value].versionDate,
        releaseNotesURL,
      );
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
      if (edgeBCD.browsers[options.bcdBrowserName].releases[i.toString()]) {
        edgeBCD.browsers[options.bcdBrowserName].releases[i.toString()].status =
          'retired';
      } else {
        // There is a retired version missing. Chromestatus doesn't list them.
        // There is an oddity: the version is not skipped but not in chromestatus
        console.warn(
          chalk`{yellow Chrome ${i} not found in Chromestatus! Add it manually or add an exception.}`,
        );
      }
    }
  }

  //
  // Add a planned version entry
  //
  if (
    edgeBCD.browsers[options.bcdBrowserName].releases[
      (data[options.nightlyBranch].version + 1).toString()
    ]
  ) {
    edgeBCD.browsers[options.bcdBrowserName].releases[
      (data[options.nightlyBranch].version + 1).toString()
    ].status = 'planned';
  } else {
    // New entry
    newBrowserEntry(
      edgeBCD,
      options.bcdBrowserName,
      (data[options.nightlyBranch].version + 1).toString(),
      'planned',
      options.browserEngine,
      '',
      '',
    );
  }

  //
  // Write the update browser's json to file
  //
  fs.writeFileSync(
    `./${options.bcdFile}`,
    JSON.stringify(edgeBCD, null, 2) + '\n',
  );
  console.log(chalk`{bold File generated successfully: ${options.bcdFile}}`);
};
