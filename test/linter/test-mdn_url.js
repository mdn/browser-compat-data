const chalk = require('chalk');

const URLPrefix = 'https://developer.mozilla.org/docs/Web/API';

/**
 * @param {Identifier} apiData
 * @param {String} apiName
 * @param {import('../utils').Logger} logger
 * @param {String} prefix
 */
function hasCorrectMDNUrl(apiData, apiName, logger, prefix) {
  // worker_support
  const actualURL = apiData['__compat'].mdn_url;
  if (apiName === 'worker_support') {
    if (actualURL !== undefined) {
      logger.error(chalk`{red Incorrect mdn_url for {bold worker_support}}
      {yellow Actual: {bold "${actualURL}"}}
      {green Expected to be undefined`);
    }
    return;
  }
  if (actualURL && actualURL !== `${prefix}/${apiName}` && actualURL !== `${prefix}#${apiName}`) {
    logger.error(chalk`{red Incorrect mdn_url for {bold ${apiName}#${null}}}
    {yellow Actual: {bold "${actualURL || ""}"}}
    {green Expected: {bold "${prefix}/${apiName}" or "${prefix}#${apiName}"}}`);
  }
}

/**
 * @param {Identifier} apiData
 * @param {String} apiName
 * @param {import('../utils').Logger} logger
 * @param {String} prefix
 */
function hasCorrectMDNUrlRecursive (apiData, apiName, logger, prefix = URLPrefix) {
  hasCorrectMDNUrl(apiData, apiName, logger, prefix);
  const newPrefix = `${prefix}/${apiName}`;
  for (const apiAttributeName in apiData) {
    if (apiAttributeName === '__compat') {
      continue;
    }
    const newData = apiData[apiAttributeName];
    hasCorrectMDNUrlRecursive(newData, apiAttributeName, logger, newPrefix);
  }
}

/**
 * @param {string} filename
 */
function testMDNUrls(filename) {
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

  if (data.api) {
    for (const apiName in data.api) {
      const apiData = data.api[apiName];
      hasCorrectMDNUrlRecursive(apiData, apiName, logger);
    }
  }

  if (errors.length) {
    console.error(chalk`{red   mdn_urls – {bold ${errors.length}} ${errors.length === 1 ? 'error' : 'errors'}:}`);
    for (const error of errors) {
      console.error(`    ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testMDNUrls;
