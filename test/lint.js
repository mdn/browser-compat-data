'use strict';
const fs = require('fs');
const path = require('path');
const ora = require('ora');
const yargs = require('yargs');
const chalk = require('chalk');
const {
  testBrowsersData,
  testBrowsersPresence,
  testConsistency,
  testDescriptions,
  testLinks,
  testPrefix,
  testRealValues,
  testSchema,
  testStyle,
  testVersions,
} = require('./linter/index.js');
const { IS_CI } = require('./utils.js');

const argv = yargs
  .alias('version', 'v')
  .usage('$0 [[--] files...]', false, (yargs) => {
    return yargs.positional('files...', {
      description: 'The files to lint (leave blank to test everything)',
      type: 'string',
    });
  })
  .help()
  .alias('help', 'h')
  .alias('help', '?')
  .parse(process.argv.slice(2));

/** @type {object} */
const spinner = ora({
  stream: process.stdout,
});

/** @type {string[]} */
let errors = [];

/** @type {number} */
let filesWithErrors = 0;

/**
 * Recursively load one or more files and/or directories passed as arguments and check for any errors.
 *
 * @param {string[]} files The files to test
 * @returns {boolean} Whether any of the files passed have errors
 */
const load = (...files) => {
  return files.reduce((prevHasErrors, file) => {
    if (file.indexOf(__dirname) !== 0) {
      file = path.resolve(__dirname, '..', file);
    }

    if (!fs.existsSync(file)) {
      console.warn(chalk`{yellow File {bold ${file}} doesn't exist!}`);
      return prevHasErrors; // Ignore non-existent files
    }

    if (fs.statSync(file).isFile()) {
      let fileHasErrors = false;

      if (path.extname(file) === '.json') {
        const relativeFilePath = path.relative(process.cwd(), file);

        spinner.text = relativeFilePath;

        if (!IS_CI) {
          // Continuous integration environments don't allow overwriting
          // previous lines using VT escape sequences, which is how
          // the spinner animation is implemented.
          spinner.start();
        }

        let fileErrors = [];

        const console_error = console.error;
        console.error = (...args) => {
          if (!fileHasErrors) {
            fileHasErrors = true;
            spinner['stream'] = process.stderr;
            spinner.fail(chalk.red.bold(relativeFilePath));
          }
          console_error(...args);
          fileErrors.push(...args);
        };

        try {
          if (file.indexOf('browsers' + path.sep) !== -1) {
            testSchema(file, './../../schemas/browsers.schema.json');
            testLinks(file);
            testBrowsersData(file0;
          } else {
            testBrowsersPresence(file);
            testConsistency(file);
            testDescriptions(file);
            testLinks(file);
            testPrefix(file);
            testRealValues(file);
            testSchema(file);
            testStyle(file);
            testVersions(file);

          }
        } catch (e) {
          console.error(e);
        }

        if (fileHasErrors) {
          errors.push(chalk`{red.bold ✖ ${relativeFilePath}}`);
          errors.push(...fileErrors);
          filesWithErrors++;
        } else {
          console.error = console_error;
          spinner.succeed();
        }
      }

      return prevHasErrors || fileHasErrors;
    }

    const subFiles = fs.readdirSync(file).map((subfile) => {
      return path.join(file, subfile);
    });

    return load(...subFiles) || prevHasErrors;
  }, false);
};

/**
 * Test for any errors in specified file(s) and/or folder(s), or all of BCD
 *
 * @param {?string} files The file(s) and/or folder(s) to test. Leave null for everything.
 * @returns {boolean} Whether there were any errors
 */
const main = (files) => {
  /** @type {boolean} */
  var hasErrors = false;

  if (files) {
    hasErrors = load(...files);
  } else {
    hasErrors = load(
      'api',
      'browsers',
      'css',
      'html',
      'http',
      'svg',
      'javascript',
      'mathml',
      'webdriver',
      'webextensions',
    );
  }

  if (hasErrors) {
    console.error('');
    console.error(
      chalk`{red Problems in {bold ${filesWithErrors}} ${
        filesWithErrors === 1 ? 'file' : 'files'
      }:}`,
    );
    for (let error of errors) {
      console.error(error);
    }
  }

  return hasErrors;
};

if (require.main === module) {
  process.exit(main(argv.files) ? 1 : 0);
}

module.exports = main;
