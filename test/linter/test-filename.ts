/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Identifier } from '../../types/types.js';
import { Linter, Logger, LinterData } from '../utils.js';

/**
 * Test the filename based on the identifier
 * @param data The identifier
 * @param pathParts Parts of the path
 * @param currentPath The current path traversed
 * @returns A string with the error message if the lint failed, or false if it passed
 */
const testFilename = (
  data: Identifier,
  pathParts: string[],
  currentPath: string,
): string | false => {
  const feature = pathParts[0];
  if (Object.keys(data).length > 1 || !(feature in data)) {
    return `Expected only "${currentPath}${feature}" but found "${currentPath}${Object.keys(
      data,
    ).join(`, ${currentPath}`)}"`;
  }

  if (pathParts.length > 1) {
    return testFilename(
      data[feature],
      pathParts.splice(1),
      currentPath + feature + '.',
    );
  }

  return false;
};

/**
 * Process the data to make sure it defines the features appropriate to the file's name
 * @param data The raw contents of the file to test
 * @param filepath The file path
 * @param logger The logger to output errors to
 */
const processData = (
  data: Identifier,
  filepath: string,
  logger: Logger,
): void => {
  const p = filepath
    .replace('.json', '')
    .replace('api/_globals', 'api')
    .replace('api/Console', 'api/console')
    .replace('html/elements/input/', 'html/elements/input/type_')
    .replace('javascript/builtins/globals', 'javascript/builtins');

  const failed = testFilename(data, p.split('/'), '');
  if (failed) {
    logger.error(failed);
  }
};

export default {
  name: 'Filename',
  description:
    'Tests the filename to make sure it includes the intended feature',
  scope: 'file',
  /**
   * Test the data
   * @param logger The logger to output errors to
   * @param root The data to test
   * @param root.data The data to test
   * @param root.path The path of the data
   * @param root.path.full The full filepath of the data
   */
  check: (logger: Logger, { data, path: { full } }: LinterData) => {
    processData(data, full, logger);
  },
} as Linter;
