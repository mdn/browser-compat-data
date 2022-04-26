'use strict';

import fs from 'node:fs';
import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import betterAjvErrors from 'better-ajv-errors';
import chalk from 'chalk';

const ajv = new Ajv({ allErrors: true });
// We use 'fast' because as a side effect that makes the "uri" format more lax.
// By default the "uri" format rejects ① and similar in URLs.
ajvFormats(ajv, { mode: 'fast' });

/**
 * @param {string} dataFilename
 * @param {string} [schemaFilename]
 */
export default function testSchema(
  dataFilename,
  schemaFilename = './../../schemas/compat-data.schema.json',
) {
  const schema = JSON.parse(
    fs.readFileSync(new URL(schemaFilename, import.meta.url), 'utf-8'),
  );
  const data = JSON.parse(
    fs.readFileSync(new URL(dataFilename, import.meta.url), 'utf-8'),
  );

  const valid = ajv.validate(schema, data);

  if (!valid) {
    console.error(
      chalk`{red   JSON Schema – {bold ${ajv.errors.length}} ${
        ajv.errors.length === 1 ? 'error' : 'errors'
      }:}`,
    );
    // Output messages by one since better-ajv-errors wrongly joins messages
    // (see https://github.com/atlassian/better-ajv-errors/pull/21)
    ajv.errors.forEach((e) => {
      console.error(betterAjvErrors(schema, data, [e], { indent: 2 }));
    });
    return true;
  }
  return false;
}
