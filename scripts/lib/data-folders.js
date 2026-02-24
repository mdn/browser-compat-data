/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import { InternalCompatData } from "../../types/internal.js" */

export const dataFoldersMinusBrowsers = [
  'api',
  'css',
  'html',
  'http',
  'javascript',
  'manifests',
  'mathml',
  'mediatypes',
  'svg',
  'webassembly',
  'webdriver',
  'webextensions',
];

export default /** @type {Array<keyof InternalCompatData>} */ ([
  ...dataFoldersMinusBrowsers,
  'browsers',
]);
