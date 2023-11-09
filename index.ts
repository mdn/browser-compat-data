/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fdir } from 'fdir';

import { CompatData } from './types/types.js';
import extend from './scripts/lib/extend.js';
import { normalizePath, walk } from './utils/index.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Recursively load one or more directories passed as arguments.
 * @param {string[]} dirs The directories to load
 * @returns {object} All of the browser compatibility data
 */
const load = async (...dirs: string[]) => {
  const result = {};

  for (const dir of dirs) {
    const paths = new fdir()
      .withBasePath()
      .filter((fp) => fp.endsWith('.json'))
      .crawl(path.join(dirname, dir))
      .sync() as string[];

    for (const fp of paths) {
      try {
        const rawcontents = await fs.readFile(fp);
        const contents: CompatData = JSON.parse(rawcontents.toString('utf8'));

        // Add source_file props
        const walker = walk(undefined, contents);
        for (const { compat } of walker) {
          compat.source_file = normalizePath(path.relative(dirname, fp));
        }

        extend(result, contents);
      } catch (e) {
        // Skip invalid JSON. Tests will flag the problem separately.
        continue;
      }
    }
  }

  return result;
};

export default (await load(
  'api',
  'browsers',
  'css',
  'html',
  'http',
  'javascript',
  'mathml',
  'svg',
  'webassembly',
  'webdriver',
  'webextensions',
)) as CompatData;
