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

  if (actual.includes("//bugzilla.mozilla.org/show_bug.cgi?id=") // like https://bugzil.la/1000000
    || actual.includes("//bugs.chromium.org/")) { // like https://crbug.com/100000
    hasErrors = true;
    console.log('\x1b[33m  Found shortenable url.\x1b[0m');
  }
  if (actual.includes("href=\\\"")) {
    hasErrors = true;
    console.log('\x1b[33m  You can replace \\\" with \' for <a> tag.\x1b[0m');
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
    }));
  }
}


function load(...files) {
  for (let file of files) {
    if (file.indexOf(__dirname) !== 0) {
      file = path.resolve(__dirname, '..', file);
    }

    if (fs.statSync(file).isFile()) {
      if (path.extname(file) === '.json') {
        console.log(file.replace(path.resolve(__dirname, '..') + path.sep, ''));
        checkStyle(file)
        checkSchema(file);
      }

      continue;
    }

    let subFiles = fs.readdirSync(file).map((subfile) => {
      return path.join(file, subfile);
    });

    load(...subFiles);
  }
}

if (process.argv[2]) {
  load(process.argv[2])
} else {
  load(
    'api',
    'css',
    'html',
    'http',
    'javascript',
    'test',
    'webextensions'
  );
}

if (hasErrors) {
  process.exit(1);
}
