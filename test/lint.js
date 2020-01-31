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
const testCompareFeatures = require('./test-compare-features');
const testMigrations = require('./test-migrations');
const testFormat = require('./test-format');

const argv = yargs
  .alias('version', 'v')
  .usage('$0 [[--] files...]', false, yargs => {
    return yargs.positional('files...', {
      description: 'The files to lint',
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

/** @type {integer} */
let filesWithErrors = 0;

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
          } else {
            testBrowsers(file);
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

    const subFiles = fs.readdirSync(file).map(subfile => {
      return path.join(file, subfile);
    });

    return load(...subFiles) || prevHasErrors;
  }, false);
}

/**
 * @param {string} testName
 * @param {function} test
/** @return {boolean} */
function testGlobal(testName, test) {
  let globalHasErrors = false;

  const console_error = console.error;
  console.error = (...args) => {
    if (!globalHasErrors) {
      globalHasErrors = true;
      spinner['stream'] = process.stderr;
      spinner.fail(chalk.red.bold(`${testName}()`));
    }
    console_error(...args);
  };

  spinner.text = `${testName}()`;

  if (!IS_CI) {
    // Continuous integration environments don't allow overwriting
    // previous lines using VT escape sequences, which is how
    // the spinner animation is implemented.
    spinner.start();
  }

  test();

  if (globalHasErrors) {
    filesWithErrors += 1;
    spinner.fail();
  } else {
    spinner.succeed();
  }

  return globalHasErrors;
}

/**
 * @param {string} testName
 * @param {function} test
/** @return {boolean} */
function testGlobals() {
  let hasErrors = false;

  hasErrors = testGlobal('compare-features', testCompareFeatures) || hasErrors;
  hasErrors = testGlobal('migrations', testMigrations) || hasErrors;
  hasErrors = testGlobal('format', testFormat) || hasErrors;

  return hasErrors;
}

/** @type {boolean} */
var hasErrors = false;

if (argv.files) {
  hasErrors = load.apply(undefined, argv.files);
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
    'xpath',
    'xslt',
  );
  hasErrors = testGlobals() || hasErrors;
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
  process.exit(1);
}
