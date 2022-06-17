/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { BrowserName } from '../../types/types.js';
import { InternalSupportStatement } from '../../types/index.js';

import fs from 'node:fs/promises';
import path from 'node:path';

import esMain from 'es-main';
import stringify from 'fast-json-stable-stringify';

import mirrorSupport from './mirror.js';
import compileTS from '../generate-types.js';
import { walk } from '../../utils/index.js';

const packageJson = JSON.parse(
  await fs.readFile(new URL('../../package.json', import.meta.url), 'utf-8'),
);

const directory = './build/';

const verbatimFiles = ['LICENSE', 'README.md'];

export function generateMeta() {
  return { version: packageJson.version };
}

export function applyMirroring(data) {
  const response = Object.assign({}, data);
  const walker = walk(undefined, response);

  for (const feature of walker) {
    if (!feature.compat) {
      continue;
    }
    for (const [browser, supportData] of Object.entries(
      feature.compat.support as InternalSupportStatement,
    )) {
      if (supportData === 'mirror') {
        (feature.data as any).__compat.support[browser] = mirrorSupport(
          browser as BrowserName,
          feature.compat.support,
        );
      }
    }
  }

  return response;
}

// Returns an object containing the prepared BCD data
export async function createDataBundle() {
  const { default: bcd } = await import('../../index.js');

  return {
    ...applyMirroring(bcd),
    __meta: generateMeta(),
  };
}

/* c8 ignore start */

// Returns a promise for writing the data to JSON file
async function writeData() {
  const dest = path.resolve(directory, 'data.json');
  const data = await createDataBundle();
  await fs.writeFile(dest, stringify(data));
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

async function writeTypeScript() {
  const dest = path.resolve(directory, 'index.ts');
  const content = `/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { CompatData } from "./types";

import bcd from "./data.json";

// XXX The cast to "any" mitigates a TS definition issue. This is very bad practice and
// should be fixed as soon as possible.
export default bcd as any as CompatData;
export * from "./types";`;
  await fs.writeFile(dest, content);

  await compileTS(path.resolve(directory, 'types.d.ts'));
}

// Returns an array of promises for copying of all files that don't need transformation
async function copyFiles() {
  for (const file of verbatimFiles) {
    const src = path.join('./', file);
    const dest = path.join(directory, file);
    await fs.copyFile(src, dest);
  }
}

/* c8 ignore stop */

export function createManifest() {
  const minimal: { [index: string]: any } = {
    main: 'data.json',
    exports: {
      '.': './data.json',
      './forLegacyNode': './legacynode.mjs',
    },
    types: 'index.ts',
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
  ];

  for (const key of minimalKeys) {
    if (key in packageJson) {
      minimal[key] = packageJson[key];
    } else {
      throw `Could not create a complete manifest! ${key} is missing!`;
    }
  }
  return minimal;
}

/* c8 ignore start */

async function writeManifest() {
  const dest = path.resolve(directory, 'package.json');
  const manifest = createManifest();
  await fs.writeFile(dest, JSON.stringify(manifest));
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
  await writeTypeScript();
  await copyFiles();

  console.log('Data bundle is ready');
}

if (esMain(import.meta)) {
  await main();
}

/* c8 ignore stop */
