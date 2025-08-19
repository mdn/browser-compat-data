/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import * as fs from 'node:fs';

import chalk from 'chalk-template';

import stringify from '../lib/stringify-and-order-properties.js';

import { newBrowserEntry, updateBrowserEntry } from './utils.js';

interface Release {
  version: string;
  engineVersion: string;
  channel: 'current' | 'beta' | 'retired';
  date: string;
  releaseNote: string;
}

/**
 * extractReleaseData - Extract release info from string given by Apple
 * @param str The string with release information
 *            E.g., Released September 18, 2023 — Version 17 (19616.1.27)
 * @returns Data for the release
 */
const extractReleaseData = (str): Release | null => {
  // Note: \s is needed as some spaces in Apple source are non-breaking
  const result =
    /Released\s+(.*)\s*—\s*(?:Version\s+)?(\d+(?:\.\d+)*)\s*(\s*beta)?\s*\((.*)\)/.exec(
      str,
    );
  if (!result) {
    console.warn(
      chalk`{yellow A release string for Safari is not parsable (${str}'). Skipped.}`,
    );
    return null;
  }
  return {
    date: new Date(`${result[1]} UTC`).toISOString().substring(0, 10),
    version: result[2].replace(/\.0$/, ''),
    channel: result[3] ? 'beta' : 'retired',
    engineVersion: result[4].substring(2),
    releaseNote: '',
  };
};

/**
 * updateSafariFile - Update the json file listing the browser version of a safari entry
 * @param options The list of options for this type of Safari.
 * @returns The log of what has been generated (empty if nothing)
 */
export const updateSafariReleases = async (options) => {
  let result = '';
  //
  // Get the safari.json from the local BCD
  //
  const file = fs.readFileSync(`${options.bcdFile}`);
  const safariBCD = JSON.parse(file.toString());

  //
  // Read JSON of release notes
  //
  const releaseNoteFile = await fetch(`${options.releaseNoteJSON}`);
  if (releaseNoteFile.status !== 200) {
    console.error(
      chalk`{red \nRelease note file not found at Apple (${options.releaseNoteJSON}).}`,
    );
    return '';
  }
  const safariRelease = JSON.parse(await releaseNoteFile.text());
  const releases = safariRelease['references'];

  //
  // Collect release data from JSON
  //
  const releaseData: Release[] = [];
  for (const id in releases) {
    // Filter out data from "Technologies" overview page
    if (releases[id].kind !== 'article') {
      continue;
    }
    const releaseDataEntry = extractReleaseData(releases[id].abstract[0].text);

    if (!releaseDataEntry) {
      console.warn(
        chalk`{yellow Release string from Apple not understandable (${releases[id].abstract[0].text})}`,
      );
      continue;
    } else if (/^\d+\.\d+\.\d+$/.test(releaseDataEntry.version)) {
      // Ignore patch version (e.g. "18.0.1").
      continue;
    }

    // Compute release note
    if (releases[id].url) {
      releaseDataEntry.releaseNote = `${options.releaseNoteURLBase}${releases[id].url}`;
    } else {
      releaseDataEntry.releaseNote = '';
    }
    // Don't use the date for beta, we only record release dates, not beta dates
    if (releaseDataEntry.channel === 'beta') {
      releaseDataEntry.date = '';
    }

    releaseData.push(releaseDataEntry);
  }

  //
  // Find current release
  //
  const dates: string[] = [];
  releaseData.forEach((release) => {
    if (
      release.channel !== 'beta' &&
      !options.skippedReleases.includes(release.version)
    ) {
      dates.push(release.date);
    }
  });
  const currentDate = dates.sort().pop();
  releaseData.forEach((release) => {
    if (release.date === currentDate) {
      release.channel = 'current';
    }
  });

  //
  // Update from releaseData object to BCD
  //
  releaseData.forEach((release) => {
    if (!options.skippedReleases.includes(release.version)) {
      if (
        safariBCD.browsers[options.bcdBrowserName].releases[release.version]
      ) {
        result += updateBrowserEntry(
          safariBCD,
          options.bcdBrowserName,
          release.version,
          release.date,
          release.channel,
          release.releaseNote,
          release.engineVersion,
        );
      } else {
        result += newBrowserEntry(
          safariBCD,
          options.bcdBrowserName,
          release.version,
          release.channel,
          'WebKit',
          release.date,
          release.releaseNote,
          release.engineVersion,
        );
      }
    }
  });

  //
  // Write the update browser's json to file
  //
  fs.writeFileSync(`./${options.bcdFile}`, stringify(safariBCD) + '\n');

  // Returns the log
  if (result) {
    result = `### Updates for ${options.browserName}\n${result}`;
  }
  return result;
};
