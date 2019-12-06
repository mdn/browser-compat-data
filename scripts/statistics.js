'use strict';
const bcd = require('..');

/**
 * @typedef {object} VersionStats
 * @property {number} all The total number of occurrences for the browser.
 * @property {number} true The total number of `true` values for the browser.
 * @property {number} null The total number of `null` values for the browser.
 * @property {number} range The total number of range values for the browser.
 * @property {number} real The total number of real values for the browser.
 */

const browsers = [
  'chrome',
  'chrome_android',
  'edge',
  'firefox',
  'ie',
  'safari',
  'safari_ios',
  'webview_android',
];
/** @type {{total: VersionStats; [browser: string]: VersionStats}} */
let stats = { total: { all: 0, true: 0, null: 0, range: 0, real: 0 } };
browsers.forEach(browser => {
  stats[browser] = { all: 0, true: 0, null: 0, range: 0, real: 0 };
});

const checkSupport = (supportData, type) => {
  if (!Array.isArray(supportData)) {
    supportData = [supportData];
  }
  if (type == '≤') {
    return supportData.some(
      item =>
        (typeof item.version_added == 'string' &&
          item.version_added.startsWith('≤')) ||
        (typeof item.version_removed == 'string' &&
          item.version_removed.startsWith('≤')),
    );
  }
  return supportData.some(
    item => item.version_added === type || item.version_removed === type,
  );
};

const processData = data => {
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
        } else if (checkSupport(data.support[browser], true)) {
          stats[browser].true++;
          stats.total.true++;
          real_value = false;
        } else if (checkSupport(data.support[browser], '≤')) {
          stats[browser].range++;
          stats.total.range++;
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

const iterateData = data => {
  for (const key in data) {
    if (key === '__compat') {
      processData(data[key]);
    } else {
      iterateData(data[key]);
    }
  }
};

if (process.argv[2]) {
  iterateData(bcd[process.argv[2]]);
} else {
  for (const data in bcd) {
    if (!(data === 'browsers' || data === 'webextensions')) {
      iterateData(bcd[data]);
    }
  }
}

const printTable = () => {
  let table = `| browser | real values | ranged values | \`true\` values | \`null\` values |
| --- | --- | --- | --- | --- |
`;

  Object.keys(stats).forEach(entry => {
    table += `| ${entry.replace('_', ' ')} | `;
    table += `${((stats[entry].real / stats[entry].all) * 100).toFixed(2)}% | `;
    table += `${((stats[entry].range / stats[entry].all) * 100).toFixed(
      2,
    )}% | `;
    table += `${((stats[entry].true / stats[entry].all) * 100).toFixed(2)}% | `;
    table += `${((stats[entry].null / stats[entry].all) * 100).toFixed(2)}% |
`;
  });

  console.log(table);
};

console.log(
  `Status as of version 0.0.xx (released on 2019-MM-DD) for ${
    process.argv[2] ? `${process.argv[2]}/ directory` : `web platform features`
  }: \n`,
);
printTable();
