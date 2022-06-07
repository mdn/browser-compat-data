/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs/promises';

import esMain from 'es-main';
import { compileFromFile } from 'json-schema-to-typescript';

import bcd from '../index.js';

const opts = {
  bannerComment: '',
  unreachableDefinitions: true,
};

const header =
  '/* This file is a part of @mdn/browser-compat-data\n * See LICENSE file for more information. */\n\n/**\n* This file was automatically generated by json-schema-to-typescript.\n* DO NOT MODIFY IT BY HAND. Instead, modify the source schema files in\n* schemas/*, and run "npm run gentypes" to regenerate this file.\n*/';

const compatDataTypes = {
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
  webdriver:
    'Contains data for [WebDriver](https://developer.mozilla.org/docs/Web/WebDriver) commands.',
  webextensions:
    'Contains data for [WebExtensions](https://developer.mozilla.org/Add-ons/WebExtensions) JavaScript APIs and manifest keys.',
};

const generateBrowserNames = () => {
  const browsers = Object.keys(bcd.browsers);
  return `/**\n * The names of the known browsers.\n */\nexport type BrowserName = ${browsers
    .map((b) => `"${b}"`)
    .join(' | ')};`;
};

const generateCompatDataTypes = () => {
  const props = Object.entries(compatDataTypes).map(
    (t) =>
      `  /**\n   * ${t[1]}\n   */\n  ${t[0]}: ${
        t[0] === 'browsers' ? 'Browsers' : 'Identifier'
      };`,
  );
  return `export interface CompatData {\n${props.join('\n\n')}\n}\n`;
};

const transformTS = (browserTS, compatTS) => {
  // XXX Temporary until the following PR is merged and released:
  // https://github.com/bcherny/json-schema-to-typescript/pull/456
  let ts = browserTS + '\n\n' + compatTS;

  ts = ts
    .replace('export type Browsers1', 'export type Browsers')
    .replace(
      'export interface Browsers {\n  browsers?: Browsers1;\n}',
      'export interface BrowserDataFile {\n  browsers?: Browsers;\n}',
    )
    .replace('export interface CompatData {}', '');

  return ts;
};

const compile = async () => {
  const browserTS = await compileFromFile('schemas/browsers.schema.json', opts);
  const compatTS = await compileFromFile(
    'schemas/compat-data.schema.json',
    opts,
  );

  const ts = [
    header,
    generateBrowserNames(),
    transformTS(browserTS, compatTS),
    generateCompatDataTypes(),
  ].join('\n\n');
  await fs.writeFile(new URL('../types-autogen.d.ts', import.meta.url), ts);
};

if (esMain(import.meta)) {
  await compile();
}
