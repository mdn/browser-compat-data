import { Ajv } from 'ajv';
import ajvErrors from 'ajv-errors';
import ajvFormats from 'ajv-formats';

/**
 * Returns a new pre-configured Ajv instance.
 * @returns the Ajv instance.
 */
export const createAjv = (): Ajv => {
  const ajv = new Ajv({ allErrors: true });
  // We use 'fast' because as a side effect that makes the "uri" format more lax.
  // By default the "uri" format rejects ① and similar in URLs.
  ajvFormats.default(ajv, { mode: 'fast' });
  // Allow for custom error messages to provide better directions for contributors
  ajvErrors.default(ajv);

  // Define keywords for schema->TS converter
  ajv.addKeyword('tsEnumNames');
  ajv.addKeyword('tsName');
  ajv.addKeyword('tsType');

  return ajv;
};
