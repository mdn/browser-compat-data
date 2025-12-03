/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs/promises';
import { Stats } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk-template';

import { BrowserName } from '../types/types.js';
import { DataType } from '../types/index.js';
import dataFolders from '../scripts/lib/data-folders.js';
import extend from '../scripts/lib/extend.js';
import pluralize from '../scripts/lib/pluralize.js';
import { walk } from '../utils/index.js';

import * as linterModules from './linter/index.js';
import {
  Linters,
  LinterMessage,
  LinterMessageLevel,
  LinterPath,
} from './utils.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

const linters = new Linters(Object.values(linterModules));

/**
 * Normalize and categorize file path
 * @param file The file path
 * @returns The normalized and categorized file path
 */
const normalizeAndCategorizeFilePath = (file: string): LinterPath => {
  const filePath: LinterPath = {
    full: path.relative(process.cwd(), file),
    category: '',
  };
  if (path.sep === '\\') {
    // Normalize file paths for Windows users
    filePath.full = filePath.full.replace(/\\/g, '/');
  }
  if (filePath.full.includes('/')) {
    filePath.category = filePath.full.split('/')[0];
  }

  return filePath;
};

/**
 * Recursively load
 * @param files The files to test
 * @returns The data from the loaded files
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
      const filePath = normalizeAndCategorizeFilePath(file);

      try {
        const rawFileData = (await fs.readFile(file, 'utf-8')).trim();
        const fileData = JSON.parse(rawFileData);

        await linters.runScope('file', {
          data: fileData,
          rawdata: rawFileData,
          path: filePath,
        });

        extend(data, fileData);
      } catch (e) {
        linters.messages['File'].push({
          level: 'error',
          title: 'File Read Error',
          path: filePath.full,
          message: e as string,
        });
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
 * @param files The file(s) and/or folder(s) to test. Leave undefined for everything.
 * @param options Linting options
 * @param options.failOnWarnings Treat warnings as errors (non-zero exit code)
 * @returns Whether there were any errors
 */
const main = async (
  files = dataFolders,
  options: { failOnWarnings?: boolean } = {},
) => {
  const { failOnWarnings = false } = options;

  let hasErrors = false;

  console.log(chalk`{cyan Loading and checking files...}`);
  const data = await loadAndCheckFiles(...files);

  console.log(chalk`{cyan Testing browser data...}`);
  for (const browser in data?.browsers) {
    await linters.runScope('browser', {
      data: data.browsers[browser],
      rawdata: '',
      path: {
        full: `browsers.${browser}`,
        category: 'browsers',
        browser: browser as BrowserName,
      },
    });
  }

  console.log(chalk`{cyan Testing feature data...}`);
  const walker = walk(undefined, data);
  for (const feature of walker) {
    await linters.runScope('feature', {
      data: feature.compat,
      rawdata: '',
      path: {
        full: feature.path,
        category: feature.path.split('.')[0],
      },
    });
  }

  console.log(chalk`{cyan Testing all features together...}`);
  await linters.runScope('tree', {
    data,
    rawdata: '',
    path: {
      full: '',
      category: '',
    },
  });

  for (const [linter, messages] of Object.entries(linters.messages)) {
    if (!messages.length) {
      continue;
    }

    const messagesByLevel: Record<LinterMessageLevel, LinterMessage[]> = {
      error: [],
      warning: [],
      info: [],
    };

    for (const message of messages) {
      messagesByLevel[message.level].push(message);
    }

    if (messagesByLevel.error.length) {
      hasErrors = true;
    }

    if (failOnWarnings && messagesByLevel.warning.length) {
      hasErrors = true;
    }

    const errorCounts = Object.entries(messagesByLevel)
      .map(([k, v]) => pluralize(k, v.length, true))
      .join(', ');

    console.error(
      chalk`{${
        messagesByLevel.error.length ? 'red' : 'yellow'
      } ${linter} - {bold ${pluralize(
        'problem',
        messages.length,
        true,
      )}} (${errorCounts}):}`,
    );

    for (const message of messages) {
      console.error(
        chalk`{${message.level === 'error' ? 'red' : message.level === 'warning' ? 'yellow' : 'blue'}  ✖ ${
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
      for (const linter of linters.linters) {
        if (linter.exceptions) {
          console.log(
            chalk`{yellow  ${linter.name} has ${pluralize(
              'exception',
              linter.exceptions.length,
              true,
            )}}`,
          );
          for (const exception of linter.exceptions) {
            console.log(chalk`{yellow   - ${exception}}`);
          }
        }
      }
    }
  }

  return hasErrors;
};

if (esMain(import.meta)) {
  const { argv } = yargs(hideBin(process.argv))
    .command('$0 [files..]', false, (yargs) =>
      yargs.positional('files...', {
        description: 'The files to lint (leave blank to test everything)',
        type: 'string',
      }),
    )
    .option('fail-on-warnings', {
      type: 'boolean',
      description: 'Treat warnings as errors (non-zero exit code)',
      default: false,
    });

  const { files, failOnWarnings } = argv as any;
  process.exit((await main(files, { failOnWarnings })) ? 1 : 0);
}

export default main;
