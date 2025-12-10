/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { platform } from 'node:os';

import chalk from 'chalk-template';

import { DataType } from '../types/index.js';
import { BrowserName, SimpleSupportStatement } from '../types/types.js';

export interface LintOptions {
  only?: string[];
}

const INVISIBLES_MAP: Readonly<Record<string, string>> = Object.freeze(
  Object.assign(Object.create(null), {
    '\0': '\\0', // ␀ (0x00)
    '\b': '\\b', // ␈ (0x08)
    '\t': '\\t', // ␉ (0x09)
    '\n': '\\n', // ␊ (0x0A)
    '\v': '\\v', // ␋ (0x0B)
    '\f': '\\f', // ␌ (0x0C)
    '\r': '\\r', // ␍ (0x0D)
  }),
);

/* eslint-disable-next-line no-control-regex */
export const INVISIBLES_REGEXP = /[\0\x08-\x0D]/g;

/** Used to check if the process is running in a CI environment. */
export const IS_CI = process.env.CI?.toLowerCase() === 'true';

/** Determines if the OS is Windows */
export const IS_WINDOWS = platform() === 'win32';

export const VALID_ELEMENTS = ['code', 'kbd', 'em', 'strong', 'a'];

/**
 * Escapes common invisible characters.
 * @param str The string to escape invisibles for
 * @returns The string with invisibles escaped
 */
export const escapeInvisibles = (str: string): string =>
  INVISIBLES_REGEXP[Symbol.replace](
    str,
    (char) => INVISIBLES_MAP[char] || char,
  );

/**
 * Gets the row and column matching the index in a string.
 * @param str The string
 * @param index The character index
 * @returns The position from the index
 */
export const indexToPosRaw = (
  str: string,
  index: number,
): [number, number] | [null, null] => {
  let line = 1,
    col = 1;

  if (
    typeof str !== 'string' ||
    typeof index !== 'number' ||
    index > str.length
  ) {
    return [null, null];
  }

  for (let i = 0; i < index; i++) {
    const char = str[i];
    switch (char) {
      case '\r':
        line++;
        col = 1;
        if (i + 1 < index && str[i + 1] === '\r') {
          i++;
        }
        break;
      case '\t':
        // Use JSON `tab_size` value from `.editorconfig`
        col += 2;
        break;
      default:
        col++;
        break;
    }
  }

  return [line, col];
};

/**
 * Gets the row and column matching the index in a string and formats it.
 * @param str The string
 * @param index The character index
 * @returns The line and column in the form of: `"(Ln <ln>, Col <col>)"`
 */
export const indexToPos = (str: string, index: number): string => {
  const [line, col] = indexToPosRaw(str, index);
  return `(Ln ${line}, Col ${col})`;
};

/**
 * Get the stringified difference between two JSON strings
 * @param actual Actual JSON string
 * @param expected Expected JSON string
 * @returns Statement explaining the difference in provided JSON strings
 */
export const jsonDiff = (actual: string, expected: string): string | null => {
  const actualLines = actual.split(/\n/);
  const expectedLines = expected.split(/\n/);

  if (actualLines.length !== expectedLines.length) {
    return chalk`{bold different number of lines:
    {yellow → Actual:   {bold ${actualLines.length}}}
    {green → Expected: {bold ${expectedLines.length}}}}`;
  }

  for (let i = 0; i < actualLines.length; i++) {
    if (actualLines[i] !== expectedLines[i]) {
      return chalk`{bold line #${i + 1}}:
      {yellow → Actual:   {bold ${escapeInvisibles(actualLines[i])}}}
      {green → Expected: {bold ${escapeInvisibles(expectedLines[i])}}}`;
    }
  }

  return null;
};

export interface Linter {
  name: string;
  description: string;
  scope: LinterScope;
  check: (logger: Logger, options: object) => void | Promise<void>;
  exceptions?: string[];
}

export type LinterScope = 'file' | 'feature' | 'browser' | 'tree';

export type LinterMessageLevel = 'error' | 'warning' | 'info';

export interface LinterMessage {
  level: LinterMessageLevel;
  title: string;
  path: string;
  message: string;
  fixable?: true;
  [k: string]: any;
}

export interface LinterPath {
  full: string;
  category: string;
  browser?: BrowserName;
}

export interface LinterData {
  data: DataType;
  rawdata: string;
  path: LinterPath;
}

/**
 * Linter logger class
 */
export class Logger {
  title: string;
  path: string;
  messages: LinterMessage[];

  /**
   * Construct the logger
   * @param title Logger title
   * @param path The scope path
   */
  constructor(title: string, path: string) {
    this.title = title;
    this.path = path;
    this.messages = [];
  }

  /**
   * Report an error
   * @param message Message string
   * @param options Additional options (ex. actual, expected)
   */
  error(message: string, options?: object): void {
    this.messages.push({
      level: 'error',
      title: this.title,
      path: this.path,
      message,
      ...options,
    });
  }

  /**
   * Report a warning
   * @param message Message string
   * @param options Additional options (ex. actual, expected)
   */
  warning(message: string, options?: object): void {
    this.messages.push({
      level: 'warning',
      title: this.title,
      path: this.path,
      message,
      ...options,
    });
  }

  /**
   * Report an info
   * @param message Message string
   * @param options Additional options (ex. actual, expected)
   */
  info(message: string, options?: object): void {
    this.messages.push({
      level: 'info',
      title: this.title,
      path: this.path,
      message,
      ...options,
    });
  }
}

/**
 * Linters class
 */
export class Linters {
  linters: Linter[];
  messages: Record<string, LinterMessage[]>;
  // Contains all seen tested objects, boolean means:
  // false - failure occurred (good)
  // true - failure did not occur (bad)
  missingExpectedFailures: Record<string, Record<string, boolean>>;

  /**
   * Construct the linters
   * @param linters All the linters
   */
  constructor(linters: Linter[]) {
    this.linters = linters;
    this.messages = {
      File: [],
    };
    this.missingExpectedFailures = {};

    for (const linter of this.linters) {
      this.messages[linter.name] = [];
      this.missingExpectedFailures[linter.name] = {};
    }
  }

  /**
   * Run the linters for a specific scope
   * @param scope The scope to run
   * @param data The data to lint
   */
  async runScope(scope: LinterScope, data: LinterData): Promise<void> {
    const linters = this.linters.filter((linter) => linter.scope === scope);
    for (const linter of linters) {
      const logger = new Logger(linter.name, data.path.full);
      try {
        const shouldFail = linter.exceptions?.includes(data.path.full);
        await linter.check(logger, data);
        if (shouldFail) {
          this.missingExpectedFailures[linter.name][data.path.full] =
            logger.messages.length === 0;
        } else {
          this.messages[linter.name].push(...logger.messages);
        }
      } catch (e: any) {
        this.messages[linter.name].push({
          level: 'error',
          title: linter.name,
          path: data.path.full,
          message: 'Linter failure! ' + e.stack,
        });
      }
    }
  }
}

/**
 * Returns the key for the group that this statement belongs to.
 * @param support The support statement.
 * @returns The key of the support statement group.
 */
export const createStatementGroupKey = (
  support: SimpleSupportStatement,
): string => {
  const parts: string[] = [];
  if (support.prefix) {
    parts.push(`prefix: ${support.prefix}`);
  }

  if (support.alternative_name) {
    parts.push(`alt. name: ${support.alternative_name}`);
  }

  if (support.flags) {
    parts.push(...support.flags.map((flag) => `${flag.type}: ${flag.name}`));
  }

  if (parts.length === 0) {
    return 'normal name';
  }

  return parts.join(' / ');
};
