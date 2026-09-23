/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import walk from '../../utils/walk.js';
import stringifyAndOrderProperties from '../../scripts/lib/stringify-and-order-properties.js';
import { expectedTags } from '../linter/test-web-features.js';

/**
 * Fix mapped tags in one data file.
 * @param {string} filename The data file name
 * @param {string} actual The current file content
 * @returns {string} The updated file content
 */
const fixWebFeatures = (filename, actual) => {
  if (filename.includes('/browsers/')) {
    return actual;
  }

  const data = JSON.parse(actual);
  let changed = false;
  for (const feature of walk(undefined, data)) {
    const tags = expectedTags(feature.compat.tags, feature.path);
    if (tags !== feature.compat.tags) {
      feature.compat.tags = /** @type {[string, ...string[]]} */ (tags);
      changed = true;
    }
  }

  return changed ? stringifyAndOrderProperties(data) : actual;
};

export default fixWebFeatures;
