import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = /** @type {any} */ (
  yargs(hideBin(process.argv))
    .command('$0 [files..]', 'Split BCD JSON files', (yargs) => {
      yargs.positional('files', {
        describe: 'One or more JSON files to split',
        type: 'string',
      });
    })
    .help().argv
);

/**
 * Extracts the base key path (as array of strings) from a JSON file path.
 *
 * For example, `api/AbortController.json` becomes `['api', 'AbortController']`.
 * @param {string} filePath - The path to the BCD JSON file
 * @returns {string[]} Array of path components without the `.json` extension
 */
const getBaseKeyFromPath = (filePath) => {
  const relativePath = filePath.replace(/\.json$/, '').split(sep);
  return relativePath;
};

/**
 * Creates the JSON for the subfeature.
 * @param {string[]} baseKeys - The parent keys in which to nest the data.
 * @param {string} key - The key of the subfeature.
 * @param {import('../types/types.js').Identifier} value - The value of the subfeature.
 * @returns {object} JSON for the subfeature data nested in parent structure.
 */
const createSubfeatureJSON = (baseKeys, key, value) => {
  const data = {};
  let current = data;

  for (const baseKey of baseKeys) {
    current[baseKey] = {};
    current = current[baseKey];
  }

  current[key] = value;

  return data;
};

/**
 * Checks if data contains compat data.
 * @param {any} data - The data to check for `__compat` entries.
 * @returns {boolean} TRUE, if the data contains any compat data.
 */
const hasCompatData = (data) =>
  '__compat' in data ||
  (typeof data === 'object' && Object.values(data).some(hasCompatData));

/**
 * Writes a JSON file.
 * @param {string} path - The path to the file.
 * @param {import('../types/types.js').Identifier} data - The data to write as JSON.
 * @returns {Promise<void>} Promise.
 */
const writeJSONFile = async (path, data) =>
  writeFile(path, JSON.stringify(data, null, 2) + '\n');

/**
 * Splits a BCD-style JSON file into separate files for each subfeature.
 * Each file will include only the `__compat` data of a given property.
 * Extracted entries are also removed from the original file.
 * @param {string} file - The absolute or relative path to the source JSON file
 */
const splitFile = async (file) => {
  const fullPath = resolve(file);
  const raw = await readFile(fullPath, 'utf-8');
  const data = /** @type {import('../types/types.js').Identifier} */ (
    JSON.parse(raw)
  );

  const baseKeys = getBaseKeyFromPath(file);
  let current = data;

  for (const key of baseKeys) {
    if (!(key in current)) {
      console.error(`❌ Error: Key "${key}" not found in structure.`);
      return;
    }
    current = current[key];
  }

  const dirPath = fullPath.replace(/\.json$/, '');

  // Write file for each subfeature, then remove subfeature from parent file.
  for (const [key, value] of Object.entries(current)) {
    if (key === '__compat') {
      continue;
    }
    if (typeof value === 'object' && value !== null && '__compat' in value) {
      const data = createSubfeatureJSON(baseKeys, key, value);

      await mkdir(dirPath, { recursive: true });
      const outFile = join(dirPath, `${key}.json`);
      await writeJSONFile(outFile, data);
      console.log(`✔ Created: ${relative(process.cwd(), outFile)}`);

      Reflect.deleteProperty(current, key);
    }
  }

  // Check if current file still has any data.
  if (hasCompatData(data)) {
    await writeJSONFile(fullPath, data);
    console.log(`✔ Updated: ${file}`);
  } else {
    await rm(fullPath);
    console.log(`✔ Deleted: ${file}`);
  }
};

await Promise.all(argv.files.map(splitFile));
