var path = require('path');

function testHierarchy(dataFilename) {

  var data = require(dataFilename);

  var localFilePath = dataFilename.replace(path.resolve(__dirname, '..') + path.sep, '');
  var levels = localFilePath.replace(".json", "").split("/");

  var hasErrors = false;

  // HTTP is the only folder that has non matching capitalization
  // between the file name and the compat data content.
  if (levels[0] !== "http") {

    hasErrors = !hierarchyExists(data, levels);

    if (hasErrors) {
      console.error("Incorrect hierarachy in file: " + localFilePath);
      console.error("Make sure the filename is correct and matches the interface name");
      console.error("Expected hierarchy based on the current file name: " + levels.join(" > "));
    }
  }

  return hasErrors;
}

function hierarchyExists(obj, levels) {
  if (levels.length === 0) {
    return true;
  } else if (obj.hasOwnProperty(levels[0])) {
    return hierarchyExists(obj[levels[0]], levels.slice(1));
  } else {
    return false;
  }
}

module.exports.testHierarchy = testHierarchy;
