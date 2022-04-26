import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ora from 'ora';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import {
  testBrowsers,
  testConsistency,
  testDescriptions,
  testLinks,
  testPrefix,
  testRealValues,
  testSchema,
  testStyle,
  testVersions,
} from './linter/index.js';
import { IS_CI } from './utils.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/** @type {Map<string, string>} */
const filesWithErrors = new Map();

const { argv } = yargs(hideBin(process.argv)).command('$0 [files..]', (yargs) =>
  yargs.positional('files...', {
    description: 'The files to lint',
    type: 'string',
  }),
);

/**
 * @param {string[]} files
 * @return {boolean}
 */
function load(...files) {
  return files.reduce((prevHasErrors, file) => {
    if (file.indexOf(dirname) !== 0) {
      file = path.resolve(dirname, '..', file);
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
