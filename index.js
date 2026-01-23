/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {CompatData} from './types/types.js' */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fdir } from 'fdir';

import extend from './scripts/lib/extend.js';
import dataFolders from './scripts/lib/data-folders.js';
import { normalizePath, walk } from './utils/index.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Recursively load one or more directories passed as arguments.
 * @param {...string} dirs The directories to load
 * @returns {Promise<CompatData>} All of the browser compatibility data
 */
const load = async (...dirs) => {
  const result = {};

  for (const dir of dirs) {
    const paths = /** @type {string[]} */ (
      new fdir()
        .withBasePath()
        .filter((fp) => fp.endsWith('.json'))
        .crawl(path.join(dirname, dir))
        .sync()
    );

    for (const fp of paths) {
      try {
        const rawcontents = await fs.readFile(fp);
        /** @type {CompatData} */
        const contents = JSON.parse(rawcontents.toString('utf8'));

        // Add source_file props
        const walker = walk(undefined, contents);
        for (const { compat } of walker) {
          compat.source_file = normalizePath(path.relative(dirname, fp));
        }

        extend(result, contents);
        /* c8 ignore start */
      } catch (e) {
        // Skip invalid JSON. Tests will flag the problem separately.
        continue;
      }
      /* c8 ignore stop */
    }
  }

  return /** @type {CompatData} */ (result);
};

export default await load(...dataFolders);
