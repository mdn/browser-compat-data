/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { DataType } from '../types/index.js';
import { BrowserName } from '../types/types.js';

import { Logger } from './utils.js';

export interface LintOptions {
  only?: string[];
}

export type LinterScope = 'file' | 'feature' | 'browser' | 'tree';

export type LinterMessageLevel = 'error' | 'warning' | 'info';

export interface LinterMessage {
  level: LinterMessageLevel;
  title: string;
  path: string;
  message: string;
  fixable?: true;
  tip?: string;
  actual?: unknown;
  expected?: unknown;
}

export interface LinterPath {
  full: string;
  category: string;
  browser?: BrowserName;
}

export interface LinterData {
  data: DataType;
  rawdata?: string;
  path: LinterPath;
}

export interface Linter {
  name: string;
  description: string;
  scope: LinterScope;
  check: (logger: Logger, data: LinterData) => void | Promise<void>;
  exceptions?: string[];
}
