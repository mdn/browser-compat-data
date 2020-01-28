'use strict';
const path = require('path');
const chalk = require('chalk');
const parser = require('node-html-parser');
const { VALID_ELEMENTS } = require('../utils.js');

function testNode(node, browser, relPath, errors) {
  if (node.nodeType == 1) {
    if (node.tagName && !VALID_ELEMENTS.includes(node.tagName))
      errors.push({
        type: 'disallowed',
        relPath: relPath,
        browser: browser,
        tag: node.tagName,
      });
    if (node.tagName !== 'a' && Object.entries(node.attributes).length !== 0) {
      errors.push({
        type: 'attrs',
        relPath: relPath,
        browser: browser,
        tag: node.tagName,
      });
    }
    if (
      node.tagName === 'a' &&
      (Object.entries(node.attributes).length !== 1 ||
        Object.entries(node.attributes)[0][0] !== 'href')
    ) {
      errors.push({
        type: 'attrs_a',
        relPath: relPath,
        browser: browser,
        tag: node.tagName,
      });
    }
  }
  for (let childNode of node.childNodes) {
    testNode(childNode, browser, relPath, errors);
  }
}

function checkNotes(notes, browser, relPath, errors) {
  if (Array.isArray(notes)) {
    for (let note of notes) {
      checkNotes(note, browser, relPath, errors);
    }
  } else {
    let notesData = parser.parse(notes);
    testNode(notesData, browser, relPath, errors);
  }
}

/**
 * @param {string} filename
 */
function testNotes(filename) {
  const relativePath = path.relative(
    path.resolve(__dirname, '..', '..'),
    filename,
  );
  const category =
    relativePath.includes(path.sep) && relativePath.split(path.sep)[0];
  /** @type {Identifier} */
  const data = require(filename);

  /** @type {string[]} */
  const errors = [];

  /**
   * @param {Identifier} data
   * @param {string} [relPath]
   */
  function findSupport(data, relPath) {
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
        findSupport(sub, relPath ? `${relPath}.${prop}` : `${prop}`);
      }
    }
  }
  findSupport(data);

  if (errors.length) {
    console.error(
      chalk`{red   Notes – {bold ${errors.length}} ${
        errors.length === 1 ? 'error' : 'errors'
      }:}`,
    );
    for (const error of errors) {
      if (error.type == 'disallowed') {
        console.error(
          chalk`{red   Notes for {bold ${error.relPath}} in {bold ${
            error.browser
          }} have a {bold disallowed HTML element} ({bold <${
            error.tag
          }>}).  Allowed HTML elements are: ${VALID_ELEMENTS.join(', ')}}`,
        );
      } else if (error.type == 'attrs') {
        console.error(
          chalk`{red   Notes for {bold ${error.relPath}} in {bold ${error.browser}} have an HTML element ({bold <${error.tag}>}) with {bold attributes}.  Elements other than {bold <a>} may {bold not} have any attributes.`,
        );
      } else if (error.type == 'attrs_a') {
        console.error(
          chalk`{red   Notes for {bold ${error.relPath}} in {bold ${error.browser}} have an HTML element ({bold <${error.tag}>}) with {bold attributes}.  {bold <a>} elements may only have an {bold href} attribute.}`,
        );
      }
    }
    return true;
  }
  return false;
}

module.exports = testNotes;
