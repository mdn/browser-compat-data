/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

export type * from './types.js';

export type DataType =
  | CompatData
  | BrowserStatement
  | CompatStatement
  | Identifier;

export type InternalDataType =
  | InternalCompatData
  | BrowserStatement
  | InternalCompatStatement
  | InternalIdentifier;
