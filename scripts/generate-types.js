/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { rm } from 'node:fs/promises';

import esMain from 'es-main';

import compileInternal from './generate-internal-types.js';
import compilePublic from './generate-public-types.js';

/* c8 ignore start */

/**
 * Cleans up old types.
 */
const cleanupObsolete = async () => {
  const path = new URL('../types/types.d.ts', import.meta.url);
  try {
    await rm(path);
  } catch {
    // Ignore.
  }
};

if (esMain(import.meta)) {
  await Promise.all([compileInternal(), compilePublic(), cleanupObsolete()]);
}

/* c8 ignore stop */
