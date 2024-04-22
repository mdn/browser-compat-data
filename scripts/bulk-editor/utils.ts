/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

import chalk from 'chalk-template';
import { fdir } from 'fdir';

import { dataFolders } from '../../index.js';
import walk from '../../utils/walk.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

const performUpdate = (key, json, updater) => {
  const parts = key.split('.');
  if (!(parts[0] in json)) {
    console.warn('Key not found in file!');
    return json;
  }
  if (parts.length === 1) {
    json[parts[0]]['__compat'] = updater(json[parts[0]]['__compat']);
  } else {
    json[parts[0]] = performUpdate(
      parts.slice(1).join('.'),
      json[parts[0]],
      updater,
    );
  }
  return json;
};

export const updateFeatures = (featureIDs, updater) => {
  for (const dir of dataFolders) {
    const paths = new fdir()
      .withBasePath()
      .filter((fp) => fp.endsWith('.json'))
      .crawl(path.join(dirname, '..', '..', dir))
      .sync() as string[];

    for (const fp of paths) {
      const rawcontents = fs.readFileSync(fp);
      const contents = JSON.parse(rawcontents.toString('utf8'));
      let changed = false;

      const walker = walk(undefined, contents);
      for (const { path: featureID } of walker) {
        if (featureIDs.includes(featureID)) {
          console.log(chalk`{yellow Updating ${featureID}...}`);
          performUpdate(featureID, contents, updater);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fp, stringifyAndOrderProperties(contents), 'utf-8');
      }
    }
  }
};
