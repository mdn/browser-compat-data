/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';
import path from 'node:path';

import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { walk } from '../utils/index.js';

async function main(argv: any) {
  const { dest, dataFrom } = argv;
  fs.writeFileSync(dest, JSON.stringify(await enumerateFeatures(dataFrom)));
}

async function enumerateFeatures(dataFrom: string) {
  const feats = [];

  const walker = dataFrom
    ? walk(
        undefined,
        await import(path.join(process.cwd(), dataFrom, 'index.js')),
      )
    : walk();

  for (const { path, compat } of walker) {
    if (compat) {
      feats.push(path);
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
