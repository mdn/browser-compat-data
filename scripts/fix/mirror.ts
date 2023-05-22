/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';

import stringify from 'fast-json-stable-stringify';

import { CompatData, BrowserName } from '../../types/types.js';
import {
  InternalSupportStatement,
  InternalSupportBlock,
} from '../../types/index.js';
import bcd from '../../index.js';
import { walk } from '../../utils/index.js';
import mirrorSupport from '../release/mirror.js';

const downstreamBrowsers = (
  Object.keys(bcd.browsers) as (keyof typeof bcd.browsers)[]
).filter((browser) => bcd.browsers[browser].upstream);

/**
 * Check to see if the statement is equal to the mirrored statement
 * @param {InternalSupportBlock} support The support statement to test
 * @param {BrowserName} browser The browser to mirror for
 * @returns {boolean} Whether the support statement is equal to mirroring
 */
export const isMirrorEquivalent = (
  support: InternalSupportBlock,
  browser: BrowserName,
): boolean => {
  const original = support[browser];
  if (!original) {
    return false; // No data for browser.
  }
  if (original === 'mirror') {
    return false; // Already mirrored.
  }
  let mirrored;
  try {
    mirrored = mirrorSupport(browser, support);
  } catch (e) {
    // This can happen with missing engine_version. Don't mirror anything.
    return false;
  }
  if (stringify(mirrored) !== stringify(original)) {
    return false;
  }
  return true;
};

/**
 * Set the support statement for each browser to mirror if it matches mirroring
 * @param {CompatData} bcd The compat data to update
 */
export const mirrorIfEquivalent = (bcd: CompatData): void => {
  for (const { compat } of walk(undefined, bcd)) {
    for (const browser of downstreamBrowsers) {
      if (isMirrorEquivalent(compat.support, browser)) {
        (compat.support[browser] as InternalSupportStatement) = 'mirror';
      }
    }
  }
};

/**
 * Update compat data to 'mirror' if the statement matches mirroring
 * @param {string} filename The name of the file to fix
 */
const fixMirror = (filename: string): void => {
  const actual = fs.readFileSync(filename, 'utf-8').trim();
  const bcd = JSON.parse(actual);
  mirrorIfEquivalent(bcd);
  const expected = JSON.stringify(bcd, null, 2);

  if (actual !== expected) {
    fs.writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

export default fixMirror;
