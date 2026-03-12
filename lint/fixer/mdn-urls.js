/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import testMDNURLs, { processData } from '../linter/test-mdn-urls.js';
import walk from '../../utils/walk.js';

/**
 * Fixes issues with MDN URLs
 * @param {string} filename The filename containing compatibility info
 * @param {string} actual The current content of the file
 * @returns {Promise<string>} expected content of the file
 */
const fixMDNURLs = async (filename, actual) => {
  if (filename.includes('/browsers/')) {
    return actual;
  }

  const data = JSON.parse(actual);
  const walker = walk(undefined, data);

  /** @type {Map<string, string>} path → mdn_url */
  const urlsByPath = new Map();

  for (const feature of walker) {
    if (testMDNURLs.exceptions?.includes(feature.path)) {
      continue;
    }

    const errors = processData(feature.compat, feature.path);

    for (const error of errors) {
      if (error.expected) {
        feature.compat.mdn_url = error.expected;
      } else if (error.expected === '') {
        delete feature.compat.mdn_url;
      }
    }

    // Remove mdn_url if an ancestor has the same value.
    if (feature.compat.mdn_url) {
      const parts = feature.path.split('.');
      let isDuplicate = false;
      for (let i = 1; i < parts.length; i++) {
        const ancestorPath = parts.slice(0, i).join('.');
        if (urlsByPath.get(ancestorPath) === feature.compat.mdn_url) {
          isDuplicate = true;
          break;
        }
      }
      if (isDuplicate) {
        delete feature.compat.mdn_url;
      } else {
        urlsByPath.set(feature.path, feature.compat.mdn_url);
      }
    }
  }

  return JSON.stringify(data, null, 2);
};

export default fixMDNURLs;
