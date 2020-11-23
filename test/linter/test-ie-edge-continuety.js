'use strict';
const chalk = require('chalk');
const { Logger } = require('./utils.js');

/**
 * @param {*} supportData
 * Returns the version_added of the support block that should imply Edge's support
 * It is the block that does not have version_removed, prefix, flags, and partial_implementation,
 * which could imply support was removed from engine before Edge 12 release.
 * If no such block exists, returns false.
 */
function lastIESupportsSince(supportData) {
  let ie_compat = supportData && supportData.ie;
  if (!ie_compat) return false;
  if (ie_compat.constructor === Object) ie_compat = [ie_compat];
  for (const s of ie_compat)
    if (
      s.version_added &&
      !s.version_removed &&
      !s.flags &&
      !s.prefix &&
      !s.partial_implementation
    )
      return s.version_added;
  return false;
}

function Edge12Supports(supportData) {
  let edge_compat = supportData && supportData.edge;
  if (!edge_compat) return false;
  if (edge_compat.constructor === Object) edge_compat = [edge_compat];
  for (const s of edge_compat)
    if (
      s.version_added === '12' &&
      !s.flags &&
      !s.prefix &&
      !s.partial_implementation
    )
      return true;
  return false;
}

/**
 * @param {SupportBlock} supportData
 * @param {string} relPath
 * @param {Logger} logger
 */
function checkVersions(supportData, relPath, logger) {
  const ie_added = lastIESupportsSince(supportData);
  const edge12_supports = Edge12Supports(supportData);

  if (ie_added && !edge12_supports) {
    logger.error(
      chalk`{red → {bold ${relPath}} - {bold Edge 12 not supporting this feature contradicts} IE's version_added: "${ie_added}"}\n    Since IE ${ie_added} supports ${relPath}, so should Edge 12, please set Edge's version_added to "12"`,
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
    if (support) checkVersions(support, relPath, logger);

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
