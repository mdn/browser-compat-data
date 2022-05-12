const chalk = require('chalk');
const { Logger } = require('./utils.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

/**
 * Check for errors in the description of a specified statement's description and return whether there's an error and log as such
 *
 * @param {string} error_type The name of the error
 * @param {string} name The name of the API method
 * @param {Identifier} method The method's compat data
 * @param {string} expected Expected description
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
function checkError(error_type, name, method, expected, logger) {
  const actual = method.__compat.description || '';
  if (actual != expected) {
    logger.error(chalk`{red → Incorrect ${error_type} description for {bold ${name}}
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
  for (const methodName in apiData) {
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
    } else if (methodName.endsWith('_permission')) {
      checkError(
        'permission',
        `${apiName}.${methodName}`,
        method,
        `<code>${methodName.replace('_permission', '')}</code> permission`,
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
function testDescriptions(filename) {
  /** @type {Identifier} */
  const data = require(filename);

  const logger = new Logger('Descriptions');

  processData(data, logger);

  logger.emit();
  return logger.hasErrors();
}

module.exports = testDescriptions;
