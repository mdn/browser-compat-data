/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs/promises';
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
const loadAndCheckFiles = async (...files) => {
  const data = {};

  for (let file of files) {
    if (file.indexOf(dirname) !== 0) {
      file = path.resolve(dirname, '..', file);
    }

    let fsStats;

    try {
      fsStats = await fs.stat(file);
    } catch (e) {
      console.warn(chalk`{yellow File {bold ${file}} doesn't exist!}`);
      return;
    }

    if (fsStats.isFile() && path.extname(file) === '.json') {
      const filePath = {
        full: path.relative(process.cwd(), file),
      };
      filePath.category =
        filePath.full.includes(path.sep) && filePath.full.split(path.sep)[0];

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
 * @param {?string[]} files The file(s) and/or folder(s) to test. Leave undefined for everything.
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

    const messagesByLevel = {
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
        console[message.level](
          chalk`{blue    ◆ Tip: Run {bold npm run fix} to fix this problem automatically}`,
        );
      }
      if (message.tip) {
        console[message.level](chalk`{blue    ◆ Tip: ${message.tip}}`);
      }
    }
  }

  if (!hasErrors) {
    console.log(chalk`{green All data {bold passed} linting!}`);
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

  process.exit((await main(argv.files)) ? 1 : 0);
}

export default main;
