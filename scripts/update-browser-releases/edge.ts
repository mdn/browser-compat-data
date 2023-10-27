/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import * as fs from 'node:fs';

import chalk from 'chalk-template';

import stringify from '../lib/stringify-and-order-properties.js';

import { newBrowserEntry, updateBrowserEntry } from './utils.js';

/**
 * getFutureReleaseDate - Read the future release date
 * @param {string} release The release number of the versin
 * @param {string} releaseScheduleURL The url of the MD file having it
 * @returns {string} The date in the YYYY-MM-DD format
 */
const getFutureReleaseDate = async (release, releaseScheduleURL) => {
  // Fetch the MD of the release schedule
  const scheduleMD = await fetch(releaseScheduleURL);
  const text = await scheduleMD.text();
  if (!text) {
    console.log(chalk`{red \nRelease file not found.}`);
    return '';
  }
  // Find the line
  //const regexp = new RegExp(`| ${release} |\\w*|\\w*| ?Week of (\\w*) ?|\\w*|`, 'i');
  const regexp = new RegExp(
    `\\| ${release} \\|.*\\|.*\\| ?Week of (.*) ?\\|.*\\|`,
    'i',
  );
  const result = text.match(regexp);
  if (!result) {
    console.log(chalk`{yellow \nRelease date not found for Edge ${release}.}`);
    return '';
  }
  const releaseDateText = result[1];

  // Get the date frome the file
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const year = releaseDateText.substring(7, 11);
  const month = months.indexOf(releaseDateText.substring(3, 6)) + 1;
  const day = releaseDateText.substring(0, 2);

  const releaseDate = new Date(`${year}-${month}-${day}Z`);

  return releaseDate.toISOString().substring(0, 10); // Remove the time part
};

/**
 * getReleaseNotesURL - Guess the URL of the release notes
 * @param {string} status The status of the release
 * @param {string} fullRelease The release of the release
 * @param {string} date The date of the release
 * @returns {string} The URL of the release notes or the empty string if not found
 */
const getReleaseNotesURL = async (status, fullRelease, date) => {
  // If the status isn't stable, do not give back any release notes.
  if (status !== 'Stable') {
    return '';
  }

  // Calculate the URL
  const releaseStr = fullRelease.replace(/\./g, '');
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

  const URL = `https://learn.microsoft.com/en-us/deployedge/microsoft-edge-relnote-stable-channel#version-${releaseStr}-${dateStr}`;
  const id = URL.split('#')[1];

  // Fetch the page
  const releaseNote = await fetch(URL);
  if (releaseNote.status != 200) {
    // File not found -> log a warning
    console.log(
      chalk`{red \nRelease note files not found for Edge ${fullRelease}}`,
    );
    return '';
  }

  // Check if the id exists
  const releaseNoteText = await releaseNote.text();
  if (releaseNoteText.indexOf(`<h2 id="${id}">`) == -1) {
    // Section not found -> log a warning
    console.log(
      chalk`{red \nSection not found in official release notes for Edge ${fullRelease}}`,
    );
  }

  return URL;
};

/**
 * updateEdgeReleases - Update the json file listing the browser releases of an Edge browser
 * @param {object} options The list of options for Edge.
 */
export const updateEdgeReleases = async (options) => {
  //
  // Get the JSON with the versions from edgereleases
  //
  const buffer = await fetch(options.edgeupdatesURL);
  const edgeVersions = JSON.parse(await buffer.text());

  //
  // Get the edge.json from the local BCD
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

    // We need to find the first release with this version.
    // As, they are from the newer to the older in the JSON object,
    // we are looking for the first that is not the latest version
    // and get the one immediately above (the first release of that
    // version)
    //
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

    // NOTE: the published date is the one of the actual release
    // (being the Stable, Beta, or Nightly),
    // and not the one of the future release like we would like
    // So we only get it if we are on the 'current' channel.

    // Get published date
    if (key === 'current') {
      data[value].versionDate = entry['Releases'][id][
        'PublishedTime'
      ].substring(0, 10); // Remove the time part;
    } else {
      data[value].versionDate = await getFutureReleaseDate(
        data[value].version,
        options.releaseScheduleURL,
      );
    }

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
        edgeBCD,
        options.bcdBrowserName,
        data[value].version,
        data[value]?.versionDate,
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
        data[value]?.versionDate,
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
        // There is a retired version missing. Edgeupdates doesn't list them.
        // There is an oddity: the version is not skipped but not in edgeupdates
        console.log(
          chalk`{yellow \nEdge ${i} not found in Edgeupdates! Add it manually or add an exception.}`,
        );
      }
    }
  }

  //
  // Add a planned version entry
  //
  const planned = (data[options.nightlyBranch].version + 1).toString();
  const releaseDate = await getFutureReleaseDate(
    planned,
    options.releaseScheduleURL,
  );

  if (edgeBCD.browsers[options.bcdBrowserName].releases[planned]) {
    updateBrowserEntry(
      edgeBCD,
      options.bcdBrowserName,
      planned,
      releaseDate,
      'planned',
      '',
    );
    edgeBCD.browsers[options.bcdBrowserName].releases[planned].status =
      'planned';
  } else {
    // New entry
    newBrowserEntry(
      edgeBCD,
      options.bcdBrowserName,
      planned.toString(),
      'planned',
      options.browserEngine,
      releaseDate,
      '',
    );
  }

  //
  // Write the update browser's json to file
  //
  fs.writeFileSync(`./${options.bcdFile}`, stringify(edgeBCD) + '\n');
};
