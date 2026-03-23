/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { styleText } from 'node:util';

import walk from '../../utils/walk.js';
import { inventory } from '../../utils/mdn-content-inventory.js';

/** @import {Linter, LinterData} from '../types.js' */
/** @import {Logger} from '../utils.js' */
/** @import {CompatData, CompatStatement} from '../../types/types.js' */

/**
 * @typedef {object} MDNURLError
 * @property {string} path
 * @property {string} ruleName
 * @property {string} actual
 * @property {string} expected
 */

/** @type {Map<string, string>} path → mdn_url, persisted across calls */
export const urlsByPath = new Map();

/**
 * Process the data for MDN URL issues
 * @param {CompatStatement} data The data to test
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

    if (redirectURL in inventory.redirects) {
      // Replace redirects with the new URL.
      issues.push({
        ruleName: 'mdn_url_redirect',
        path,
        actual: data.mdn_url,
        expected:
          mdnURL.origin +
          inventory.redirects[redirectURL]?.replace('/en-US', ''),
      });
    } else if (
      // Check if casing is wrong.
      // slugs.values().some(v => v === slug) when https://tc39.es/proposal-iterator-helpers is available
      !Array.from(inventory.slugs.values()).includes(slug) &&
      Array.from(inventory.slugs.keys()).includes(slug.toLowerCase())
    ) {
      issues.push({
        ruleName: 'mdn_url_casing',
        path,
        actual: data.mdn_url,
        expected: `https://developer.mozilla.org/docs/${inventory.slugs.get(slug.toLowerCase())}${hash}`,
      });
    } else if (!Array.from(inventory.slugs.values()).includes(slug)) {
      // Delete non-existing MDN pages.
      issues.push({
        ruleName: 'mdn_url_404',
        path,
        actual: data.mdn_url,
        expected: '',
      });
    } else if (inventory.slugByPath.has(path) && !hash) {
      // Overwrite url, unless it has a fragment.
      const expected = `https://developer.mozilla.org/docs/${inventory.slugByPath.get(path)}`;
      if (expected != data.mdn_url) {
        issues.push({
          ruleName: 'mdn_url_other_page',
          path,
          actual: data.mdn_url,
          expected: `https://developer.mozilla.org/docs/${inventory.slugByPath.get(path)}`,
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

    // Check if mdn_url duplicates an ancestor's mdn_url.
    const parts = path.split('.');
    for (let i = 1; i < parts.length; i++) {
      const ancestorPath = parts.slice(0, i).join('.');
      if (urlsByPath.get(ancestorPath) === data.mdn_url) {
        issues.push({
          ruleName: 'mdn_url_duplicate_ancestor',
          path,
          actual: data.mdn_url,
          expected: '',
        });
        break;
      }
    }
    // Track this path's mdn_url for future ancestor checks.
    urlsByPath.set(path, data.mdn_url);
  } else if (inventory.slugByPath.has(path)) {
    issues.push({
      ruleName: 'mdn_url_new_page',
      path,
      actual: '',
      expected: `https://developer.mozilla.org/docs/${inventory.slugByPath.get(path)}`,
    });
  }
  return issues;
};

/**
 * Log issues found by processData
 * @param {MDNURLError[]} issues The issues to log
 * @param {Logger} logger The logger to output errors to
 */
const logIssues = (issues, logger) => {
  for (const issue of issues) {
    if (issue.ruleName === 'mdn_url_duplicate_ancestor') {
      logger.error(
        styleText(
          'red',
          `${styleText('bold', issue.path)} has mdn_url duplicated from ancestor: ${styleText('italic', issue.actual)}`,
        ),
        { fixable: true },
      );
    } else if (issue.expected === '') {
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
};

/** @type {Linter} */
export default {
  name: 'MDN URLs',
  description: 'Ensure the mdn_url values point to existing MDN Web Docs pages',
  scope: 'tree',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data }) => {
    for (const feature of walk(undefined, /** @type {CompatData} */ (data))) {
      const issues = processData(feature.compat, feature.path);
      logIssues(issues, logger);
    }
  },
};
