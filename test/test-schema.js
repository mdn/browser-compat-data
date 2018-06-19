'use strict';
const Ajv = require('ajv');
const betterAjvErrors = require('better-ajv-errors');

const ajv = new Ajv({ jsonPointers: true, allErrors: true });

function testSchema(dataFilename, schemaFilename = './../schemas/compat-data.schema.json') {
  const schema = require(schemaFilename);
  const data   = require(dataFilename);

  if (ajv.validate(schema, data)) {
    console.log('\x1b[32m  JSON schema – OK \x1b[0m');
    return false;
  } else {
    console.error('\x1b[31m  File : ' + dataFilename);
    console.error('\x1b[31m  JSON schema – ' + ajv.errors.length + ' error(s)\x1b[0m');
    ajv.errors.forEach(e => {
      console.error(betterAjvErrors(schema, data, [e], {indent: 2}));
    });
    return true;
  }
}

module.exports.testSchema = testSchema;
