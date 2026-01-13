/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import betterAjvErrors from 'better-ajv-errors';

import { createAjv } from '../../scripts/lib/ajv.js';
import { Linter, Logger, LinterData } from '../utils.js';

import compatDataSchema from './../../schemas/compat-data.schema.json' with { type: 'json' };
import browserDataSchema from './../../schemas/browsers.schema.json' with { type: 'json' };

const ajv = createAjv();

export default {
  name: 'JSON Schema',
  description: 'Test a file to ensure that it follows the defined schema',
  scope: 'file',
  /**
   * Test the data
   * @param logger The logger to output errors to
   * @param root The data to test
   * @param root.data The data to test
   * @param root.path The path of the data
   * @param root.path.category The category the data belongs to
   */
  check: (logger: Logger, { data, path: { category } }: LinterData) => {
    const schema =
      category === 'browsers' ? browserDataSchema : compatDataSchema;
    if (!ajv.validate(schema, data)) {
      // Output messages by one since better-ajv-errors wrongly joins messages
      // (see https://github.com/atlassian/better-ajv-errors/pull/21)
      (ajv.errors || []).forEach((e) => {
        logger.error(betterAjvErrors(schema, data, [e], { indent: 2 }));
      });
    }
  },
} as Linter;
