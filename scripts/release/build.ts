/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs/promises';

import esMain from 'es-main';
import stringify from 'fast-json-stable-stringify';
import { compareVersions } from 'compare-versions';

import { InternalSupportStatement } from '../../types/index.js';
import { BrowserName, CompatData, VersionValue } from '../../types/types.js';
import compileTS from '../generate-types.js';
import { walk } from '../../utils/index.js';
import { WalkOutput } from '../../utils/walk.js';
import bcd from '../../index.js';

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
 * @returns Metadata to embed into BCD
 */
export const generateMeta = (): any => ({
  version: packageJson.version,
  timestamp: new Date(),
});

/**
 * Apply mirroring to a feature
 * @param feature The BCD to perform mirroring on
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

const getPreviousVersion = (
  browser: BrowserName,
  version: VersionValue,
): VersionValue => {
  if (typeof version === 'string' && !version.startsWith('≤')) {
    const browserVersions = Object.keys(bcd.browsers[browser].releases).sort(
      compareVersions,
    );
    const currentVersionIndex = browserVersions.indexOf(version);
    if (currentVersionIndex > 0) {
      return browserVersions[currentVersionIndex - 1];
    }
  }

  return version;
};

/**
 * Add version_last
 * @param {WalkOutput} feature The BCD to transform
 * @returns {void}
 */
export const addVersionLast = (feature: WalkOutput): void => {
  for (const [browser, supportData] of Object.entries(
    feature.compat.support as InternalSupportStatement,
  )) {
    if (Array.isArray(supportData)) {
      (feature.data as any).__compat.support[browser] = supportData.map((d) => {
        if (d.version_removed) {
          return {
            ...d,
            version_last: getPreviousVersion(
              browser as BrowserName,
              d.version_removed,
            ),
          };
        }
        return d;
      });
    } else if (typeof supportData === 'object') {
      if ((supportData as any).version_removed) {
        (feature.data as any).__compat.support[browser].version_last =
          getPreviousVersion(
            browser as BrowserName,
            (supportData as any).version_removed,
          );
      }
    }
  }
};

/**
 * Generate a BCD data bundle
 * @returns An object containing the prepared BCD data
 */
export const createDataBundle = async (): Promise<CompatData> => {
  const { default: bcd } = await import('../../index.js');

  const walker = walk(undefined, bcd);

  for (const feature of walker) {
    applyMirroring(feature);
    addVersionLast(feature);
  }

  return {
    ...bcd,
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
  const destRequire = new URL('require.d.ts', targetdir);
  const destImport = new URL('import.d.mts', targetdir);
  const content = `/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { CompatData } from "./types.js";

declare var bcd: CompatData;
export default bcd;
export * from "./types.js";`;

  await fs.writeFile(destRequire, content);
  await fs.writeFile(destImport, content);

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
 * @returns A generated package.json for build output
 */
export const createManifest = (): any => {
  const minimal: Record<string, any> = {
    main: 'data.json',
    exports: {
      '.': {
        require: {
          types: './require.d.ts',
          default: './data.json',
        },
        import: {
          types: './import.d.mts',
          default: './data.json',
        },
      },
      './forLegacyNode': {
        types: './import.d.mts',
        default: './legacynode.mjs',
      },
    },
    types: 'require.d.ts',
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
  await fs.writeFile(dest, JSON.stringify(manifest, null, 2));
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

  await Promise.all([
    writeManifest(),
    writeData(),
    writeWrapper(),
    writeTypeScript(),
    copyFiles(),
  ]);

  console.log('Data bundle is ready');
};

if (esMain(import.meta)) {
  await main();
}

/* c8 ignore stop */
