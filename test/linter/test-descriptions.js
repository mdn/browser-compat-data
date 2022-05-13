/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const chalk = require('chalk');
const { Logger } = require('../utils.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

/**
 * @param {Identifier} apiData
 * @param {String} apiName
 * @param {Logger} logger
 */
function hasValidConstrutorDescription(apiData, apiName, logger) {
  const constructor = apiData[apiName];
  if (
    constructor &&
    constructor.__compat.description !== `<code>${apiName}()</code> constructor`
  ) {
    logger.error(chalk`Incorrect constructor description for {bold ${apiName}()}
      {yellow Actual: {bold "${constructor.__compat.description || ''}"}}
      {green Expected: {bold "<code>${apiName}()</code> constructor"}}`);
  }
}

/**
 * @param {Identifier} apiData
 * @param {String} apiName
 * @param {Logger} logger
 */
function hasCorrectDOMEventsDescription(apiData, apiName, logger) {
  for (const methodName in apiData) {
    if (methodName.endsWith('_event')) {
      const event = apiData[methodName];
      const eventName = methodName.replace('_event', '');
      if (event.__compat.description !== `<code>${eventName}</code> event`) {
        logger.error(chalk`Incorrect event description for {bold ${apiName}#${methodName}}
      {yellow Actual: {bold "${event.__compat.description || ''}"}}
      {green Expected: {bold "<code>${eventName}</code> event"}}`);
      }
    }
  }
}

/**
 * @param {Identifier} apiData
 * @param {String} apiName
 * @param {Logger} logger
 */
function hasCorrectSecureContextRequiredDescription(apiData, apiName, logger) {
  const secureContext = apiData.secure_context_required;
  if (
    secureContext &&
    secureContext.__compat.description !== `Secure context required`
  ) {
    logger.error(chalk`Incorrect secure context required description for {bold ${apiName}()}
      {yellow Actual: {bold "${secureContext.__compat.description || ''}"}}
      {green Expected: {bold "Secure context required"}}`);
  }
}

/**
 * @param {Identifier} apiData
 * @param {String} apiName
 * @param {Logger} logger
 */
function hasCorrectWebWorkersDescription(apiData, apiName, logger) {
  const workerSupport = apiData.worker_support;
  if (
    workerSupport &&
    workerSupport.__compat.description !== `Available in workers`
  ) {
    logger.error(chalk`Incorrect worker support description for {bold ${apiName}()}
      {yellow Actual: {bold "${workerSupport.__compat.description || ''}"}}
      {green Expected: {bold "Available in workers"}}`);
  }
}

/**
 * @param {Identifier} apiData
 * @param {String} apiName
 * @param {Logger} logger
 */
function hasCorrectPermissionDescription(apiData, apiName, logger) {
  const expectedDescrition = `<code>${apiName.replace(
    '_permission',
    '',
  )}</code> permission`;
  if (
    apiName &&
    apiName.match('_permission$') &&
    apiData &&
    apiData.__compat &&
    apiData.__compat.description !== expectedDescrition
  ) {
    logger.error(chalk`Incorrect permission description for {bold ${apiName}}
      {yellow Actual: {bold "${apiData.__compat.description || ''}"}}
      {green Expected: {bold "${expectedDescrition}"}}`);
  }
}

/**
 * @param {string} filename
 */
function testDescriptions(filename) {
  /** @type {Identifier} */
  const data = require(filename);

  const logger = new Logger('Descriptions');

  if (data.api) {
    for (const apiName in data.api) {
      const apiData = data.api[apiName];
      hasValidConstrutorDescription(apiData, apiName, logger);
      hasCorrectDOMEventsDescription(apiData, apiName, logger);
      hasCorrectSecureContextRequiredDescription(apiData, apiName, logger);
      hasCorrectWebWorkersDescription(apiData, apiName, logger);
    }
  }

  if (data.api && data.api.Permissions) {
    for (const permissionKey in data.api.Permissions) {
      const apiData = data.api.Permissions[permissionKey];
      hasCorrectPermissionDescription(apiData, permissionKey, logger);
    }
  }

  logger.emit();
  return logger.hasErrors();
}

module.exports = testDescriptions;
