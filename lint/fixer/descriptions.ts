/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import testDescriptions, { processData } from '../linter/test-descriptions.js';
import walk from '../../utils/walk.js';

/**
 * Fixes issues with descriptions
 * @param filename The filename containing compatibility info
 * @param actual The current content of the file
 * @returns expected content of the file
 */
const fixDescriptions = (filename: string, actual: string): string => {
  if (filename.includes('/browsers/')) {
    return actual;
  }

  const data = JSON.parse(actual);
  const walker = walk(undefined, data);

  for (const feature of walker) {
    if (testDescriptions.exceptions?.includes(feature.path)) {
      continue;
    }

    const errors = processData(
      feature.compat,
      feature.path.split('.')[0],
      feature.path,
    );

    for (const error of errors) {
      if (typeof error === 'string') {
        // Ignore HTML validation failures
        continue;
      }

      if (error.expected) {
        feature.compat.description = error.expected;
      } else if (error.expected === '') {
        delete feature.compat.description;
      }
    }
  }

  return JSON.stringify(data, null, 2);
};

export default fixDescriptions;
