import fsp from 'node:fs/promises';
import path from 'node:path';
import fs from 'node:fs';

import chalk from 'chalk-template';

/**
 * isObject - Helper function testing for an object
 * @param item Value to test
 * @returns A boolean saying if it is an object or not
 */
const isObject = (item: any) => (item && typeof item === 'object' && !Array.isArray(item));

/**
 * mergeDeep - Merge several JSON object
 * @param target The first JSON object
 * @param sources The JSON object to merge to the first one
 * @returns The merged JSON object
 */
const mergeDeep = (target: object, ...sources: object[]) => {
  // Assume there is no circular references (or this leads to an infinite loop)

  if (!sources.length) {
    return target;
  }

  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

/**
 * bcdAssociatedFilename - Generate the filename containing the bcd ID
 * @param bcdID The bcd ID we are looking for
 * @param path The path to the JSON files
 * @returns A string with the filename
 */
const bcdAssociatedFilename = (bcdID: string, path: string): string => {
  let [ bcdDomain, top, second, third ] = bcdID.split('.');

  if (!bcdDomain || !top || !second) {
    console.log(chalk`{red Not a terminal bcd-id.}`);
    return '';
  }

  // Special case for html.elements.input.type_
  if ((bcdDomain === 'html') && (top === 'elements') && (second === 'input') && third.startsWith('type_')) {
    third = third.replace('type_', '');
  }

  // Normal case: Test if the second file does exists
  let filename = `${path?path:''}${bcdDomain}/${top}/${second}.json`;
  try {
    fsp.stat(filename);
  } catch (e) {
    // This is the special case for JS namespace (Intl, Temporal, …)
    filename = `${path?path:''}${bcdDomain}/${top}/${second}/${third}.json`;
  }
  return filename;
}

/**
 * topBCDIDForFilename - Generate the bcd ID associated with a filename
 * @param filename The filename of the JSON file
 * @param path The path to the JSON files
 * @returns A string with the dot-separated bcdID
 */
const topBCDIDForFilename = (filename: string, path: string): string => {
  if (!path) {
    path = '/Users/perrier/Documents/Github_repo/mdn/browser-compat-data/';
  }
  filename = filename.replace(path, '');
  filename = filename.replace('.json', '');
  const [bcdDomain, top, second, third ] = filename.split('/');
  return `${bcdDomain}.${top}.${second}${third?'.'+third:''}`;
}

/** Class representing any 'tags XYZ' comnmand. */
export class TagsCommand {

  path = './';
  filenames: string[] = [];

  /**
   * constructor - Create an object for a tags command
   * @param path The path to JSON files
   */
  constructor(path:string) {
    this.path = path;
  }

  /**
   * readJSONFiles - Read the content of JSON files
   * @param bcdIDs Array of BCD IDs that needs to be included
   * @returns A JSON object containing all of them
   */
  readJSONFiles(bcdIDs) {
    //
    // Loop on each bcdid and create the list of files containing all bcdIDs
    //

    for (const bcdID of bcdIDs) {
      const newFilename = bcdAssociatedFilename(bcdID, this.path);
      // If the filename is already in the list, skip it.
      if (!this.filenames.includes(newFilename)) {
        this.filenames.push(newFilename);
      }
    }

    //
    // Read all the files
    //
    let allJSONs: object = {}; // All JSONs.
    console.log(chalk`{white Read files}`);
    for (const filename of this.filenames) {
      console.log(chalk`{yellow Read ${filename}}`);

      // Read JSON file
      if (fs.existsSync(filename)) {

        if (path.extname(filename) === '.json' && !filename.endsWith('.schema.json')) {
          const file = fs.readFileSync(filename, 'utf-8').trim();
          const json = JSON.parse(file);

          // Merge it with all JSON
          allJSONs = mergeDeep(allJSONs, json);
        }
      }
    }
    return allJSONs;
  }

  /**
   * writeJSONFiles - Write the JSON object to JSON Files
   * @param bcdIDs Array of BCD IDs that needs to be written
   * @param allJSONs The JSON object
   */
  writeJSONFiles(bcdIDs, allJSONs) {
    //
    // Write back the modified files
    //
    console.log(chalk`{white \nWrite files}`);
    for (const filename of this.filenames) {
      const topBCDID = topBCDIDForFilename(filename, this.path);
      console.log(chalk`{yellow Writing ${topBCDID}}`);
      // Find the bcd entry
      const values = topBCDID.split('.');
      let result = {};
      const resultJSON = result;
      let lastValue;
      let actualJSON = allJSONs;
      for (const value of values) {
        if (lastValue) {
          result[lastValue] = {};
          result = result[lastValue];
        }
        lastValue = value;
        actualJSON = actualJSON[value];
      }
      result[lastValue] = actualJSON;
      const fileContent = JSON.stringify(resultJSON, null, 2)
      fs.writeFileSync(filename, fileContent + '\n', 'utf-8');
    }
  }
}

