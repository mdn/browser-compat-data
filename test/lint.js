/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const fs = require('fs');
const path = require('path');
const ora = require('ora');
const yargs = require('yargs');
const chalk = require('chalk');
const {
  testBrowsers,
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

/** @type {Map<string, string>} */
const filesWithErrors = new Map();

const argv = yargs
  .alias('version', 'v')
  .usage('$0 [[--] files...]', false, (yargs) => {
    return yargs.positional('files...', {
      description: 'The files to lint',
      type: 'string',
    });
  })
  .help()
  .alias('help', 'h')
  .alias('help', '?')
  .parse(process.argv.slice(2));

/**
 * @param {string[]} files
 * @return {boolean}
 */
function load(...files) {
  return files.reduce((prevHasErrors, file) => {
    if (file.indexOf(__dirname) !== 0) {
      file = path.resolve(__dirname, '..', file);
    }

    if (!fs.existsSync(file)) {
      return prevHasErrors; // Ignore non-existent files
    }

    if (fs.statSync(file).isFile()) {
      let fileHasErrors = false;

      if (path.extname(file) === '.json') {
        let hasSyntaxErrors = false,
          hasSchemaErrors = false,
          hasStyleErrors = false,
          hasLinkErrors = false,
          hasBrowserErrors = false,
          hasVersionErrors = false,
          hasConsistencyErrors = false,
          hasRealValueErrors = false,
          hasPrefixErrors = false,
          hasDescriptionsErrors = false;
        const relativeFilePath = path.relative(process.cwd(), file);

        const spinner = ora({
          stream: process.stdout,
          text: relativeFilePath,
        });

        if (!IS_CI) {
          // Continuous integration environments don't allow overwriting
          // previous lines using VT escape sequences, which is how
          // the spinner animation is implemented.
          spinner.start();
        }

        const console_error = console.error;
        console.error = (...args) => {
          spinner['stream'] = process.stderr;
          spinner.fail(chalk.red.bold(relativeFilePath));
          console.error = console_error;
          console.error(...args);
        };

        try {
          if (file.indexOf('browsers' + path.sep) !== -1) {
            hasSchemaErrors = testSchema(
              file,
              './../../schemas/browsers.schema.json',
            );
            hasLinkErrors = testLinks(file);
          } else {
            hasSchemaErrors = testSchema(file);
            hasStyleErrors = testStyle(file);
            hasLinkErrors = testLinks(file);
            hasBrowserErrors = testBrowsers(file);
            hasVersionErrors = testVersions(file);
            hasConsistencyErrors = testConsistency(file);
            hasRealValueErrors = testRealValues(file);
            hasPrefixErrors = testPrefix(file);
            hasDescriptionsErrors = testDescriptions(file);
          }
        } catch (e) {
          hasSyntaxErrors = true;
          console.error(e);
        }

        fileHasErrors = [
          hasSyntaxErrors,
          hasSchemaErrors,
          hasStyleErrors,
          hasLinkErrors,
          hasBrowserErrors,
          hasVersionErrors,
          hasConsistencyErrors,
          hasRealValueErrors,
          hasPrefixErrors,
          hasDescriptionsErrors,
        ].some((x) => !!x);

        if (fileHasErrors) {
          filesWithErrors.set(relativeFilePath, file);
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
}

/** @type {boolean} */
var hasErrors = argv.files
  ? load.apply(undefined, argv.files)
  : load(
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

if (hasErrors) {
  console.warn('');
  console.warn(
    chalk`{red Problems in {bold ${filesWithErrors.size}} ${
      filesWithErrors.size === 1 ? 'file' : 'files'
    }:}`,
  );
  for (const [fileName, file] of filesWithErrors) {
    console.warn(chalk`{red.bold ✖ ${fileName}}`);
    try {
      if (file.indexOf('browsers' + path.sep) !== -1) {
        testSchema(file, './../../schemas/browsers.schema.json');
        testLinks(file);
      } else {
        testSchema(file);
        testStyle(file);
        testLinks(file);
        testVersions(file);
        testRealValues(file);
        testBrowsers(file);
        testConsistency(file);
        testPrefix(file);
        testDescriptions(file);
      }
    } catch (e) {
      console.error(e);
    }
  }
  process.exit(1);
}
