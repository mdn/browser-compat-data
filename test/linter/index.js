'use strict';
const testBrowsersData = require('./test-browsers-data.js');
const testBrowsersPresence = require('./test-browsers-presence.js');
const testLinks = require('./test-links.js');
const testPrefix = require('./test-prefix.js');
const testRealValues = require('./test-real-values.js');
const testSchema = require('./test-schema.js');
const testStyle = require('./test-style.js');
const testVersions = require('./test-versions.js');
const { testConsistency } = require('./test-consistency.js');
const testDescriptions = require('./test-descriptions.js');

module.exports = {
  testBrowsersData,
  testBrowsersPresence,
  testLinks,
  testPrefix,
  testRealValues,
  testStyle,
  testSchema,
  testVersions,
  testConsistency,
  testDescriptions,
};
