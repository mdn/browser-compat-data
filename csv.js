const { parse } = require('node-html-parser');

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
  console.log(`path,deprecated,experimental,${browsers.join(',')},comments`);
  for (const {path, compat} of walk(entryPoints, bcd)) {
    const url = compat.mdn_url;
    const linkedPath = url ? `=HYPERLINK(${JSON.stringify(url)};${JSON.stringify(path)})` : `=${JSON.stringify(path)}`;
    const statuses = [
      compat.status.deprecated,
      compat.status.experimental
    ].map((s) => `=${String(s).toUpperCase()}`);
    const links = [];
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
      const notes = firstRange.notes;
      if (notes) {
        const tree = parse(notes);
        for (const link of tree.querySelectorAll('a')) {
          links.push(link.getAttribute('href'));
        }
      }
      if (firstRange.version_removed) {
        return false;
      }
      return firstRange.version_added;
    }).map(version => {
      // Flatten even further to just boolean support
      return version ? '=TRUE' : '=FALSE';
    });
    let crbug = links.find(href => href.startsWith('https://crbug.com/'));
    if (crbug) {
      crbug = `=HYPERLINK(${JSON.stringify(crbug)};${JSON.stringify(crbug.substr(8))})`;
    } else {
      crbug = '';
    }
    console.log([linkedPath, ...statuses, ...flatSupport, crbug].join(','));
  }
}

if (require.main === module) {
  main();
}
