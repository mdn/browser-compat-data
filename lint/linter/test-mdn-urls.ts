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

const redirects = mdnContentInventory.redirects;

/**
 * Process the data for MDN URL errors
 * @param data The data to test
 * @param path The path of the feature
 * @param category The feature category
 * @returns The errors caught in the file
 */
export const processData = (
  data: CompatStatement,
  path: string,
  category: string,
): MDNURLError[] => {
  const errors: MDNURLError[] = [];
  if (data.mdn_url) {
    const mdnURL = new URL(data.mdn_url);
    const redirectURL = '/en-US' + mdnURL.pathname;
    const slug = mdnURL.pathname.replace('/docs/', '');

    /* Replace redirects with the new URL */
    if (redirectURL in redirects) {
      errors.push({
        ruleName: 'mdn_url_redirect',
        path,
        actual: data.mdn_url,
        expected: mdnURL.origin + redirects[redirectURL]?.replace('/en-US', ''),
      });
      /* Delete non-existing MDN pages */
    } else if (!slugs.has(slug)) {
      errors.push({
        ruleName: 'mdn_url_404',
        path,
        actual: data.mdn_url,
        expected: '',
      });
    }
  } else {
    /* Try to find new existing MDN pages at conventional places */
    let categorySlug = `Web/${path.replaceAll('.', '/')}`;
    switch (category) {
      case 'api':
        categorySlug = `Web/${path}`.replace('api.', 'API/').replace('.', '/');
        break;
      case 'css':
        categorySlug = `Web/${path
          .replace('css.', 'CSS/')
          .replace('properties.', '')
          .replace('selectors.', '')
          .replace('types.', '')
          .replaceAll('.', '/')}`;
        break;
      case 'html':
        categorySlug = `Web/${path
          .replace('html.', 'HTML/')
          .replace('elements.', 'Elements/')
          .replace('global_attributes.', 'Global_attributes/')
          .replace('manifest.', 'Manifest/')
          .replaceAll('.', '/')}`;
        break;
      case 'http':
        categorySlug = `Web/${path
          .replace('http.', 'HTTP/')
          .replace('headers.', 'Headers/')
          .replace('status.', 'Status/')
          .replace('method.', 'Method/')
          .replaceAll('.', '/')}`;
        break;
      case 'javascript':
        categorySlug = `Web/${path
          .replace('javascript.', 'JavaScript/Reference/')
          .replace('builtins.', 'Global_Objects/')
          .replace('operators.', 'Operators/')
          .replace('statements.', 'Statements/')
          .replace('functions.', 'Functions/')
          .replace('classes.', 'Classes/')
          .replaceAll('.', '/')}`;
        break;
      case 'webextensions':
        categorySlug = `Mozilla/Add-ons/${path
          .replaceAll('.', '/')
          .replace('webextensions', 'WebExtensions')
          .replace('manifest', 'manifest.json')
          .replace('api', 'API')}`;
        break;
    }

    if (slugs.has(categorySlug)) {
      errors.push({
        ruleName: 'mdn_url_new_page',
        path,
        actual: '',
        expected: `https://developer.mozilla.org/docs/${categorySlug}`,
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
   * @param root.path.category The category of the feature
   */
  check: (logger: Logger, { data, path: { full, category } }: LinterData) => {
    const errors = processData(data, full, category);
    for (const error of errors) {
      if (error.expected === '') {
        logger.error(
          chalk`{red Current mdn_url is a 404:
          {bold ${error.actual}}}`,
          { fixable: true },
        );
      } else if (error.actual === '') {
        logger.error(
          chalk`{red New mdn_url to add:
          {bold ${error.expected}}}`,
          { fixable: true },
        );
      } else {
        logger.error(
          chalk`{red Issues with mdn_url found:
            Actual:   ${error.actual}
            Expected: ${error.expected}}`,
          { fixable: true },
        );
      }
    }
  },
} as Linter;
