/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { styleText } from 'node:util';

import * as xref from '@webref/xref';

import { getSpecURLsExceptions } from '../common/spec-urls-exceptions.js';

/** @import {Linter, LinterData} from '../types.js' */
/** @import {Logger} from '../utils.js' */
/** @import {InternalCompatStatement} from '../../types/index.js' */

const specsExceptions = await getSpecURLsExceptions();
xref.setup();

/**
 * Process the data for spec URL errors
 * @param {InternalCompatStatement} data The data to test
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

  for (let specURL of featureSpecURLs) {
    // Skip validation for spec_urls hosted at domains listed in our exception list
    if (specsExceptions.some((host) => specURL.startsWith(host))) {
      continue;
    }

    // Skip validation for spec_urls containing no fragment ID (we may want to emit warnings for these in the future)
    if (!specURL.includes('#')) {
      /* logger.warning(
        `Specification URL without a fragment id found: ${styleText('bold', specURL)}
         Check if a deep link using a validated fragment identifier ('#') can be provided.`,
      ); */
      continue;
    }

    // Check that there is a valid section ID before text fragments
    if (specURL.includes(':~:text=')) {
      const trimmedSpecURL = specURL.split(':~:text=')[0];
      if (/#.+/.test(trimmedSpecURL)) {
        specURL = trimmedSpecURL;
      } else {
        // We only have '#:~:text=' without any section ID
        // Skip validation entirely in this case
        continue;
        // We may want to emit warnings for this case in the future:
        /* logger.warning(
          `Text fragment specification URL with section ID found: ${styleText('bold', specURL)}
           Check if a deep link using a validated fragment identifier ('#') can be provided.`,
        ); */
      }
    }

    // Check if the spec_url exists in @webref/xref
    if (!xref.lookup(specURL, { series: true, standing: 'good' }).length) {
      logger.error(
        `Invalid specification URL found: ${styleText('bold', specURL)}. Check if:
         - there is a more current specification URL
         - the specification is listed in https://github.com/w3c/browser-specs
         - the specification has a "good" standing
         - the fragment id (#) is valid according to @webref/xref.`,
      );
      continue;
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
    processData(/** @type {InternalCompatStatement} */ (data), logger);
  },
};
