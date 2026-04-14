/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import mdnContentInventory from '@ddbeck/mdn-content-inventory';

/** @type {Map<string, string>} lowercase slug → canonical slug */
const slugs = (() => {
  /** @type {Map<string, string>} */
  const result = new Map();
  for (const item of mdnContentInventory.inventory) {
    result.set(item.frontmatter.slug.toLowerCase(), item.frontmatter.slug);
  }
  return result;
})();

/**
 * Returns true if the slug tail and path tail are related enough to link.
 * Strips leading `@@` from path tail to handle well-known symbol names
 * (e.g. `@@dispose` matches `Symbol.dispose`).
 * @param {string} slugTail Last segment of an MDN slug
 * @param {string | undefined} pathTail Last segment of a BCD path
 * @returns {boolean} Whether the tails are related
 */
export const tailsMatch = (slugTail, pathTail) => {
  if (!pathTail) {
    return false;
  }
  const normalized = pathTail.replace(/^@@/, '');
  return slugTail.includes(normalized) || normalized.includes(slugTail);
};

/** @type {Map<string, string>} BCD path → MDN slug (only unambiguous mappings) */
const slugByPath = (() => {
  /** @type {Map<string, string[]>} */
  const slugsByPath = new Map();
  for (const item of mdnContentInventory.inventory) {
    if (!('browser-compat' in item.frontmatter)) {
      continue;
    }

    const value = item.frontmatter['browser-compat'];
    const paths = Array.isArray(value) ? value : [value];

    const slug = item.frontmatter.slug;

    for (const path of paths) {
      const slugTail = slug.split('/').at(-1);
      const pathTail = path.split('.').at(-1);

      if (!tailsMatch(slugTail, pathTail)) {
        // Ignore unrelated pages/features.
        continue;
      }

      if (!slugsByPath.has(path)) {
        slugsByPath.set(path, []);
      }
      slugsByPath.get(path)?.push(item.frontmatter.slug);
    }
  }

  /** @type {Map<string, string>} */
  const result = new Map();
  slugsByPath.forEach((values, key) => {
    if (values.length === 1) {
      result.set(key, values[0]);
    }
  });
  return result;
})();

/**
 * Mutable inventory data derived from `@ddbeck/mdn-content-inventory`.
 * Properties can be reassigned in tests to inject mock data.
 */
export const inventory = {
  slugs,
  slugByPath,
  redirects: mdnContentInventory.redirects,
};
