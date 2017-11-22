var browsers = require('./../browsers/browsers.json');

var validBrowserVersions = {};
for (let browser of Object.keys(browsers)) {
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
  var hasErrors = false;
  var data = require(dataFilename);

  function checkVersions(supportData) {
    var browsersToCheck = Object.keys(supportData);
    for (let browser of browsersToCheck) {
      if (validBrowserVersions[browser]) {

        let supportStatements = [];
        if (Array.isArray(supportData[browser])) {
          Array.prototype.push.apply(supportStatements, supportData[browser]);
        } else {
          supportStatements.push(supportData[browser]);
        }

        for (let statement of supportStatements) {
          if (!isValidVersion(browser, statement.version_added)) {
            console.error('\x1b[31m  version_added: "' + statement.version_added + '" is not a valid version number for ' + browser);
            hasErrors = true;
          }
          if (!isValidVersion(browser, statement.version_removed)) {
            console.error('\x1b[31m  version_removed: "' + statement.version_removed + '" is not a valid version number for ' + browser);
            hasErrors = true;
          }
        }
      }
    }
  }

  function findSupport(data) {
    for (var prop in data) {
      if (prop === 'support') {
        checkVersions(data[prop]);
      }
      var sub = data[prop];
      if (typeof(sub) === "object") {
        findSupport(sub);
      }
    }
  }
  findSupport(data);

  if (hasErrors) {
    console.error('\x1b[31m  File : ' + filename); 
    console.error('\x1b[31m  Browser version error(s)\x1b[0m');
    return true;
  } else {
    console.log('\x1b[32m  Browser versions – OK \x1b[0m');
    return false;
  }
}

module.exports.testVersions = testVersions;
