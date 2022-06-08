/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Linter, Logger } from '../utils.js';
import { CompatStatement } from '../../types/types.js';

import chalk from 'chalk-template';
import HTMLParser from '@desertnet/html-parser';

import { VALID_ELEMENTS } from '../utils.js';

const parser = new HTMLParser();

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../utils').Logger} Logger
 */

/**
 * Recursively test a DOM node for valid elements
 *
 * @param {object} node The DOM node to test
 * @param {string} browser The browser the notes belong to
 * @param {string} feature The identifier of the feature
 * @param {logger} logger The logger to output errors to
 * @returns {void}
 */
const testNode = (node, browser, feature, logger) => {
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

  for (let childNode of node.children || []) {
    testNode(childNode, browser, feature, logger);
  }
};

/**
 * Test a string for valid HTML
 *
 * @param {string} string The string to test
 * @param {string} browser The browser the notes belong to
 * @param {string} feature The identifier of the feature
 * @param {logger} logger The logger to output errors to
 * @returns {void}
 */
const validateHTML = (string, browser, feature, logger) => {
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
 *
 * @param {string|string[]} notes The notes to test
 * @param {string} browser The browser the notes belong to
 * @param {string} feature The identifier of the feature
 * @param {logger} logger The logger to output errors to
 * @returns {void}
 */
const checkNotes = (notes, browser, feature, logger) => {
  if (Array.isArray(notes)) {
    for (let note of notes) {
      validateHTML(note, browser, feature, logger);
    }
  } else {
    validateHTML(notes, browser, feature, logger);
  }
};

/**
 * Process the data for notes errors
 *
 * @param {CompatStatement} data The data to test
 * @param {logger} logger The logger to output errors to
 * @param {string} [feature] The identifier of the feature
 * @returns {void}
 */
const processData = (data, logger, feature) => {
  for (const browser in data.support) {
    if (Array.isArray(data.support[browser])) {
      for (let s of data.support[browser]) {
        if (s.notes) checkNotes(s.notes, browser, feature, logger);
      }
    } else {
      if (data.support[browser].notes)
        checkNotes(data.support[browser].notes, browser, feature, logger);
    }
  }
};

export default {
  name: 'Notes',
  description: 'Test the notes in each support statement',
  scope: 'feature',
  check(logger: Logger, { data }: { data: CompatStatement }) {
    processData(data, logger);
  },
} as Linter;
