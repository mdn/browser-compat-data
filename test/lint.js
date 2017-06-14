var fs = require('fs');
var path = require('path');
var Ajv = require('ajv');
var ajv = new Ajv({ allErrors: true });
var hasErrors = false;

function jsonDiff(actual, expected) {
  var actualLines = actual.split(/\n/);
  var expectedLines = expected.split(/\n/);

  for (var i = 0; i < actualLines.length; i++) {
    if (actualLines[i] !== expectedLines[i]) {
      return [
        '#' + i + '\x1b[0m',
        '    Actual:   ' + actualLines[i],
        '    Expected: ' + expectedLines[i]
      ].join('\n');
    }
  }
}

function checkStyle(filename) {
  var actual = fs.readFileSync(filename, 'utf-8').trim();
  var expected = JSON.stringify(JSON.parse(actual), null, 2);

  if (actual === expected) {
    console.log('\x1b[32m  Style – OK\x1b[0m');
  } else {
    hasErrors = true;
    console.log('\x1b[31m  Style – Error on line ' + jsonDiff(actual, expected));
  }
}

function checkSchema(dataFilename) {
  var schemaFilename = '../compat-data.schema.json';
  var valid = ajv.validate(
    require(schemaFilename),
    require(dataFilename)
  );

  if (valid) {
    console.log('\x1b[32m  JSON schema – OK\x1b[0m');
  } else {
    hasErrors = true;
    console.log('\x1b[31m  JSON schema – ' + ajv.errors.length + ' error(s)\x1b[0m');
    console.log('   ' + ajv.errorsText(ajv.errors, {
      separator: '\n    ',
      dataVar: 'item'
    })
  );
}
}


function load() {
  var dirAbs;

  function processFilename(fn) {
    var fp = path.join(dirAbs, fn);
    // If the given filename is a directory, recursively load it.
    if (fs.statSync(fp).isDirectory()) {
      load(fp);
    } else if (path.extname(fn) === '.json') {
      console.log(dirRel.replace('../', '') + '/' + fn);
      checkStyle(fp)
      checkSchema(fp);
    }
  }

  for (const dir of arguments) {
    dirRel = path.relative(__dirname, dir);
    dirAbs = path.resolve(__dirname, '../', dir);
    fs.readdirSync(dirAbs).forEach(processFilename);
  }
}

load(
  'api',
  'css',
  'http',
  'javascript',
  'test',
  'webextensions'
);

if (hasErrors) {
  process.exit(1);
}
