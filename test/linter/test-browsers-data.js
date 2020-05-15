'use strict';
const path = require('path');
const chalk = require('chalk');

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../utils').Logger} Logger
 */

/**
 * @param {Identifier} data
 * @param {Logger} logger
 * @returns {boolean}
 */
function processData(data, logger) {
  const browser = Object.keys(data.browsers)[0];
  const releases = data.browsers[browser].releases;

  let releaseByStatus = {
    current: null,
    beta: null,
    nightly: null,
    esr: null,
  };

  for (let releaseVersion in releases) {
    const releaseData = releases[releaseVersion];

    if (['current', 'beta', 'nightly', 'esr'].includes(releaseData.status)) {
      if (releaseByStatus[releaseData.status]) {
        if (
          !(
            browser == 'nodejs' &&
            ['current', 'esr'].includes(releaseData.status)
          )
        ) {
          logger.error(
            chalk`{red → {bold ${browser}} has multiple {bold ${
              releaseData.status
            }} (${
              releaseByStatus[releaseData.status]
            } and ${releaseVersion}), which is not allowed.}`,
          );
        }
      }

      releaseByStatus[releaseData.status] = releaseVersion;
    }
  }
}

/**
 * @param {string} filename
 * @returns {boolean} If the file contains errors
 */
function testBrowsersData(filename) {
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

  processData(data, logger);

  if (errors.length) {
    console.error(
      chalk`{red   Browsers – {bold ${errors.length}} ${
        errors.length === 1 ? 'error' : 'errors'
      }:}`,
    );
    for (const error of errors) {
      console.error(`  ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testBrowsersData;
