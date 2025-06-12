/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { Stats } from 'node:fs';
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
import { IS_WINDOWS, LintOptions } from './utils.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

const FIXES: Record<
  string,
  (filename: string, actual: string) => Promise<string> | string
> = Object.freeze({
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
 * @param options The lint options
 * @param files The files to load and perform fix upon
 */
const load = async (
  options: LintOptions,
  ...files: string[]
): Promise<void> => {
  const fixes = Object.entries(FIXES)
    .filter(([key]) => !options.only || options.only.includes(key))
    .map(([, fix]) => fix);

  for (let file of files) {
    if (file.indexOf(dirname) !== 0) {
      file = path.resolve(dirname, '..', file);
    }

    let fsStats: Stats;

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
 * @param files The file(s) and/or folder(s) to fix. Leave undefined for everything.
 * @param options Lint options
 * @returns Promise<void>
 */
const main = async (files: string[], options: LintOptions) => {
  await load(options, ...files);
};

if (esMain(import.meta)) {
  const { argv } = yargs(hideBin(process.argv))
    .command('$0 [files..]', false, (yargs) =>
      yargs.positional('files...', {
        description: 'The files to fix (leave blank to test everything)',
        type: 'string',
      }),
    )
    .option('only', {
      array: true,
      description: 'The checks to run',
    })
    .choices('only', Object.keys(FIXES));

  const { files = dataFolders, only } = argv as {
    files?: string[];
  } & LintOptions;

  await main(files, { only });
}

export default load;
