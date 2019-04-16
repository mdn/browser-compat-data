'use strict';
const Ajv = require('ajv');
const betterAjvErrors = require('better-ajv-errors');
const path = require('path');

const ajv = new Ajv({ jsonPointers: true, allErrors: true });

/**
 * @param {string} dataFilename
 * @param {string} [schemaFilename]
 */
function testSchema(dataFilename, schemaFilename = './../schemas/compat-data.schema.json') {
  const schema = require(schemaFilename);
  const data   = require(dataFilename);

  const valid = ajv.validate(schema, data);

  if (valid) {
    return false;
  } else {
    console.error('\x1b[31m  File : ' + path.relative(process.cwd(), dataFilename));
    console.error('\x1b[31m  JSON schema – ' + ajv.errors.length + ' error(s)\x1b[0m');
    ajv.errors.forEach(e => {
      console.error(betterAjvErrors(schema, data, [e], {indent: 2}));
    });
    return true;
  }
}

module.exports = testSchema;
