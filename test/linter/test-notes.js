'use strict';
const chalk = require('chalk');
const parser = require('node-html-parser');
const { HtmlValidate } = require('html-validate');
const { VALID_ELEMENTS } = require('../utils.js');

const validator = new HtmlValidate();

/**
 * @typedef {import('../../types').Identifier} Identifier
 *
 * @typedef {'disallowed' | 'attrs' | 'attrs_a'} ErrorType
 *
 * @typedef {object} NotesError
 * @property {ErrorType} errortype The type of error
 * @property {string} relPath The identifier of the feature
 * @property {string} browser The browser where the error was found
 * @property {string} tag The specific HTML tag
 */

/**
 * Test a specific HTML tag (node) in notes for issues
 *
 * @param {object} node The HTML node to test
 * @param {string} browser The browser the notes belong to
 * @param {string} relPath The identifier of the feature
 * @param {NotesError[]} errors The array to push errors to
 * @returns {void}
 */
const testNode = (node, browser, relPath, errors) => {
  if (node.nodeType == 1) {
    const tag = node.tagName?.toLowerCase();
    if (tag && !VALID_ELEMENTS.includes(tag))
      errors.push({
        type: 'disallowed',
        relPath,
        browser,
        tag,
      });
    if (tag !== 'a' && Object.entries(node.attributes).length !== 0) {
      errors.push({
        type: 'attrs',
        relPath,
        browser,
        tag,
      });
    }
    if (
      tag === 'a' &&
      (Object.entries(node.attributes).length !== 1 ||
        Object.entries(node.attributes)[0][0] !== 'href')
    ) {
      errors.push({
        type: 'attrs_a',
        relPath,
        browser,
        tag,
      });
    }
  }
  for (let childNode of node.childNodes) {
    testNode(childNode, browser, relPath, errors);
  }
};

/**
 * Recursively check the notes in the data
 *
 * @param {string|string[]} notes The notes to test
 * @param {string} browser The browser the notes belong to
 * @param {string} relPath The identifier of the feature
 * @param {NotesError[]} errors The array to push errors to
 * @returns {void}
 */
const checkNotes = (notes, browser, relPath, errors) => {
  if (Array.isArray(notes)) {
    for (let note of notes) {
      checkNotes(note, browser, relPath, errors);
    }
  } else {
    const report = validator.validateString(notes, {
      rules: {
        'attr-quotes': 'off',
      },
    });
    if (report.valid) {
      // If HTML is valid, ensure we're only using valid elements
      let notesData = parser.parse(notes);
      testNode(notesData, browser, relPath, errors);
    } else {
      errors.push({
        type: 'invalid',
        messages: report.results
          .map(x => x.messages)
          .flat()
          .map(x => x.message),
        relPath: relPath,
        browser: browser,
        tag: null,
      });
    }

    if (notes.includes('  ')) {
      errors.push({
        type: 'doublespace',
        relPath: relPath,
        browser: browser,
        tag: null,
      });
    }
  }
};

/**
 * Process the data for notes errors
 *
 * @param {Identifier} data The data to test
 * @param {NotesError[]} errors The array to push errors to
 * @param {string} [relPath] The identifier of the feature
 * @returns {void}
 */
const processData = (data, errors, relPath) => {
  for (const prop in data) {
    if (prop === '__compat' && data[prop].support) {
      let statement = data[prop].support;
      for (const browser in statement) {
        if (Array.isArray(statement[browser])) {
          for (let s in statement[browser]) {
            if (s.notes) checkNotes(s.notes, browser, relPath, errors);
          }
        } else {
          if (statement[browser].notes)
            checkNotes(statement[browser].notes, browser, relPath, errors);
        }
      }
    }
    const sub = data[prop];
    if (typeof sub === 'object') {
      processData(sub, errors, relPath ? `${relPath}.${prop}` : `${prop}`);
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

  /** @type {NotesError[]} */
  const errors = [];

  processData(data, errors);

  if (errors.length) {
    console.error(
      chalk`{red   Notes – {bold ${errors.length}} ${
        errors.length === 1 ? 'error' : 'errors'
      }:}`,
    );
    for (const error of errors) {
      switch (error.type) {
        case 'invalid':
          console.error(
            chalk`{red   Notes for {bold ${error.relPath}} in {bold ${
              error.browser
            }} have broken HTML: ${error.messages.join(', ')}}`,
          );
          break;
        case 'disallowed':
          console.error(
            chalk`{red   Notes for {bold ${error.relPath}} in {bold ${
              error.browser
            }} have a {bold disallowed HTML element} ({bold <${
              error.tag
            }>}).  Allowed HTML elements are: ${VALID_ELEMENTS.join(', ')}}`,
          );
          break;
        case 'attrs':
          console.error(
            chalk`{red   Notes for {bold ${error.relPath}} in {bold ${error.browser}} have an HTML element ({bold <${error.tag}>}) with {bold attributes}.  Elements other than {bold <a>} may {bold not} have any attributes.}`,
          );
          break;
        case 'attrs_a':
          console.error(
            chalk`{red   Notes for {bold ${error.relPath}} in {bold ${error.browser}} have an HTML element ({bold <${error.tag}>}) with {bold attributes}.  {bold <a>} elements may only have an {bold href} attribute.}`,
          );
          break;
        case 'doublespace':
          console.error(
            chalk`{red   Notes for {bold ${error.relPath}} in {bold ${error.browser}} have double-spaces.  Notes are required to have single spaces only.}`,
          );
          break;
      }
    }
    return true;
  }
  return false;
};

module.exports = testNotes;
