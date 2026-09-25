/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import esMain from 'es-main';

import walk from '../utils/walk.js';

/** @import {InternalDataType} from '../types/index.js' */

/**
 * Compare map entries by key using locale-independent alphabetical order.
 * @template T
 * @param {[string, T]} a First entry
 * @param {[string, T]} b Second entry
 * @returns {number} Sort order
 */
const compareKeys = ([a], [b]) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * List explicit flag occurrences by type, browser, and name, alphabetically.
 * Each flags entry counts once, regardless of value or support version.
 * @param {InternalDataType} [data] Source compatibility data
 * @returns {string} The indented flag inventory
 */
const flagInventory = (data) => {
  /** @type {Map<string, Map<string, Map<string, number>>>} */
  const inventory = new Map();

  for (const { compat } of walk(undefined, data)) {
    for (const [browser, support] of Object.entries(compat.support)) {
      if (support === 'mirror') {
        continue;
      }
      for (const statement of Array.isArray(support) ? support : [support]) {
        for (const { type, name } of statement.flags ?? []) {
          const browsers = inventory.get(type) ?? new Map();
          inventory.set(type, browsers);
          const flags = browsers.get(browser) ?? new Map();
          browsers.set(browser, flags);
          flags.set(name, (flags.get(name) ?? 0) + 1);
        }
      }
    }
  }

  const lines = [];
  for (const [type, browsers] of [...inventory].sort(compareKeys)) {
    lines.push(type);
    for (const [browser, flags] of [...browsers].sort(compareKeys)) {
      lines.push(`  ${browser}`);
      for (const [name, count] of [...flags].sort(compareKeys)) {
        lines.push(`    ${name}: ${count}`);
      }
    }
  }
  return lines.join('\n');
};

if (esMain(import.meta)) {
  const output = flagInventory();
  if (output) {
    console.log(output);
  }
}

export default flagInventory;
