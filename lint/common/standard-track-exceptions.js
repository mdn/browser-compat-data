import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const exceptionListPath = join(
  __dirname,
  './standard-track-exceptions.txt',
);

/**
 * @returns {Promise<Iterable<string>>}
 */
export const getStandardTrackExceptions = async () =>
  (await readFile(exceptionListPath, 'utf-8'))
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));

/**
 *
 * @param {Iterable<string>} features
 */
export const setStandardTrackExceptions = async (features) => {
  const lines = (await readFile(exceptionListPath, 'utf-8'))
    .split('\n')
    .map((line) => line.trim());
  const headerLines = lines.filter((line) => line.startsWith('#'));
  const result = [...headerLines, ...[...features].sort()].join('\n');
  await writeFile(exceptionListPath, result + '\n', 'utf-8');
};
