/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Linter, Logger } from '../utils.js';
import { CompatStatement } from '../../types/types.js';

import chalk from 'chalk-template';

/**
 * Check for errors in the description of a specified statement's description and return whether there's an error and log as such
 *
 * @param {string} ruleName The name of the error
 * @param {string} name The name of the API method
 * @param {CompatStatement} compat The compat data to test
 * @param {string} expected Expected description
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
function checkDescription(
  ruleName: string,
  name: string,
  compat: CompatStatement,
  expected: string,
  logger: Logger,
): void {
  const actual = compat.description || '';
  if (actual != expected) {
    logger.error(chalk`{red → Incorrect ${ruleName} description for {bold ${name}}
      Actual: {yellow "${actual}"}
      Expected: {green "${expected}"}}`);
  }
}

/**
 * Process API data and check for any incorrect descriptions in said data, logging any errors
 *
 * @param {CompatStatement} data The data to test
 * @param {string} path The path of the feature
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
function processApiData(
  data: CompatStatement,
  path: string,
  logger: Logger,
): void {
  const pathParts = path.split('.');
  const apiName = pathParts[1];
  const featureName = pathParts[2];

  if (pathParts.length !== 3) {
    // Ignore anything that isn't an interface subfeature
    return;
  }

  if (featureName == apiName) {
    checkDescription(
      'constructor',
      `${apiName}()`,
      data,
      `<code>${apiName}()</code> constructor`,
      logger,
    );
  } else if (featureName.endsWith('_event')) {
    checkDescription(
      'event',
      `${apiName}.${featureName}`,
      data,
      `<code>${featureName.replace('_event', '')}</code> event`,
      logger,
    );
  } else if (featureName.endsWith('_permission')) {
    checkDescription(
      'permission',
      `${apiName}.${featureName}`,
      data,
      `<code>${featureName.replace('_permission', '')}</code> permission`,
      logger,
    );
  } else if (featureName == 'secure_context_required') {
    checkDescription(
      'secure context required',
      `${apiName}()`,
      data,
      'Secure context required',
      logger,
    );
  } else if (featureName == 'worker_support') {
    checkDescription(
      'worker',
      `${apiName}()`,
      data,
      'Available in workers',
      logger,
    );
  }
}

export default {
  name: 'Descriptions',
  description: 'Test the descriptions of compatibility data',
  scope: 'feature',
  check(
    logger: Logger,
    {
      data,
      path: { full, category },
    }: { data: CompatStatement; path: { full: string; category: string } },
  ) {
    if (category === 'api') {
      processApiData(data, full, logger);
    }
  },
} as Linter;
