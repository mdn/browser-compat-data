'use strict';
const testBrowsers = require('./test-browsers.js');
const { testConsistency } = require('./test-consistency.js');
const testDescriptions = require('./test-descriptions.js');
const testLinks = require('./test-links.js');
const testPrefix = require('./test-prefix.js');
const testRealValues = require('./test-real-values.js');
const testSchema = require('./test-schema.js');
const testStatus = require('./test-status.js');
const testStyle = require('./test-style.js');
const testVersions = require('./test-versions.js');

module.exports = {
  testBrowsers,
  testConsistency,
  testDescriptions,
  testLinks,
  testPrefix,
  testRealValues,
  testSchema,
  testStatus,
  testStyle,
  testVersions,
};
