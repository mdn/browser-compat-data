'use strict';
const testBrowsers = require('./test-browsers.js');
const { testConsistency } = require('./test-consistency.js');
const testDescriptions = require('./test-descriptions.js');
const testLinks = require('./test-links.js');
const testPrefix = require('./test-prefix.js');
const testSchema = require('./test-schema.js');
const testStyle = require('./test-style.js');
const testVersions = require('./test-versions.js');

module.exports = {
  testBrowsers,
  testConsistency,
  testDescriptions,
  testLinks,
  testPrefix,
  testSchema,
  testStyle,
  testVersions,
};
