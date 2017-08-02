var fs = require('fs');
var path = require('path');


function convert(file, filePath) {
  // remove version that is not being used or updated
  delete file.version;

  function traverse(obj) {
    for (i in obj) {
      if (!!obj[i] && typeof(obj[i])=="object") {
        // log structures that aren't nested properly and contain a dot.
        // Need to fix these manually or come up with a script here
        if (i.includes(".")) {
          console.log(i);
        }
        // there is __compat, but sub features follow, "support" should always be the next key
        if (obj[i].hasOwnProperty("__compat") && !obj[i].__compat.support) {
          let newObj = {};
          for (let feature of Object.keys(obj[i].__compat)) {
            // change "desc" to "description" and ensure it is added at the top (thus Object.assign)
            if (obj[i].__compat[feature].desc) {
              obj[i].__compat[feature] = Object.assign({description: obj[i].__compat[feature].desc}, obj[i].__compat[feature]);
              delete obj[i].__compat[feature].desc;
            }
            // basic_support is now __compat on the main feature level
            if (feature == 'basic_support') {
              newObj = obj[i].__compat.basic_support;
            } else {
              // former sub features need to have __compat too
              obj[i][feature] = {"__compat": obj[i].__compat[feature]};
            }
          }
          obj[i].__compat = newObj;
        }
        traverse(obj[i]);
      }
    }
  }
  traverse(file.data);

  fs.writeFile(filePath, JSON.stringify(file.data, null, 2), function(err) {
    if(err) {
      return console.log(err);
    }
  });

}

function load(...files) {
  for (let file of files) {
    if (file.indexOf(__dirname) !== 0) {
      file = path.resolve(__dirname, '..', file);
    }

    if (fs.statSync(file).isFile()) {
      if (path.extname(file) === '.json') {
        console.log(file.replace(path.resolve(__dirname, '..') + path.sep, ''));
        convert(require(file), file);
      }

      continue;
    }

    let subFiles = fs.readdirSync(file).map((subfile) => {
      return path.join(file, subfile);
    });

    load(...subFiles);
  }
}

load(process.argv[2])
