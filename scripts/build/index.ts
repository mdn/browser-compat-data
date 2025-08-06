/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs/promises';
import { relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import esMain from 'es-main';
import stringify from 'fast-json-stable-stringify';
import { compareVersions } from 'compare-versions';
import { marked } from 'marked';

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

function logWrite(url: URL, description: string = '') {
  if (description) {
    description = ` (${description})`;
  }
  const path = relative(fileURLToPath(rootdir), fileURLToPath(url));
  console.log(`Wrote: ${path}${description}`);
}

/**
 * Generate metadata to embed into BCD builds
 * @returns Metadata to embed into BCD
 */
export const generateMeta = (): any => ({
  version: packageJson.version,
  timestamp: new Date(),
});

/**
 * Converts Markdown to HTML and sanitizes output
 * @param {string | string[]} markdown The Markdown to convert
 * @returns {string | string[]} The HTML output
 */
const mdToHtml = (markdown: string): string => {
  // "as string" cast because TS thinks response could be a promise
  return (marked.parseInline(markdown) as string)
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;([\w#]+);/g, '&$1;');
};

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

/**
 * Retrieves the previous version of a browser.
 * @param browser The name of the browser.
 * @param version The current version of the browser.
 * @returns The previous version of the browser.
 */
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
 * @param feature The BCD to transform
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
 * Convert descriptions and notes from Markdown to HTML
 * @param {WalkOutput} feature The BCD to perform note conversion on
 * @returns {void}
 */
export const transformMD = (feature: WalkOutput): void => {
  if ('description' in feature.data.__compat) {
    feature.data.__compat.description = mdToHtml(
      feature.data.__compat.description,
    );
  }

  for (const [browser, supportData] of Object.entries(
    feature.compat.support as InternalSupportStatement,
  )) {
    if (!supportData) continue;

    if (Array.isArray(supportData)) {
      for (let i = 0; i < supportData.length; i++) {
        if ('notes' in supportData[i]) {
          (feature.data as any).__compat.support[browser][i].notes =
            Array.isArray(supportData[i].notes)
              ? supportData[i].notes.map((md) => mdToHtml(md))
              : mdToHtml(supportData[i].notes);
        }
      }
    } else if (typeof supportData === 'object') {
      if ('notes' in supportData) {
        (feature.data as any).__compat.support[browser].notes = Array.isArray(
          (supportData as any).notes,
        )
          ? (supportData as any).notes.map((md) => mdToHtml(md))
          : mdToHtml((supportData as any).notes);
      }
    }
  }
};

/**
 * Adds missing IE statements.
 * @param {WalkOutput} feature The BCD to perform note conversion on
 * @returns {void}
 */
const addIE = (feature: WalkOutput): void => {
  if (
    feature.path.startsWith('webextensions.') &&
    !bcd.browsers.ie.accepts_webextensions
  ) {
    return;
  }
  const browsers = Object.keys(feature.compat.support);
  if (browsers.includes('edge') && !browsers.includes('ie')) {
    feature.compat.support['ie'] = { version_added: false };
  }
};

/**
 * Applies transforms to the given data.
 * @param data - The data to apply transforms to.
 */
export const applyTransforms = (data): void => {
  const walker = walk(undefined, data);

  for (const feature of walker) {
    applyMirroring(feature);
    addVersionLast(feature);
    transformMD(feature);
    addIE(feature);
  }
};

/**
 * Generate a BCD data bundle
 * @returns An object containing the prepared BCD data
 */
export const createDataBundle = async (): Promise<CompatData> => {
  const { default: bcd } = await import('../../index.js');

  applyTransforms(bcd);

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
  logWrite(dest, 'data');
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
  logWrite(dest, 'wrapper for old NodeJS versions');
};

/**
 * Write the TypeScript index for TypeScript users
 */
const writeTypeScript = async () => {
  const destRequire = new URL('require.d.ts', targetdir);
  const destImport = new URL('import.d.mts', targetdir);
  const destTypes = new URL('types.d.ts', targetdir);
  const content = `/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { CompatData } from "./types.js";

declare var bcd: CompatData;
export default bcd;
export * from "./types.js";`;

  await fs.writeFile(destRequire, content);
  logWrite(destRequire, 'CommonJS types');

  await fs.writeFile(destImport, content);
  logWrite(destImport, 'ESM types');

  await compileTS(destTypes);
  logWrite(destTypes, 'data types');
};

/**
 * Copy files from the BCD repo to the output folder
 */
const copyFiles = async () => {
  for (const file of verbatimFiles) {
    const src = new URL(file, rootdir);
    const dest = new URL(file, targetdir);
    await fs.copyFile(src, dest);
    logWrite(dest);
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
      './types': {
        types: './types.d.ts',
        default: './types.d.ts',
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
  logWrite(dest, 'manifest');
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
