const chalk = require('chalk');
const { Logger } = require('./utils.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

/**
 * @param {(string | string[])?} target
 * @param {string} str
 */
function stringOrArrayIncludes(target, str) {
  if (!target) {
    return false;
  }
  if (Array.isArray(target)) {
    return target.some((item) => item.includes(str));
  }
  return target.includes(str);
}

/**
 * @param {import('../../types.js').SimpleSupportStatement} statement
 */
function includesTrackingBug(statement) {
  return (
    stringOrArrayIncludes(statement.notes, 'crbug.com') ||
    stringOrArrayIncludes(statement.notes, 'bugzil.la') ||
    stringOrArrayIncludes(statement.notes, 'webkit.org/b/')
  );
}

/**
 * @param {Identifier} data
 */
function hasSupportHistory(data) {
  return Object.values(data.__compat.support).some(
    (c) => Array.isArray(c) || !!c.version_added || includesTrackingBug(c),
  );
}

/**
 * @param {Identifier} data
 * @param {Logger} logger
 */
function checkSupport(data, logger, path = []) {
  if (data.__compat && !hasSupportHistory(data)) {
    logger.error(
      chalk`{red → No support without a tracking bug in ${path.join('.')}}`,
    );
  }
  for (const member in data) {
    if (member === '__compat') {
      continue;
    }
    checkSupport(data[member], logger, [...path, member]);
  }
}

/**
 * @param {string} filename
 * @returns {boolean} If the file contains errors
 */
function testSupportHistory(filename) {
  /** @type {Identifier} */
  const data = require(filename);

  const logger = new Logger('Support history');

  checkSupport(data, logger);

  logger.emit();
  return logger.hasErrors();
}

module.exports = testSupportHistory;
