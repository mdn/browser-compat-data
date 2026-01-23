/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import HTMLParser from '@desertnet/html-parser';
import { marked } from 'marked';

import { VALID_ELEMENTS } from '../utils.js';

/** @import {Linter, Logger, LinterData} from '../utils.js' */
/** @import {BrowserName, CompatStatement, SupportStatement} from '../../types/types.js' */

const parser = new HTMLParser();

/**
 * Recursively test a DOM node for valid elements
 * @param {*} node The DOM node to test
 * @returns {string[]} The errors found during validation
 */
const testNode = (node) => {
  /** @type {string[]} */
  const errors = [];
  if (node.type == 'TAG') {
    const tag = node.tagName?.toLowerCase();
    if (tag && !VALID_ELEMENTS.includes(tag)) {
      // Ensure we're only using select nodes
      errors.push(
        chalk`HTML element {bold <${tag}>} is {bold not allowed}. Allowed HTML elements are: ${VALID_ELEMENTS.join(
          ', ',
        )}`,
      );
    }

    // Ensure nodes only contain specific attributes
    const attrs = node.attributes.map((x) => x._name);
    if (tag === 'a') {
      if (attrs.length !== 1 || !attrs.includes('href')) {
        // Ensure 'a' nodes only contain an 'href'
        errors.push(
          chalk`HTML element {bold <${tag}>} has {bold invalid attributes}. {bold <${tag}>} elements may only have (and must have) an {bold href} attribute; found {bold ${
            attrs.length ? attrs.join(', ') : 'no attributes'
          }}.`,
        );
      }
    } else {
      if (attrs.length > 0) {
        // Ensure nodes (besides 'a') contain no attributes
        errors.push(
          chalk`HTML element {bold <${tag}>} has {bold invalid attributes}. Elements other than {bold <a>} may {bold not} have any attributes; found {bold ${attrs.join(
            ', ',
          )}}.`,
        );
      }
    }
  }

  for (const childNode of node.children || []) {
    errors.push(...testNode(childNode));
  }

  return errors;
};

/**
 * Test a string for valid HTML
 * @param {string} string The string to test
 * @returns {string[]} The errors found during validation
 */
export const validateHTML = (string) => {
  /** @type {string[]} */
  const errors = [];
  const html = marked.parseInline(string);
  const htmlErrors = HTMLParser.validate(html);

  if (htmlErrors.length === 0) {
    // If HTML is valid, ensure we're only using valid elements
    errors.push(...testNode(parser.parse(html)));
  } else {
    errors.push(
      chalk`Invalid HTML: ${htmlErrors.map((x) => x._message).join(', ')}`,
    );
  }

  if (string.includes('  ')) {
    errors.push(chalk`Double-spaces are not allowed.`);
  }

  if (string.includes('\n')) {
    errors.push(chalk`Newlines are not allowed.`);
  }

  return errors;
};

/**
 * Check the notes in the data
 * @param {string | string[]} notes The notes to test
 * @param {BrowserName} browser The browser the notes belong to
 * @param {string} feature The identifier of the feature
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
const checkNotes = (notes, browser, feature, logger) => {
  /** @type {*} */
  let errors = [];
  if (Array.isArray(notes)) {
    for (const note of notes) {
      errors = validateHTML(note);
    }
  } else {
    errors = validateHTML(notes);
  }

  if (errors) {
    for (const error of errors) {
      logger.error(chalk`Notes for {bold ${browser}} → ${error}`);
    }
  }
};

/**
 * Process the data for notes errors
 * @param {CompatStatement} data The data to test
 * @param {Logger} logger The logger to output errors to
 * @param {string} feature The identifier of the feature
 * @returns {void}
 */
const processData = (data, logger, feature) => {
  for (const [
    browser,
    support,
  ] of /** @type {[BrowserName, SupportStatement][]} */ (
    Object.entries(data.support)
  )) {
    if (Array.isArray(support)) {
      for (const s of support) {
        if (s.notes) {
          checkNotes(s.notes, browser, feature, logger);
        }
      }
    } else {
      if (support.notes) {
        checkNotes(support.notes, browser, feature, logger);
      }
    }
  }
};

/** @type {Linter} */
export default {
  name: 'Notes',
  description: 'Test the notes in each support statement',
  scope: 'feature',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data, path: { full } }) => {
    processData(data, logger, full);
  },
};
