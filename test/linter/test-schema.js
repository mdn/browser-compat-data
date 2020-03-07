'use strict';
const fs = require('fs');
const Ajv = require('ajv');
const betterAjvErrors = require('better-ajv-errors');
const path = require('path');
const chalk = require('chalk');

const ajv = new Ajv({ jsonPointers: true, allErrors: true });

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

/**
 * @param {string} dataFilename
 * @param {string} [schemaFilename]
 */
function testSchema(
  dataFilename,
  schemaFilename = './../../schemas/compat-data.schema.json',
) {
  const schema = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, schemaFilename), 'UTF-8'),
  );
  /** @type {Identifier} */
  const data = JSON.parse(fs.readFileSync(dataFilename, 'UTF-8'));

  const valid = ajv.validate(schema, data);

  if (!valid) {
    console.error(
      chalk`{red   JSON Schema – {bold ${ajv.errors.length}} ${
        ajv.errors.length === 1 ? 'error' : 'errors'
      }:}`,
    );
    // Output messages by one since better-ajv-errors wrongly joins messages
    // (see https://github.com/atlassian/better-ajv-errors/pull/21)
    ajv.errors.forEach(e => {
      console.error(betterAjvErrors(schema, data, [e], { indent: 2 }));
    });
    return true;
  }
  return false;
}

module.exports = testSchema;
