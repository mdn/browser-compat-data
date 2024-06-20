/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs/promises';
import { Stats } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import esMain from 'es-main';
import chalk from 'chalk-template';

import fixBrowserOrder from './fixer/browser-order.js';
import fixFeatureOrder from './fixer/feature-order.js';
import fixPropertyOrder from './fixer/property-order.js';
import fixStatementOrder from './fixer/statement-order.js';
import fixDescriptions from './fixer/descriptions.js';
import fixFlags from './fixer/flags.js';
import fixLinks from './fixer/links.js';
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

if (esMain(import.meta)) {
  if (process.argv[2]) {
    await load(process.argv[2]);
  } else {
    await load(
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
    );
  }
}

export default load;
