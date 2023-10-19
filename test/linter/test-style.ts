/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import {
  Linter,
  Logger,
  LinterData,
  IS_WINDOWS,
  indexToPos,
  jsonDiff,
} from '../utils.js';
import { orderSupportBlock } from '../../scripts/fix/browser-order.js';
import { orderFeatures } from '../../scripts/fix/feature-order.js';
import { orderStatements } from '../../scripts/fix/statement-order.js';
import { orderProperties } from '../../scripts/fix/property-order.js';

/**
 * Process the data for any styling errors that cannot be caught by Prettier or the schema
 * @param {string} rawData The raw contents of the file to test
 * @param {Logger} logger The logger to output errors to
 */
const processData = (rawData: string, logger: Logger): void => {
  let actual = rawData;
  /** @type {import('../../types').CompatData} */
  const dataObject = JSON.parse(actual);
  let expected = JSON.stringify(dataObject, null, 2);
  let expectedBrowserSorting = JSON.stringify(dataObject, orderSupportBlock, 2);
  let expectedFeatureSorting = JSON.stringify(dataObject, orderFeatures, 2);
  let expectedStatementSorting = JSON.stringify(dataObject, orderStatements, 2);
  let expectedPropertySorting = JSON.stringify(dataObject, orderProperties, 2);

  // prevent false positives from git.core.autocrlf on Windows
  if (IS_WINDOWS) {
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
    expectedBrowserSorting = expectedBrowserSorting.replace(/\r/g, '');
    expectedFeatureSorting = expectedFeatureSorting.replace(/\r/g, '');
    expectedStatementSorting = expectedStatementSorting.replace(/\r/g, '');
    expectedPropertySorting = expectedPropertySorting.replace(/\r/g, '');
  }

  if (actual !== expected) {
    logger.error(chalk`{red → Error on ${jsonDiff(actual, expected)}}`);
  }

  if (expected !== expectedBrowserSorting) {
    logger.error(
      chalk`Browser sorting error on ${jsonDiff(
        actual,
        expectedBrowserSorting,
      )}`,
      { fixable: true },
    );
  }

  if (expected !== expectedFeatureSorting) {
    logger.error(
      chalk`Feature sorting error on ${jsonDiff(
        actual,
        expectedFeatureSorting,
      )}`,
      { fixable: true },
    );
  }

  if (expected !== expectedStatementSorting) {
    logger.error(
      chalk`Statement sorting error on ${jsonDiff(
        actual,
        expectedFeatureSorting,
      )}`,
      { fixable: true },
    );
  }

  if (expected !== expectedPropertySorting) {
    logger.error(
      chalk`Property sorting error on ${jsonDiff(
        actual,
        expectedFeatureSorting,
      )}`,
      { tip: chalk`Run {bold npm run fix} to fix sorting automatically` },
    );
  }

  const hrefDoubleQuoteIndex = actual.indexOf('href=\\"');
  if (hrefDoubleQuoteIndex >= 0) {
    logger.error(
      chalk`${indexToPos(
        actual,
        hrefDoubleQuoteIndex,
      )} - Found {yellow \\"}, but expected {green \'} for <a href>.`,
    );
  }
};

export default {
  name: 'Style',
  description: 'Tests the style and formatting of the JSON file',
  scope: 'file',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger: Logger, { rawdata, path: { category } }: LinterData) => {
    if (category !== 'browsers') {
      processData(rawdata, logger);
    }
  },
} as Linter;
