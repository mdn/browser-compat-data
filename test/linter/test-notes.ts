/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import HTMLParser from '@desertnet/html-parser';

import { Linter, Logger, LinterData, VALID_ELEMENTS } from '../utils.js';
import {
  BrowserName,
  CompatStatement,
  SupportStatement,
} from '../../types/types.js';

const parser = new HTMLParser();

/**
 * Recursively test a DOM node for valid elements
 * @param {any} node The DOM node to test
 * @param {BrowserName} browser The browser the notes belong to
 * @param {string} feature The identifier of the feature
 * @param {logger} logger The logger to output errors to
 */
const testNode = (
  node,
  browser: BrowserName,
  feature: string,
  logger: Logger,
): void => {
  if (node.type == 'TAG') {
    const tag = node.tagName?.toLowerCase();
    if (tag && !VALID_ELEMENTS.includes(tag)) {
      // Ensure we're only using select nodes
      logger.error(
        chalk`Notes for {bold ${feature}} in {bold ${browser}} have a {bold disallowed HTML element} ({bold <${tag}>}).  Allowed HTML elements are: ${VALID_ELEMENTS.join(
          ', ',
        )}`,
      );
    }

    // Ensure nodes only contain specific attributes
    const attrs = node.attributes.map((x) => x._name);
    if (tag === 'a') {
      if (attrs.length !== 1 || !attrs.includes('href')) {
        // Ensure 'a' nodes only contain an 'href'
        logger.error(
          chalk`Notes for {bold ${feature}} in {bold ${browser}} have an HTML element ({bold <${tag}>}) with {bold attributes other than href}. {bold <a>} elements may only have an {bold href} attribute.`,
        );
      }
    } else {
      if (attrs.length > 0) {
        // Ensure nodes (besides 'a') contain no attributes
        logger.error(
          chalk`Notes for {bold ${feature}} in {bold ${browser}} have an HTML element ({bold <${tag}>}) with {bold attributes}. Elements other than {bold <a>} may {bold not} have any attributes.`,
        );
      }
    }
  }

  for (const childNode of node.children || []) {
    testNode(childNode, browser, feature, logger);
  }
};

/**
 * Test a string for valid HTML
 * @param {string} string The string to test
 * @param {BrowserName} browser The browser the notes belong to
 * @param {string} feature The identifier of the feature
 * @param {logger} logger The logger to output errors to
 */
const validateHTML = (
  string: string,
  browser: BrowserName,
  feature: string,
  logger: Logger,
): void => {
  const htmlErrors = HTMLParser.validate(string);

  if (htmlErrors.length === 0) {
    // If HTML is valid, ensure we're only using valid elements
    testNode(parser.parse(string), browser, feature, logger);
  } else {
    logger.error(
      chalk`Notes for {bold ${feature}} in {bold ${browser}} have invalid HTML: ${htmlErrors
        .map((x) => x._message)
        .flat()}`,
    );
  }

  if (string.includes('  ')) {
    logger.error(
      chalk`Notes for {bold ${feature}} in {bold ${browser}} have double-spaces. Notes are required to have single spaces only.`,
    );
  }

  if (string.includes('\n')) {
    logger.error(
      chalk`Notes for {bold ${feature}} in {bold ${browser}} may not contain newlines.`,
    );
  }
};

/**
 * Check the notes in the data
 * @param {string|string[]} notes The notes to test
 * @param {BrowserName} browser The browser the notes belong to
 * @param {string} feature The identifier of the feature
 * @param {logger} logger The logger to output errors to
 */
const checkNotes = (
  notes: string | string[],
  browser: BrowserName,
  feature: string,
  logger: Logger,
): void => {
  if (Array.isArray(notes)) {
    for (const note of notes) {
      validateHTML(note, browser, feature, logger);
    }
  } else {
    validateHTML(notes, browser, feature, logger);
  }
};

/**
 * Process the data for notes errors
 * @param {CompatStatement} data The data to test
 * @param {Logger} logger The logger to output errors to
 * @param {string} feature The identifier of the feature
 */
const processData = (
  data: CompatStatement,
  logger: Logger,
  feature: string,
): void => {
  for (const [browser, support] of Object.entries(data.support) as [
    BrowserName,
    SupportStatement,
  ][]) {
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

export default {
  name: 'Notes',
  description: 'Test the notes in each support statement',
  scope: 'feature',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger: Logger, { data, path: { full } }: LinterData) => {
    processData(data, logger, full);
  },
} as Linter;
