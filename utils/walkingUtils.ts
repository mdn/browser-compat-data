/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import {
  CompatData,
  CompatStatement,
  BrowserName,
  Identifier,
  BrowserStatement,
  SimpleSupportStatement,
} from '../types/types.js';

export type DataType =
  | CompatData
  | BrowserStatement
  | CompatStatement
  | Identifier;

export function joinPath() {
  return Array.from(arguments).filter(Boolean).join('.');
}

export function isFeature(obj: any): obj is Identifier {
  return '__compat' in obj;
}

export function isBrowser(obj: any): obj is BrowserStatement {
  return 'name' in obj && 'releases' in obj;
}

export function descendantKeys(data) {
  if (typeof data !== 'object') {
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
