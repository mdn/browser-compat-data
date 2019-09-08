const chalk = require('chalk');

function getApiData(data, cb) {
  if (data.api) {
    for (let apiName in data.api) {
      if (typeof cb === "function") {
        cb({ apiName, apiData: data.api[apiName] });
      }
    }
  }
}

function checkDescriptionGuidelines({ data, logger, methodName, expectedDescription }) {
  getApiData(data, ({ apiName, apiData }) => {
    const method = apiData[apiName][methodName];
    if (method && method.__compat.description !== expectedDescription) {
        logger.error(chalk`{red Incorrect ${methodName.replace("_", " ")} description for {bold ${apiName}()}
        Actual: "${method.__compat.description || ""}"
        Expected: {bold "${expectedDescription}"}}`);
    }
  });
}

/**
 * @param {Identifier} data
 * @param {import('../utils').Logger} logger
 */
function checkConstructorDescription(data, logger) {
  getApiData(data, ({ apiName, apiData }) => {
    const constructor = apiData[apiName];
      if (constructor && constructor.__compat.description !== `<code>${apiName}()</code> constructor`) {
          logger.error(chalk`{red Incorrect constructor description for {bold ${apiName}()
          Actual: "${constructor.__compat.description || ""}"
          Expected: "<code>${apiName}()</code> constructor"}}`);
      }
  });
}

/**
 * @param {Identifier} data
 * @param {import('../utils').Logger} logger
 */
function checkDOMEventsDescription(data, logger) {
  getApiData(data, ({ apiName, apiData }) => {
    for (let methodName in apiData) {
      if (methodName.endsWith("_event")) {
        const event = apiData[methodName];
        const eventName = methodName.replace("_event", "");
        if (event.__compat.description !== `<code>${eventName}</code> event`) {
          logger.error(chalk`{red Incorrect event description for {bold ${apiName}#${methodName}}
          Actual: "${event.__compat.description || ""}"
          Expected: "<code>${eventName}</code> event"}`);
        }
      }
    }
  });
}

/**
 * @param {Identifier} data
 * @param {import('../utils').Logger} logger
 */
function checkSecureContextRequiredDescription(data, logger) {
  checkDescriptionGuidelines({
    data,
    logger,
    methodName: "secure_context_required",
    expectedDescription: "Secure context required"
  });
}

/**
 * @param {Identifier} data
 * @param {import('../utils').Logger} logger
 */
function checkWebWorkersDescription(data, logger) {
  checkDescriptionGuidelines({
    data,
    logger,
    methodName: "worker_support",
    expectedDescription: "Available in workers"
  });
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

  checkConstructorDescription(data, logger);
  checkDOMEventsDescription(data, logger);
  checkSecureContextRequiredDescription(data, logger);
  checkWebWorkersDescription(data, logger);

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
