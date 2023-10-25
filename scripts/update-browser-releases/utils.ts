/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { compareVersions } from 'compare-versions';

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
  if (releaseNotesURL) {
    entry['release_notes'] = releaseNotesURL;
  }
};

/**
 * sortStringify - Stringify an object using a mixed lexicographic-semver order
 * @param {object} obj The object to stringify
 * @param {string} indent The indentation to add, as a string
 * @param {Array} orders Fixed order to use (An Array of arrays)
 *   Example: [['type', 'update', 'release']] will put release after type or update
 *   Example: [['type', 'update', 'release'],
 *             ['release_date', 'status', 'release notes', 'engine' , 'engine_version']]
 * @returns {string} The URL of the release notes or the empty string if not found
 */
export const sortStringify = (obj, indent, orders) => {
  const indentStep = '  '; // Constant with the indent step that sortStringify will use

  const sortedKeys = Object.keys(obj).sort((a, b) => {
    // If they both start with a number, convert to float (so that 1.5 < 10)
    // and apply number comparison
    if (a[0] >= '0' && a[0] <= '9' && b[0] >= '0' && b[0] <= '9') {
      return compareVersions(a, b);
    }

    // Use lexicographic order unless they are in a hardcoded position

    // Order according the hardcoded arrays
    let hardcoded; // Initially undefined
    orders.forEach((order) => {
      if (hardcoded) {
        return; // Already found
      }

      // Check if both entry are in the order array
      if (order.indexOf(a) != -1 && order.indexOf(b) != -1) {
        hardcoded = order.indexOf(a) - order.indexOf(b);
      }
    });

    // Hardcoded order detected: let's use it
    if (hardcoded) {
      return hardcoded;
    }

    // Normal string comparison: lexicographic order
    if (a === b) {
      return 0;
    }
    return a > b ? 1 : -1;
  });

  let result = '{\n'; // obj is an object, it must be enclosed in braces
  for (let i = 0; i < sortedKeys.length; i++) {
    const key = sortedKeys[i];
    let value = obj[key];

    if (value instanceof Object) {
      // An object: recursively call this method
      value = `${sortStringify(value, indent + indentStep, orders)}`;
    } else {
      // A value or an array: call the regulare JSON.stringify function
      value = `${JSON.stringify(value)}`;
    }

    // Add it to the result
    result += `${indent}${indentStep}"${key}": ${value}`;

    // Check if this is the last entry or not: if not, add a comma
    if (i != sortedKeys.length - 1) {
      result += ',';
    }

    // We always need a carriage return
    result += '\n';
  }
  return `${result}${indent}}`; // Close the brace and return the string
};
