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

// Page types that are overview/landing pages rather than specific reference pages.
// When a BCD key appears on both one of these and a reference page, the reference page wins.
const SKIP_PAGE_TYPES = new Set(['web-api-overview', 'guide', 'landing-page']);

/**
 * Build a map from BCD path to MDN slug, preferring specific reference pages.
 * @param {typeof mdnContentInventory.inventory} inventory The MDN content inventory to process
 * @returns {Map<string, string>} Map from BCD path to MDN slug
 */
export const buildSlugByPath = (inventory) => {
  /**
   * @typedef {{ slug: string, isSoleKey: boolean }} SlugEntry
   * @type {Map<string, SlugEntry[]>}
   */
  const slugsByPath = new Map();
  for (const item of inventory) {
    if (!('browser-compat' in item.frontmatter)) {
      continue;
    }

    if (SKIP_PAGE_TYPES.has(item.frontmatter['page-type'])) {
      // Skip overview/landing pages; a reference page for the same BCD key is preferred.
      continue;
    }

    const value = item.frontmatter['browser-compat'];
    const paths = Array.isArray(value) ? value : [value];
    const isSoleKey = paths.length === 1;

    const slug = item.frontmatter.slug;

    for (const path of paths) {
      const slugTail = slug.split('/').at(-1);
      const pathTail = path.split('.').at(-1);

      if (!slugTail.includes(pathTail) && !pathTail?.includes(slugTail)) {
        // Ignore unrelated pages/features.
        continue;
      }

      if (!slugsByPath.has(path)) {
        slugsByPath.set(path, []);
      }
      slugsByPath.get(path)?.push({ slug, isSoleKey });
    }
  }

  /** @type {Map<string, string>} */
  const result = new Map();
  slugsByPath.forEach((entries, key) => {
    if (entries.length === 1) {
      result.set(key, entries[0].slug);
    } else {
      // When multiple pages list this key, prefer the one where it's the only key.
      const soleKeyEntries = entries.filter((e) => e.isSoleKey);
      if (soleKeyEntries.length === 1) {
        result.set(key, soleKeyEntries[0].slug);
      }
    }
  });
  return result;
};

/** @type {Map<string, string>} BCD path → MDN slug (only unambiguous mappings) */
const slugByPath = buildSlugByPath(mdnContentInventory.inventory);

/**
 * Mutable inventory data derived from `@ddbeck/mdn-content-inventory`.
 * Properties can be reassigned in tests to inject mock data.
 */
export const inventory = {
  slugs,
  slugByPath,
  redirects: mdnContentInventory.redirects,
};
