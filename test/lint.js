/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk-template';

import linters from './linter/index.js';
import extend from '../scripts/lib/extend.js';
import { walk } from '../utils/index.js';
import { pluralize } from './utils.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Recursively load
 *
 * @param {string[]} files The files to test
 * @returns {{messages: object, data: Identifier}}
 */
const loadAndCheckFiles = (...files) => {
  const data = {};

  for (let file of files) {
    if (file.indexOf(dirname) !== 0) {
      file = path.resolve(dirname, '..', file);
    }

    if (!fs.existsSync(file)) {
      console.warn(chalk`{yellow File {bold ${file}} doesn't exist!}`);
      return;
    }

    if (fs.statSync(file).isFile() && path.extname(file) === '.json') {
      const filePath = {
        full: path.relative(process.cwd(), file),
      };
      filePath.category =
        filePath.full.includes(path.sep) && filePath.full.split(path.sep)[0];

      try {
        const rawFileData = fs.readFileSync(file, 'utf-8').trim();
        const fileData = JSON.parse(rawFileData);

        linters.runScope('file', {
          data: fileData,
          rawdata: rawFileData,
          path: filePath,
        });

        extend(data, fileData);
      } catch (e) {
        console.error(`Couldn't load ${filePath.full}!`);
        console.error(e);
      }
    }

    if (fs.statSync(file).isDirectory()) {
      const subFiles = fs
        .readdirSync(file)
        .map((subfile) => path.join(file, subfile));

      extend(data, loadAndCheckFiles(...subFiles));
    }
  }

  return data;
};

/**
 * Test for any errors in specified file(s) and/or folder(s), or all of BCD
 *
 * @param {?string} files The file(s) and/or folder(s) to test. Leave null for everything.
 * @returns {boolean} Whether there were any errors
 */
const main = (
  files = [
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
  ],
) => {
  let hasErrors = false;

  const data = loadAndCheckFiles(...files);

  for (const browser in data.browsers) {
    linters.runScope('browser', {
      data: data.browsers[browser],
      path: {
        full: `browsers.${browser}`,
        category: 'browsers',
      },
    });
  }

  const walker = walk(undefined, data);
  for (const feature of walker) {
    linters.runScope('feature', {
      data: feature.compat,
      path: {
        full: feature.path,
        category: feature.path.split('.')[0],
      },
    });
  }

  linters.runScope('tree', {
    data,
    path: {
      full: '',
    },
  });

  for (const [linter, messages] of Object.entries(linters.messages)) {
    if (!messages.length) continue;

    const errors = messages.filter((m) => m.level === 'error');
    const warnings = messages.filter((m) => m.level === 'warning');

    console.error(
      chalk`{${errors.length ? 'red' : 'yellow'} ${linter} - {bold ${pluralize(
        'problem',
        messages.length,
      )}} (${pluralize('error', errors.length)}, ${pluralize(
        'warning',
        warnings.length,
      )}):}`,
    );

    for (const error of errors) {
      hasErrors = true;

      console.error(chalk`{red  ✖ ${error.path} - Error → ${error.message}}`);
      if (error.tip) {
        console.error(chalk`{blue    ◆ Tip: ${error.tip}}`);
      }
    }

    for (const warning of warnings) {
      console.warn(
        chalk`{red  ✖ ${warning.path} - Warning → ${warning.message}}`,
      );
      if (warning.tip) {
        console.warn(chalk`{blue    ◆ Tip: ${warning.tip}}`);
      }
    }
  }

  return hasErrors;
};

if (esMain(import.meta)) {
  const { argv } = yargs(hideBin(process.argv)).command(
    '$0 [files..]',
    false,
    (yargs) =>
      yargs.positional('files...', {
        description: 'The files to lint (leave blank to test everything)',
        type: 'string',
      }),
  );

  process.exit(main(argv.files) ? 1 : 0);
}

export default main;
