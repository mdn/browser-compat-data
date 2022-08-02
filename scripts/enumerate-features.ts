/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';
import path from 'node:path';

import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { lowLevelWalk } from '../utils/walk.js';

async function main(argv: any) {
  const { dest, dataFrom } = argv;
  fs.writeFileSync(dest, JSON.stringify(await enumerateFeatures(dataFrom)));
}

async function enumerateFeatures(dataFrom: string) {
  const feats: string[] = [];

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
}

if (esMain(import.meta)) {
  const { argv } = yargs(hideBin(process.argv)).command(
    '$0 [dest]',
    'Write a JSON-formatted list of feature paths',
    (yargs) => {
      yargs
        .positional('dest', {
          default: '.features.json',
          description: 'File destination',
        })
        .option('data-from', {
          nargs: 1,
          description: 'Require compat data from an alternate path',
        });
    },
  );

  await main(argv);
}

export default enumerateFeatures;
