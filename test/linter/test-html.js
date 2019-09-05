'use strict';
const fs = require('fs');
const chalk = require('chalk');

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../../types').SimpleSupportStatement} SimpleSupportStatement
 * @typedef {import('../../types').CompatStatement} CompatStatement
 *
 * @typedef {import('../utils').Logger} Logger
 * @typedef {{name:string,nameStart:number,nameEnd:number,value?:string,valueEnd?:number}} AttributeDescriptor
 */

/** A regular expression used to match HTML elements. */
const ELEMENT_REGEXP = String.raw`<([a-zA-Z][^\s/>]*)(?: (.*?))?>(.*?)</\1\s*>`;
/** A regular expression used to match HTML attributes. */
const ATTR_REGEXP = String.raw`([^\x00-\x20\x7F-\x9F"'>/=\uFDD0-\uFDEF]+)(?: *= *('[^']*'|\\"[^"]*\\"|[^\x09\x0A\x0C\x0D\x20"'=<>\x60]+))?`;

/** Elements that are allowed in all properties. */
const ALLOWED_GLOBAL_ELEMENTS = [
  // Force newline
  'code',
  'em',
  'kbd',
  'strong',
];

/**
 * Elements allowed only in specific properties.
 *
 * @type {{[property: string]: string[]}}
 */
const ALLOWED_PROPERTY_ELEMENTS = {
  notes: ['a'],
};

/**
 * Special attributes that are limited only to specific elements.
 *
 * @type {{[element: string]: string[]}}
 */
const ALLOWED_ELEMENT_ATTRIBUTES = {
  a: ['href'],
};

/**
 * Checks all properties that may contain HTML in the `CompatStatement`.
 *
 * @param {CompatStatement} compat The browser compatibility statement.
 * @param {string} path The path of the feature.
 * @param {Logger} logger The logger.
 */
function checkCompatStatement(compat, path, logger) {
  let hasErrors = false;
  if (compat.description) {
    lintHTMLString(
      compat.description,
      'description',
      path,
      logger,
      // Allow `<a>` when `mdn_url` is not specified:
      compat.mdn_url ? undefined : ['a'],
    );
  }

  for (const browser in compat.support) {
    /** @type {SimpleSupportStatement[]} */
    const supportStatements = [];
    if (Array.isArray(compat.support[browser])) {
      Array.prototype.push.apply(supportStatements, compat.support[browser]);
    } else {
      supportStatements.push(/** @type {any} */ (compat.support[browser]));
    }

    for (const statement of supportStatements) {
      const notes = Array.isArray(statement.notes)
        ? statement.notes
        : [statement.notes];

      for (const note of notes) {
        lintHTMLString(note, 'notes', `${path} (${browser})`, logger);
      }
    }
  }
}

/**
 *
 * @param {string} html The HTML string to lint
 * @param {string} property The property used as an index to `ALLOWED_PROPERTY_ELEMENTS`.
 * @param {string} path The path of the feature.
 * @param {Logger} logger The logger.
 * @param {string[]} [specialElements] Dynamically allowed elements
 */
function lintHTMLString(html, property, path, logger, specialElements) {
  const regexp = new RegExp(ELEMENT_REGEXP, 'gu');
  const allowedElements = [...ALLOWED_GLOBAL_ELEMENTS];

  if (specialElements) {
    Array.prototype.push.apply(allowedElements, specialElements);
  }

  if (ALLOWED_PROPERTY_ELEMENTS[property]) {
    Array.prototype.push.apply(
      allowedElements,
      ALLOWED_PROPERTY_ELEMENTS[property],
    );
  }

  /** @type {RegExpExecArray | null} */ let match;
  /** @type {RegExpExecArray | null} */ let attrMatch;

  while (!!(match = regexp.exec(html))) {
    const attrRegexp = new RegExp(ATTR_REGEXP, 'gu');
    const [, actualElementName, attributesActual] = match;

    const realElementName = actualElementName.toLowerCase();

    if (!allowedElements.includes(realElementName)) {
      logger.error(
        chalk`{red {bold ${path}} - Element <${realElementName}> is not allowed in property '${property}'.}`,
      );
      continue;
    }

    if (actualElementName !== realElementName) {
      logger.error(
        chalk`{red {bold ${path}} - Use lowercase element name ({yellow <${actualElementName}>} → {green <${realElementName}>}).}`,
      );
    }

    /** @type {string[]} */
    const allowedAttributes = [];
    if (ALLOWED_ELEMENT_ATTRIBUTES[realElementName]) {
      Array.prototype.push.apply(
        allowedAttributes,
        ALLOWED_ELEMENT_ATTRIBUTES[realElementName],
      );
    }

    /** @type {AttributeDescriptor[]} */
    const badAttributes = [];

    if (attributesActual) {
      while (!!(attrMatch = attrRegexp.exec(attributesActual))) {
        const [attrFull, attrName, attrValue] = attrMatch;
        const attrStart = attrMatch.index;

        /** @type {AttributeDescriptor} */
        let attrDescriptor = {
          name: attrName,
          nameStart: attrStart,
          nameEnd: attrStart + attrName.length,
        };

        if (attrValue != null) {
          attrDescriptor.value = attrValue;
          attrDescriptor.valueEnd = attrStart + attrFull.length;
        }

        if (!allowedAttributes.includes(attrName)) {
          badAttributes.push(attrDescriptor);
        }
      }
    }

    if (badAttributes.length > 0) {
      const badAttributesString = badAttributes
        .reduce(
          (badAttrs, { name, value }) => {
            let result = name;
            if (typeof value === 'string') {
              result += '=' + value.includes("'") ? `"${value}"` : `'${value}'`;
            }
            badAttrs.push(result);
            return badAttrs;
          },
          /** @type {string[]} */ ([]),
        )
        .join(', ');

      logger.error(
        chalk`{red {bold ${path}} - Element <${realElementName}> has disallowed attributes: ${badAttributesString}}`,
      );
      if (allowedAttributes.length > 0) {
        logger.error(
          chalk`{red {bold ${path}} - Valid attributes for <${realElementName}> are: ${allowedAttributes.join(
            ', ',
          )}}`,
        );
      }
    }
  }
}

/**
 * @param {string} filename
 */
function testHTML(filename) {
  /** @type {Identifier} */
  const data = require(filename);

  /** @type {string[]} */
  const errors = [];
  const logger = {
    /** @param {...unknown} message */
    error: (...message) => {
      errors.push(message.join(' '));
    },
  };

  /**
   * @param {Identifier} data
   * @param {string} [path]
   */
  function walkTree(data, path) {
    for (const prop in data) {
      if (prop === '__compat') {
        checkCompatStatement(data[prop], path, logger);
        continue;
      }
      const sub = data[prop];
      if (typeof sub === 'object') {
        walkTree(sub, path ? `${path}.${prop}` : `${prop}`);
      }
    }
  }
  walkTree(data);

  if (errors.length > 0) {
    console.error(
      chalk`{red   HTML – {bold ${errors.length}} ${
        errors.length === 1 ? 'error' : 'errors'
      }:}`,
    );
    for (const error of errors) {
      console.error(`    ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testHTML;
