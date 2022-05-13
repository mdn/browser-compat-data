/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const chalk = require('chalk');
const { Logger } = require('../utils.js');

const { browsers } = require('../../index.js');

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
    if (compat.status.experimental) {
      // Check if experimental should be false (code copied from migration 007)

      const browserSupport = new Set();

      for (const [browser, support] of Object.entries(compat.support)) {
        // Consider only the first part of an array statement.
        const statement = Array.isArray(support) ? support[0] : support;
        // Ignore anything behind flag, prefix or alternative name
        if (statement.flags || statement.prefix || statement.alternative_name) {
          continue;
        }
        if (statement.version_added && !statement.version_removed) {
          browserSupport.add(browser);
        }
      }

      // Now check which of Blink, Gecko and WebKit support it.

      const engineSupport = new Set();

      for (const browser of browserSupport) {
        const currentRelease = Object.values(browsers[browser].releases).find(
          (r) => r.status === 'current',
        );
        const engine = currentRelease.engine;
        engineSupport.add(engine);
      }

      let engineCount = 0;
      for (const engine of ['Blink', 'Gecko', 'WebKit']) {
        if (engineSupport.has(engine)) {
          engineCount++;
        }
      }

      if (engineCount > 1) {
        logger.error(
          chalk`{red → Experimental should be set to {bold false} for {bold ${path}} as the feature is supported in multiple browser engines.}`,
        );
      }
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
