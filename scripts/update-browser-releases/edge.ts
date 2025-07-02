/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import * as fs from 'node:fs';

import chalk from 'chalk-template';

import stringify from '../lib/stringify-and-order-properties.js';

import {
  newBrowserEntry,
  setBrowserReleaseStatus,
  updateBrowserEntry,
} from './utils.js';

/**
 * getFutureReleaseDate - Read the future release date
 * @param release The release number of the version
 * @param releaseScheduleURL The url of the MD file having it
 * @returns The date in the YYYY-MM-DD format
 * Throws a string in case of an error
 */
const getFutureReleaseDate = async (release, releaseScheduleURL) => {
  // Fetch the MD of the release schedule
  const scheduleMD = await fetch(releaseScheduleURL);
  const text = await scheduleMD.text();
  if (!text) {
    throw chalk`{red \nRelease file not found.}`;
  }
  // Find the line
  //const regexp = new RegExp(`| ${release} |\\w*|\\w*| ?Week of (\\w*) ?|\\w*|`, 'i');
  const regexp = new RegExp(
    `\\| ${release} \\|.*\\|.*\\| ?Week of (.*) ?\\|.*\\|`,
    'i',
  );
  const result = text.match(regexp);
  if (!result) {
    throw chalk`{yellow \nRelease date not found for Edge ${release}.}`;
  }
  const releaseDateText = result[1];

  // Get the date from the file
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
 * @param status The status of the release
 * @param version The major version of the release
 * @returns The URL of the release notes or the empty string if not found
 * @throws a string in case of error
 */
const getReleaseNotesURL = async (status, version) => {
  const url = `https://learn.microsoft.com/en-us/microsoft-edge/web-platform/release-notes/${version}`;

  const releaseNote = await fetch(url);

  if (releaseNote.status != 200) {
    if (status !== 'Stable') {
      return '';
    }

    throw chalk`{red \nFailed to fetch Edge ${version} release notes at ${url}!}`;
  }

  return url;
};

/**
 * updateEdgeReleases - Update the json file listing the browser releases of an Edge browser
 * @param options The list of options for Edge.
 * @returns The log of what has been generated (empty if nothing)
 */
export const updateEdgeReleases = async (options) => {
  let result = '';

  //
  // Get the JSON with the versions from edge releases
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

    //
    // Update the JSON in memory
    //

    // We skip beta and nightly versions if they are of the same version as the released one
    if (
      key === 'current' ||
      (key !== 'current' &&
        data[value].version !== data[channels.get('current')].version)
    ) {
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
        try {
          data[value].versionDate = await getFutureReleaseDate(
            data[value].version,
            options.releaseScheduleURL,
          );
        } catch (str) {
          result += str;
        }
      }

      // Get the release notes
      let releaseNotesURL = '';
      try {
        releaseNotesURL = await getReleaseNotesURL(value, data[value].version);
      } catch (s) {
        result += s;
      }

      if (
        edgeBCD.browsers[options.bcdBrowserName].releases[data[value].version]
      ) {
        // The entry already exists
        result += updateBrowserEntry(
          edgeBCD,
          options.bcdBrowserName,
          data[value].version,
          data[value]?.versionDate,
          key,
          releaseNotesURL,
          '',
        );
      } else {
        // New entry
        result += newBrowserEntry(
          edgeBCD,
          options.bcdBrowserName,
          data[value].version,
          key,
          options.browserEngine,
          data[value]?.versionDate,
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
      if (edgeBCD.browsers[options.bcdBrowserName].releases[i.toString()]) {
        result += updateBrowserEntry(
          edgeBCD,
          options.bcdBrowserName,
          i.toString(),
          edgeBCD.browsers[options.bcdBrowserName].releases[i.toString()]
            .release_date,
          'retired',
          '',
          '',
        );
      } else {
        // There is a retired version missing. Edgeupdates doesn't list them.
        // There is an oddity: the version is not skipped but not in edgeupdates
        result += chalk`{yellow \nEdge ${i} not found in Edgeupdates! Add it manually or add an exception.}`;
      }
    }
  }

  //
  // Ensure that the release following stable is 'beta'
  //
  const betaVersion = data[options.releaseBranch].version + 1;
  result += setBrowserReleaseStatus(
    edgeBCD,
    options.bcdBrowserName,
    betaVersion.toString(),
    'beta',
  );

  //
  // Ensure that the release following beta is 'nightly'
  //
  const nightlyVersion = data[options.releaseBranch].version + 2;
  result += setBrowserReleaseStatus(
    edgeBCD,
    options.bcdBrowserName,
    nightlyVersion.toString(),
    'nightly',
  );

  //
  // Add a planned version entry
  //
  const planned = (data[options.releaseBranch].version + 3).toString();
  let releaseDate;
  try {
    releaseDate = await getFutureReleaseDate(
      planned,
      options.releaseScheduleURL,
    );
  } catch (s) {
    result += s;
  }

  if (edgeBCD.browsers[options.bcdBrowserName].releases[planned]) {
    result += updateBrowserEntry(
      edgeBCD,
      options.bcdBrowserName,
      planned,
      releaseDate,
      'planned',
      '',
      planned,
    );
  } else {
    // New entry
    result += newBrowserEntry(
      edgeBCD,
      options.bcdBrowserName,
      planned.toString(),
      'planned',
      options.browserEngine,
      releaseDate,
      '',
      planned.toString(),
    );
  }

  //
  // Write the update browser's json to file
  //
  fs.writeFileSync(`./${options.bcdFile}`, stringify(edgeBCD) + '\n');

  // Returns the log
  if (result) {
    result = `### Updates for ${options.browserName}\n${result}`;
  }
  return result;
};
