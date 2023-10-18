/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/**
 * newBrowserEntry - Add a new browser entry in the JSON list

 * @param {object} json json file to update
 * @param {object} browser the entry name where to add it in the bcd file
 * @param {string} version new version to add
 * @param {string} status new status
 * @param {string} engine name of the engine
 * @param {string} releaseDate new release date
 * @param {string} releaseNotesURL url of the release notes
 */
export const newBrowserEntry = (
  json,
  browser,
  version,
  status,
  engine,
  releaseDate,
  releaseNotesURL,
) => {
  const release = (json.browsers[browser].releases[version] = new Object());
  if (releaseDate) {
    release['release_date'] = releaseDate;
  }
  if (releaseNotesURL) {
    release['release_notes'] = releaseNotesURL;
  }
  release['status'] = status;
  release['engine'] = engine;
  release['engine_version'] = version.toString();
};

/**
 * updateBrowserEntry - Update browser entry in the JSON list
 *
 * @param {object} entry the entry to update
 * @param {string} releaseDate new release date
 * @param {string} status new status
 * @param {string} releaseNotesURL url of the release notes
 */
export const updateBrowserEntry = (
  entry,
  releaseDate,
  status,
  releaseNotesURL,
) => {
  entry['status'] = status;
  entry['release_date'] = releaseDate;
  entry['release_notes'] = releaseNotesURL;
};
