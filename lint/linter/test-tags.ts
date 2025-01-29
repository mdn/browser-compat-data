/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import { features } from 'web-features';

import { Linter, Logger, LinterData } from '../utils.js';
import { CompatStatement } from '../../types/types.js';

const allowedNamespaces = ['web-features'];
const validFeatureIDs = Object.keys(features);

/**
 * Process the data for spec URL errors
 * @param data The data to test
 * @param logger The logger to output errors to
 */
const processData = (data: CompatStatement, logger: Logger): void => {
  if (!data.tags) {
    return;
  }

  for (const tag of data.tags) {
    if (
      !allowedNamespaces.some((namespace) => tag.startsWith(namespace + ':'))
    ) {
      logger.error(
        chalk`Invalid tag found: {bold ${tag}}. Check if:
         - the tag has a namespace
         - the tag uses one of the allowed namespaces: {bold ${allowedNamespaces}}`,
      );
    }

    if (tag.startsWith('web-features')) {
      const featureID = tag.split(':').pop() as string;

      if (
        !tag.includes(':snapshot:') && // ignore web-feature snapshots for now
        !validFeatureIDs.includes(featureID)
      ) {
        logger.error(
          chalk`Non-registered web-features ID found: {bold ${featureID}}.
          - New web-feature IDs need to be present in https://github.com/web-platform-dx/web-features first.
          - Check for typos or remove tag. Tagging will be taken care of by web-features maintainers.`,
        );
      }
    }
  }
};

export default {
  name: 'Tags',
  description: 'Ensure tags meet requirements like allowed namespaces.',
  scope: 'feature',
  /**
   * Test the data
   * @param logger The logger to output errors to
   * @param root The data to test
   * @param root.data The data to test
   */
  check: (logger: Logger, { data }: LinterData) => {
    processData(data, logger);
  },
} as Linter;
