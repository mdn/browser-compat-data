'use strict';
const fs = require('fs');
const path = require('path');
const ora = require('ora');
const yargs = require('yargs');
const chalk = require('chalk');
const testStyle = require('./test-style');
const testSchema = require('./test-schema');
const testVersions = require('./test-versions');
const testRealValues = require('./test-real-values');
const testBrowsers = require('./test-browsers');
const testPrefix = require('./test-prefix');
/** @type {Map<string, string>} */
const filesWithErrors = new Map();

const argv = yargs.alias('version','v')
  .usage('$0 [[--] files...]', false, yargs => {
    return yargs.positional('files...', {
      description: 'The files to lint',
      type: 'string'
    })
  })
  .help().alias('help','h').alias('help','?')
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
          hasBrowserErrors = false,
          hasVersionErrors = false,
          hasRealValueErrors = false,
          hasPrefixErrors = false;
        const relativeFilePath = path.relative(process.cwd(), file);

        const spinner = ora({
          stream: process.stdout,
          text: relativeFilePath,
        });

        if (!process.env.CI || String(process.env.CI).toLowerCase() !== 'true') {
          spinner.start();
        }

        const console_error = console.error;
        console.error = (...args) => {
          spinner['stream'] = process.stderr;
          spinner.fail(chalk.red.bold(relativeFilePath));
          console.error = console_error;
          console.error(...args);
        }

        try {
          if (file.indexOf('browsers' + path.sep) !== -1) {
            hasSchemaErrors = testSchema(file, './../schemas/browsers.schema.json');
          } else {
            hasSchemaErrors = testSchema(file);
            hasStyleErrors = testStyle(file);
            hasBrowserErrors = testBrowsers(file);
            hasVersionErrors = testVersions(file);
            hasRealValueErrors = testRealValues(file);
            hasPrefixErrors = testPrefix(file);
          }
        } catch (e) {
          hasSyntaxErrors = true;
          console.error(e);
        }

        fileHasErrors = [
          hasSyntaxErrors,
          hasSchemaErrors,
          hasStyleErrors,
          hasBrowserErrors,
          hasVersionErrors,
          hasRealValueErrors,
          hasPrefixErrors,
        ].some(x => !!x);

        if (fileHasErrors) {
          filesWithErrors.set(relativeFilePath, file);
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

/** @type {boolean} */
const hasErrors = argv.files
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
    'xpath',
    'xslt',
  );

if (hasErrors) {
  console.warn('');
  console.warn(chalk`{red Problems in }{red.bold ${filesWithErrors.size}}{red  ${filesWithErrors.size === 1 ? 'file' : 'files'}:}`,
  );
  for (const [fileName, file] of filesWithErrors) {
    console.warn(chalk`{red.bold ✖ ${fileName}}`);
    try {
      if (file.indexOf('browsers' + path.sep) !== -1) {
        testSchema(file, './../schemas/browsers.schema.json');
      } else {
        testSchema(file);
        testStyle(file);
        testVersions(file);
        testRealValues(file);
        testBrowsers(file);
        testPrefix(file);
      }
    } catch (e) {
      console.error(e);
    }
  }
  process.exit(1);
}
