/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { styleText } from 'node:util';

import { IS_WINDOWS, jsonDiff } from '../utils.js';
import { orderSupportBlock } from '../fixer//browser-order.js';
import { orderFeatures } from '../fixer//feature-order.js';
import { orderStatements } from '../fixer//statement-order.js';
import stringifyAndOrderProperties from '../../scripts/lib/stringify-and-order-properties.js';

/** @import {Linter, LinterData} from '../types.js' */
/** @import {Logger} from '../utils.js' */

/**
 * Process the data for any styling errors that cannot be caught by Prettier or the schema
 * @param {string} rawData The raw contents of the file to test
 * @param {Logger} logger The logger to output errors to
 * @param {string} category The category of the file
 * @returns {void}
 */
const processData = (rawData, logger, category) => {
  let actual = rawData;
  let expectedPropertySorting = stringifyAndOrderProperties(rawData);

  // prevent false positives from git.core.autocrlf on Windows
  if (IS_WINDOWS) {
    actual = actual.replace(/\r/g, '');
    expectedPropertySorting = expectedPropertySorting.replace(/\r/g, '');
  }

  if (actual !== expectedPropertySorting) {
    logger.error(
      `Property sorting error on ${jsonDiff(actual, expectedPropertySorting)}`,
      {
        tip: `Run ${styleText('bold', 'npm run fix')} to fix sorting automatically`,
      },
    );
  }

  // Skip remaining checks if file is browser file
  if (category === 'browsers') {
    return;
  }

  const dataObject = JSON.parse(actual);
  let expected = JSON.stringify(dataObject, null, 2);
  let expectedBrowserSorting = JSON.stringify(dataObject, orderSupportBlock, 2);
  let expectedFeatureSorting = JSON.stringify(dataObject, orderFeatures, 2);
  let expectedStatementSorting = JSON.stringify(dataObject, orderStatements, 2);

  // prevent false positives from git.core.autocrlf on Windows
  if (IS_WINDOWS) {
    expected = expected.replace(/\r/g, '');
    expectedBrowserSorting = expectedBrowserSorting.replace(/\r/g, '');
    expectedFeatureSorting = expectedFeatureSorting.replace(/\r/g, '');
    expectedStatementSorting = expectedStatementSorting.replace(/\r/g, '');
  }

  if (actual !== expected) {
    logger.error(styleText('red', `→ Error on ${jsonDiff(actual, expected)}`));
  }

  if (actual !== expectedBrowserSorting) {
    logger.error(
      `Browser sorting error on ${jsonDiff(actual, expectedBrowserSorting)}`,
      { fixable: true },
    );
  }

  if (actual !== expectedFeatureSorting) {
    logger.error(
      `Feature sorting error on ${jsonDiff(actual, expectedFeatureSorting)}`,
      { fixable: true },
    );
  }

  if (actual !== expectedStatementSorting) {
    logger.error(
      `Statement sorting error on ${jsonDiff(actual, expectedStatementSorting)}`,
      { fixable: true },
    );
  }
};

/** @type {Linter} */
export default {
  name: 'Style',
  description: 'Tests the style and formatting of the JSON file',
  scope: 'file',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { rawdata = '', path: { category } }) => {
    processData(rawdata, logger, category);
  },
};
