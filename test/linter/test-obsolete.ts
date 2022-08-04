/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Linter, Logger, LinterMessageLevel } from '../utils.js';
import {
  BrowserName,
  CompatStatement,
  SupportBlock,
  SupportStatement,
} from '../../types/types.js';

import chalk from 'chalk-template';
import bcd from '../../index.js';
const { browsers } = bcd;

/**
 * @param {SupportBlock} support
 * @returns boolean
 */
export function neverImplemented(support: SupportBlock): boolean {
  for (const s in support) {
    let data = support[s];
    if (!Array.isArray(data)) {
      data = [data];
    }
    for (const d of data) {
      if (d.version_added) {
        return false;
      }
    }
  }
  return true;
}

const errorTime = new Date(),
  warningTime = new Date();
errorTime.setFullYear(errorTime.getFullYear() - 2.5);
warningTime.setFullYear(warningTime.getFullYear() - 2);

/**
 * @param {SupportBlock} support
 * @returns LinterMessageLevel | false
 */
export function implementedAndRemoved(
  support: SupportBlock,
): LinterMessageLevel | false {
  let result: LinterMessageLevel = 'error';
  for (const [browser, data] of Object.entries(support) as [
    BrowserName,
    SupportStatement,
  ][]) {
    for (const d of Array.isArray(data) ? data : [data]) {
      // Feature is still supported or it is not known when feature was dropped
      if (!d.version_removed || typeof d.version_removed === 'boolean') {
        return false;
      }

      const releaseDateData =
        browsers[browser].releases[d.version_removed].release_date;

      // No browser release date
      if (!releaseDateData) {
        return false;
      }

      const releaseDate = new Date(releaseDateData);
      // Feature was recently supported, no need to show warning
      if (warningTime < releaseDate) {
        return false;
      }
      // Feature was supported sufficiently recently to not show an error
      if (errorTime < releaseDate) {
        result = 'warning';
      }
    }
  }
  return result;
}

/**
 * @param {Logger} logger
 * @param {CompatStatement} data The data to test
 */
export function processData(logger: Logger, data: CompatStatement): void {
  if (data && data.support) {
    const { support, status } = data;

    const abandoned = status && status.standard_track === false;
    const rule1Fail = abandoned && neverImplemented(support);
    if (rule1Fail) {
      logger.error(
        chalk`feature was never implemented in any browser and the specification has been abandoned.`,
      );
      return;
    }

    // Note: This check is time-based
    const rule2Fail = implementedAndRemoved(support);
    if (rule2Fail) {
      logger[rule2Fail](
        chalk`feature was implemented and has since been removed from all browsers dating back two or more years ago.`,
      );
    }
  }
}

export default {
  name: 'Obsolete',
  description: 'Test for obsolete data in each support statement',
  scope: 'feature',
  /**
   *
   * @param logger
   * @param root0
   * @param root0.data
   */
  check(logger: Logger, { data }: { data: CompatStatement }) {
    processData(logger, data);
  },
  exceptions: [
    'css.types.length.lh',
    'css.types.length.rlh',
    'http.headers.Cache-Control.stale-if-error',
    'http.headers.Feature-Policy.layout-animations',
    'http.headers.Feature-Policy.legacy-image-formats',
    'http.headers.Feature-Policy.oversized-images',
    'http.headers.Feature-Policy.unoptimized-images',
    'http.headers.Feature-Policy.unsized-media',
    'svg.elements.view.zoomAndPan',
  ],
} as Linter;
