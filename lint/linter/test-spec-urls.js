/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { styleText } from 'node:util';

import specData from 'web-specs' with { type: 'json' };

import { getSpecURLsExceptions } from '../common/spec-urls-exceptions.js';

/** @import {Linter, LinterData} from '../types.js' */
/** @import {Logger} from '../utils.js' */
/** @import {CompatStatement} from '../../types/types.js' */

const allowedSpecURLs = [
  .../** @type {string[]} */ (
    specData
      .filter((spec) => spec.standing == 'good')
      .map((spec) => [
        spec.url,
        spec.nightly?.url,
        ...(spec.nightly ? spec.nightly.alternateUrls : []),
        spec.series.nightlyUrl,
      ])
      .flat()
      .filter((url) => !!url)
  ),
  ...(await getSpecURLsExceptions()),
];

/**
 * Process the data for spec URL errors
 * @param {CompatStatement} data The data to test
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
const processData = (data, logger) => {
  if (!data.spec_url) {
    return;
  }

  const featureSpecURLs = Array.isArray(data.spec_url)
    ? data.spec_url
    : [data.spec_url];

  for (const specURL of featureSpecURLs) {
    if (!allowedSpecURLs.some((prefix) => specURL.startsWith(prefix))) {
      logger.error(
        `Invalid specification URL found: ${styleText('bold', specURL)}. Check if:
         - there is a more current specification URL
         - the specification is listed in https://github.com/w3c/browser-specs
         - the specification has a "good" standing`,
      );
    }
  }
};

/** @type {Linter} */
export default {
  name: 'Spec URLs',
  description:
    'Ensure the spec_url values match spec URLs in w3c/browser-specs (or defined exceptions)',
  scope: 'feature',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data }) => {
    processData(/** @type {CompatStatement} */ (data), logger);
  },
};
