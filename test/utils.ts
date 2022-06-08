/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { platform } from 'node:os';
import chalk from 'chalk-template';

export const INVISIBLES_MAP: { readonly [char: string]: string } =
  Object.freeze(
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
 * @return {string}
 */
export const pluralize = (word: string, quantifier: number): string => {
  return chalk`{bold ${quantifier}} ${word}${quantifier === 1 ? '' : 's'}`;
};

/**
 * Escapes common invisible characters.
 *
 * @param {string} str
 */
export function escapeInvisibles(str: string): string {
  // This should now be O(n) instead of O(n*m),
  // where n = string length; m = invisible characters
  return INVISIBLES_REGEXP[Symbol.replace](str, (char) => {
    return INVISIBLES_MAP[char] || char;
  });
}

/**
 * Gets the row and column matching the index in a string.
 *
 * @param {string} str
 * @param {number} index
 * @return {[number, number] | [null, null]}
 */
export function indexToPosRaw(
  str: string,
  index: number,
): [number, number] | [null, null] {
  let line = 1,
    col = 1;
  let prevChar = null;

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
      case '\n':
        if (prevChar === '\r') break;
      // fall through
      case '\r':
        line++;
        col = 1;
        break;
      case '\t':
        // Use JSON `tab_size` value from `.editorconfig`
        col += 2;
        break;
      default:
        col++;
        break;
    }
    prevChar = char;
  }

  return [line, col];
}

/**
 * Gets the row and column matching the index in a string and formats it.
 *
 * @param {string} str
 * @param {number} index
 * @return {string} The line and column in the form of: `"(Ln <ln>, Col <col>)"`
 */
export function indexToPos(str: string, index: number): string {
  const [line, col] = indexToPosRaw(str, index);
  return `(Ln ${line}, Col ${col})`;
}

/**
 * @param {string} actual
 * @param {string} expected
 * @return {string}
 */
export function jsonDiff(actual: string, expected: string): string {
  const actualLines = actual.split(/\n/);
  const expectedLines = expected.split(/\n/);

  for (let i = 0; i < actualLines.length; i++) {
    if (actualLines[i] !== expectedLines[i]) {
      return chalk`{bold line #${i + 1}}:
      {yellow → Actual:   {bold ${escapeInvisibles(actualLines[i])}}}
      {green → Expected: {bold ${escapeInvisibles(expectedLines[i])}}}`;
    }
  }
}

export type Linter = {
  name: string;
  description: string;
  scope: LinterScope;
  check: Function;
};

export type LinterScope = 'file' | 'feature' | 'browser' | 'tree';

export type LinterMessage = {
  level: 'error' | 'warning';
  title: string;
  path: string;
  message: string;
  [k: string]: any;
};

export class Logger {
  title: string;
  path: string;
  messages: LinterMessage[];

  constructor(title, path) {
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

export class Linters {
  linters: Array<Linter>;
  messages: Record<string, LinterMessage[]>;

  constructor(linters: Array<Linter>) {
    this.linters = linters;
    this.messages = {};

    for (const linter of this.linters) {
      this.messages[linter.name] = [];
    }
  }

  /**
   * @param {string} scope
   * @param {any} data
   */
  runScope(scope: LinterScope, data: any): void {
    for (const linter of this.linters.filter(
      (linter) => linter.scope === scope,
    )) {
      const logger = new Logger(linter.name, data.path.full);
      linter.check(logger, data);
      this.messages[linter.name].push(...logger.messages);
    }
  }
}
