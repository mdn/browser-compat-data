/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

/**
 * newBrowserEntry - Add a new browser entry in the JSON list
 * @param json json file to update
 * @param browser the entry name where to add it in the bcd file
 * @param version new version to add
 * @param status new status
 * @param engine name of the engine
 * @param releaseDate new release date
 * @param releaseNotesURL url of the release notes
 * @param engineVersion the version of the engine
 * @returns Text describing what has been added
 */
export const newBrowserEntry = (
  json,
  browser,
  version,
  status,
  engine,
  releaseDate,
  releaseNotesURL,
  engineVersion,
) => {
  const release = (json.browsers[browser].releases[version] = {});
  if (releaseDate) {
    release['release_date'] = releaseDate;
  }
  if (releaseNotesURL) {
    release['release_notes'] = releaseNotesURL;
  }
  release['status'] = status;
  release['engine'] = engine;
  if (engineVersion) {
    release['engine_version'] = engineVersion;
  }
  return chalk`{yellow \n- New release detected for {bold ${browser}}: Version {bold ${version}} as a {bold ${status}} release.}`;
};

/**
 * updateBrowserEntry - Update browser entry in the JSON list
 * @param json json file to update
 * @param browser the entry name where to add it in the bcd file
 * @param version new version to add
 * @param releaseDate new release date
 * @param status new status
 * @param releaseNotesURL url of the release notes
 * @param engineVersion the version of the engine
 * @returns Text describing what has been updated
 */
export const updateBrowserEntry = (
  json,
  browser,
  version,
  releaseDate,
  status,
  releaseNotesURL,
  engineVersion,
) => {
  const entry = json.browsers[browser].releases[version];
  let result = '';
  if (entry['status'] !== status) {
    result += chalk`{cyan \n- New status for {bold ${browser} ${version}}: {bold ${status}}, previously ${entry['status']}.}`;
    entry['status'] = status;
  }
  if (releaseDate && entry['release_date'] !== releaseDate) {
    result += chalk`{cyan \n- New release date for {bold ${browser} ${version}}: {bold ${releaseDate}}, previously ${entry['release_date']}.}`;
    entry['release_date'] = releaseDate;
  }
  if (releaseNotesURL && entry['release_notes'] !== releaseNotesURL) {
    result += chalk`{cyan \n- New release notes for {bold ${browser} ${version}}: {bold ${releaseNotesURL}}, previously ${entry['release_notes']}.}`;
    entry['release_notes'] = releaseNotesURL;
  }

  if (engineVersion && entry['engine_version'] != engineVersion) {
    result += chalk`{cyan \n- New engine version for {bold ${browser} ${version}}: {bold ${engineVersion}}, previously ${entry['engine_version']}.}`;
    entry['engine_version'] = engineVersion;
  }

  return result;
};
