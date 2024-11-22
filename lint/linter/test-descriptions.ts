/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { Linter, Logger, LinterData } from '../utils.js';
import { CompatStatement } from '../../types/types.js';

import { validateHTML } from './test-notes.js';

interface DescriptionError {
  path: string;
  ruleName: string;
  actual: string;
  expected: string;
}

/**
 * Check for errors in the description of a specified statement's description and return whether there's an error and log as such
 * @param ruleName The name of the error
 * @param path The feature path
 * @param compat The compat data to test
 * @param expected Expected description
 * @param errors The array of errors to push to
 */
const checkDescription = (
  ruleName: string,
  path: string,
  compat: CompatStatement,
  expected: string,
  errors: (DescriptionError | string)[],
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
 * @param data The data to test
 * @param path The path of the feature
 * @param errors The array of errors to push to
 */
const processApiData = (
  data: CompatStatement,
  path: string,
  errors: (DescriptionError | string)[],
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
      `\`${apiName}()\` constructor`,
      errors,
    );
  } else if (featureName.endsWith('_event')) {
    checkDescription(
      'event',
      path,
      data,
      `\`${featureName.replace('_event', '')}\` event`,
      errors,
    );
  } else if (featureName.endsWith('_permission')) {
    checkDescription(
      'permission',
      path,
      data,
      `\`${featureName.replace('_permission', '')}\` permission`,
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
 * @param data The data to test
 * @param category The feature category
 * @param path The path of the feature
 * @returns The errors caught in the file
 */
export const processData = (
  data: CompatStatement,
  category: string,
  path: string,
): (DescriptionError | string)[] => {
  const errors: (DescriptionError | string)[] = [];

  if (category === 'api') {
    processApiData(data, path, errors);
  }

  if (data.description === `\`${path.split('.').at(-1)}\``) {
    errors.push({
      ruleName: 'redundant',
      path,
      actual: data.description,
      expected: '',
    });
  }

  if (data.description) {
    errors.push(...validateHTML(data.description));
  }

  return errors;
};

export default {
  name: 'Descriptions',
  description: 'Test the descriptions of compatibility data',
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
    const errors = processData(data, category, full);

    for (const error of errors) {
      if (typeof error === 'string') {
        logger.error(chalk`{red ${error}}`);
      } else {
        logger.error(
          chalk`{red Incorrect ${error.ruleName} description for {bold ${error.path}}
      Actual: {yellow "${error.actual}"}
      Expected: {green "${error.expected}"}}`,
          { fixable: true },
        );
      }
    }
  },
} as Linter;
