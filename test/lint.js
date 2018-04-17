var fs = require('fs');
var path = require('path');
var {testStyle} = require('./test-style');
var {testSchema} = require('./test-schema');
var {testVersions} = require('./test-versions');
var {testImports} = require('./test-imports');
var hasErrors, hasStyleErrors, hasSchemaErrors, hasVersionErrors, hasImportErrors = false;

function load(...files) {
  for (let file of files) {
    if (file.indexOf(__dirname) !== 0) {
      file = path.resolve(__dirname, '..', file);
    }

    if (fs.statSync(file).isFile()) {
      if (path.extname(file) === '.json') {
        console.log(file.replace(path.resolve(__dirname, '..') + path.sep, ''),'\x1b[0m');
        if (file.indexOf('browsers' + path.sep) !== -1) {
          hasSchemaErrors = testSchema(file, './../schemas/browsers.schema.json');
        } else {
          hasSchemaErrors = testSchema(file);
          hasStyleErrors = testStyle(file);
          hasVersionErrors =  testVersions(file);
        }
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
  load(process.argv[2]);

  console.log('Imports');
  // Ignore import errors when testing a signle file,
  // as imports require loading the whole tree.
  hasImportErrors = testImports(
    process.argv[2]
  );
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

  console.log('Imports');
  // Imports require loading the whole tree into memory.
  // TODO: Figure out a way to test this better.
  hasErrors |= hasImportErrors = testImports(
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

if (!hasImportErrors) {
  console.log('\x1b[32m  OK \x1b[0m');
} else {
  console.error('\x1b[31m  Error \x1b[0m');
}

if (hasErrors) {
  process.exit(1);
}
