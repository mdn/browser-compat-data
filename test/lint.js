var fs = require('fs');
var path = require('path');
var {testStyle} = require('./test-style');
var {testSchema} = require('./test-schema');
var {testVersions} = require('./test-versions');
var hasErrors, hasStyleErrors, hasSchemaErrors, hasVersionErrors = false;
var filesWithErrors = {};

function load(...files) {
  for (let file of files) {
    if (file.indexOf(__dirname) !== 0) {
      file = path.resolve(__dirname, '..', file);
    }

    if (fs.statSync(file).isFile()) {
      if (path.extname(file) === '.json') {
        console.log(file.replace(path.resolve(__dirname, '..') + path.sep, ''));
        if (file.indexOf('browsers' + path.sep) !== -1) {
          hasSchemaErrors = testSchema(file, './../schemas/browsers.schema.json');
        } else {
          hasSchemaErrors = testSchema(file);
          hasStyleErrors = testStyle(file);
          hasVersionErrors = testVersions(file);
        }
        if (hasStyleErrors || hasSchemaErrors || hasVersionErrors) {
          hasErrors = true;
          fileName = file.replace(path.resolve(__dirname, '..') + path.sep, '');
          filesWithErrors[fileName] = file;
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
    'browsers',
    'css',
    'html',
    'http',
    'svg',
    'javascript',
    'mathml',
    'test',
    'webdriver',
    'webextensions'
  );
}

if (hasErrors) {
  console.log("");
  console.log(`Problems in ${Object.keys(filesWithErrors).length} files:`);
  for (let file in filesWithErrors) {
    console.log(file);
    testSchema(filesWithErrors[file]);
    testStyle(filesWithErrors[file]);
    testVersions(filesWithErrors[file]);
  }
  process.exit(1);
}
