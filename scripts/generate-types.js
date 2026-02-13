/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import esMain from 'es-main';

import compileInternal from './generate-internal-types.js';
import compilePublic from './generate-public-types.js';

/* c8 ignore start */

if (esMain(import.meta)) {
  await Promise.all([compileInternal(), compilePublic()]);
}

/* c8 ignore stop */
