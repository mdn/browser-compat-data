/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Identifier, BrowserStatement } from '../types/types.js';

export function joinPath(...args: (string | undefined)[]): string {
  return Array.from(args).filter(Boolean).join('.');
}

export function isFeature(obj): obj is Identifier {
  return '__compat' in obj;
}

export function isBrowser(obj): obj is BrowserStatement {
  return 'name' in obj && 'releases' in obj;
}

export function descendantKeys(data) {
  if (!data || typeof data !== 'object') {
    // Return if the data isn't an object
    return [];
  }

  if (isFeature(data)) {
    return Object.keys(data).filter((key) => !key.startsWith('__'));
  }

  if (isBrowser(data)) {
    // Browsers never have independently meaningful descendants
    return [];
  }

  return Object.keys(data).filter((key) => key !== '__meta');
}
