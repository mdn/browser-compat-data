/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import testMDNURLs, { processData } from '../linter/test-mdn-urls.js';
import walk from '../../utils/walk.js';

/**
 * Fixes issues with MDN URLs
 * @param filename The filename containing compatibility info
 * @param actual The current content of the file
 * @returns expected content of the file
 */
const fixMDNURLs = async (
  filename: string,
  actual: string,
): Promise<string> => {
  if (filename.includes('/browsers/')) {
    return actual;
  }

  const data = JSON.parse(actual);
  const walker = walk(undefined, data);

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
  }

  return JSON.stringify(data, null, 2);
};

export default fixMDNURLs;
