/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import path from 'node:path';

export function normalizePathInternal(p: string, testPath: any = path): string {
  if (testPath.sep === '/') return p;
  return p.replace(/\\/gi, '/');
}

export default function normalizePath(p: string): string {
  return normalizePathInternal(p, path);
}
