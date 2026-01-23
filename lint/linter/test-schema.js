/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import betterAjvErrors from 'better-ajv-errors';

import { createAjv } from '../../scripts/lib/ajv.js';

import compatDataSchema from './../../schemas/compat-data.schema.json' with { type: 'json' };
import browserDataSchema from './../../schemas/browsers.schema.json' with { type: 'json' };

/** @import {Linter, Logger, LinterData} from '../utils.js' */

const ajv = createAjv();

/** @type {Linter} */
export default {
  name: 'JSON Schema',
  description: 'Test a file to ensure that it follows the defined schema',
  scope: 'file',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data, path: { category } }) => {
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
};
