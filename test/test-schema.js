var Ajv = require('ajv');
var ajv = new Ajv({ allErrors: true });

function testSchema(dataFilename, schemaFilename = '../compat-data.schema.json') {
  var valid = ajv.validate(
    require(schemaFilename),
    require(dataFilename)
  );

  if (valid) {
    console.log('\x1b[32m  JSON schema – OK \x1b[0m');
    return false;
  } else {
    console.log('\x1b[31m  JSON schema – ' + ajv.errors.length + ' error(s)\x1b[0m');
    console.log('   ' + ajv.errorsText(ajv.errors, {
      separator: '\n    ',
      dataVar: 'item'
    }));
    return true;
  }
}

module.exports.testSchema = testSchema;
