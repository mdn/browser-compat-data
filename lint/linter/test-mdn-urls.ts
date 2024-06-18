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
    const slug = new URL(data.mdn_url).pathname.replace('/docs/', '');
    if (!slugs.has(slug)) {
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
      logger.error(
        chalk`{red Non-existing MDN URL found: {bold ${error.actual}}}`,
        { fixable: true },
      );
    }
  },
} as Linter;
