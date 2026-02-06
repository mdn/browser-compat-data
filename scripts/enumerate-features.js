/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';
import path from 'node:path';

import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { lowLevelWalk } from '../utils/walk.js';

/**
 * Enumerate features and write to a destination file
 * @param {object} options Options
 * @param {string} options.dest Destination file name
 * @param {string} [options.dataFrom] Where the data is (leave blank for repository folder)
 * @returns {Promise<void>}
 */
const main = async ({ dest, dataFrom }) => {
  fs.writeFileSync(dest, JSON.stringify(await enumerateFeatures(dataFrom)));
};

/**
 * Enumerate compat data features
 * @param {string} [dataFrom] Where to get the data from (leave blank for repository folder)
 * @returns {Promise<string[]>} A list of features
 */
const enumerateFeatures = async (dataFrom) => {
  /** @type {string[]} */
  const feats = [];

  const walker = lowLevelWalk(
    dataFrom
      ? (await import(path.join(process.cwd(), dataFrom, 'index.js'))).default
      : undefined,
  );

  for (const feat of walker) {
    if (feat.compat || feat.browser) {
      feats.push(feat.path);
    }
  }

  return feats;
};

if (esMain(import.meta)) {
  const argv = yargs(hideBin(process.argv))
    .command('$0 [dest]', 'Write a JSON-formatted list of feature paths')
    .positional('dest', {
      default: '.features.json',
      description: 'File destination',
    })
    .option('data-from', {
      type: 'string',
      nargs: 1,
      description: 'Require compat data from an alternate path',
    })
    .parseSync();

  const { dest, dataFrom } = argv;

  await main({ dest, dataFrom });
}

export default enumerateFeatures;
