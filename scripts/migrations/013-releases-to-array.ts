import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { compareVersions } from 'compare-versions';

const directoryPath = fileURLToPath(new URL('../../browsers', import.meta.url));

/**
 * Converts a releases object into an array.
 * @param releases - the releases as an object.
 * @returns the releases as an array.
 */
const transformReleases = (releases: Record<string, any>): any[] =>
  Object.entries(releases)
    .map(([version, details]) => ({
      version,
      ...details,
    }))
    .sort(({ version: a }, { version: b }) => compareVersions(a, b));

/**
 * Migrates a browser JSON file.
 * @param filePath - the path to the browser JSON file.
 * @returns a Promise
 */
const processJsonFile = async (filePath: string): Promise<void> => {
  try {
    const rawData = await readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(rawData);

    if (jsonData.browsers) {
      for (const browser in jsonData.browsers) {
        if (jsonData.browsers[browser].releases) {
          jsonData.browsers[browser].releases = transformReleases(
            jsonData.browsers[browser].releases,
          );
        }
      }
    }

    await writeFile(
      filePath,
      JSON.stringify(jsonData, null, 2) + '\n',
      'utf-8',
    );
    console.log(`Processed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
};

(await readdir(directoryPath)).forEach((file) => {
  if (extname(file) === '.json') {
    processJsonFile(join(directoryPath, file));
  }
});
