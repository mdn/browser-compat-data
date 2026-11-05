/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { styleText } from 'node:util';

import stringify from 'fast-json-stable-stringify';
import { compareVersions } from 'compare-versions';

import bcd from '../../index.js';
const { browsers } = bcd;
import { isMirrorEquivalent, isMirrorRequired } from '../fixer/mirror.js';
import {
  getFirstBlinkRelease,
  isImplicitLegacyMirror,
  LEGACY_SPLIT_BROWSERS,
  mirrorLegacyStatements,
} from '../../scripts/build/mirror.js';

/** @import {Linter, LinterData} from '../types.js' */
/** @import {Logger} from '../utils.js' */
/** @import {BrowserName, InternalCompatStatement} from '../../types/index.js' */
/** @import {InternalSupportBlock} from '../../types/index.js' */

/**
 * Check the data to ensure all statements that should use `mirror` do
 * @param {InternalSupportBlock} supportData The data to test
 * @param {string} category The category the data
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
const checkMirroring = (supportData, category, logger) => {
  const browsersToCheck = /** @type {BrowserName[]} */ (
    Object.keys(browsers)
      .filter((b) =>
        category === 'webextensions' ? browsers[b].accepts_webextensions : !!b,
      )
      .filter((b) => browsers[b].upstream)
  );

  for (const browser of browsersToCheck) {
    if (
      isMirrorRequired(supportData, browser) &&
      isMirrorEquivalent(supportData, browser)
    ) {
      logger.error(
        `Data for ${styleText('bold', browser)} can be automatically mirrored, use ${styleText('bold', `"${browser}": "mirror"`)} instead`,
        { fixable: true },
      );
    }
  }
};

/**
 * Report `mirror: true` statements that are already the default
 * @param {InternalSupportBlock} supportData The data to test
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
const checkRedundantMirror = (supportData, logger) => {
  for (const browser of Object.keys(supportData)) {
    const hasTrue = [supportData[browser]]
      .flat()
      .some((s) => typeof s === 'object' && s.mirror === true);
    if (
      hasTrue &&
      isImplicitLegacyMirror(/** @type {BrowserName} */ (browser), supportData)
    ) {
      logger.error(
        `${styleText('bold', browser)} statements marked \`"mirror": true\` are mirrored by default, remove the flag`,
        { fixable: true },
      );
    }
  }
};

/**
 * Validate the internal `mirror` flag by running the same resolution as the build
 * @param {InternalSupportBlock} supportData The data to test
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
const checkMirrorFlag = (supportData, logger) => {
  for (const browser of Object.keys(supportData)) {
    const statements = [supportData[browser]].flat();
    if (!statements.some((s) => typeof s === 'object' && 'mirror' in s)) {
      continue;
    }
    if (!LEGACY_SPLIT_BROWSERS.includes(browser)) {
      logger.error(
        `${styleText('bold', browser)} does not support the \`mirror\` flag`,
      );
      continue;
    }
    try {
      mirrorLegacyStatements(/** @type {BrowserName} */ (browser), supportData);
    } catch (error) {
      logger.error(
        `${styleText('bold', browser)}: ${/** @type {Error} */ (error).message}`,
      );
    }
  }
};

/**
 * Warn when authored Edge data past the Chromium switch differs from the mirrored data
 * @param {InternalSupportBlock} supportData The data to test
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
const checkLegacyRemoval = (supportData, logger) => {
  if (!isImplicitLegacyMirror('edge', supportData)) {
    return;
  }
  const switchVersion = /** @type {string} */ (getFirstBlinkRelease('edge'));
  const authored = [supportData.edge].flat();
  const hasLaterRemoval = authored.some(
    (statement) =>
      typeof statement === 'object' &&
      statement.version_removed &&
      compareVersions(
        statement.version_removed.replace('≤', ''),
        switchVersion,
      ) > 0,
  );
  if (!hasLaterRemoval) {
    return;
  }
  const resolved = [mirrorLegacyStatements('edge', supportData)].flat();
  const resolvedKeys = resolved.map((statement) => stringify(statement)).sort();
  const authoredKeys = authored.map((statement) => stringify(statement)).sort();
  if (JSON.stringify(resolvedKeys) !== JSON.stringify(authoredKeys)) {
    logger.warning(
      `${styleText('bold', 'edge')} data after ${switchVersion} differs from the mirrored Chromium data`,
    );
  }
};

/** @type {Linter} */
export default {
  name: 'Mirroring',
  description: 'Test statements for pre-mirroring',
  scope: 'feature',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data, path: { category } }) => {
    const support = /** @type {InternalCompatStatement} */ (data).support;
    checkMirroring(support, category, logger);
    checkRedundantMirror(support, logger);
    checkMirrorFlag(support, logger);
    checkLegacyRemoval(support, logger);
  },
};
