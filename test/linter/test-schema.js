/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import ajvFormats from 'ajv-formats';
import betterAjvErrors from 'better-ajv-errors';
import { Logger } from '../utils.js';

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

/**
 * Test a file to make sure it follows the defined schema
 *
 * @param {Identifier} data The contents of the file to test
 * @param {object} filePath The path info for the file being tested
 * @returns {boolean} If the file contains errors
 */
export default function testSchema(data, filePath) {
  const schema =
    filePath.category === 'browsers' ? browserDataSchema : compatDataSchema;

  const logger = new Logger('JSON Schema');

  if (!ajv.validate(schema, data)) {
    // Output messages by one since better-ajv-errors wrongly joins messages
    // (see https://github.com/atlassian/better-ajv-errors/pull/21)
    ajv.errors.forEach((e) => {
      logger.error(betterAjvErrors(schema, data, [e], { indent: 2 }));
    });
  }

  logger.emit();
  return logger.hasErrors();
}
