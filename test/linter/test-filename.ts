/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Identifier } from '../../types/types.js';
import { Linter, Logger } from '../utils.js';

import path from 'node:path';
import chalk from 'chalk-template';
import { IS_WINDOWS, indexToPos, jsonDiff } from '../utils.js';
import { orderSupportBlock } from '../../scripts/fix/browser-order.js';
import { orderFeatures } from '../../scripts/fix/feature-order.js';
import { orderStatements } from '../../scripts/fix/statement-order.js';
import { orderProperties } from '../../scripts/fix/property-order.js';

function testFeaturePresence(
  data: Identifier,
  pathParts: string[],
  currentPath: string,
) {
  const feature = pathParts[0];
  if (Object.keys(data).length > 1 || !(feature in data)) {
    return `Expected only "${currentPath}${feature}" but found "${currentPath}${Object.keys(
      data,
    ).join(`, ${currentPath}`)}"`;
  }

  if (pathParts.length > 1) {
    return testFeaturePresence(
      data[feature],
      pathParts.splice(1),
      currentPath + feature + '.',
    );
  }

  return false;
}

/**
 * Process the data to make sure it defines the features appropriate to the file's name
 *
 * @param {Identifier} data The raw contents of the file to test
 * @param {string} filepath The file path
 * @param {Logger} logger The logger to output errors to
 */
function processData(data: Identifier, filepath: string, logger: Logger): void {
  const p = filepath
    .replace('.json', '')
    .replace('api/_globals', 'api')
    .replace('api/Console', 'api/console')
    .replace(/api\/_mixins\/(\w+)__(\w+)/g, 'api/$2')
    .replace('html/elements/input/', 'html/elements/input/type_')
    .replace('javascript/builtins/globals', 'javascript/builtins');

  const failed = testFeaturePresence(data, p.split(path.sep), '');
  if (failed) {
    logger.error(failed);
  }
}

export default {
  name: 'Filename',
  description:
    'Tests the filename to make sure it includes the intended feature',
  scope: 'file',
  check(
    logger: Logger,
    { data, path: { full } }: { data: Identifier; path: { full: string } },
  ) {
    processData(data, full, logger);
  },
} as Linter;
