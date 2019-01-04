'use strict';
const Ajv = require('ajv');
const path = require('path');
const ajv = new Ajv({ allErrors: true });

function testSchema(dataFilename, schemaFilename = './../schemas/compat-data.schema.json') {
  var valid = ajv.validate(
    require(schemaFilename),
    require(dataFilename)
  );

  if (valid) {
    return false;
  } else {
    console.error('\x1b[31m  File : ' + path.relative(process.cwd(), dataFilename));
    console.error('\x1b[31m  JSON schema – ' + ajv.errors.length + ' error(s)\x1b[0m');
    console.error('   ' + ajv.errorsText(ajv.errors, {
      separator: '\n    ',
      dataVar: 'item'
    }));
    return true;
  }
}

module.exports.testSchema = testSchema;
