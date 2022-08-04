/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { DataType } from '../types/index.js';
import { BrowserName } from '../types/types.js';

import { platform } from 'node:os';
import chalk from 'chalk-template';

/**
 * @typedef LinterScope
 * @type {('file'|'feature'|'browser'|'tree')}
 */

/**
 * @typedef LoggerLevel
 * @type {('error'|'warning')}
 */

/**
 * @typedef Linter
 * @type {{name: string, description: string,  scope: string,  check: any}}
 */

const INVISIBLES_MAP: { readonly [char: string]: string } = Object.freeze(
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
export const IS_CI =
  process.env.CI && String(process.env.CI).toLowerCase() === 'true';

/** Determines if the OS is Windows */
export const IS_WINDOWS = platform() === 'win32';

/** @type {string[]} */
export const VALID_ELEMENTS = ['code', 'kbd', 'em', 'strong', 'a'];

/**
 * Pluralizes a string
 *
 * @param {string} word Word in singular form
 * @param {number} quantifier
 * @returns {string}
 */
export const pluralize = (word: string, quantifier: number): string =>
  chalk`{bold ${quantifier}} ${word}${quantifier === 1 ? '' : 's'}`;

/**
 * Escapes common invisible characters.
 *
 * @param {string} str
 * @returns {string}
 */
export const escapeInvisibles = (str: string): string =>
  INVISIBLES_REGEXP[Symbol.replace](
    str,
    (char) => INVISIBLES_MAP[char] || char,
  );

/**
 * Gets the row and column matching the index in a string.
 *
 * @param {string} str
 * @param {number} index
 * @returns {[number, number] | [null, null]}
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
 *
 * @param {string} str
 * @param {number} index
 * @returns {string} The line and column in the form of: `"(Ln <ln>, Col <col>)"`
 */
export const indexToPos = (str: string, index: number): string => {
  const [line, col] = indexToPosRaw(str, index);
  return `(Ln ${line}, Col ${col})`;
};

/**
 * @param {string} actual
 * @param {string} expected
 * @returns {string?} Statement explaining the difference in provided JSON strings
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

export type Linter = {
  name: string;
  description: string;
  scope: LinterScope;
  check: (logger: Logger, options: object) => void;
  exceptions?: string[];
};

export type LinterScope = 'file' | 'feature' | 'browser' | 'tree';

export type LinterMessageLevel = 'error' | 'warning';

export type LinterMessage = {
  level: LinterMessageLevel;
  title: string;
  path: string;
  message: string;
  [k: string]: any;
};

export type LinterPath = {
  full: string;
  category?: string;
  browser?: BrowserName;
};

export type LinterData = {
  data: DataType;
  rawdata: string;
  path: LinterPath;
};

/**
 *
 */
export class Logger {
  title: string;
  path: string;
  messages: LinterMessage[];

  /**
   *
   * @param {string} title
   * @param {string} path
   */
  constructor(title: string, path: string) {
    this.title = title;
    this.path = path;
    this.messages = [];
  }

  /**
   * @param {string} message
   * @param {object} options
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
   * @param {string} message
   * @param {object} options
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
}

/**
 *
 */
export class Linters {
  linters: Linter[];
  messages: Record<string, LinterMessage[]>;
  // Contains all seen tested objects, boolean means:
  // false - failure occured (good)
  // true - failure did not occur (bad)
  missingExpectedFailures: Record<string, Record<string, boolean>>;

  /**
   *
   * @param {Linter[]} linters
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
   * @param {LinterScope} scope
   * @param {LinterData} data
   */
  runScope(scope: LinterScope, data: LinterData): void {
    const linters = this.linters.filter((linter) => linter.scope === scope);
    for (const linter of linters) {
      const logger = new Logger(linter.name, data.path.full);
      try {
        const shouldFail = linter.exceptions?.includes(data.path.full);
        linter.check(logger, data);
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
          path: e.traceback,
          message: 'Linter failure! ' + e,
        });
      }
    }
  }
}
