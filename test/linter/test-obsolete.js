/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import bcd from '../../index.js';
const { browsers } = bcd;

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

function neverImplemented(support) {
  for (const s in support) {
    let data = support[s];
    if (!Array.isArray(data)) data = [data];
    for (const d of data) if (d.version_added) return false;
  }
  return true;
}

function implementedAndRemoved(browsers, support) {
  for (const browser in support) {
    let data = support[browser];
    if (!Array.isArray(data)) data = [data];
    for (const d of data) {
      if (!d.version_removed) return false;
      if (
        d.version_removed &&
        new Date(
          browsers[browser].releases[d.version_removed].release_date,
        ).getTime() >
          new Date().getTime() - 2 * 365 * 24 * 60 * 60 * 1000
      )
        return false;
    }
  }
  return true;
}

/**
 * @param {string} name
 * @param {CompatStatement} data The data to test
 * @param {Logger} logger
 * @param {boolean} shouldFail
 * @returns {void}
 */
function processData(logger, data, browsers, path) {
  if (data && data.support) {
    const { support, status } = data;
    const shouldFail = exceptions.includes(path);

    const abandoned = status && status.standard_track === false;
    const rule1Fail = abandoned && neverImplemented(support);
    if (rule1Fail && !shouldFail) {
      console.error(path);
      logger.error(
        chalk`feature was never implemented in any browser and the specification has been abandoned.`,
      );
      return;
    }

    const rule2Fail = implementedAndRemoved(browsers, support);
    if (rule2Fail && !shouldFail) {
      console.error(path);
      logger.error(
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

export default {
  name: 'Obsolete',
  description: 'Test for osolete data in each support statement',
  scope: 'feature',
  check(logger, { data, path }) {
    processData(logger, data, browsers, path.full);
  },
  internals: {
    neverImplemented,
  },
};
