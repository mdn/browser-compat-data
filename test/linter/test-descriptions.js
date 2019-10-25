const chalk = require('chalk');

/**
 * @param {Identifier} apiData
 * @param {String} apiName
 * @param {import('../utils').Logger} logger
 */
function processData(apiData, apiName, logger) {
  for (let methodName in apiData) {
    const method = apiData[methodName];
    if (methodName == apiName) {
      if (method.__compat.description !== `<code>${apiName}()</code> constructor`) {
        logger.error(chalk`{red Incorrect constructor description for {bold ${apiName}()}
      Actual: {yellow "${method.__compat.description || ""}"}
      Expected: {green "<code>${apiName}()</code> constructor"}}`);
      }
    } else if (methodName.endsWith("_event")) {
      const eventName = methodName.replace("_event", "");
      if (method.__compat.description !== `<code>${eventName}</code> event`) {
        logger.error(chalk`{red Incorrect event description for {bold ${apiName}.${methodName}}
      Actual: {yellow "${method.__compat.description || ""}"}
      Expected: {green "<code>${eventName}</code> event"}}`);
      }
    } else if (methodName == 'secure_context_required') {
      if (method.__compat.description !== `Secure context required`) {
        logger.error(chalk`{red Incorrect secure context required description for {bold ${apiName}()}
      Actual: {yellow "${method.__compat.description || ""}"}
      Expected: {green "Secure context required"}}`);
      }
    } else if (methodName == 'worker_support') {
      if (method.__compat.description !== `Available in workers`) {
        logger.error(chalk`{red Incorrect worker support description for {bold ${apiName}()}
      Actual: {yellow "${method.__compat.description || ""}"}
      Expected: {green "Available in workers"}}`);
      }
    }
  }
}

/**
 * @param {string} filename
 */
function testDescriptions(filename) {
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
      processData(apiData, apiName, logger);
    }
  }

  if (errors.length) {
    console.error(chalk`{red   Descriptions – {bold ${errors.length}} ${errors.length === 1 ? 'error' : 'errors'}:}`);
    for (const error of errors) {
      console.error(`    ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testDescriptions;
