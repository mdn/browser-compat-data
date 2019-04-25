'use strict';
const path = require('path');
const compareVersions = require('compare-versions');
/**
 * @typedef {import('../types').Identifier} Identifier
 * @typedef {import('../types').SimpleSupportStatement} SimpleSupportStatement
 * @typedef {import('../types').SupportBlock} SupportBlock
 * @typedef {import('../types').VersionValue} VersionValue
 */
const browsers = require('..').browsers;

/** @type {Object<string, string[]>} */
const validBrowserVersions = {};
for (const browser of Object.keys(browsers)) {
  validBrowserVersions[browser] = Object.keys(browsers[browser].releases);
}

/**
 * @param {string} browserIdentifier
 * @param {VersionValue} version
 */
function isValidVersion(browserIdentifier, version) {
  if (typeof version === "string") {
    return validBrowserVersions[browserIdentifier].includes(version);
  } else {
    return true;
  }
}

/**
 * @param {string} dataFilename
 */
function testVersions(dataFilename) {
  const data = require(dataFilename);
  let hasErrors = false;

  /**
   * @param {SupportBlock} supportData
   */
  function checkVersions(supportData) {
    const browsersToCheck = Object.keys(supportData);
    for (const browser of browsersToCheck) {
      if (validBrowserVersions[browser]) {
        /** @type {SimpleSupportStatement[]} */
        const supportStatements = [];
        if (Array.isArray(supportData[browser])) {
          Array.prototype.push.apply(supportStatements, supportData[browser]);
        } else {
          supportStatements.push(supportData[browser]);
        }

        for (const statement of supportStatements) {
          if (!isValidVersion(browser, statement.version_added)) {
            console.error('\x1b[31m  version_added: "' + statement.version_added + '" is not a valid version number for ' + browser);
            console.error('  Valid ' + browser + ' versions are: ' + validBrowserVersions[browser].join(', '));
            hasErrors = true;
          }
          if (!isValidVersion(browser, statement.version_removed)) {
            console.error('\x1b[31m  version_removed: "' + statement.version_removed + '" is not a valid version number for ' + browser);
            console.error('  Valid ' + browser + ' versions are: ' + validBrowserVersions[browser].join(', '));
            hasErrors = true;
          }
          if ("version_removed" in statement && "version_added" in statement) {
            if (typeof statement.version_added !== "string" && statement.version_added !== true) {
              console.error('\x1b[31m  version_added: "' + statement.version_added + '" is not a valid version number when version_removed is present');
              console.error('  Valid', browser, 'versions are:', validBrowserVersions[browser].length > 0 ? 'true, ' + validBrowserVersions[browser].join(', ') : 'true');
              hasErrors = true;
            } else if (typeof statement.version_added === "string" && typeof statement.version_removed === "string" && compareVersions(statement.version_added, statement.version_removed) >= 0) {
              console.error('\x1b[31m  version_removed: "' + statement.version_removed + '" must be greater than version_added: "' + statement.version_added + '"');
              hasErrors = true;
            }
          }
        }
      }
    }
  }

  /**
   * @param {Identifier} data
   */
  function findSupport(data) {
    for (const prop in data) {
      if (prop === '__compat' && data[prop].support) {
        checkVersions(data[prop].support);
      }
      const sub = data[prop];
      if (typeof(sub) === "object") {
        findSupport(sub);
      }
    }
  }
  findSupport(data);

  if (hasErrors) {
    console.error('\x1b[31m  File : ' + path.relative(process.cwd(), dataFilename));
    console.error('\x1b[31m  Browser version error(s)\x1b[0m');
    return true;
  } else {
    return false;
  }
}

module.exports = testVersions;
