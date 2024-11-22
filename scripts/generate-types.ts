/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/* c8 ignore start */

import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import esMain from 'es-main';
import { fdir } from 'fdir';
import { compileFromFile } from 'json-schema-to-typescript';

import extend from './lib/extend.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

const opts = {
  bannerComment: '',
  unreachableDefinitions: true,
};

const header =
  '/* This file is a part of @mdn/browser-compat-data\n * See LICENSE file for more information. */\n\n/**\n* This file was automatically generated by json-schema-to-typescript.\n* DO NOT MODIFY IT BY HAND. Instead, modify the source schema files in\n* schemas/*, and run "npm run gentypes" to regenerate this file.\n*/';

const compatDataTypes = {
  __meta:
    'Contains metadata for the current BCD information, such as the BCD version.',
  api: 'Contains data for each [Web API](https://developer.mozilla.org/docs/Web/API) interface.',
  browsers: 'Contains data for each known and tracked browser/engine.',
  css: 'Contains data for [CSS](https://developer.mozilla.org/docs/Web/CSS) properties, selectors, and at-rules.',
  html: 'Contains data for [HTML](https://developer.mozilla.org/docs/Web/HTML) elements, attributes, and global attributes.',
  http: 'Contains data for [HTTP](https://developer.mozilla.org/docs/Web/HTTP) headers, statuses, and methods.',
  javascript:
    'Contains data for [JavaScript](https://developer.mozilla.org/docs/Web/JavaScript) built-in Objects, statement, operators, and other ECMAScript language features.',
  mathml:
    'Contains data for [MathML](https://developer.mozilla.org/docs/Web/MathML) elements, attributes, and global attributes.',
  svg: 'Contains data for [SVG](https://developer.mozilla.org/docs/Web/SVG) elements, attributes, and global attributes.',
  webassembly:
    'Contains data for [WebAssembly](https://developer.mozilla.org/docs/WebAssembly) features.',
  webdriver:
    'Contains data for [WebDriver](https://developer.mozilla.org/docs/Web/WebDriver) commands.',
  webextensions:
    'Contains data for [WebExtensions](https://developer.mozilla.org/Add-ons/WebExtensions) JavaScript APIs and manifest keys.',
};

/**
 * Generate the browser names TypeScript
 * @returns The stringified TypeScript typedef
 */
const generateBrowserNames = async () => {
  // Load browser data independently of index.ts, since index.ts depends
  // on the output of this script
  const browserData = { browsers: {} };

  const paths = new fdir()
    .withBasePath()
    .filter((fp) => fp.endsWith('.json'))
    .crawl(path.join(dirname, '..', 'browsers'))
    .sync() as string[];

  for (const fp of paths) {
    try {
      const contents = await fs.readFile(fp);
      extend(browserData, JSON.parse(contents.toString('utf8')));
    } catch (e) {
      // Skip invalid JSON. Tests will flag the problem separately.
      continue;
    }
  }

  // Generate BrowserName type
  const browsers = Object.keys(browserData.browsers);
  return `/**\n * The names of the known browsers.\n */\nexport type BrowserName = ${browsers
    .map((b) => `"${b}"`)
    .join(' | ')};`;
};

/**
 * Generate the CompatData TypeScript
 * @returns The stringified TypeScript typedef
 */
const generateCompatDataTypes = (): string => {
  const props = Object.entries(compatDataTypes).map(
    (t) =>
      `  /**\n   * ${t[1]}\n   */\n  ${t[0]}: ${
        t[0] === '__meta'
          ? 'MetaBlock'
          : t[0] === 'browsers'
            ? 'Browsers'
            : 'Identifier'
      };`,
  );

  const metaType =
    'export interface MetaBlock {\n  version: string;\n  timestamp: string;\n}';

  return `${metaType}\n\nexport interface CompatData {\n${props.join(
    '\n\n',
  )}\n}\n`;
};

/**
 * Transform the TypeScript to remove unneeded bits of typedefs
 * @param browserTS Typedefs for BrowserName
 * @param compatTS Typedefs for CompatData
 * @returns Updated typedefs
 */
const transformTS = (browserTS: string, compatTS: string): string => {
  // XXX Temporary until the following PR is merged and released:
  // https://github.com/bcherny/json-schema-to-typescript/pull/456
  let ts = browserTS + '\n\n' + compatTS;

  ts = ts
    .replace(
      'export interface BrowserDataFile {\n  browsers?: Browsers;\n}',
      '',
    )
    .replace('export interface CompatDataFile {}', '')
    .replace(
      /\/\*\*\n \* This interface was referenced by `CompatDataFile`'s JSON-Schema definition\n \* via the `patternProperty` "\^webextensions\*\$"\.\n \*\/\nexport type WebextensionsIdentifier = Identifier;\n/,
      '',
    )
    .replace(
      /\/\*\*\n \* This interface was referenced by `CompatDataFile`'s JSON-Schema\n \* via the `definition` "webextensions_identifier"\.\n \*\/\nexport type WebextensionsIdentifier1 = .*;\n/,
      '',
    )
    .replace(
      /\/\*\*\n \* This interface was referenced by `CompatDataFile`'s JSON-Schema\n \* via the `definition` "spec_url_value"\.\n \*\/\nexport type SpecUrlValue = string;\n/,
      '',
    )
    .replace(
      /\/\*\*\n \* This interface was referenced by `CompatDataFile`'s JSON-Schema\n \* via the `definition` "impl_url_value"\.\n \*\/\nexport type ImplUrlValue = string;\n/,
      '',
    )
    .replace(
      '/**\n * This interface was referenced by `CompatDataFile`\'s JSON-Schema\n * via the `definition` "support_block".\n */\nexport type SupportBlock1 = Partial<Record<BrowserName, SupportStatement>>;\n',
      '',
    )
    .replace(
      /\/\*\*\n \* This interface was referenced by `CompatDataFile`'s JSON-Schema\n \* via the `definition` "status_block"\.\n \*\/\nexport interface StatusBlock1 {(.*\n)*}\n/,
      '',
    );

  return ts;
};

/**
 * Compile the TypeScript typedefs from the schema JSON
 * @param destination Output destination
 */
const compile = async (
  destination: URL | string = new URL('../types/types.d.ts', import.meta.url),
) => {
  const browserTS = await compileFromFile('schemas/browsers.schema.json', opts);
  const compatTS = await compileFromFile(
    'schemas/compat-data.schema.json',
    opts,
  );

  const ts = [
    header,
    await generateBrowserNames(),
    'export type VersionValue = string | boolean | null;',
    transformTS(browserTS, compatTS),
    generateCompatDataTypes(),
  ].join('\n\n');
  await fs.writeFile(destination, ts);
  execSync('tsc --skipLibCheck ../types/types.d.ts', {
    cwd: dirname,
    stdio: 'inherit',
  });
};

if (esMain(import.meta)) {
  await compile();
}

export default compile;

/* c8 ignore stop */
