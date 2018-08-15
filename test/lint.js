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
  for (let file of files) {
    if (file.indexOf(__dirname) !== 0) {
      file = path.resolve(__dirname, '..', file);
    }

    if (!fs.existsSync(file)) {
      continue; // Ignore non-existent files
    }

    if (fs.statSync(file).isFile()) {
      if (path.extname(file) === '.json') {
        let hasStyleErrors, hasSchemaErrors, hasVersionErrors = false;
        const relativeFilePath = path.relative(process.cwd(), file);
        console.log(relativeFilePath);
        if (file.indexOf('browsers' + path.sep) !== -1) {
          hasSchemaErrors = testSchema(file, './../schemas/browsers.schema.json');
        } else {
          hasSchemaErrors = testSchema(file);
          hasStyleErrors = testStyle(file);
          hasVersionErrors = testVersions(file);
        }
        if (hasStyleErrors || hasSchemaErrors || hasVersionErrors) {
          hasErrors = true;
          filesWithErrors.set(relativeFilePath, file);
        }
      }

      continue;
    }

    const subFiles = fs.readdirSync(file).map((subfile) => {
      return path.join(file, subfile);
    });

    load(...subFiles);
  }
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
    testSchema(file);
    testStyle(file);
    testVersions(file);
  }
  process.exit(1);
}
