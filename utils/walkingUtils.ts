/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Identifier, BrowserStatement } from '../types/types.js';

/**
 *
 * @param {(string|undefined)[]} args
 * @returns {string}
 */
export const joinPath = (...args: (string | undefined)[]): string =>
  Array.from(args).filter(Boolean).join('.');

/**
 *
 * @param {any} obj
 * @returns {boolean}
 */
export const isFeature = (obj): obj is Identifier => '__compat' in obj;

/**
 *
 * @param {any} obj
 * @returns {boolean}
 */
export const isBrowser = (obj): obj is BrowserStatement =>
  'name' in obj && 'releases' in obj;

/**
 *
 * @param {any} data
 * @returns {string[]}
 */
export const descendantKeys = (data) => {
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
};
