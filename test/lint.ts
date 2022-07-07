/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { DataType } from '../types/index.js';

import fs from 'node:fs/promises';
import { Stats } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk-template';

import linters from './linter/index.js';
import extend from '../scripts/lib/extend.js';
import { walk } from '../utils/index.js';
import { pluralize, LinterMessage, LinterMessageLevel } from './utils.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Recursively load
 *
 * @param {string[]} files The files to test
 * @returns {DataType?}
 */
const loadAndCheckFiles = async (...files: string[]): Promise<DataType> => {
  const data = {};

  for (let file of files) {
    if (file.indexOf(dirname) !== 0) {
      file = path.resolve(dirname, '..', file);
    }

    let fsStats: Stats;

    try {
      fsStats = await fs.stat(file);
    } catch (e) {
      console.warn(chalk`{yellow File {bold ${file}} doesn't exist!}`);
      continue;
    }

    if (fsStats.isFile() && path.extname(file) === '.json') {
      const filePath: { full: string; category?: string } = {
        full: path.relative(process.cwd(), file),
      };
      if (filePath.full.includes(path.sep)) {
        filePath.category = filePath.full.split(path.sep)[0];
      }

      try {
        const rawFileData = (await fs.readFile(file, 'utf-8')).trim();
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

    if (fsStats.isDirectory()) {
      const dircontents = await fs.readdir(file);
      const subFiles = dircontents.map((subfile) => path.join(file, subfile));

      extend(data, await loadAndCheckFiles(...subFiles));
    }
  }

  return data;
};

/**
 * Test for any errors in specified file(s) and/or folder(s), or all of BCD
 *
 * @param {string[]?} files The file(s) and/or folder(s) to test. Leave undefined for everything.
 * @returns {boolean} Whether there were any errors
 */
const main = async (
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

  console.log(chalk`{cyan Loading and checking files...}`);
  const data = await loadAndCheckFiles(...files);

  console.log(chalk`{cyan Testing browser data...}`);
  for (const browser in data?.browsers) {
    linters.runScope('browser', {
      data: data.browsers[browser],
      path: {
        full: `browsers.${browser}`,
        category: 'browsers',
        browser,
      },
    });
  }

  console.log(chalk`{cyan Testing feature data...}`);
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

  console.log(chalk`{cyan Testing all features together...}`);
  linters.runScope('tree', {
    data,
    path: {
      full: '',
    },
  });

  for (const [linter, messages] of Object.entries(linters.messages)) {
    if (!messages.length) continue;

    const messagesByLevel: Record<LinterMessageLevel, LinterMessage[]> = {
      error: [],
      warning: [],
    };

    for (const message of messages) {
      messagesByLevel[message.level].push(message);
    }

    if (messagesByLevel.error.length) {
      hasErrors = true;
    }

    const errorCounts = Object.entries(messagesByLevel)
      .map(([k, v]) => pluralize(k, v.length))
      .join(', ');

    console.error(
      chalk`{${
        messagesByLevel.error.length ? 'red' : 'yellow'
      } ${linter} - {bold ${pluralize(
        'problem',
        messages.length,
      )}} (${errorCounts}):}`,
    );

    for (const message of messages) {
      console.error(
        chalk`{${message.level === 'error' ? 'red' : 'yellow'}  ✖ ${
          message.path
        } - ${message.level[0].toUpperCase() + message.level.substring(1)} → ${
          message.message
        }}`,
      );
      if (message.fixable) {
        console.error(
          chalk`{blue    ◆ Tip: Run {bold npm run fix} to fix this problem automatically}`,
        );
      }
      if (message.tip) {
        console.error(chalk`{blue    ◆ Tip: ${message.tip}}`);
      }
    }
  }

  // Find all unnecessary linting exceptions
  for (const linter of linters.linters) {
    if (linter.exceptions) {
      const missingExceptions = linters.missingExpectedFailures[linter.name];
      for (const exception in missingExceptions) {
        if (missingExceptions[exception]) {
          hasErrors = true;
          console.error(
            chalk`{red  ✖ ${linter.name} - Unnecessary exception → ${exception}}`,
          );
        }
      }
    }
  }

  if (!hasErrors) {
    console.log(chalk`{green All data {bold passed} linting!}`);
    if (linters.linters.some((linter) => linter.exceptions)) {
      console.log(
        chalk`{yellow Linters have some exceptions, please help us remove them!}`,
      );
      for (const linter of linters.linters)
        if (linter.exceptions) {
          console.log(
            chalk`{yellow  ${linter.name} has ${pluralize(
              'exception',
              linter.exceptions.length,
            )}}`,
          );
          for (const exception of linter.exceptions)
            console.log(chalk`{yellow   - ${exception}}`);
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

  process.exit((await main((argv as any).files)) ? 1 : 0);
}

export default main;
