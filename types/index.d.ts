/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import type {
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

export interface InternalCompatStatement extends Omit<
  CompatStatement,
  'support'
> {
  support: InternalSupportBlock;
}

export type DataType =
  | CompatData
  | BrowserStatement
  | CompatStatement
  | Identifier;

export type InternalDataType =
  | CompatData
  | BrowserStatement
  | InternalCompatStatement
  | Identifier;
