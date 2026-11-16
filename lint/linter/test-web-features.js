/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { getWebFeatureTags } from '../../utils/web-features.js';

/** @import {Linter} from '../types.js' */
/** @import {InternalCompatStatement} from '../../types/index.js' */

/**
 * Compute tags for a mapped BCD feature.
 * @param {string[] | undefined} tags The current tags
 * @param {string} path The BCD path
 * @returns {string[] | undefined} The updated tags
 */
export const expectedTags = (tags, path) => {
  const missing = getWebFeatureTags(path).filter((tag) => !tags?.includes(tag));
  if (!missing.length) {
    return tags;
  }

  return [...(tags ?? []), ...missing];
};

/** @type {Linter} */
export default {
  name: 'Web features',
  description: 'Ensure mapped web-features tags are present',
  scope: 'feature',
  /**
   * Check a feature's tag against the mapping.
   * @type {Linter['check']}
   */
  check: (logger, { data, path }) => {
    const expected = getWebFeatureTags(path.full);
    if (!expected.length) {
      return;
    }

    const compat = /** @type {InternalCompatStatement} */ (data);
    const missing = expected.filter((tag) => !compat.tags?.includes(tag));
    if (missing.length) {
      logger.warning(`Missing tag ${missing.join(', ')}`, { fixable: true });
    }
  },
};
