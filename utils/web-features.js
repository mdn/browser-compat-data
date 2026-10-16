/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { features } from 'web-features';

/** @type {Map<string, string[]>} */
const tagsByPath = new Map();

for (const [feature, { compat_features }] of Object.entries(features)) {
  for (const path of compat_features ?? []) {
    const tags = tagsByPath.get(path) ?? [];
    tags.push(`web-features:${feature}`);
    tagsByPath.set(path, tags);
  }
}

/**
 * Find the tags assigned to a BCD path.
 * @param {string} path The BCD path
 * @returns {string[]} The assigned tags
 */
export const getWebFeatureTags = (path) => tagsByPath.get(path) ?? [];
