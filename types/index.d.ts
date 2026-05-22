/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import type {
  InternalBrowserStatement,
  InternalCompatStatement,
  InternalIdentifier,
  InternalBrowsers,
} from './internal.js';
import type {
  BrowserStatement,
  CompatData,
  CompatStatement,
  Identifier,
} from './public.js';

export type * from './internal.js';

export type DataType =
  | CompatData
  | BrowserStatement
  | CompatStatement
  | Identifier;

export type InternalDataType =
  | InternalCompatData
  | InternalBrowserStatement
  | InternalCompatStatement
  | InternalIdentifier;

export interface InternalCompatData {
  api: InternalIdentifier;
  browsers: InternalBrowsers;
  css: InternalIdentifier;
  html: InternalIdentifier;
  http: InternalIdentifier;
  javascript: InternalIdentifier;
  manifests: InternalIdentifier;
  mathml: InternalIdentifier;
  mediatypes: InternalIdentifier;
  svg: InternalIdentifier;
  webassembly: InternalIdentifier;
  webdriver: InternalIdentifier;
  webextensions: InternalIdentifier;
}

export type VersionValue = string | false;
