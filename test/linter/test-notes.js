/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const chalk = require('chalk');
const HTMLParser = require('@desertnet/html-parser');
const { Logger, VALID_ELEMENTS } = require('../utils.js');

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
 * @param {Identifier} data The data to test
 * @param {logger} logger The logger to output errors to
 * @param {string} [feature] The identifier of the feature
 * @returns {void}
 */
const processData = (data, logger, feature) => {
  for (const prop in data) {
    if (prop === '__compat' && data[prop].support) {
      let statement = data[prop].support;
      for (const browser in statement) {
        if (Array.isArray(statement[browser])) {
          for (let s of statement[browser]) {
            if (s.notes) checkNotes(s.notes, browser, feature, logger);
          }
        } else {
          if (statement[browser].notes)
            checkNotes(statement[browser].notes, browser, feature, logger);
        }
      }
    }
    const sub = data[prop];
    if (typeof sub === 'object') {
      processData(sub, logger, feature ? `${feature}.${prop}` : `${prop}`);
    }
  }
};

/**
 * Test the data for notes errors
 *
 * @param {string} filename The file to test
 * @returns {boolean} Whether the file had any errors
 */
const testNotes = (filename) => {
  /** @type {Identifier} */
  const data = require(filename);
  const logger = new Logger('Notes');

  processData(data, logger);

  logger.emit();
  return logger.hasErrors();
};

module.exports = testNotes;
