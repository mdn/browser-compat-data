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
import { LintOptions } from './utils.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

const FIXES = Object.freeze({
  browser_order: fixBrowserOrder,
  feature_order: fixFeatureOrder,
  property_order: fixPropertyOrder,
  statement_order: fixStatementOrder,
  descriptions: fixDescriptions,
  flags: fixFlags,
  links: fixLinks,
  mdn_urls: fixMDNURLs,
  status: fixStatus,
  mirror: fixMirror,
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
      fsStats = await fs.stat(file);
    } catch (e) {
      console.warn(chalk`{yellow File {bold ${file}} doesn't exist!}`);
      continue;
    }

    if (fsStats.isFile()) {
      if (path.extname(file) === '.json' && !file.endsWith('.schema.json')) {
        for (const fix of fixes) {
          await fix(file);
        }
      }
    } else {
      const subFiles = (await fs.readdir(file)).map((subfile) =>
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
  load(options, ...files);
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
    only,
  } = argv as { files?: string[] } & LintOptions;

  await main(files, { only });
}

export default load;
