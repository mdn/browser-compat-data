/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { promises as fs } from 'node:fs';
import path from 'node:path';

import esMain from 'es-main';
import stringify from 'fast-json-stable-stringify';

const directory = './build/';

const verbatimFiles = ['LICENSE', 'README.md', 'index.d.ts', 'types.d.ts'];

// Returns a string representing data ready for writing to JSON file
async function createDataBundle() {
  const { default: bcd } = await import('../../index.js');
  const string = stringify(bcd);
  return string;
}

// Returns a promise for writing the data to JSON file
async function writeData() {
  const dest = path.resolve(directory, 'data.json');
  const data = await createDataBundle();
  await fs.writeFile(dest, data);
}

async function writeWrapper() {
  const dest = path.resolve(directory, 'legacynode.mjs');
  const content = `// A small wrapper to allow ESM imports on older NodeJS versions that don't support import assertions
import fs from 'node:fs';
const bcd = JSON.parse(fs.readFileSync(new URL('./data.json', import.meta.url)));
export default bcd;
`;
  await fs.writeFile(dest, content);
}

// Returns an array of promises for copying of all files that don't need transformation
async function copyFiles() {
  for (const file of verbatimFiles) {
    const src = path.join('./', file);
    const dest = path.join(directory, file);
    await fs.copyFile(src, dest);
  }
}

async function createManifest() {
  const packageJSONRaw = await fs.readFile(
    new URL('../../package.json', import.meta.url),
    'utf-8',
  );
  const full = JSON.parse(packageJSONRaw);
  const minimal = {
    main: 'data.json',
    exports: {
      '.': './data.json',
      './forLegacyNode': './legacynode.mjs',
    },
  };

  const minimalKeys = [
    'name',
    'version',
    'description',
    'repository',
    'keywords',
    'author',
    'license',
    'bugs',
    'homepage',
    'types',
  ];

  for (const key of minimalKeys) {
    if (key in full) {
      minimal[key] = full[key];
    } else {
      throw `Could not create a complete manifest! ${key} is missing!`;
    }
  }
  return JSON.stringify(minimal);
}

async function writeManifest() {
  const dest = path.resolve(directory, 'package.json');
  const manifest = await createManifest();
  await fs.writeFile(dest, manifest);
}

async function main() {
  // Remove existing files, if there are any
  await fs
    .rm(directory, {
      force: true,
      recursive: true,
    })
    .catch((e) => {
      // Missing folder is not an issue since we wanted to delete it anyway
      if (e.code !== 'ENOENT') throw e;
    });

  // Crate a new directory
  await fs.mkdir(directory);

  await writeManifest();
  await writeData();
  await writeWrapper();
  await copyFiles();

  console.log('Data bundle is ready');
}

if (esMain(import.meta)) {
  await main();
}
