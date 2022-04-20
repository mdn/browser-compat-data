'use strict';
const chalk = require('chalk');
const parser = require('node-html-parser');
const { HtmlValidate } = require('html-validate');
const { VALID_ELEMENTS } = require('./utils.js');

const validator = new HtmlValidate();

/**
 * @typedef {import('../../types').Identifier} Identifier
 *
 * @typedef {'disallowed' | 'attrs' | 'attrs_a' | 'invalid' | 'doublespace'} HTMLErrorType
 *
 * @typedef {object} HTMLError
 * @property {HTMLErrorType} errortype The type of error
 * @property {string} feature The identifier of the feature
 * @property {string} browser The browser where the error was found
 * @property {string} tag The specific HTML tag
 * @property {string[]} messages Messages to describe the error
 */

/**
 * Recursively test a DOM node for valid elements
 *
 * @param {object} node The DOM node to test
 * @param {string} browser The browser the notes belong to
 * @param {string} feature The identifier of the feature
 * @param {HTMLError[]} errors The array to push errors to
 * @returns {void}
 */
const testNode = (node, browser, feature, errors) => {
  if (node.nodeType == 1) {
    const tag = node.tagName?.toLowerCase();
    if (tag && !VALID_ELEMENTS.includes(tag)) {
      // Ensure we're only using select nodes
      errors.push({
        type: 'disallowed',
        feature,
        browser,
        tag,
      });
    } else if (tag === 'a') {
      if (
        Object.entries(node.attributes).length !== 1 ||
        Object.entries(node.attributes)[0][0] !== 'href'
      ) {
        // Ensure 'a' nodes only contain an 'href'
        errors.push({
          type: 'attrs_a',
          feature,
          browser,
          tag,
        });
      }
    } else {
      if (Object.entries(node.attributes).length !== 0) {
        // Ensure nodes (besides 'a') contain no attributes
        errors.push({
          type: 'attrs',
          feature,
          browser,
          tag,
        });
      }
    }
  }
  for (let childNode of node.childNodes) {
    testNode(childNode, browser, feature, errors);
  }
};

/**
 * Test a string for valid HTML
 *
 * @param {string} string The string to test
 * @param {string} browser The browser the notes belong to
 * @param {string} feature The identifier of the feature
 * @param {HTMLError[]} errors The array to push errors to
 * @returns {void}
 */
const validateHTML = (string, browser, feature, errors) => {
  const report = validator.validateString(string, {
    rules: {
      'attr-quotes': 'off',
    },
  });
  if (report.valid) {
    // If HTML is valid, ensure we're only using valid elements
    let data = parser.parse(string);
    testNode(data, browser, feature, errors);
  } else {
    errors.push({
      type: 'invalid',
      messages: report.results
        .map(x => x.messages)
        .flat()
        .map(x => x.message),
      feature,
      browser,
    });
  }

  if (string.includes('  ')) {
    errors.push({
      type: 'doublespace',
      feature,
      browser,
    });
  }
};

/**
 * Check the notes in the data
 *
 * @param {string|string[]} notes The notes to test
 * @param {string} browser The browser the notes belong to
 * @param {string} feature The identifier of the feature
 * @param {HTMLError[]} errors The array to push errors to
 * @returns {void}
 */
const checkNotes = (notes, browser, feature, errors) => {
  if (Array.isArray(notes)) {
    for (let note of notes) {
      checkNotes(note, browser, feature, errors);
    }
  } else {
    validateHTML(notes, browser, feature, errors);
  }
};

/**
 * Process the data for notes errors
 *
 * @param {Identifier} data The data to test
 * @param {HTMLError[]} errors The array to push errors to
 * @param {string} [feature] The identifier of the feature
 * @returns {void}
 */
const processData = (data, errors, feature) => {
  for (const prop in data) {
    if (prop === '__compat' && data[prop].support) {
      let statement = data[prop].support;
      for (const browser in statement) {
        if (Array.isArray(statement[browser])) {
          for (let s of statement[browser]) {
            if (s.notes) checkNotes(s.notes, browser, feature, errors);
          }
        } else {
          if (statement[browser].notes)
            checkNotes(statement[browser].notes, browser, feature, errors);
        }
      }
    }
    const sub = data[prop];
    if (typeof sub === 'object') {
      processData(sub, errors, feature ? `${feature}.${prop}` : `${prop}`);
    }
  }
};

/**
 * Test the data for notes errors
 *
 * @param {string} filename The file to test
 * @returns {boolean} Whether the file had any errors
 */
const testNotes = filename => {
  /** @type {Identifier} */
  const data = require(filename);

  /** @type {HTMLError[]} */
  const errors = [];

  processData(data, errors);

  if (!errors.length) {
    return false;
  }

  console.error(
    chalk`{red   Notes – {bold ${errors.length}} ${
      errors.length === 1 ? 'error' : 'errors'
    }:}`,
  );
  for (const error of errors) {
    switch (error.type) {
      case 'invalid':
        console.error(
          chalk`{red   Notes for {bold ${error.feature}} in {bold ${
            error.browser
          }} have invalid HTML: ${error.messages.join(', ')}}`,
        );
        break;
      case 'disallowed':
        console.error(
          chalk`{red   Notes for {bold ${error.feature}} in {bold ${
            error.browser
          }} have a {bold disallowed HTML element} ({bold <${
            error.tag
          }>}).  Allowed HTML elements are: ${VALID_ELEMENTS.join(', ')}}`,
        );
        break;
      case 'attrs':
        console.error(
          chalk`{red   Notes for {bold ${error.feature}} in {bold ${error.browser}} have an HTML element ({bold <${error.tag}>}) with {bold attributes}. Elements other than {bold <a>} may {bold not} have any attributes.}`,
        );
        break;
      case 'attrs_a':
        console.error(
          chalk`{red   Notes for {bold ${error.feature}} in {bold ${error.browser}} have an HTML element ({bold <${error.tag}>}) with {bold attributes}. {bold <a>} elements may only have an {bold href} attribute.}`,
        );
        break;
      case 'doublespace':
        console.error(
          chalk`{red   Notes for {bold ${error.feature}} in {bold ${error.browser}} have double-spaces. Notes are required to have single spaces only.}`,
        );
        break;
    }
  }
  return true;
};

module.exports = testNotes;
