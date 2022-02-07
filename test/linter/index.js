'use strict';
const testBrowsers = require('./test-browsers.js');
const testLinks = require('./test-links.js');
const testPrefix = require('./test-prefix.js');
const testRealValues = require('./test-real-values.js');
const testSchema = require('./test-schema.js');
const testStyle = require('./test-style.js');
const testVersions = require('./test-versions.js');
const { testConsistency } = require('./test-consistency.js');
const testDescriptions = require('./test-descriptions.js');
const testNotes = require('./test-notes.js');

module.exports = {
  testBrowsers,
  testLinks,
  testPrefix,
  testRealValues,
  testStyle,
  testSchema,
  testVersions,
  testConsistency,
  testDescriptions,
  testNotes,
};
