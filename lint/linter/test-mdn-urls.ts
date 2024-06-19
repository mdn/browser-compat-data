/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import mdnContentInventory from '@ddbeck/mdn-content-inventory';

import { Linter, Logger, LinterData } from '../utils.js';
import { CompatStatement } from '../../types/types.js';

interface MDNURLError {
  path: string;
  ruleName: string;
  actual: string;
  expected: string;
}

const slugs = (() => {
  const result = new Set<string>();
  for (const item of mdnContentInventory.inventory) {
    result.add(item.frontmatter.slug);
  }
  return result;
})();

/**
 * Get redirects from mdn/content
 * @returns redirectMap
 */
const redirects = await fetch(
  'https://raw.githubusercontent.com/mdn/content/main/files/en-us/_redirects.txt',
)
  .then((res) => res.text())
  .then((data) => {
    const lines = data.split('\n');
    const redirectLines = lines.filter(
      (line) => line.startsWith('/') && line.includes('\t'),
    );
    const redirectMap = new Map<string, string>();
    for (const redirectLine of redirectLines) {
      const [source, target] = redirectLine.split('\t', 2);
      if (source && target) {
        redirectMap.set(source, target);
      }
    }
    return redirectMap;
  });

/**
 * Process the data for MDN URL errors
 * @param data The data to test
 * @param path The path of the feature
 * @returns The errors caught in the file
 */
export const processData = (
  data: CompatStatement,
  path: string,
): MDNURLError[] => {
  const errors: MDNURLError[] = [];
  if (data.mdn_url) {
    const mdnURL = new URL(data.mdn_url);
    const redirectURL = '/en-US' + mdnURL.pathname;
    const slug = mdnURL.pathname.replace('/docs/', '');

    if (redirects.has(redirectURL)) {
      errors.push({
        ruleName: 'mdn_url_redirect',
        path,
        actual: data.mdn_url,
        expected:
          mdnURL.origin + redirects.get(redirectURL)?.replace('/en-US', ''),
      });
    } else if (!slugs.has(slug)) {
      errors.push({
        ruleName: 'mdn_url_404',
        path,
        actual: data.mdn_url,
        expected: '',
      });
    }
  }
  return errors;
};

export default {
  name: 'MDN URLs',
  description: 'Ensure the mdn_url values point to existing MDN Web Docs pages',
  scope: 'feature',
  /**
   * Test the data
   * @param logger The logger to output errors to
   * @param root The data to test
   * @param root.data The feature data
   * @param root.path The path to the feature data
   * @param root.path.full The full filepath to the feature data
   */
  check: (logger: Logger, { data, path: { full } }: LinterData) => {
    const errors = processData(data, full);
    for (const error of errors) {
      if (error.expected === '') {
        logger.error(
          chalk`{red Non-existing MDN URL found:
          {bold ${error.actual}}}`,
          { fixable: true },
        );
      } else {
        logger.error(
          chalk`{red Issues with mdn_urls found
            Actual:   ${error.actual}
            Expected: ${error.expected}}`,
          { fixable: true },
        );
      }
    }
  },
} as Linter;
