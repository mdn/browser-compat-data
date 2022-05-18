/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';
import chalk from 'chalk';
import { Logger } from './utils.js';

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

/**
 * Check for errors in the description of a specified statement's description and return whether there's an error and log as such
 *
 * @param {string} ruleName The name of the error
 * @param {string} name The name of the API method
 * @param {Identifier} feature - The feature's compat data.
 * @param {string} expected Expected description
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
function checkDescription(ruleName, name, method, expected, logger) {
  const actual = method.__compat.description || '';
  if (actual != expected) {
    logger.error(chalk`{red → Incorrect ${ruleName} description for {bold ${name}}
      Actual: {yellow "${actual}"}
      Expected: {green "${expected}"}}`);
  }
}

/**
 * Process API data and check for any incorrect descriptions in said data, logging any errors
 *
 * @param {Identifier} apiData The data to test
 * @param {string} apiName The name of the API
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
function processApiData(apiData, apiName, logger) {
  for (const featureName in apiData) {
    const feature = apiData[featureName];
    if (featureName == apiName) {
      checkDescription(
        'constructor',
        `${apiName}()`,
        feature,
        `<code>${apiName}()</code> constructor`,
        logger,
      );
    } else if (featureName.endsWith('_event')) {
      checkDescription(
        'event',
        `${apiName}.${featureName}`,
        feature,
        `<code>${featureName.replace('_event', '')}</code> event`,
        logger,
      );
    } else if (featureName.endsWith('_permission')) {
      checkDescription(
        'permission',
        `${apiName}.${featureName}`,
        feature,
        `<code>${featureName.replace('_permission', '')}</code> permission`,
        logger,
      );
    } else if (featureName == 'secure_context_required') {
      checkDescription(
        'secure context required',
        `${apiName}()`,
        feature,
        'Secure context required',
        logger,
      );
    } else if (featureName == 'worker_support') {
      checkDescription(
        'worker',
        `${apiName}()`,
        feature,
        'Available in workers',
        logger,
      );
    }
  }
}

/**
 * Process data and check for any incorrect descriptions in said data, logging any errors
 *
 * @param {Identifier} data The data to test
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
function processData(data, logger) {
  if (data.api) {
    for (const apiName in data.api) {
      const apiData = data.api[apiName];
      processApiData(apiData, apiName, logger);
    }
  }
}

/**
 * Test all of the descriptions through the data in a given filename.  This test only functions with files with API data; all other files are silently ignored
 *
 * @param {string} filename The file to test
 * @returns {boolean} Whether the file has errors
 */
export default function testDescriptions(filename) {
  /** @type {Identifier} */
  const data = JSON.parse(
    fs.readFileSync(new URL(filename, import.meta.url), 'utf-8'),
  );

  const logger = new Logger('Descriptions');

  processData(data, logger);

  logger.emit();
  return logger.hasErrors();
}
