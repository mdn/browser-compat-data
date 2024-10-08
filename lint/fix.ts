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

import fixBrowserOrder from './fixer/browser-order.js';
import fixFeatureOrder from './fixer/feature-order.js';
import fixPropertyOrder from './fixer/property-order.js';
import fixStatementOrder from './fixer/statement-order.js';
import fixDescriptions from './fixer/descriptions.js';
import fixFlags from './fixer/flags.js';
import fixLinks from './fixer/links.js';
import fixMDNURLs from './fixer/mdn-urls.js';
import fixStatus from './fixer/status.js';
import fixMirror from './fixer/mirror.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Recursively load one or more files and/or directories passed as arguments and perform automatic fixes.
 * @param files The files to load and perform fix upon
 */
const load = async (...files: string[]): Promise<void> => {
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

    if (fsStats.isFile()) {
      if (path.extname(file) === '.json' && !file.endsWith('.schema.json')) {
        if (!file.includes('/browsers/')) {
          fixBrowserOrder(file);
          fixFeatureOrder(file);
          fixStatementOrder(file);
          fixDescriptions(file);
          fixFlags(file);
          fixLinks(file);
          fixMDNURLs(file);
          fixStatus(file);
          fixMirror(file);
        }
        fixPropertyOrder(file);
      }
    } else {
      const subFiles = (await fs.readdir(file)).map((subfile) =>
        path.join(file, subfile),
      );

      await load(...subFiles);
    }
  }
};

/**
 * Fix any errors in specified file(s) and/or folder(s), or all of BCD
 * @param files The file(s) and/or folder(s) to fix. Leave undefined for everything.
 */
const main = async (files: string[]) => {
  load(...files);
};

if (esMain(import.meta)) {
  const { argv } = yargs(hideBin(process.argv)).command(
    '$0 [files..]',
    false,
    (yargs) =>
      yargs.positional('files...', {
        description: 'The files to fix (leave blank to test everything)',
        type: 'string',
      }),
  );

  const {
    files = [
      'api',
      'browsers',
      'css',
      'html',
      'http',
      'svg',
      'javascript',
      'mathml',
      'webassembly',
      'webdriver',
      'webextensions',
    ],
  } = argv as any;

  await main(files);
}

export default load;
