import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const exceptionListPath = join(__dirname, './spec-urls-exceptions.txt');

/**
 * @returns {Promise<string[]>}
 */
export const getSpecURLsExceptions = async () =>
  (await readFile(exceptionListPath, 'utf-8'))
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));
