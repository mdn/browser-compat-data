/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { styleText } from 'node:util';

import { features } from 'web-features';

/** @import {Linter, LinterData} from '../types.js' */
/** @import {Logger} from '../utils.js' */
/** @import {CompatStatement} from '../../types/types.js' */

const allowedNamespaces = ['web-features'];
const validFeatureIDs = Object.keys(features);

/**
 * Process the data for spec URL errors
 * @param {CompatStatement} data The data to test
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
const processData = (data, logger) => {
  if (!data.tags) {
    return;
  }

  for (const tag of data.tags) {
    if (
      !allowedNamespaces.some((namespace) => tag.startsWith(namespace + ':'))
    ) {
      logger.error(
        `Invalid tag found: ${styleText('bold', tag)}. Check if:
         - the tag has a namespace
         - the tag uses one of the allowed namespaces: ${styleText('bold', String(allowedNamespaces))}`,
      );
    }

    if (tag.startsWith('web-features')) {
      const featureID = /** @type {string} */ (tag.split(':').pop());

      if (
        !tag.includes(':snapshot:') && // ignore web-feature snapshots for now
        !validFeatureIDs.includes(featureID)
      ) {
        logger.error(
          `Non-registered web-features ID found: ${styleText('bold', featureID)}.
          - New web-feature IDs need to be present in https://github.com/web-platform-dx/web-features first.
          - Check for typos or remove tag. Tagging will be taken care of by web-features maintainers.`,
        );
      }
    }
  }
};

/** @type {Linter} */
export default {
  name: 'Tags',
  description: 'Ensure tags meet requirements like allowed namespaces.',
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
