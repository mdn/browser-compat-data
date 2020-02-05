/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const Ajv = require('ajv');
const betterAjvErrors = require('better-ajv-errors');
const chalk = require('chalk');

const ajv = new Ajv({ jsonPointers: true, allErrors: true });

/**
 * @param {string} dataFilename The file to test
 * @param {string} [schemaFilename] A specific schema file to test with, if needed
 * @returns {boolean} If the file contains errors
 */
const testSchema = (
  dataFilename,
  schemaFilename = './../../schemas/compat-data.schema.json',
) => {
  const schema = require(schemaFilename);
  const data = require(dataFilename);

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
};

module.exports = testSchema;
