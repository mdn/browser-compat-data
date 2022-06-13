/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

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

/** @type {{readonly [char: string]: string}} */
export const INVISIBLES_MAP = Object.freeze(
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
export const pluralize = (word, quantifier) => {
  return chalk`{bold ${quantifier}} ${word}${quantifier === 1 ? '' : 's'}`;
};

/**
 * Escapes common invisible characters.
 *
 * @param {string} str
 */
export function escapeInvisibles(str) {
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
export function indexToPosRaw(str, index) {
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
export function indexToPos(str, index) {
  const [line, col] = indexToPosRaw(str, index);
  return `(Ln ${line}, Col ${col})`;
}

/**
 * @param {string} actual
 * @param {string} expected
 * @return {string} Statement explaining the difference in provided JSON strings
 */
export function jsonDiff(actual, expected) {
  const actualLines = actual.split(/\n/);
  const expectedLines = expected.split(/\n/);

  if (actualLines.length !== expectedLines.length)
    return chalk`{bold different number of lines:
    {yellow → Actual:   {bold ${actualLines.length}}}
    {green → Expected: {bold ${expectedLines.length}}}}`;

  for (let i = 0; i < actualLines.length; i++) {
    if (actualLines[i] !== expectedLines[i]) {
      return chalk`{bold line #${i + 1}}:
      {yellow → Actual:   {bold ${escapeInvisibles(actualLines[i])}}}
      {green → Expected: {bold ${escapeInvisibles(expectedLines[i])}}}`;
    }
  }
}

export class Logger {
  /**
   * @param {string} title
   * @param {string} path
   */
  constructor(title, path) {
    this.title = title;
    this.path = path;
    /**
     * @type {object}
     * @property {('error'|'warning')} level - Warning level
     * @property {string} title - Message title
     * @property {string} path - Path to the feature
     * @property {string} message
     */
    this.messages = [];
  }

  /**
   * @param {string} message
   * @param {object} options
   */
  error(message, options) {
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
  warning(message, options) {
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
  /** @param {Array.<Linter>} linters */
  constructor(linters) {
    /**
     * @type {Array.<Linter>}
     */
    this.linters = linters;
    /**
     * @type {object}
     */
    this.messages = {};

    for (const linter of this.linters) {
      if (!this.#validateScope(linter.scope)) {
        throw new Error(
          `Tried to initialize "${linter.name}" linter, but found invalid scope (${linter.scope}.`,
        );
      }
      this.messages[linter.name] = [];
    }
  }

  // TODO: remove this function after migration to TypeScript
  /** @param {LinterScope} scope */
  #validateScope(scope) {
    return ['file', 'feature', 'browser', 'tree'].includes(scope);
  }

  /**
   * @param {LinterScope} scope
   * @param {{data: object, rawdata: string, path: {full: string}}} data
   */
  runScope(scope, data) {
    if (!this.#validateScope(scope)) {
      throw new Error(
        `Tried to run tests for "${scope}" which is not a valid scope.`,
      );
    }

    for (const linter of this.linters.filter(
      (linter) => linter.scope === scope,
    )) {
      const logger = new Logger(linter.title, data.path.full);
      linter.check(logger, data);
      this.messages[linter.name].push(...logger.messages);
    }
  }
}
