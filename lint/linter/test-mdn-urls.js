/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { styleText } from 'node:util';

import mdnContentInventory from '@ddbeck/mdn-content-inventory';

/** @import {Linter, LinterData} from '../types.js' */
/** @import {Logger} from '../utils.js' */
/** @import {InternalCompatStatement} from '../../types/index.js' */

/**
 * @typedef {object} MDNURLError
 * @property {string} path
 * @property {string} ruleName
 * @property {string} actual
 * @property {string} expected
 */

const slugs = (() => {
  /** @type {Map<string, string>} */
  const result = new Map();
  for (const item of mdnContentInventory.inventory) {
    result.set(item.frontmatter.slug.toLowerCase(), item.frontmatter.slug);
  }
  return result;
})();

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

      if (!slugTail.includes(pathTail) && !pathTail?.includes(slugTail)) {
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
  const slugByPath = new Map();
  slugsByPath.forEach((values, key) => {
    if (values.length === 1) {
      slugByPath.set(key, values[0]);
    }
  });
  return slugByPath;
})();

const redirects = mdnContentInventory.redirects;

/**
 * Process the data for MDN URL issues
 * @param {InternalCompatStatement} data The data to test
 * @param {string} path The path of the feature
 * @returns {MDNURLError[]} The issues caught in the file
 */
export const processData = (data, path) => {
  /** @type {MDNURLError[]} */
  const issues = [];
  if (data.mdn_url) {
    const mdnURL = new URL(data.mdn_url);
    const redirectURL = '/en-US' + mdnURL.pathname;
    const slug = mdnURL.pathname.replace('/docs/', '');
    const hash = mdnURL.hash;

    if (redirectURL in redirects) {
      // Replace redirects with the new URL.
      issues.push({
        ruleName: 'mdn_url_redirect',
        path,
        actual: data.mdn_url,
        expected: mdnURL.origin + redirects[redirectURL]?.replace('/en-US', ''),
      });
    } else if (
      // Check if casing is wrong.
      // slugs.values().some(v => v === slug) when https://tc39.es/proposal-iterator-helpers is available
      !Array.from(slugs.values()).includes(slug) &&
      Array.from(slugs.keys()).includes(slug.toLowerCase())
    ) {
      issues.push({
        ruleName: 'mdn_url_casing',
        path,
        actual: data.mdn_url,
        expected: `https://developer.mozilla.org/docs/${slugs.get(slug.toLowerCase())}${hash}`,
      });
    } else if (!Array.from(slugs.values()).includes(slug)) {
      // Delete non-existing MDN pages.
      issues.push({
        ruleName: 'mdn_url_404',
        path,
        actual: data.mdn_url,
        expected: '',
      });
    } else if (slugByPath.has(path) && !hash) {
      // Overwrite url, unless it has a fragment.
      const expected = `https://developer.mozilla.org/docs/${slugByPath.get(path)}`;
      if (expected != data.mdn_url) {
        issues.push({
          ruleName: 'mdn_url_other_page',
          path,
          actual: data.mdn_url,
          expected: `https://developer.mozilla.org/docs/${slugByPath.get(path)}`,
        });
      }
    } else if (hash !== hash.toLowerCase()) {
      // Enforce lower-case fragment.
      issues.push({
        ruleName: 'mdn_url_casing_hash',
        path,
        actual: data.mdn_url,
        expected: `https://developer.mozilla.org/docs/${slug}${hash.toLowerCase()}`,
      });
    }
  } else if (slugByPath.has(path)) {
    issues.push({
      ruleName: 'mdn_url_new_page',
      path,
      actual: '',
      expected: `https://developer.mozilla.org/docs/${slugByPath.get(path)}`,
    });
  }
  return issues;
};

/** @type {Linter} */
export default {
  name: 'MDN URLs',
  description: 'Ensure the mdn_url values point to existing MDN Web Docs pages',
  scope: 'feature',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data, path: { full } }) => {
    const issues = processData(
      /** @type {InternalCompatStatement} */ (data),
      full,
    );
    for (const issue of issues) {
      if (issue.expected === '') {
        logger.warning(
          styleText(
            'red',
            `Current mdn_url is a 404:
          ${styleText('bold', issue.actual)}`,
          ),
          { fixable: true },
        );
      } else if (issue.actual === '') {
        logger.warning(
          styleText(
            'red',
            `New mdn_url to add:
          ${styleText('bold', issue.expected)}`,
          ),
          { fixable: true },
        );
      } else {
        logger.warning(
          styleText(
            'red',
            `Issues with mdn_url found:
            Actual:   ${issue.actual}
            Expected: ${issue.expected}`,
          ),
          { fixable: true },
        );
      }
    }
  },
};
