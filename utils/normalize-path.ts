/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import path from 'node:path';

/**
 *
 * @param {string} p
 * @param {any} testPath
 * @returns {string}
 */
export const normalizePathInternal = (
  p: string,
  testPath: any = path,
): string => {
  if (testPath.sep === '/') {
    return p;
  }
  return p.replace(/\\/gi, '/');
};

/**
 *
 * @param {string} p
 * @returns {string}
 */
export default (p: string): string => normalizePathInternal(p, path);
