const HTMLParser = require('@desertnet/html-parser');

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

function* getLinks(notes) {
  function* walk(node) {
    if (node.tagName === 'a') {
      for (const attr of node.attributes) {
        if (attr._name === 'href') {
          yield attr._value;
        }
      }
    }
    if (node.children) {
      for (const child of node.children) {
        yield* walk(child);
      }
    }
  }

  if (Array.isArray(notes)) {
    // Join notes to parse once, assuming HTML is valid enough.
    notes = notes.join('\n');
  }

  const parser = new HTMLParser();
  yield* walk(parser.parse(notes));
}

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
        for (const link of getLinks(notes)) {
          links.push(link);
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

    // Extract bug links. Reverse links so that the first one wins.
    links.reverse();
    let crbug = '';
    let bzbug = '';
    let wkbug = '';
    for (const href of links) {
      if (href.startsWith('https://crbug.com/')) {
        crbug = href;
      } else if (href.startsWith('https://bugzil.la/')) {
        bzbug = href;
      } else if (href.startsWith('https://webkit.org/b/')) {
        wkbug = href;
      }
    }
    // List entries with more than one bug:
    // if (!!crbug + !!bzbug + !!wkbug > 1) {
    //   console.log(path);
    // }
    // There can only be one link, so pick one (if any). Alternatively, we could
    // have one bug column per engine.
    let bug = crbug || bzbug || wkbug;
    if (bug) {
      crbug = `=HYPERLINK(${JSON.stringify(bug)};${JSON.stringify(bug.substr(8))})`;
    } else {
      bug = '';
    }
    console.log([linkedPath, ...statuses, ...flatSupport, bug].join(','));
  }
}

if (require.main === module) {
  main();
}
