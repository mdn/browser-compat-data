/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fdir } from 'fdir';

import extend from './scripts/lib/extend';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Recursively load one or more directories passed as arguments.
 *
 * @param {string[]} dirs The directories to load
 * @returns {object} All of the browser compatibility data
 */
async function load(...dirs: string[]) {
  let result = {};

  for (const dir of dirs) {
    const paths = new fdir()
      .withBasePath()
      .filter((fp) => fp.endsWith('.json'))
      .crawl(path.join(dirname, dir))
      .sync() as string[];

    for (const fp of paths) {
      try {
        const contents = await fs.readFile(fp);
        extend(result, JSON.parse(contents.toString('utf8')));
      } catch (e) {
        // Skip invalid JSON. Tests will flag the problem separately.
        continue;
      }
    }
  }

  return result;
}

export default await load(
  'api',
  'browsers',
  'css',
  'html',
  'http',
  'javascript',
  'mathml',
  'svg',
  'webdriver',
  'webextensions',
);
