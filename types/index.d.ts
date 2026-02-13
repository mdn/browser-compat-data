/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import type {
  BrowserName,
  BrowserStatement,
  CompatData,
  CompatStatement,
  Identifier,
  SimpleSupportStatement,
  SupportStatement,
} from './types.js';

export type {
  Browsers,
  BrowserName,
  BrowserStatement,
  BrowserStatus,
  FlagStatement,
  MetaBlock,
  ReleaseStatement,
  SimpleSupportStatement,
  StatusBlock,
  VersionValue,
} from './types.js';

export type InternalCompatData = Omit<CompatData, '__meta'>;

export type InternalSupportStatement = SupportStatement | 'mirror';
export type InternalSimpleSupportStatement = SimpleSupportStatement | 'mirror';

export type InternalSupportBlock = Partial<
  Record<BrowserName, InternalSupportStatement>
>;

export interface InternalCompatStatement extends Omit<
  CompatStatement,
  'source_file' | 'support'
> {
  support: InternalSupportBlock;
}

export type InternalIdentifier =
  | {
      __compat: InternalCompatStatement;
      [k: string]: InternalIdentifier;
    }
  | {
      __compat?: InternalCompatStatement;
      [k: string]: InternalIdentifier;
    }
  | {
      [k: string]: InternalIdentifier;
    };

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
