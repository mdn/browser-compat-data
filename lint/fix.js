/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk-template';

import dataFolders from '../scripts/lib/data-folders.js';

import fixBrowserOrder from './fixer/browser-order.js';
import fixCommonErrors from './fixer/common-errors.js';
import fixFeatureOrder from './fixer/feature-order.js';
import fixPropertyOrder from './fixer/property-order.js';
import fixStatementOrder from './fixer/statement-order.js';
import fixDescriptions from './fixer/descriptions.js';
import fixFlags from './fixer/flags.js';
import fixLinks from './fixer/links.js';
import fixMDNURLs from './fixer/mdn-urls.js';
import fixStatus from './fixer/status.js';
import fixMirror from './fixer/mirror.js';
import fixOverlap from './fixer/overlap.js';
import { IS_WINDOWS } from './utils.js';

/** @import {Stats} from 'node:fs' */
/** @import {LintOptions} from './utils.js' */

const dirname = fileURLToPath(new URL('.', import.meta.url));

/** @type {Readonly<Record<string, function(string, string): Promise<string> | string>>} */
const FIXES = Object.freeze({
  descriptions: fixDescriptions,
  common_errors: fixCommonErrors,
  flags: fixFlags,
  links: fixLinks,
  mdn_urls: fixMDNURLs,
  status: fixStatus,
  mirror: fixMirror,
  overlap: fixOverlap,
  browser_order: fixBrowserOrder,
  feature_order: fixFeatureOrder,
  property_order: fixPropertyOrder,
  statement_order: fixStatementOrder,
});

/**
 * Recursively load one or more files and/or directories passed as arguments and perform automatic fixes.
 * @param {LintOptions} options The lint options
 * @param {...string} files The files to load and perform fix upon
 * @returns {Promise<void>}
 */
const load = async (options, ...files) => {
  const fixes = Object.entries(FIXES)
    .filter(([key]) => !options.only || options.only.includes(key))
    .map(([, fix]) => fix);

  for (let file of files) {
    if (file.indexOf(dirname) !== 0) {
      file = path.resolve(dirname, '..', file);
    }

    /** @type {Stats} */
    let fsStats;

    try {
      fsStats = await stat(file);
    } catch (e) {
      console.warn(chalk`{yellow File {bold ${file}} doesn't exist!}`);
      continue;
    }

    if (fsStats.isFile()) {
      if (path.extname(file) === '.json' && !file.endsWith('.schema.json')) {
        let initial = (await readFile(file, 'utf-8')).trim();
        let expected = initial;

        for (const fix of fixes) {
          expected = await fix(file, expected);
        }

        if (IS_WINDOWS) {
          // prevent false positives from git.core.autocrlf on Windows
          initial = initial.replace(/\r/g, '');
          expected = expected.replace(/\r/g, '');
        }

        if (initial !== expected) {
          await writeFile(file, expected + '\n', 'utf-8');
        }
      }
    } else {
      const subFiles = (await readdir(file)).map((subfile) =>
        path.join(file, subfile),
      );

      await load(options, ...subFiles);
    }
  }
};

/**
 * Fix any errors in specified file(s) and/or folder(s), or all of BCD
 * @param {string[]} files The file(s) and/or folder(s) to fix. Leave undefined for everything.
 * @param {LintOptions} options Lint options
 * @returns {Promise<void>}
 */
const main = async (files, options) => {
  await load(options, ...files);
};

if (esMain(import.meta)) {
  const argv = yargs(hideBin(process.argv))
    .command('$0 [files..]', false)
    .positional('files', {
      array: true,
      description: 'The files to fix (leave blank to test everything)',
      type: 'string',
    })
    .option('only', {
      array: true,
      description: 'The checks to run',
      choices: Object.keys(FIXES),
    })
    .parseSync();

  const { files = dataFolders, only } = argv;

  await main(files, { only });
}

export default load;
