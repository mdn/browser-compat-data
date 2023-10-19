/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs/promises';

import esMain from 'es-main';
import stringify from 'fast-json-stable-stringify';

import { InternalSupportStatement } from '../../types/index.js';
import { BrowserName, CompatData } from '../../types/types.js';
import compileTS from '../generate-types.js';
import { walk } from '../../utils/index.js';
import { WalkOutput } from '../../utils/walk.js';

import mirrorSupport from './mirror.js';

const dirname = new URL('.', import.meta.url);
const rootdir = new URL('../../', dirname);

const packageJson = JSON.parse(
  await fs.readFile(new URL('./package.json', rootdir), 'utf-8'),
);

const targetdir = new URL('./build/', rootdir);

const verbatimFiles = ['LICENSE', 'README.md'];

/**
 * Generate metadata to embed into BCD builds
 * @returns {any} Metadata to embed into BCD
 */
export const generateMeta = (): any => ({
  version: packageJson.version,
  timestamp: new Date(),
});

/**
 * Apply mirroring to a feature
 * @param {WalkOutput} feature The BCD to perform mirroring on
 * @returns {void}
 */
export const applyMirroring = (feature: WalkOutput): void => {
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
};

/**
 * Generate a BCD data bundle
 * @returns {CompatData} An object containing the prepared BCD data
 */
export const createDataBundle = async (): Promise<CompatData> => {
  const { default: bcd } = await import('../../index.js');

  const data = Object.assign({}, bcd);
  const walker = walk(undefined, data);

  for (const feature of walker) {
    applyMirroring(feature);
  }

  return {
    ...data,
    __meta: generateMeta(),
  };
};

/* c8 ignore start */

/**
 * Generate a BCD data bundle and write to the output folder
 */
const writeData = async () => {
  const dest = new URL('data.json', targetdir);
  const data = await createDataBundle();
  await fs.writeFile(dest, stringify(data));
};

/**
 * Write the wrapper for old NodeJS versions
 */
const writeWrapper = async () => {
  const dest = new URL('legacynode.mjs', targetdir);
  const content = `// A small wrapper to allow ESM imports on older NodeJS versions that don't support import assertions
import fs from 'node:fs';
const bcd = JSON.parse(fs.readFileSync(new URL('./data.json', import.meta.url)));
export default bcd;
`;
  await fs.writeFile(dest, content);
};

/**
 * Write the TypeScript index for TypeScript users
 */
const writeTypeScript = async () => {
  const dest = new URL('index.ts', targetdir);
  const content = `/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { CompatData } from "./types";

import bcd from "./data.json";

// XXX The cast to "any" mitigates a TS definition issue.
// This is a longstanding TypeScript issue; see https://github.com/microsoft/TypeScript/issues/17867.
export default bcd as any as CompatData;
export * from "./types";`;
  await fs.writeFile(dest, content);

  await compileTS(new URL('types.d.ts', targetdir));
};

/**
 * Copy files from the BCD repo to the output folder
 */
const copyFiles = async () => {
  for (const file of verbatimFiles) {
    const src = new URL(file, rootdir);
    const dest = new URL(file, targetdir);
    await fs.copyFile(src, dest);
  }
};

/* c8 ignore stop */

/**
 * Generate the JSON for a published package.json
 * @returns {any} A generated package.json for build output
 */
export const createManifest = (): any => {
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
};

/* c8 ignore start */

/**
 * Write the package.json to the output folder
 */
const writeManifest = async () => {
  const dest = new URL('package.json', targetdir);
  const manifest = createManifest();
  await fs.writeFile(dest, JSON.stringify(manifest));
};

/**
 * Perform a build of BCD for publishing
 */
const main = async () => {
  // Remove existing files, if there are any
  await fs
    .rm(targetdir, {
      force: true,
      recursive: true,
    })
    .catch((e) => {
      // Missing folder is not an issue since we wanted to delete it anyway
      if (e.code !== 'ENOENT') {
        throw e;
      }
    });

  // Crate a new directory
  await fs.mkdir(targetdir);

  await writeManifest();
  await writeData();
  await writeWrapper();
  await writeTypeScript();
  await copyFiles();

  console.log('Data bundle is ready');
};

if (esMain(import.meta)) {
  await main();
}

/* c8 ignore stop */
