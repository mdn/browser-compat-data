/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const fs = require('fs').promises;
const path = require('path');

const stringify = require('fast-json-stable-stringify');

const directory = './build/';

const verbatimFiles = ['LICENSE', 'README.md', 'index.d.ts', 'types.d.ts'];

// Returns a string representing data ready for writing to JSON file
function createDataBundle() {
  const bcd = require('../../index.js');
  const string = stringify(bcd);
  return string;
}

// Returns a promise for writing the data to JSON file
async function writeData() {
  const dest = path.resolve(directory, 'data.json');
  const data = createDataBundle();
  await fs.writeFile(dest, data);
}

async function writeIndexForESM1214() {
  const dest = path.resolve(directory, 'nodejs12-14.js');
  const content = `import fs from 'node:fs';\nconst bcd = JSON.parse(fs.readFileSync(new URL('./data.json', import.meta.url)));\n`;
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

function createManifest() {
  const full = require('../../package.json');
  const minimal = {
    main: 'data.json',
    exports: {
      '.': './data.json',
      'Node12-14': './nodejs12-14.js',
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
  const manifest = createManifest();
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
  await writeIndexForESM1214();
  await copyFiles();

  console.log('Data bundle is ready');
}

// This is needed because NodeJS does not support top-level await.
// Also, make sure to log all errors and exit with failure code.
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
