/* eslint-env node */

const fs = require('fs');

const fileName = process.argv.slice(2)[0];

console.log(`Sorting version arrays in ${fileName}`);

const data = fs.readFileSync(fileName);
const compatData = JSON.parse(data.toString());

const apiName = Object.keys(compatData.api);
const methods = Object.keys(compatData.api[apiName]);

const api = compatData.api[apiName];

methods.forEach(method => {
  const support = api[method].support || api[method].__compat.support;
  const browsers = Object.keys(support);

  browsers.forEach(browser => {
    let supportData = support[browser];

    if (!Array.isArray(supportData)) {
      return;
    }

    supportData = supportData.sort((a, b) => {
      if (a.version_added && b.version_added) {
        const av = parseFloat(a.version_added);
        const bv = parseFloat(b.version_added);

        return bv - av;
      }
    });
  });
});

fs.writeFile(fileName, JSON.stringify(compatData, null, 2), err => {
  if (err) {
    return console.log(err);
  }

  console.log(`Versions have been sorted ${fileName}.`);
});
