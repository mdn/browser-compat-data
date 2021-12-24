'use strict';

const fs = require('fs').promises;
const path = require('path');

const packageJson = require('../package.json');

const directory = './build/';

const verbatimFiles = ['LICENSE', 'README.md', 'index.d.ts', 'types.d.ts'];

// Returns a string representing data ready for writing to JSON file
function createDataBundle() {
  const bcd = require('../index.js');
  bcd.__version = packageJson.version;
  const string = JSON.stringify(bcd);
  return string;
}

// Returns a promise for writing the data to JSON file
async function writeData() {
  const dest = path.resolve(directory, 'data.json');
  const data = createDataBundle();
  await fs.writeFile(dest, data);
}

async function writeIndex() {
  const dest = path.resolve(directory, 'index.js');
  const content = `module.exports = require("./data.json");\n`;
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
  const minimal = { main: 'index.js' };

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
    if (key in packageJson) {
      minimal[key] = packageJson[key];
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
    .rmdir(directory, {
      force: true,
      recursive: true,
    })
    .catch(e => {
      // Missing folder is not an issue since we wanted to delete it anyway
      if (e.code !== 'ENOENT') throw e;
    });

  // Crate a new directory
  await fs.mkdir(directory);

  await writeManifest();
  await writeData();
  await writeIndex();
  await copyFiles();

  console.log('Data bundle is ready');
}

// This is needed because NodeJS does not support top-level await.
// Also, make sure to log all errors and exit with failure code.
main().catch(e => {
  console.error(e);
  process.exit(1);
});
