/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import path from 'node:path';

/**
 *
 * @param p
 * @param testPath
 */
export function normalizePathInternal(p: string, testPath: any = path): string {
  if (testPath.sep === '/') {
    return p;
  }
  return p.replace(/\\/gi, '/');
}

/**
 *
 * @param p
 */
export default function normalizePath(p: string): string {
  return normalizePathInternal(p, path);
}
