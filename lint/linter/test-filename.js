/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/**
 * @typedef {import('../../types/types.js').Identifier} Identifier
 * @typedef {import('../utils.js').Linter} Linter
 * @typedef {import('../utils.js').Logger} Logger
 * @typedef {import('../utils.js').LinterData} LinterData
 */

/**
 * Test the filename based on the identifier
 * @param {Identifier} data The identifier
 * @param {string[]} pathParts Parts of the path
 * @param {string} currentPath The current path traversed
 * @returns {string | false} A string with the error message if the lint failed, or false if it passed
 */
const testFilename = (data, pathParts, currentPath) => {
  const feature = pathParts[0];
  if (Object.keys(data).length > 1 || !(feature in data)) {
    return `Expected only "${currentPath}${feature}" but found "${currentPath}${Object.keys(
      data,
    ).join(`, ${currentPath}`)}"`;
  }

  if (pathParts.length > 1) {
    return testFilename(
      data[feature],
      pathParts.splice(1),
      currentPath + feature + '.',
    );
  }

  return false;
};

/**
 * Process the data to make sure it defines the features appropriate to the file's name
 * @param {Identifier} data The raw contents of the file to test
 * @param {string} filepath The file path
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
const processData = (data, filepath, logger) => {
  const p = filepath
    .replace('.json', '')
    .replace('api/_globals', 'api')
    .replace('api/Console', 'api/console')
    .replace('html/elements/input/', 'html/elements/input/type_')
    .replace('javascript/builtins/globals', 'javascript/builtins');

  const failed = testFilename(data, p.split('/'), '');
  if (failed) {
    logger.error(failed);
  }
};

/** @type {Linter} */
export default {
  name: 'Filename',
  description:
    'Tests the filename to make sure it includes the intended feature',
  scope: 'file',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data, path: { full } }) => {
    processData(data, full, logger);
  },
};
