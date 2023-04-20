/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { Linter, Logger, LinterData } from '../utils.js';
import { CompatStatement } from '../../types/types.js';

type DescriptionError = {
  path: string;
  ruleName: string;
  actual: string;
  expected: string;
};

/**
 * Check for errors in the description of a specified statement's description and return whether there's an error and log as such
 * @param {string} ruleName The name of the error
 * @param {string} path The feature path
 * @param {CompatStatement} compat The compat data to test
 * @param {string} expected Expected description
 * @param {DescriptionError[]} errors The array of errors to push to
 */
const checkDescription = (
  ruleName: string,
  path: string,
  compat: CompatStatement,
  expected: string,
  errors: DescriptionError[],
): void => {
  const actual = compat.description || '';
  if (actual != expected) {
    errors.push({
      ruleName,
      path,
      actual,
      expected,
    });
  }
};

/**
 * Process API data and check for any incorrect descriptions in said data, logging any errors
 * @param {CompatStatement} data The data to test
 * @param {string} path The path of the feature
 * @param {DescriptionError[]} errors The array of errors to push to
 */
const processApiData = (
  data: CompatStatement,
  path: string,
  errors: DescriptionError[],
): void => {
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
      path,
      data,
      `<code>${apiName}()</code> constructor`,
      errors,
    );
  } else if (featureName.endsWith('_event')) {
    checkDescription(
      'event',
      path,
      data,
      `<code>${featureName.replace('_event', '')}</code> event`,
      errors,
    );
  } else if (featureName.endsWith('_permission')) {
    checkDescription(
      'permission',
      path,
      data,
      `<code>${featureName.replace('_permission', '')}</code> permission`,
      errors,
    );
  } else if (featureName == 'secure_context_required') {
    checkDescription(
      'secure context required',
      path,
      data,
      'Secure context required',
      errors,
    );
  } else if (featureName == 'worker_support') {
    checkDescription('worker', path, data, 'Available in workers', errors);
  }
};

/**
 * Process data and check for any incorrect descriptions in said data, logging any errors
 * @param {CompatStatement} data The data to test
 * @param {string} category The feature category
 * @param {string} path The path of the feature
 * @returns {DescriptionError[]} The errors caught in the file
 */
export const processData = (
  data: CompatStatement,
  category: string,
  path: string,
): DescriptionError[] => {
  const errors: DescriptionError[] = [];

  if (category === 'api') {
    processApiData(data, path, errors);
  }

  return errors;
};

export default {
  name: 'Descriptions',
  description: 'Test the descriptions of compatibility data',
  scope: 'feature',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger: Logger, { data, path: { full, category } }: LinterData) => {
    const errors = processData(data, category, full);

    for (const error of errors) {
      logger.error(chalk`{red → Incorrect ${error.ruleName} description for {bold ${error.path}}
      Actual: {yellow "${error.actual}"}
      Expected: {green "${error.expected}"}}`);
    }
  },
} as Linter;
