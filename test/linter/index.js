/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const testBrowsersData = require('./test-browsers-data.js');
const testBrowsersPresence = require('./test-browsers-presence.js');
const { testConsistency } = require('./test-consistency.js');
const testDescriptions = require('./test-descriptions.js');
const { testLinks } = require('./test-links.js');
const testNotes = require('./test-notes.js');
const testPrefix = require('./test-prefix.js');
const testRealValues = require('./test-real-values.js');
const testSchema = require('./test-schema.js');
const testStatusInheritance = require('./test-status-inheritance.js');
const testStyle = require('./test-style.js');
const testVersions = require('./test-versions.js');

module.exports = {
  testBrowsersData,
  testBrowsersPresence,
  testConsistency,
  testDescriptions,
  testLinks,
  testNotes,
  testPrefix,
  testRealValues,
  testSchema,
  testStatusInheritance,
  testStyle,
  testVersions,
};
