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
  const result = new Map<string, string>();
  for (const item of mdnContentInventory.inventory) {
    result.set(item.frontmatter.slug.toLowerCase(), item.frontmatter.slug);
  }
  return result;
})();

const redirects = mdnContentInventory.redirects;

/**
 * Process the data for MDN URL issues
 * @param data The data to test
 * @param path The path of the feature
 * @param category The feature category
 * @returns The issues caught in the file
 */
export const processData = (
  data: CompatStatement,
  path: string,
  category: string,
): MDNURLError[] => {
  const issues: MDNURLError[] = [];
  if (data.mdn_url) {
    const mdnURL = new URL(data.mdn_url);
    const redirectURL = '/en-US' + mdnURL.pathname;
    const slug = mdnURL.pathname.replace('/docs/', '');

    /* Replace redirects with the new URL */
    if (redirectURL in redirects) {
      issues.push({
        ruleName: 'mdn_url_redirect',
        path,
        actual: data.mdn_url,
        expected: mdnURL.origin + redirects[redirectURL]?.replace('/en-US', ''),
      });

      /* Check if casing is wrong */
    } else if (
      // slugs.values().some(v => v === slug) when https://tc39.es/proposal-iterator-helpers is available
      !Array.from(slugs.values()).includes(slug) &&
      Array.from(slugs.keys()).includes(slug.toLowerCase())
    ) {
      issues.push({
        ruleName: 'mdn_url_casing',
        path,
        actual: data.mdn_url,
        expected: `https://developer.mozilla.org/docs/${slugs.get(slug.toLowerCase())}`,
      });

      /* Delete non-existing MDN pages */
    } else if (!Array.from(slugs.values()).includes(slug)) {
      issues.push({
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

    if (slugs.has(categorySlug.toLowerCase())) {
      issues.push({
        ruleName: 'mdn_url_new_page',
        path,
        actual: '',
        expected: `https://developer.mozilla.org/docs/${categorySlug}`,
      });
    }
  }
  return issues;
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
    const issues = processData(data, full, category);
    for (const issue of issues) {
      if (issue.expected === '') {
        logger.warning(
          chalk`{red Current mdn_url is a 404:
          {bold ${issue.actual}}}`,
          { fixable: true },
        );
      } else if (issue.actual === '') {
        logger.warning(
          chalk`{red New mdn_url to add:
          {bold ${issue.expected}}}`,
          { fixable: true },
        );
      } else {
        logger.warning(
          chalk`{red Issues with mdn_url found:
            Actual:   ${issue.actual}
            Expected: ${issue.expected}}`,
          { fixable: true },
        );
      }
    }
  },
} as Linter;
