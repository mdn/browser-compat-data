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
];

function main() {
  console.log(`path,deprecated,experimental,${browsers.join(',')}`);
  for (const {path, compat} of walk(entryPoints, bcd)) {
    const url = compat.mdn_url;
    const linkedPath = url ? `=HYPERLINK(${JSON.stringify(url)};${JSON.stringify(path)})` : `=${JSON.stringify(path)}`;
    const statuses = [
      compat.status.deprecated,
      compat.status.experimental
    ].map((s) => `=${String(s).toUpperCase()}`);
    const flatSupport = browsers.map(b => {
      // Flatten to string, true, false, or null using the first non-flag range.
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
    }).map(version => {
      // Flatten even further to just boolean support
      return version ? '=TRUE' : '=FALSE';
    });
    console.log([linkedPath, ...statuses, ...flatSupport].join(','));
  }
}

if (require.main === module) {
  main();
}
