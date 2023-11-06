/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import esMain from 'es-main';

import {
  CompatData,
  BrowserName,
  Identifier,
  ReleaseStatement,
  SimpleSupportStatement,
} from '../../types/types.js';
import { walk } from '../../utils/index.js';
import bcd from '../../index.js';
const { browsers } = bcd;

const dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Fix the experimental status throughout compatibility data
 * @param {CompatData} bcd Parsed BCD object to be updated in place.
 */
export const fixExperimental = (bcd: CompatData | Identifier): void => {
  for (const { compat } of walk(undefined, bcd)) {
    if (!compat.status?.experimental) {
      continue;
    }

    // This entry is marked as experimental. Check which browsers support it.

    const browserSupport = new Set<BrowserName>();

    for (const [browser, support] of Object.entries(compat.support)) {
      if (!support) {
        continue;
      }

      // Consider only the first part of an array statement.
      const statement: SimpleSupportStatement = Array.isArray(support)
        ? support[0]
        : support;

      // Ignore anything behind flag, prefix or alternative name
      if (statement.flags || statement.prefix || statement.alternative_name) {
        continue;
      }
      if (statement.version_added && !statement.version_removed) {
        browserSupport.add(browser as BrowserName);
      }
    }

    // Now check which of Blink, Gecko and WebKit support it.

    const engineSupport = new Set();

    for (const browser of browserSupport) {
      const currentRelease = Object.values(browsers[browser].releases).find(
        (r: ReleaseStatement) => r.status === 'current',
      );
      if (!currentRelease) {
        continue;
      }
      const engine = currentRelease.engine;
      engineSupport.add(engine);
    }

    let engineCount = 0;
    for (const engine of ['Blink', 'Gecko', 'WebKit']) {
      if (engineSupport.has(engine)) {
        engineCount++;
      }
    }

    if (engineCount > 1) {
      compat.status.experimental = false;
    }
  }
};

/**
 * Fix the experimental status throughout a file
 * @param {string} filename Filename of BCD to be updated in place.
 */
const fixExperimentalFile = (filename: string): void => {
  const actual = fs.readFileSync(filename, 'utf-8').trim();
  const bcd = JSON.parse(actual);
  fixExperimental(bcd);
  const expected = JSON.stringify(bcd, null, 2);

  if (actual !== expected) {
    fs.writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

/**
 * Load files and fix experimental status
 * @param {string[]} files The files to fix
 */
const load = (...files: string[]): void => {
  for (let file of files) {
    if (file.indexOf(dirname) !== 0) {
      file = path.resolve(dirname, '..', '..', file);
    }

    if (!fs.existsSync(file)) {
      continue; // Ignore non-existent files
    }

    if (fs.statSync(file).isFile()) {
      if (path.extname(file) === '.json') {
        fixExperimentalFile(file);
      }

      continue;
    }

    const subFiles = fs
      .readdirSync(file)
      .map((subfile) => path.join(file, subfile));

    load(...subFiles);
  }
};

if (esMain(import.meta)) {
  if (process.argv[2]) {
    load(process.argv[2]);
  } else {
    load(
      'api',
      'css',
      'html',
      'http',
      'svg',
      'javascript',
      'mathml',
      'test',
      'webassembly',
      'webdriver',
      'webextensions',
    );
  }
}
