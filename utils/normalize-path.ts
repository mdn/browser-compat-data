/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import path from 'node:path';

/**
 * Normalize a file path for cross-platform compatibility
 * @param p The file path
 * @param testPath The path handler
 * @returns The normalized path
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
 * Normalize a file path for cross-platform compatibility
 * @param p The file path
 * @returns The normalized path
 */
export default (p: string): string => normalizePathInternal(p, path);
