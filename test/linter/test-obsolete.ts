/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Linter, Logger, LinterMessageLevel } from '../utils.js';
import {
  BrowserName,
  BrowserStatement,
  CompatStatement,
  SupportStatement,
  SimpleSupportStatement,
} from '../../types/types.js';

import chalk from 'chalk-template';
import bcd from '../../index.js';
const { browsers } = bcd;

/**
 * List of feature keys which are expected to fail this test.
 * This list is needed for two reasons:
 *  - some entries indeed should be removed (like api.VR*)
 *  - some entries are currently just stubs and should be expanded and will pass test later
 */
const exceptions = [
  'api.VRDisplay.hardwareUnitId',
  'api.VREyeParameters.recommendedFieldOfView',
  'api.VREyeParameters.renderRect',
  'api.VRFieldOfView.VRFieldOfView',
  'api.VRPose.hasOrientation',
  'api.VRPose.hasPosition',
  'css.types.length.lh',
  'css.types.length.rlh',
  'http.headers.Cache-Control.stale-if-error',
  'http.headers.Feature-Policy.layout-animations',
  'http.headers.Feature-Policy.legacy-image-formats',
  'http.headers.Feature-Policy.oversized-images',
  'http.headers.Feature-Policy.unoptimized-images',
  'http.headers.Feature-Policy.unsized-media',
  'svg.attributes.presentation.color-rendering',
  'svg.elements.view.zoomAndPan',
];

export function neverImplemented(support: SimpleSupportStatement) {
  for (const data of Object.values(support)) {
    for (const d of Array.isArray(data) ? data : [data])
      if (d.version_added) return false;
  }
  return true;
}

const errorTime = new Date(),
  warningTime = new Date();
errorTime.setFullYear(errorTime.getFullYear() - 2.5);
warningTime.setFullYear(warningTime.getFullYear() - 2);

/**
 * @param {SimpleSupportStatement} support
 * @returns LinterMessageLevel | false
 */
function implementedAndRemoved(
  support: SimpleSupportStatement,
): LinterMessageLevel | false {
  let result: LinterMessageLevel = 'error';
  for (const [browser, data] of Object.entries(support) as [BrowserName, any]) {
    for (const d of Array.isArray(data) ? data : [data]) {
      // Feature is still supported
      if (!d.version_removed) return false;
      const releaseDate = new Date(
        (browsers[browser as BrowserName] as any).releases[
          d.version_removed
        ].release_date,
      );
      // Feature was recently supported, no need to show warning
      if (warningTime < releaseDate) return false;
      // Feature was supported sufficiently recently to not show an error
      if (errorTime < releaseDate) result = 'warning';
    }
  }
  return result;
}

/**
 * @param {Logger} logger
 * @param {CompatStatement} data The data to test
 * @param {string} path
 * @returns {void}
 */
function processData(
  logger: Logger,
  data: CompatStatement,
  path: string,
): void {
  if (data && data.support) {
    const { support, status } = data;
    const shouldFail = exceptions.includes(path);

    for (const statement of Array.isArray(support) ? support : [support]) {
      const abandoned = status && status.standard_track === false;
      const rule1Fail = abandoned && neverImplemented(statement);
      if (rule1Fail && !shouldFail) {
        logger.error(
          chalk`feature was never implemented in any browser and the specification has been abandoned.`,
        );
        return;
      }

      const rule2Fail = implementedAndRemoved(statement);
      if (rule2Fail && !shouldFail) {
        logger[rule2Fail](
          chalk`feature was implemented and has since been removed from all browsers dating back two or more years ago.`,
        );
        return;
      }

      if (!rule1Fail && !rule2Fail && shouldFail) {
        logger.error(
          chalk`Please remove this file from list of exceptions: ${path}`,
        );
      }
    }
  }
}

export default {
  name: 'Obsolete',
  description: 'Test for obsolete data in each support statement',
  scope: 'feature',
  check(
    logger: Logger,
    { data, path: { full } }: { data: CompatStatement; path: { full: string } },
  ) {
    processData(logger, data, full);
  },
} as Linter;
