var fs = require('fs');
var path = require('path');
var {testStyle} = require('./test-style');
var {testSchema} = require('./test-schema');
var {testVersions} = require('./test-versions');
var hasErrors, hasStyleErrors, hasSchemaErrors, hasVersionErrors = false;

function load(...files) {
  for (let file of files) {
    if (file.indexOf(__dirname) !== 0) {
      file = path.resolve(__dirname, '..', file);
    }

    if (fs.statSync(file).isFile()) {
      if (path.extname(file) === '.json') {
        console.log(file.replace(path.resolve(__dirname, '..') + path.sep, ''));
        hasStyleErrors = testStyle(file);
        hasSchemaErrors = testSchema(file);
        hasVersionErrors =  testVersions(file);
        if (hasStyleErrors || hasSchemaErrors || hasVersionErrors) {
          hasErrors = true;
        }
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

console.log('browsers/browsers.json');
testStyle(__dirname + '/../browsers/browsers.json');
testSchema(__dirname + '/../browsers/browsers.schema.json', __dirname + '/../browsers/browsers.json');


if (hasErrors) {
  process.exit(1);
}
