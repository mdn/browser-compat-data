/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {InternalCompatData} from './types/index.js' */

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
 * @template {keyof InternalCompatData} Dir
 * @param {...Dir} dirs The directories to load
 * @returns {Promise<Pick<InternalCompatData, Dir>>} All of the browser compatibility data
 */
const load = async (...dirs) => {
  /** @type {Partial<Pick<InternalCompatData, Dir>>} */
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
        /** @type {InternalCompatData} */
        const contents = JSON.parse(rawcontents.toString('utf8'));

        // Add source_file props
        const walker = walk(undefined, contents);
        for (const { compat } of walker) {
          // @ts-expect-error Need to better reflect transition from internal to public data.
          compat.source_file = normalizePath(path.relative(dirname, fp));
        }

        extend(result, contents);
        /* c8 ignore start */
      } catch {
        // Skip invalid JSON. Tests will flag the problem separately.
        continue;
      }
      /* c8 ignore stop */
    }
  }

  return /** @type {Pick<InternalCompatData, Dir>} */ (result);
};

/** @type {InternalCompatData} */
const bcd = await load(...dataFolders);

export default bcd;
