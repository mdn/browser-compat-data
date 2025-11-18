/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import stringify from 'fast-json-stable-stringify';

import { CompatData, BrowserName } from '../../types/types.js';
import {
  InternalSupportStatement,
  InternalSupportBlock,
} from '../../types/index.js';
import bcd from '../../index.js';
import { walk } from '../../utils/index.js';
import mirrorSupport from '../../scripts/build/mirror.js';

const downstreamBrowsers = (
  Object.keys(bcd.browsers) as (keyof typeof bcd.browsers)[]
).filter((browser) => bcd.browsers[browser].upstream);

/**
 * Check to see if the statement is equal to the mirrored statement
 * @param support The support statement to test
 * @param browser The browser to mirror for
 * @returns Whether the support statement is equal to mirroring
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
  return stringify(mirrored) === stringify(original);
};

/**
 * Check to see if mirroring is required
 * @param supportData The support statement to test
 * @param browser The browser to mirror for
 * @returns Whether mirroring is required
 */
export const isMirrorRequired = (
  supportData: Partial<Record<BrowserName, any>>,
  browser: string,
): boolean => {
  const current = bcd.browsers[browser];
  const upstream: BrowserName | undefined = current.upstream;

  if (!upstream || !supportData[browser] || !supportData[upstream]) {
    return false;
  }

  if (
    supportData[browser].version_added === false &&
    supportData[upstream].version_added === 'preview' &&
    !current.preview_name
  ) {
    // Allow `"version_added": false` if
    // - upstream only has preview support, and
    // - target does not have preview versions.
    return false;
  }

  return true;
};

/**
 * Set the support statement for each browser to mirror if it matches mirroring
 * @param bcd The compat data to update
 */
export const mirrorIfEquivalent = (bcd: CompatData): void => {
  for (const { compat } of walk(undefined, bcd)) {
    for (const browser of downstreamBrowsers) {
      if (
        isMirrorRequired(compat.support, browser) &&
        isMirrorEquivalent(compat.support, browser)
      ) {
        (compat.support[browser] as InternalSupportStatement) = 'mirror';
      }
    }
  }
};

/**
 * Update compat data to 'mirror' if the statement matches mirroring
 * @param filename The name of the file to fix
 * @param actual The current content of the file
 * @returns expected content of the file
 */
const fixMirror = (filename: string, actual: string): string => {
  if (filename.includes('/browsers/')) {
    return actual;
  }

  const bcd = JSON.parse(actual);
  mirrorIfEquivalent(bcd);

  return JSON.stringify(bcd, null, 2);
};

export default fixMirror;
