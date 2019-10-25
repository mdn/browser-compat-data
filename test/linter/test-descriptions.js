const chalk = require('chalk');

/**
 * @param {String} error_type
 * @param {String} name
 * @param {Identifier} method
 * @param {String} expected
 * @param {import('../utils').Logger} logger
 */
function checkError(error_type, name, method, expected, logger) {
  const actual = method.__compat.description || "";
  if (actual != expected) {
    logger.error(chalk`{red → Incorrect ${error_type} description for {bold ${name}}
      Actual: {yellow "${actual}"}
      Expected: {green "${expected}"}}`);
    return true;
  }

  return false;
}

/**
 * @param {Identifier} apiData
 * @param {String} apiName
 * @param {import('../utils').Logger} logger
 */
function processData(apiData, apiName, logger) {
  for (let methodName in apiData) {
    const method = apiData[methodName];
    if (methodName == apiName) {
      checkError("constructor", `${apiName}()`, method, `<code>${apiName}()</code> constructor`, logger);
    } else if (methodName.endsWith("_event")) {
      checkError("event", `${apiName}.${methodName}`, method, `<code>${methodName.replace("_event", "")}</code> event`, logger);
    } else if (methodName == 'secure_context_required') {
      checkError("secure context required", `${apiName}()`, method, "Secure context required", logger);
    } else if (methodName == 'worker_support') {
      checkError("worker", `${apiName}()`, method, "Available in workers", logger);
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
      console.error(`  ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testDescriptions;
