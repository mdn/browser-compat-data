const chalk = require('chalk');

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../utils').Logger} Logger
 */

/**
 * Check for errors in the description of a specified statement's description and return whether there's an error and log as such
 *
 * @param {String} error_type The name of the error
 * @param {String} name The name of the API method
 * @param {Identifier} method The method's compat data
 * @param {String} expected Expected description
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
const checkError = (error_type, name, method, expected, logger) => {
  const actual = method.__compat.description || '';
  if (actual != expected) {
    logger.error(chalk`{red → Incorrect ${error_type} description for {bold ${name}}
      Actual: {yellow "${actual}"}
      Expected: {green "${expected}"}}`);
  }
};

/**
 * Process data and check for any incorrect descriptions in said data, logging any errors
 *
 * @param {Identifier} apiData The compat data to check through
 * @param {String} apiName The name of the API
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
const processData = (apiData, apiName, logger) => {
  for (let methodName in apiData) {
    const method = apiData[methodName];
    if (methodName == apiName) {
      checkError(
        'constructor',
        `${apiName}()`,
        method,
        `<code>${apiName}()</code> constructor`,
        logger,
      );
    } else if (methodName.endsWith('_event')) {
      checkError(
        'event',
        `${apiName}.${methodName}`,
        method,
        `<code>${methodName.replace('_event', '')}</code> event`,
        logger,
      );
    } else if (methodName == 'secure_context_required') {
      checkError(
        'secure context required',
        `${apiName}()`,
        method,
        'Secure context required',
        logger,
      );
    } else if (methodName == 'worker_support') {
      checkError(
        'worker',
        `${apiName}()`,
        method,
        'Available in workers',
        logger,
      );
    }
  }
};

/**
 * Test all of the descriptions through the data in a given filename.  This test only functions with files with API data; all other files are silently ignored
 *
 * @param {string} filename The file to test
 * @returns {boolean} Whether the file has errors
 */
const testDescriptions = filename => {
  /** @type {Identifier} */
  const data = require(filename);

  /** @type {string[]} */
  const errors = [];
  const logger = {
    /** @param {...unknown} message */
    error: (...message) => {
      errors.push(message.join(' '));
    },
  };

  if (data.api) {
    for (const apiName in data.api) {
      const apiData = data.api[apiName];
      processData(apiData, apiName, logger);
    }
  }

  if (errors.length) {
    console.error(
      chalk`{red   Descriptions – {bold ${errors.length}} ${
        errors.length === 1 ? 'error' : 'errors'
      }:}`,
    );
    for (const error of errors) {
      console.error(`  ${error}`);
    }
    return true;
  }
  return false;
};

module.exports = testDescriptions;
