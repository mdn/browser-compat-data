import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { Identifier } from '../types/types';

const argv = yargs(hideBin(process.argv))
  .command('$0 [files..]', 'Split BCD JSON files', (yargs) => {
    yargs.positional('files', {
      describe: 'One or more JSON files to split',
      type: 'string',
    });
  })
  .help().argv as any as { files: string[] };

/**
 * Extracts the base key path (as array of strings) from a JSON file path.
 *
 * For example, `api/AbortController.json` becomes `['api', 'AbortController']`.
 * @param filePath - The path to the BCD JSON file
 * @returns Array of path components without the `.json` extension
 */
const getBaseKeyFromPath = (filePath: string): string[] => {
  const relativePath = filePath.replace(/\.json$/, '').split(sep);
  return relativePath;
};

/**
 * Creates the JSON for the subfeature.
 * @param baseKeys - The parent keys in which to nest the data.
 * @param key - The key of the subfeature.
 * @param value - The value of the subfeature.
 * @returns JSON for the subfeature data nested in parent structure.
 */
const createSubfeatureJSON = (
  baseKeys: string[],
  key: string,
  value: Identifier,
) => {
  const data = {};
  let current = data;

  for (const baseKey of baseKeys) {
    current[baseKey] = {};
    current = current[baseKey];
  }

  current[key] = {
    __compat: value.__compat,
  };

  return data;
};

/**
 * Writes a JSON file.
 * @param path - The path to the file.
 * @param data - The data to write as JSON.
 * @returns Promise.
 */
const writeJSONFile = async (path: string, data: Identifier) =>
  writeFile(path, JSON.stringify(data, null, 2) + '\n');

/**
 * Splits a BCD-style JSON file into separate files for each feature under the same namespace.
 * Each file will include only the `__compat` data of a given property.
 * Extracted entries are also removed from the original file.
 * @param file - The absolute or relative path to the source JSON file
 */
const splitFile = async (file: string) => {
  const fullPath = resolve(file);
  const raw = await readFile(fullPath, 'utf-8');
  const data = JSON.parse(raw) as Identifier;

  const baseKeys = getBaseKeyFromPath(file);
  let current = data;

  // Traverse the nested object using the base keys
  for (const key of baseKeys) {
    if (!(key in current)) {
      console.error(`❌ Error: Key "${key}" not found in structure.`);
      return;
    }
    current = current[key];
  }

  // Prepare output path and full key for naming
  const dirPath = fullPath.replace(/\.json$/, '');

  // Write __compat data for each subfeature, then remove them
  for (const [key, value] of Object.entries(current)) {
    if (key === '__compat') {
      continue;
    }
    if (typeof value === 'object' && '__compat' in value) {
      const data = createSubfeatureJSON(baseKeys, key, value);

      await mkdir(dirPath, { recursive: true });
      const outFile = join(dirPath, `${key}.json`);
      await writeJSONFile(outFile, data);
      console.log(`✔ Created: ${relative(process.cwd(), outFile)}`);

      // Remove the extracted key using Reflect to avoid dynamic delete
      Reflect.deleteProperty(current, key);
    }
  }

  // Write the modified original file
  await writeJSONFile(fullPath, data);
  console.log(`✔ Updated: ${file}`);
};

await Promise.all(argv.files.map(splitFile));
