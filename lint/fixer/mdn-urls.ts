/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';

import { IS_WINDOWS } from '../utils.js';
import testMDNURLs, { processData } from '../linter/test-mdn-urls.js';
import walk from '../../utils/walk.js';

/**
 * Fixes issues with MDN URLs
 * @param filename The filename containing compatibility info
 */
const fixMDNURLs = (filename: string): void => {
  if (filename.includes('/browsers/')) {
    return;
  }

  let actual = fs.readFileSync(filename, 'utf-8').trim();

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

  let expected = JSON.stringify(data, null, 2);

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
  }

  if (actual !== expected) {
    fs.writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

export default fixMDNURLs;
