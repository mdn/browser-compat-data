const chalk = require('chalk');

/**
 * @param {Identifier} data
 * @param {import('../utils').Logger} logger
 */
function hasValidConstrutorDescription(data, logger) {
  if (data.api) {
    for (let apiName in data.api) {
      const constructor = data.api[apiName][apiName];
      if (constructor && constructor.__compat.description !== `<code>${apiName}()</code> constructor`) {
          logger.error(chalk`{red Incorrect constructor description for {bold ${apiName}()
          Actual: "${constructor.__compat.description || ""}"
          Expected: "<code>${apiName}()</code> constructor"}}`);
      }
    }
  }
}

/**
 * @param {Identifier} data
 * @param {import('../utils').Logger} logger
 */
function hasCorrectDOMEventsDescription(data, logger) {
  if (data.api) {
    for (let apiName in data.api) {
      for (let methodName in data.api[apiName]) {
        if (methodName.endsWith("_event")) {
          const event = data.api[apiName][methodName];
          const eventName = methodName.replace("_event", "");
          if (event.__compat.description !== `<code>${eventName}</code> event`) {
            logger.error(chalk`{red Incorrect event description for {bold ${apiName}#${methodName}}
            Actual: "${event.__compat.description || ""}"
            Expected: "<code>${eventName}</code> event"}`);
          }
        }
      }
    }
  }
}

/**
 * @param {Identifier} data
 * @param {import('../utils').Logger} logger
 */
function checkSecureContextRequired(data, logger) {

}

/**
 * @param {Identifier} data
 * @param {import('../utils').Logger} logger
 */
function checkWebWorkers(data, logger) {

}


/**
 * @param {string} filename
 */
function testGuidelines(filename) {
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

  hasValidConstrutorDescription(data, logger);
  hasCorrectDOMEventsDescription(data, logger);

  if (errors.length) {
    console.error(chalk`{red   Guidelines – {bold ${errors.length}} ${errors.length === 1 ? 'error' : 'errors'}:}`);
    for (const error of errors) {
      console.error(`    ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testGuidelines;
