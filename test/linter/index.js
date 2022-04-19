'use strict';
const testBrowsers = require('./test-browsers.js');
const testLinks = require('./test-links.js');
const testPrefix = require('./test-prefix.js');
const testSchema = require('./test-schema.js');
const testStyle = require('./test-style.js');
const testVersions = require('./test-versions.js');
const { testConsistency } = require('./test-consistency.js');
const testDescriptions = require('./test-descriptions.js');

module.exports = {
  testBrowsers,
  testLinks,
  testPrefix,
  testStyle,
  testSchema,
  testVersions,
  testConsistency,
  testDescriptions,
};
