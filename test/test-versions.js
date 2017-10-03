var browsers = require('./../browsers/browsers.json');

var validBrowserVersions = {};
for (let browser of Object.keys(browsers)) {
  validBrowserVersions[browser] = Object.keys(browsers[browser].releases);
}


function testVersions(dataFilename) {
  var hasErrors = false;
  var data = require(dataFilename);

  function checkVersions(supportData) {
    var browsersToCheck = Object.keys(supportData);
    for (let browser of browsersToCheck) {
      if (validBrowserVersions[browser]) {
        if (typeof supportData[browser].version_added === "string" &&
            !validBrowserVersions[browser].includes(supportData[browser].version_added)) {
          console.log('\x1b[31m  version_added: "' + supportData[browser].version_added + '" is not a valid version number for ' + browser);
          hasErrors = true;
        }
        if (typeof supportData[browser].version_removed === "string" &&
            !validBrowserVersions[browser].includes(supportData[browser].version_removed)) {
          console.log('\x1b[31m  version_removed: "' + supportData[browser].version_removed + '" is not a valid version number for ' + browser);
          hasErrors = true;
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
      if (typeof(sub) == "object") {
        findSupport(sub);
      }
    }
  }
  findSupport(data);

  if (hasErrors) {
    console.log('\x1b[31m  Browser version error(s)\x1b[0m');
    return true;
  } else {
    console.log('\x1b[32m  Browser versions – OK \x1b[0m');
    return false;
  }
}

module.exports.testVersions = testVersions;
