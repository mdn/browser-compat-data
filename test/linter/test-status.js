/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const chalk = require('chalk');
const { Logger } = require('./utils.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

/**
 * @param {Identifier} data
 * @param {Logger} logger
 * @param {string} path
 */
function checkStatus(data, logger, path = '') {
  const compat = data.__compat;
  if (compat?.status) {
    if (compat.spec_url && compat.status.standard_track === false) {
      logger.error(
        chalk`{red → {bold ${path}} is marked as {bold non-standard}, but has a {bold spec_url}}`,
      );
    }
    if (compat.status.experimental && compat.status.deprecated) {
      logger.error(
        chalk`{red → Unexpected simultaneous experimental and deprecated status in {bold ${path}}}`,
      );
    }
  }

  // Check children
  for (const member in data) {
    if (member === '__compat') {
      continue;
    }
    checkStatus(
      data[member],
      logger,
      path && path.length > 0 ? `${path}.${member}` : member,
    );
  }
}

/**
 * @param {string} filename
 * @returns {boolean} If the file contains errors
 */
function testStatus(filename) {
  /** @type {Identifier} */
  const data = require(filename);

  const logger = new Logger('Feature Status');

  checkStatus(data, logger);

  logger.emit();
  return logger.hasErrors();
}

module.exports = testStatus;
