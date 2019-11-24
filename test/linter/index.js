'use strict';
const testBrowsers = require('./test-browsers.js');
const testLinks = require('./test-links.js');
const testMDNUrls = require('./test-mdn_url.js');
const testPrefix = require('./test-prefix.js');
const testRealValues = require('./test-real-values.js');
const testSchema = require('./test-schema.js');
const testStyle = require('./test-style.js');
const testVersions = require('./test-versions.js');
const testConsistency = require('./test-consistency.js');
const testDescriptions = require('./test-descriptions.js');

module.exports = {
  testBrowsers,
  testLinks,
  testMDNUrls,
  testPrefix,
  testRealValues,
  testStyle,
  testSchema,
  testVersions,
  testConsistency,
  testDescriptions
};
