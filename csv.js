const bcd = require('.');
const { walk } = require('./utils');

const browsers = Object.keys(bcd.browsers);

const entryPoints = [
  'api',
  //'browsers',
  'css',
  'html',
  'http',
  'javascript',
  'mathml',
  'svg',
  // Not web exposed in the typical way:
  // 'webdriver', 'webextensions',
  // https://github.com/mdn/browser-compat-data/pull/9830:
  // 'xpath', 'xslt',
];

function main() {
  console.log(`path,${browsers.join(',')}`);
  for (const {path, compat} of walk(entryPoints, bcd)) {
    const flatSupport = browsers.map(b => {
      let ranges = compat.support[b];
      if (!ranges) {
        return null;
      }
      if (!Array.isArray(ranges)) {
        ranges = [ranges];
      }
      ranges = ranges.filter(r => !r.flags);
      if (!ranges.length) {
        return false;
      }
      const firstRange = ranges[0];
      if (firstRange.version_removed) {
        return false;
      }
      return firstRange.version_added;
    }).map(String);
    console.log([path, ...flatSupport].join(','));
  }
}

if (require.main === module) {
  main();
}
