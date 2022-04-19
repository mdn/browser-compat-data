'use strict';
const Ajv = require('ajv');
const betterAjvErrors = require('better-ajv-errors').default;
const path = require('path');
const chalk = require('chalk');
const { Logger } = require('../utils.js');

const ajv = new Ajv({ jsonPointers: true, allErrors: true });

/**
 * @param {string} dataFilename
 * @param {string} [schemaFilename]
 */
function testSchema(
  dataFilename,
  schemaFilename = './../../schemas/compat-data.schema.json',
) {
  const schema = require(schemaFilename);
  const data = require(dataFilename);

  const logger = new Logger('JSON Schema');

  if (!ajv.validate(schema, data)) {
    // Output messages by one since better-ajv-errors wrongly joins messages
    // (see https://github.com/atlassian/better-ajv-errors/pull/21)
    ajv.errors.forEach(e => {
      logger.error(betterAjvErrors(schema, data, [e], { indent: 2 }));
    });
  }

  logger.emit();
  return logger.hasErrors();
}

module.exports = testSchema;
