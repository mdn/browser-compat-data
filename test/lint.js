/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import esMain from 'es-main';
import ora from 'ora';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk-template';

import {
  testBrowsersData,
  testBrowsersPresence,
  testConsistency,
  testDescriptions,
  testLinks,
  testNotes,
  testPrefix,
  testSchema,
  testStyle,
  testVersions,
} from './linter/index.js';
import { IS_CI, pluralize } from './utils.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/** @type {Map<string, string>} */
const filesWithErrors = new Map();

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
          hasBrowserDataErrors = false,
          hasBrowserPresenceErrors = false,
          hasVersionErrors = false,
          hasConsistencyErrors = false,
          hasPrefixErrors = false,
          hasDescriptionsErrors = false,
          hasNotesErrors = false;
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
            hasBrowserDataErrors = testBrowsersData(file);
            hasLinkErrors = testLinks(file);
          } else {
            hasSchemaErrors = testSchema(file);
            hasStyleErrors = testStyle(file);
            hasLinkErrors = testLinks(file);
            hasBrowserPresenceErrors = testBrowsersPresence(file);
            hasVersionErrors = testVersions(file);
            hasConsistencyErrors = testConsistency(file);
            hasPrefixErrors = testPrefix(file);
            hasDescriptionsErrors = testDescriptions(file);
            hasNotesErrors = testNotes(file);
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
          hasBrowserDataErrors,
          hasBrowserPresenceErrors,
          hasVersionErrors,
          hasConsistencyErrors,
          hasPrefixErrors,
          hasDescriptionsErrors,
          hasNotesErrors,
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

const main = (files) => {
  /** @type {boolean} */
  var hasErrors = files
    ? load.apply(undefined, files)
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
      chalk`{red Problems in ${pluralize('file', filesWithErrors.size)}:}`,
    );
    for (const [fileName, file] of filesWithErrors) {
      console.warn(chalk`{red.bold ✖ ${fileName}}`);
      try {
        if (file.indexOf('browsers' + path.sep) !== -1) {
          testSchema(file, './../../schemas/browsers.schema.json');
          testBrowsersData(file);
          testLinks(file);
        } else {
          testSchema(file);
          testStyle(file);
          testLinks(file);
          testVersions(file);
          testBrowsersPresence(file);
          testConsistency(file);
          testPrefix(file);
          testDescriptions(file);
          testNotes(file);
        }
      } catch (e) {
        console.error(e);
      }
    }
    return true;
  }

  return false;
};

if (esMain(import.meta)) {
  const { argv } = yargs(hideBin(process.argv)).command(
    '$0 [files..]',
    false,
    (yargs) =>
      yargs.positional('files...', {
        description: 'The files to lint',
        type: 'string',
      }),
  );

  process.exit(main(argv.files) ? 1 : 0);
}

export default main;
