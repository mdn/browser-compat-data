'use strict';
const path = require('path');
const chalk = require('chalk');
const parser = require('node-html-parser');
const { VALID_ELEMENTS } = require('../utils.js');

function testNode(node, browser, relPath, errors) {
  if (node.nodeType == 1) {
    if (node.tagName && !VALID_ELEMENTS.includes(node.tagName))
      errors.push({ relPath: relPath, browser: browser, tag: node.tagName });
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
      console.error(
        `  Notes for ${error.relPath} in ${
          error.browser
        } have a disallowed HTML element (<${
          error.tag
        }>).  Allowed HTML elements are: ${VALID_ELEMENTS.join(', ')}`,
      );
    }
    return true;
  }
  return false;
}

module.exports = testNotes;
