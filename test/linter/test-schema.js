/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import ajvFormats from 'ajv-formats';
import betterAjvErrors from 'better-ajv-errors';

import compatDataSchema from './../../schemas/compat-data.schema.json' assert { type: 'json' };
import browserDataSchema from './../../schemas/browsers.schema.json' assert { type: 'json' };

/**
 * @typedef {import('../utils').Logger} Logger
 */

const ajv = new Ajv({ allErrors: true });
// We use 'fast' because as a side effect that makes the "uri" format more lax.
// By default the "uri" format rejects ① and similar in URLs.
ajvFormats(ajv, { mode: 'fast' });
// Allow for custom error messages to provide better directions for contributors
ajvErrors(ajv);

// Define keywords for schema->TS converter
ajv.addKeyword('tsEnumNames');
ajv.addKeyword('tsName');
ajv.addKeyword('tsType');

export default {
  name: 'JSON Schema',
  description: 'Test a file to ensure that it follows the defined schema',
  scope: 'file',
  check(logger, { data, path: { category } }) {
    const schema =
      category === 'browsers' ? browserDataSchema : compatDataSchema;
    if (!ajv.validate(schema, data)) {
      // Output messages by one since better-ajv-errors wrongly joins messages
      // (see https://github.com/atlassian/better-ajv-errors/pull/21)
      ajv.errors.forEach((e) => {
        logger.error(betterAjvErrors(schema, data, [e], { indent: 2 }));
      });
    }
  },
};
