/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { validateHTML } from './test-notes.js';

/**
 * @typedef {import('../utils.js').Linter} Linter
 * @typedef {import('../utils.js').Logger} Logger
 * @typedef {import('../utils.js').LinterData} LinterData
 * @typedef {import('../../types/types.js').CompatStatement} CompatStatement
 */

/**
 * @typedef {object} DescriptionError
 * @property {string} path
 * @property {string} ruleName
 * @property {string} actual
 * @property {string} expected
 */

/**
 * Check for errors in the description of a specified statement's description and return whether there's an error and log as such
 * @param {string} ruleName The name of the error
 * @param {string} path The feature path
 * @param {CompatStatement} compat The compat data to test
 * @param {string} expected Expected description
 * @param {(DescriptionError | string)[]} errors The array of errors to push to
 * @returns {void}
 */
const checkDescription = (ruleName, path, compat, expected, errors) => {
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
 * @param {(DescriptionError | string)[]} errors The array of errors to push to
 * @returns {void}
 */
const processApiData = (data, path, errors) => {
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
 * @param {CompatStatement} data The data to test
 * @param {string} category The feature category
 * @param {string} path The path of the feature
 * @returns {(DescriptionError | string)[]} The errors caught in the file
 */
export const processData = (data, category, path) => {
  /** @type {(DescriptionError | string)[]} */
  const errors = [];

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

/** @type {Linter} */
export default {
  name: 'Descriptions',
  description: 'Test the descriptions of compatibility data',
  scope: 'feature',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data, path: { full, category } }) => {
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
};
