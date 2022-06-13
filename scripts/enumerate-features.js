/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';
import path from 'node:path';

import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { lowLevelWalk } from '../utils/walk.js';

function main({ dest, dataFrom }) {
  fs.writeFileSync(dest, JSON.stringify(enumerateFeatures(dataFrom)));
}

function enumerateFeatures(dataFrom) {
  const feats = [];

  const walker = dataFrom
    ? lowLevelWalk(
        undefined,
        import(path.join(process.cwd(), dataFrom, 'index.js')),
      )
    : lowLevelWalk();

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

  main(argv);
}

export default enumerateFeatures;
