import esMain from 'es-main';
import HTMLParser from '@desertnet/html-parser';

import bcd from './index.js';
import walk from './utils/walk.js';
import mirrorSupport from './scripts/release/mirror.js';

const entryPoints = [
  'api',
  'css',
  'javascript',
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

function getReleaseDateMap(browsers) {
  const dateMap = new Map();
  for (const browser of browsers) {
    const releases = bcd.browsers[browser].releases;
    const versions = new Map();
    for (const [version, releaseData] of Object.entries(releases)) {
      const date = releaseData.release_date;
      if (date) {
        versions.set(version, date);
      }
    }
    dateMap.set(browser, versions);
  }
  return dateMap;
}

function main() {
  const browsers = [];
  for (const [browser, browserData] of Object.entries(bcd.browsers)) {
    if (browser === 'ie') {
      continue;
    }
    if (['desktop', 'mobile'].includes(browserData.type)) {
      browsers.push(browser);
    }
  }
  const dateMap = getReleaseDateMap(browsers);
  const columns = browsers.flatMap(b => [`${b}_version`, `${b}_date`]);
  console.log(`path,deprecated,experimental,count,first_date,last_date,${columns.join(',')},comments`);
  for (const {path, compat} of walk(entryPoints, bcd)) {
    const url = compat.mdn_url;
    const linkedPath = url ? `=HYPERLINK(${JSON.stringify(url)};${JSON.stringify(path)})` : `=${JSON.stringify(path)}`;
    const statuses = [
      compat.status.deprecated,
      compat.status.experimental
    ].map((s) => `=${String(s).toUpperCase()}`);
    let count = 0;
    let first_date = '';
    let last_date = '';
    const links = [];
    const support = browsers.flatMap(browser => {
      // Flatten to string, true, false, or null using the first non-flag range.
      let ranges = compat.support[browser];
      if (ranges === 'mirror') {
        ranges = mirrorSupport(browser, compat.support);
      }
      if (!ranges) {
        return ['', ''];
      }
      if (!Array.isArray(ranges)) {
        ranges = [ranges];
      }
      ranges = ranges.filter(r => !r.flags);
      if (!ranges.length) {
        return ['', ''];
      }
      const firstRange = ranges[0];
      const notes = firstRange.notes;
      if (notes) {
        for (const link of getLinks(notes)) {
          links.push(link);
        }
      }
      if (firstRange.version_removed) {
        return ['', ''];
      }
      let version = firstRange.version_added;
      if (version === false) {
        return ['', ''];
      }
      if (version.startsWith('≤')) {
        version = version.substring(1);
      }
      const date = dateMap.get(browser).get(version);
      if (!date) {
        return ['', ''];
      }
      // Ensure the version can be interpreted as a number by keeping only major
      // and minor version part.
      const parts = version.split('.');
      if (parts.length > 2) {
        version = parts.slice(0, 2).join('.');
      }
      count++;
      if (!first_date || date < first_date) {
        first_date = date;
      }
      if (!last_date || date > last_date) {
        last_date = date;
      }
      return [version, date];
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
    console.log([linkedPath, ...statuses, count, first_date, last_date, ...support, bug].join(','));
  }
}

if (esMain(import.meta)) {
  main();
}
