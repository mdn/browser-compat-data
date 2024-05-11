/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Identifier, BrowserStatement } from '../types/types.js';

/**
 * Join a path array together
 * @param args The path to join together
 * @returns The combined path
 */
export const joinPath = (...args: (string | undefined)[]): string =>
  Array.from(args).filter(Boolean).join('.');

/**
 * Check if an object is a BCD feature
 * @param obj The object to check
 * @returns Whether the object is a BCD feature
 */
export const isFeature = (obj): obj is Identifier => '__compat' in obj;

/**
 * Check if an object is a browser statement
 * @param obj The object to check
 * @returns Whether the object is a browser statement
 */
export const isBrowser = (obj): obj is BrowserStatement =>
  'name' in obj && 'releases' in obj;

/**
 * Get the descendant keys of an object, minus any features that start with two underscores
 * @param data The object to iterate
 * @returns The descendant keys
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
