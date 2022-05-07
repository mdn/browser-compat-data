'use strict';
const path = require('path');
const chalk = require('chalk');
const { Logger } = require('./utils.js');

const { browsers } = require('../../index.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

/**
 * @param {Identifier} data
 * @param {string} category
 * @param {Logger} logger
 * @param {string} [path]
 */
function processData(data, category, logger, path = '') {
  if (data.__compat && data.__compat.support) {
    const support = data.__compat.support;
    const definedBrowsers = Object.keys(support);

    let displayBrowsers = [
      ...Object.keys(browsers).filter((b) =>
        ['desktop', 'mobile'].includes(browsers[b].type),
      ),
      ,
    ];
    let requiredBrowsers = [
      ...Object.keys(browsers).filter((b) => browsers[b].type == 'desktop'),
    ];

    if (category === 'api' || category === 'javascript') {
      displayBrowsers.push(
        ...Object.keys(browsers).filter((b) => browsers[b].type == 'server'),
      );
    }

    if (category === 'webextensions') {
      displayBrowsers = displayBrowsers.filter(
        (b) => browsers[b].accepts_webextensions,
      );
      requiredBrowsers = requiredBrowsers.filter(
        (b) => browsers[b].accepts_webextensions,
      );
    }

    const undefEntries = definedBrowsers.filter(
      (value) => !(value in browsers),
    );
    if (undefEntries.length > 0) {
      logger.error(
        chalk`{red → {bold ${path}} has the following browsers, which are not defined in BCD: {bold ${undefEntries.join(
          ', ',
        )}}}`,
      );
    }

    const invalidEntries = Object.keys(support).filter(
      (value) => !displayBrowsers.includes(value),
    );
    if (invalidEntries.length > 0) {
      logger.error(
        chalk`{red → {bold ${path}} has the following browsers, which are invalid for {bold ${category}} compat data: {bold ${invalidEntries.join(
          ', ',
        )}}}`,
      );
    }

    const missingEntries = requiredBrowsers.filter(
      (value) => !(value in support),
    );
    if (missingEntries.length > 0) {
      logger.error(
        chalk`{red → {bold ${path}} is missing the following browsers, which are required for {bold ${category}} compat data: {bold ${missingEntries.join(
          ', ',
        )}}}`,
      );
    }

    for (const [browser, supportStatement] of Object.entries(support)) {
      const statementList = Array.isArray(supportStatement)
        ? supportStatement
        : [supportStatement];
      function hasVersionAddedOnly(statement) {
        const keys = Object.keys(statement);
        return keys.length === 1 && keys[0] === 'version_added';
      }
      let sawVersionAddedOnly = false;
      for (const statement of statementList) {
        if (hasVersionAddedOnly(statement)) {
          if (sawVersionAddedOnly) {
            logger.error(
              chalk`{red → '{bold ${path}}' has multiple support statement with only \`{bold version_added}\` for {bold ${browser}}}`,
            );
            break;
          } else {
            sawVersionAddedOnly = true;
          }
        }
      }
    }
  }
  for (const key in data) {
    if (key === '__compat') continue;

    processData(
      data[key],
      category,
      logger,
      path && path.length > 0 ? `${path}.${key}` : key,
    );
  }
}

/**
 * @param {string} filename
 * @returns {boolean} If the file contains errors
 */
function testBrowsersPresence(filename) {
  const relativePath = path.relative(
    path.resolve(__dirname, '..', '..'),
    filename,
  );
  const category =
    relativePath.includes(path.sep) && relativePath.split(path.sep)[0];
  /** @type {Identifier} */
  const data = require(filename);

  const logger = new Logger('Browsers');

  processData(data, category, logger);

  logger.emit();
  return logger.hasErrors();
}

module.exports = testBrowsersPresence;
