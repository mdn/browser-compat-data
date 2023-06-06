/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { SupportStatement } from '../types';

export type InternalSupportStatement = SupportStatement | 'mirror';

export type InternalSupportBlock = Partial<
  Record<BrowserName, InternalSupportStatement>
>;

export type DataType =
  | CompatData
  | BrowserStatement
  | CompatStatement
  | Identifier;
