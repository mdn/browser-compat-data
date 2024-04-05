/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fsp from 'node:fs/promises';
import path from 'node:path';
import fs from 'node:fs';

import chalk from 'chalk-template';

/**
 * bcdAssociatedFilename - Generate the filename containing the bcd ID
 * @param bcdID The bcd ID we are looking for
 * @param path The path to the JSON files
 * @returns A string with the filename
 */
const bcdAssociatedFilename = (bcdID: string, path?: string): string => {
  const [bcdDomain, top, second, third] = bcdID.split('.');

  if (!bcdDomain || !top || !second) {
    console.log(chalk`{red Not a terminal bcd-id.}`);
    return '';
  }

  // Special case for html.elements.input.type_
  let fixedThird = third;
  if (
    bcdDomain === 'html' &&
    top === 'elements' &&
    second === 'input' &&
    third.startsWith('type_')
  ) {
    fixedThird = third.replace('type_', '');
  }

  // Normal case: Test if the second file does exists
  let filename = `${path ? path : ''}${bcdDomain}/${top}/${second}.json`;
  try {
    fsp.stat(filename);
  } catch (e) {
    // This is the special case for JS namespace (Intl, Temporal, …)
    filename = `${path ? path : ''}${bcdDomain}/${top}/${second}/${fixedThird}.json`;
  }
  return filename;
};

const performUpdate = (key, json, updater) => {
  const parts = key.split('.');
  if (!(parts[0] in json)) {
    console.warn('Key not found in file!');
    return json;
  }
  json[parts[0]] =
    parts.length === 1
      ? updater(json[parts[0]])
      : performUpdate(parts.slice(1).join('.'), json[parts[0]], updater);
  return json;
};

export const updateFeatures = (featureIDs, updater) => {
  for (const featureID of featureIDs) {
    // XXX Walk the file tree instead
    const filename = bcdAssociatedFilename(featureID);

    if (
      fs.existsSync(filename) &&
      path.extname(filename) === '.json' &&
      !filename.endsWith('.schema.json')
    ) {
      console.log(chalk`{yellow Updating ${featureID}...}`);
      const json = JSON.parse(fs.readFileSync(filename, 'utf-8'));
      const newJson = performUpdate(featureID, json, updater);
      fs.writeFileSync(
        filename,
        JSON.stringify(newJson, undefined, 2) + '\n',
        'utf-8',
      );
    } else {
      console.warn(
        chalk`{yellow Warning! Could not find file for ${featureID}!}`,
      );
    }
  }
};
