/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import {
  BrowserName,
  BrowserStatement,
  CompatData,
  CompatStatement,
  Identifier,
  SupportStatement,
} from '../build/types.js';

export type InternalSupportStatement = SupportStatement | 'mirror';

export type InternalSupportBlock = Partial<
  Record<BrowserName, InternalSupportStatement>
>;

export type DataType =
  | CompatData
  | BrowserStatement
  | CompatStatement
  | Identifier;
