'use strict';
const bcd = require('..');

const browsers = ['chrome', 'chrome_android', 'edge', 'firefox', 'ie', 'safari', 'safari_ios', 'webview_android'];
let stats = { total: { all: 0, true: 0, null: 0, real: 0 } };
browsers.forEach(browser => {
  stats[browser] = { all: 0, true: 0, null: 0, real: 0 }
});

const checkSupport = (supportData, type) => {
  let foundType = false;
  if (Array.isArray(supportData)) {
    supportData.forEach(item => {
      // if 'type' occurs once in the array, mark it as found
      if (item.version_added === type || item.version_removed === type) {
        foundType = true;
      }
    });
  } else {
    foundType = (supportData.version_added === type || supportData.version_removed === type);
  }
  return foundType;
};

const processData = (data) => {
  if (data.support) {
    browsers.forEach(function(browser) {
      stats[browser].all++;
      stats.total.all++;
      let real_value = true;
      if (!data.support[browser]) {
        stats[browser].null++;
        stats.total.null++;
        real_value = false;
      } else {
        if (checkSupport(data.support[browser], null)) {
          stats[browser].null++;
          stats.total.null++;
          real_value = false;
        }
        if (checkSupport(data.support[browser], true)) {
          stats[browser].true++;
          stats.total.true++;
          real_value = false;
        }
      }
      if (real_value) {
        stats[browser].real++;
        stats.total.real++;
      }
    });
  }
};

const iterateData = (data) => {
  for (let key in data) {
    if (key == '__compat') {
      processData(data[key]);
    } else {
      iterateData(data[key]);
    }
  }
};

for (let data in bcd) {
  if (!(data === 'browsers' || data === 'webextensions')) {
    iterateData(bcd[data]);
  }
}

const printTable = () => {
  let table = `| browser | real values | \`true\` values | \`null\` values |
| --- | --- | --- | --- |
`;

  Object.keys(stats).forEach(entry => {
    table += `| ${entry.replace('_', ' ')} | `;
    table += `${((stats[entry].real / stats[entry].all) * 100).toFixed(2)}% | `;
    table += `${((stats[entry].true / stats[entry].all) * 100).toFixed(2)}% | `;
    table += `${((stats[entry].null / stats[entry].all) * 100).toFixed(2)}% |
`;
  });

  console.log(table);
}

console.log('Status as of version 0.0.xx (released on xx/xx/2019) for web platform features: \n')
printTable();
