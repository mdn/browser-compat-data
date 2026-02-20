/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { styleText } from 'node:util';

import bcd from '../../index.js';
const { browsers } = bcd;

/** @import {Linter, LinterData} from '../types.js' */
/** @import {Logger} from '../utils.js' */
/** @import {BrowserName, CompatStatement} from '../../types/types.js' */

// See: https://github.com/web-platform-dx/web-features/blob/main/docs/baseline.md#core-browser-set
const CORE_BROWSER_SET = new Set([
  'chrome',
  'chrome_android',
  'edge',
  'firefox',
  'firefox_android',
  'safari',
  'safari_ios',
]);

/**
 * Check if experimental should be true or false
 * @param {CompatStatement} data The data to check
 * @returns {boolean} The expected experimental status
 */
export const checkExperimental = (data) => {
  if (data.status?.experimental) {
    // Check if experimental should be false (code copied from migration 007)

    /** @type {Set<BrowserName>} */
    const browserSupport = new Set();

    for (const [browser, support] of Object.entries(data.support)) {
      if (!CORE_BROWSER_SET.has(browser)) {
        continue;
      }
      // Consider only the first part of an array statement.
      const statement = Array.isArray(support) ? support[0] : support;
      // Ignore anything behind flag, prefix or alternative name
      if (statement.flags || statement.prefix || statement.alternative_name) {
        continue;
      }
      if (statement.version_added && !statement.version_removed) {
        if (statement.version_added !== 'preview') {
          browserSupport.add(/** @type {BrowserName} */ (browser));
        }
      }
    }

    // Now check which of Blink, Gecko and WebKit support it.

    const engineSupport = new Set();

    for (const browser of browserSupport) {
      const currentRelease = Object.values(browsers[browser].releases).find(
        (r) => r.status === 'current',
      );
      const engine = currentRelease?.engine;
      if (engine) {
        engineSupport.add(engine);
      }
    }

    let engineCount = 0;
    for (const engine of ['Blink', 'Gecko', 'WebKit']) {
      if (engineSupport.has(engine)) {
        engineCount++;
      }
    }

    if (engineCount > 1) {
      return false;
    }
  }

  return true;
};

/**
 * Check the status blocks of the compat date
 * @param {CompatStatement} data The data to test
 * @param {Logger} logger The logger to output errors to
 * @param {string} category The feature category
 * @returns {void}
 */
const checkStatus = (data, logger, category) => {
  const status = data.status;

  if (!status) {
    return;
  } else if (category === 'webextensions') {
    logger.error(
      styleText(
        'red',
        `Has a ${styleText('bold', 'status object')}, which is ${styleText('bold', 'not allowed')} for web extensions.`,
      ),
    );
  }

  if (status.experimental && status.deprecated) {
    logger.error(
      styleText(
        'red',
        `Unexpected simultaneous ${styleText('bold', 'experimental')} and ${styleText('bold', 'deprecated')} status`,
      ),
      { fixable: true },
    );
  }

  if (data.spec_url && status.standard_track === false) {
    logger.error(
      styleText(
        'red',
        `Marked as ${styleText('bold', 'non-standard')}, but has a ${styleText('bold', 'spec_url')}`,
      ),
    );
  }

  if (!checkExperimental(data)) {
    logger.error(
      styleText(
        'red',
        `${styleText('bold', 'Experimental')} should be set to ${styleText('bold', 'false')} as the feature is ${styleText('bold', 'supported')} in ${styleText('bold', 'multiple browser')} engines.`,
      ),
      { fixable: true },
    );
  }
};

/** @type {Linter} */
export default {
  name: 'Status',
  description: 'Test the status of support statements',
  scope: 'feature',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data, path: { category } }) => {
    checkStatus(/** @type {CompatStatement} */ (data), logger, category);
  },
};
