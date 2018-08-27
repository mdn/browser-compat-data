'use strict';
const path = require('path');
const {browsers} = require('..');

const validBrowserVersions = {};
for (const browser of Object.keys(browsers)) {
  validBrowserVersions[browser] = Object.keys(browsers[browser].releases);
}

function isValidVersion(browserIdentifier, version) {
  if (typeof version === "string") {
    return validBrowserVersions[browserIdentifier].includes(version);
  } else {
    return true;
  }
}

function testVersions(dataFilename) {
  const data = require(dataFilename);
  let hasErrors = false;

  function checkVersions(supportData) {
    const browsersToCheck = Object.keys(supportData);
    for (const browser of browsersToCheck) {
      if (validBrowserVersions[browser]) {

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
            }
          }
        }
      }
    }
  }

  function findSupport(data) {
    for (const prop in data) {
      if (prop === 'support') {
        checkVersions(data[prop]);
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
    console.log('\x1b[32m  Browser versions – OK \x1b[0m');
    return false;
  }
}

module.exports.testVersions = testVersions;
