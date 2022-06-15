/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import {
  CompatData,
  BrowserName,
  BrowserStatement,
  CompatStatement,
  Identifier,
  SupportStatement,
} from './types';

export type InternalSupportStatement = SupportStatement | 'mirror';

// Identical to SupportBlock but with InternalSupportStatement instead of SupportStatement
export type InternalSupportBlock = Partial<
  Record<BrowserName, InternalSupportStatement>
>;

// Identical to CompatStatement but with InternalSupportStatement instead of SupportStatement
export interface InternalCompatStatement {
  description: CompatStatement['description'];
  mdn_url: CompatStatement['mdn_url'];
  spec_url: CompatStatement['spec_url'];
  source_file: CompatStatement['source_file'];
  support: InternalSupportBlock;
  status: CompatStatement['status'];
}

export type DataType =
  | CompatData
  | BrowserStatement
  | CompatStatement
  | Identifier;
