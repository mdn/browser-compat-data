'use strict';
const chalk = require('chalk');
const { Logger } = require('./utils.js');

/**
 * @param {SupportBlock} supportData
 * @param {string} relPath
 * @param {Logger} logger
 */
function checkVersions(supportData, relPath, logger) {
  const edge_added =
    supportData && supportData.edge && supportData.edge.version_added;
  const ie_added =
    supportData && supportData.ie && supportData.ie.version_added;
  const ie_removed =
    supportData && supportData.ie && supportData.ie.version_removed;

  if (!!ie_added && !ie_removed && !!edge_added && edge_added !== '12') {
    logger.error(
      chalk`{red → {bold ${relPath}} - {bold Edge's version_added: "${edge_added}"} {bold contradicts} IE's version_added: "${ie_added}"}\n    Since IE supports ${relPath}, so should Edge 12, please set Edge's version_added to "12"`,
    );
  }
}

/**
 * @param {string} filename
 */
function testIEtoEdgeContinuety(filename) {
  /** @type {Identifier} */
  const data = require(filename);

  const logger = new Logger('Versions');

  /**
   * @param {Identifier} data
   * @param {string} [relPath]
   */
  function findSupport(data, relPath) {
    const support = data && data.__compat && data.__compat.support;
    checkVersions(support, relPath, logger);

    for (const prop in data) {
      const sub = data[prop];
      if (typeof sub === 'object')
        findSupport(sub, relPath ? `${relPath}.${prop}` : `${prop}`);
    }
  }
  findSupport(data);

  logger.emit();
  return logger.hasErrors();
}

module.exports = testIEtoEdgeContinuety;
