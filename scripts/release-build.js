'use strict';

const fs = require('fs').promises;
const path = require('path');

const directory = './build/';

const verbatimFiles = ['LICENSE', 'README.md', 'index.d.ts', 'types.d.ts'];

// Returns a string representing data ready for writing to JSON file
function createDataBundle() {
  const bcd = require('../index.js');
  const string = JSON.stringify(bcd);
  return string;
}

// Returns a promise for writing the data to JSON file
function writeData() {
  const dest = path.resolve('./', directory, './data.json');
  const data = createDataBundle();
  const promise = fs.writeFile(dest, data);
  return promise;
}

// Returns an array of promises for copying of all files that don't need transformation
function copyFiles() {
  let promises = [];
  for (const file of verbatimFiles) {
    const src = path.join('./', file);
    const dest = path.join(directory, file);
    const promise = fs.copyFile(src, dest);
    promises = promises.concat(promise);
  }
  return promises;
}

function createManifest() {
  const full = require('../package.json');
  const minimal = {};

  const allowList = [
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

  for (const key of allowList) {
    if (key in full) {
      minimal[key] = full[key];
    } else {
      throw `Could not create a complete manifest! ${key} is missing!`;
    }
  }
  return JSON.stringify(minimal);
}

function writeManifest() {
  const dest = path.resolve('./', directory, './package.json');
  const manifest = createManifest();
  const promise = fs.writeFile(dest, manifest);
  return promise;
}

async function main() {
  // Remove existing files, if there are any
  const deletedDir = await fs.rm(directory, {
    force: true,
    recursive: true,
  });
  if (deletedDir !== undefined) throw deletedDir;

  // Crate a new directory
  const createdDir = await fs.mkdir(directory);
  if (createdDir !== undefined) throw createdDir;

  const promises = [writeManifest(), writeData(), ...copyFiles()];
  let errors = await Promise.all(promises);
  errors = errors.filter(e => e !== undefined);
  if (errors.length !== 0) {
    // Re-throw all errors
    throw errors;
  }
}

// This is needed because NodeJS does not support top-level await.
// Do not catch errors so that NodeJS fails on them.
main().then(console.log('Data bundle is ready'));
