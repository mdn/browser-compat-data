'use strict';
const fs = require('fs');
const path = require('path');
const {testStyle} = require('./test-style');
const {testSchema} = require('./test-schema');
const {testVersions} = require('./test-versions');
/** @type {Map<string,string>} */
const filesWithErrors = new Map();

let hasErrors = false;

/**
 * @param {string[]} files
 */
function load(...files) {
  files.forEach(file => {
    if (file.indexOf(__dirname) !== 0) {
      file = path.resolve(__dirname, '..', file);
    }

    if (!fs.existsSync(file)) {
      return; // Ignore non-existent files
    }

    if (fs.statSync(file).isFile()) {
      if (path.extname(file) === '.json') {
        let hasSyntaxErrors = false,
          hasSchemaErrors = false,
          hasStyleErrors = false,
          hasVersionErrors = false;
        console.log(file.replace(path.resolve(__dirname, '..') + path.sep, ''));
        try {
          if (file.indexOf('browsers' + path.sep) !== -1) {
            hasSchemaErrors = testSchema(file, './../schemas/browsers.schema.json');
          } else {
            hasSchemaErrors = testSchema(file);
            hasStyleErrors = testStyle(file);
            hasVersionErrors = testVersions(file);
          }
        } catch (e) {
          hasSyntaxErrors = true;
          console.error(e);
        }
        if (hasSyntaxErrors || hasSchemaErrors || hasStyleErrors || hasVersionErrors) {
          hasErrors = true;
          const fileName = file.replace(path.resolve(__dirname, '..') + path.sep, '');
          filesWithErrors.set(fileName, file);
        }
      }

      return;
    }

    const subFiles = fs.readdirSync(file).map((subfile) => {
      return path.join(file, subfile);
    });

    load(...subFiles);
  });
}

if (process.argv[2]) {
  load(process.argv[2]);
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
  console.warn(`Problems in ${filesWithErrors.size} file${filesWithErrors.size > 1 ? 's' : ''}:`);
  for (const [fileName, file] of filesWithErrors) {
    console.log(fileName);
    try {
      if (file.indexOf('browsers' + path.sep) !== -1) {
        testSchema(file, './../schemas/browsers.schema.json');
      } else {
        testSchema(file);
        testStyle(file);
        testVersions(file);
      }
    } catch (e) {
      console.error(e);
    }
  }
  process.exit(1);
}
