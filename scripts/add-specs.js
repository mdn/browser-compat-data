#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const UTILS = require('./utils.js');
const chalk = require('chalk');
const fs = require('fs');
const request = require('sync-request');
const PATH = require('path');
const URL = require('url');

const { JSDOM } = require('jsdom');
const { platform } = require('os');

const IS_WINDOWS = platform() === 'win32';

const log = msg => console.log(`${msg}`);
const skip = msg => console.log(chalk`{keyword('dimgrey')     ${msg}}`);
const note = msg => console.log(chalk`{cyanBright     ${msg}}`);
const warn = msg => console.warn(chalk`{yellowBright     ${msg}}`);
const error = msg => console.error(chalk`{redBright     ${msg}}`);
const success = msg => console.log(chalk`{greenBright     ${msg}}`);

const deprecatedOrNonStandardSlugSubstrings = [
  'API/AudioListener/setPosition',
  'API/CSSStyleSheet/addRule',
  'API/CSSStyleSheet/removeRule',
  'API/CSSStyleSheet/rules',
  'API/CustomEvent/initCustomEvent',
  'API/DOMImplementation/hasFeature',
  'API/Document/anchors',
  'API/Document/applets',
  'API/Document/createTouch',
  'API/Document/createTouchList',
  'API/Document/fullscreen',
  'API/Document/keypress_event',
  'API/Element/DOMActivate_event',
  'API/Element/keypress_event',
  'API/Event/initEvent',
  'API/Event/returnValue',
  'API/Event/srcElement',
  'API/FileSystemDirectoryEntry/removeRecursively',
  'API/HTMLMarqueeElement',
  'API/InputDeviceCapabilities', // only in Blink
  'API/InputDeviceCapabilities/firesTouchEvents', // only in Blink
  'API/Navigator/getBattery', // removed from Gecko
  'API/Navigator/oscpu',
  'API/Navigator/productSub',
  'API/Navigator/vendorSub',
  'API/NavigatorID/taintEnabled',
  'API/NodeIterator/detach', // specified in DOM spec as a no-op
  'API/Performance/navigation',
  'API/Performance/timing',
  'API/RTCIceCandidatePairStats',
  'API/RTCPeerConnection/',
  'API/RTCRtpTransceiver/stopped', // not in Blink, intentionally
  'API/RTCSessionDescription',
  'API/ScriptProcessorNode',
  'API/ShadowRoot/delegatesFocus',
  'API/StorageQuota',
  'API/SVG',
  'API/SyncEvent/lastChance', // Blink-only
  'API/SyncEvent/tag', // Blink-only
  'API/SyncManager', // Blink-only
  'API/Window/clearImmediate',
  'API/Window/external',
  'API/Window/orientation',
  'API/Window/setImmediate',
  'CSS/@media/-webkit',
  'CSS/@media/device',
  'CSS/:-moz-ui-invalid',
  'CSS/-webkit-',
  'CSS/azimuth',
  'CSS/clip',
  'CSS/ime-mode',
  'CSS/shape',
  'CSS/text-rendering',
  'EXSLT',
  'HTML/Element/marquee',
  'HTTP/Headers/Content-Security-Policy/report-uri',
  'JavaScript/Reference/Global_Objects/',
  'JavaScript/Reference/Statements/with',
  'MathML/Element/mfenced',
  'SVG/Attribute/color-profile',
  'SVG/Attribute/enable-background',
  'SVG/Attribute/externalResourcesRequired',
  'SVG/Attribute/requiredFeatures',
  'SVG/Attribute/xlink',
  'SVG/Attribute/xml:',
  'SVG/Element/',
];

const warnAboutDeprecatedOrNonStandard = mdnURL => {
  return !deprecatedOrNonStandardSlugSubstrings.some(substring =>
    mdnURL.includes(substring),
  );
};

const isArticleWithAsIsSpecURL = url => {
  const articlesWithAsIsSpecURLs = [
    '/JavaScript/Reference/Template_literals',
    '/JavaScript/Reference/Statements/default',
    '/Classes/Class_elements#Private_fields',
    '/Classes/Class_elements#Public_fields',
    '/API/SubmitEvent',
    '/API/SubmitEvent/SubmitEvent',
    '/API/SubmitEvent/submitter',
  ];
  return articlesWithAsIsSpecURLs.some(substring => url.includes(substring));
};

var SPECURLS;

let doFullUpdate = false;

chalk.level = 3;

const scrapeRawMdnContents = (
  html,
  feature,
  mdnURL,
  deprecated,
  nonstandard,
) => {
  let specURLs = [];
  let hasSpecURL = false;
  if (!html) {
    return specURLs;
  }
  const dom = new JSDOM(html);
  const window = dom.window;
  const document = window.document;
  const tables = document.querySelectorAll('table');
  const listitems = document.querySelectorAll('li, body > p');
  window.close();
  let items = null;
  if (tables.length === 0) {
    if (listitems.length === 0) {
      if (deprecated || nonstandard) {
        return specURLs;
      }
      error(
        `${feature}: ${mdnURL}: malformed Specifications section:` +
          ` no table`,
      );
      return null;
    } else {
      items = listitems;
    }
  } else {
    Array.from(tables).forEach(table => {
      if (items !== null) {
        return;
      }
      if (table.classList && table.classList.contains('properties')) {
        warn(
          `${feature}: ${mdnURL}: malformed Specifications section:` +
            ` starts with non-Specifications table (CSS properties table?)`,
        );
        return;
      }
      items = table.querySelectorAll('tr');
      return;
    });
  }
  if (items === null) {
    return specURLs;
  }
  Array.from(items).forEach(item => {
    let link = null;
    if (item.tagName === 'TR') {
      link = item.querySelector('td:first-of-type a');
    } else {
      link = item.querySelector('a');
      if (!link || link.textContent.trim() !== item.textContent.trim()) {
        if (deprecated || nonstandard) {
          return;
        }
        if (warnAboutDeprecatedOrNonStandard(mdnURL)) {
          if (feature === 'addHitRegion') {
            return null;
          }
          if (feature === 'image-rect') {
            return null;
          }
          if (feature === 'file-selector-button') {
            return null;
          }
          error(
            `${feature}: ${mdnURL} has malformed Specifications` +
              ` section: no table, list or paragraph with spec links,` +
              ` or malformed/unparsable spec link.`,
          );
        }
        return;
      } else {
        if (deprecated || nonstandard) {
          return;
        }
        if (mdnURL.includes('EXSLT')) {
          return null;
        }
        warn(
          `${feature}: ${mdnURL} has malformed Specifications` +
            ` section: link in list or paragraph, not table.`,
        );
      }
    }
    if (link) {
      if (!link.hasAttribute('href')) {
        error(`${feature}: ${mdnURL}: broken spec URL. Bad macro value?`);
        return;
      }
      let specURL = link.getAttribute('href').trim();
      if (!specURL.startsWith('http')) {
        error(`${feature}: ${mdnURL} has bad spec URL: ${specURL}`);
        return;
      }
      const parsedURL = URL.parse(specURL);
      const base = parsedURL.host + parsedURL.path;
      if (UTILS.isObsolete(base)) {
        if (deprecated || nonstandard) {
          return;
        }
        skip(`${feature}: ${mdnURL}: archaic spec in spec URL ${specURL}`);
        return;
      }
      if (!parsedURL.hash) {
        if (deprecated || nonstandard) {
          return;
        }
        skip(`${feature}: ${mdnURL}: no fragment in spec URL ${specURL}`);
        return;
      }
      if (!parsedURL.host) {
        if (deprecated || nonstandard) {
          return;
        }
        skip(`${feature}: ${mdnURL} no host in spec URL ${specURL}`);
        return;
      }
      if (hasSpecURL) {
        note(`${feature}: ${mdnURL} has multiple spec URLs`);
      }
      specURL = UTILS.getAdjustedSpecURL(specURL);
      if (
        UTILS.isBrokenSpecURL(specURL, parsedURL, SPECURLS) &&
        !deprecated &&
        !nonstandard
      ) {
        error(`${feature}: ${mdnURL}: bad spec URL ${specURL} Bad fragment?`);
        return;
      }
      success(`${feature}: adding ${specURL}`);
      specURLs.push(specURL);
      hasSpecURL = true;
    }
  });
  if (!hasSpecURL) {
    return null;
  }
  return specURLs;
};

const getSpecURLsArray = (
  mdnURL,
  feature,
  sectionname,
  deprecated,
  nonstandard,
) => {
  const seconds = 20;
  const rawMdnArticleURL =
    'https://wiki.developer.mozilla.org/en-US' +
    URL.parse(mdnURL).path +
    '?raw&macros&section=' +
    sectionname;
  const options = {
    headers: { 'User-Agent': 'bcd-migration-script' },
    gzip: false, // prevent Z_BUF_ERROR 'unexpected end of file'
    followRedirects: false,
    retry: true,
    retryDelay: 1000 * seconds,
  };
  try {
    const response = request('GET', rawMdnArticleURL, options);
    const statusCode = response.statusCode;
    if (statusCode === 404) {
      // delete data.mdn_url;
      error(`${feature}: 404 ${mdnURL}`);
      return null;
    } else if (response.headers.location) {
      const target =
        'https://developer.mozilla.org' + response.headers.location;
      skip(`${feature}: ${mdnURL} redirects to ${target}`);
      return null;
    } else if (statusCode >= 400) {
      error(
        `${feature}: ${statusCode} ${rawMdnArticleURL}` +
          ` (unexpected status code)`,
      );
      return null;
    }
    return scrapeRawMdnContents(
      response.getBody('utf8'),
      feature,
      mdnURL,
      deprecated,
      nonstandard,
    );
  } catch (e) {
    error(`${feature}: error for ${rawMdnArticleURL} ${e.message}.`);
    log(e);
  }
  return null;
};

const processMdnUrl = (mdnURL, feature, deprecated, nonstandard) => {
  let specURLs = getSpecURLsArray(
    mdnURL,
    feature,
    'Specifications',
    deprecated,
    nonstandard,
  );
  if (specURLs === null) {
    return null;
  }
  if (specURLs.length === 0) {
    // next, try 'Specification' (singular, the less-common case)
    specURLs = getSpecURLsArray(
      mdnURL,
      feature,
      'Specification',
      deprecated,
      nonstandard,
    );
  }
  if (specURLs === null) {
    return null;
  }
  if (specURLs.length === 0) {
    if (deprecated || nonstandard) {
      return specURLs;
    }
    skip(`${feature}: ${mdnURL} lacks spec URL`);
    return null;
  }
  if (specURLs.length == 1) {
    specURLs = specURLs[0];
  }
  return specURLs;
};

const insertSpecURLKeyIntoData = (data, specURLs) => {
  /* We need to insert the 'spec_url' key in the correct order in our BCD
   * data, right after the 'mdn_url' key, but before all other keys. */
  let afterSpecURL = false;
  for (var property in data) {
    if (property === 'mdn_url') {
      data.spec_url = specURLs;
      afterSpecURL = true;
    } else {
      if (afterSpecURL && property !== 'spec_url') {
        const prop = data[property];
        /* Delete and re-add all keys after 'mdn_url', so the 'spec_url'
         * key effectively bubbles back up into the right place. */
        delete data[property];
        data[property] = prop;
      }
    }
  }
};

const addSpecs = (key, data) => {
  let deprecated = false;
  let nonstandard = false;
  if (key === 'named_capture_groups') {
    return data;
  }
  if (data && data instanceof Object && '__compat' in data) {
    const feature = key;
    const bcdFeatureData = data.__compat;
    const mdnURL = bcdFeatureData.mdn_url;
    if (mdnURL && isArticleWithAsIsSpecURL(mdnURL)) {
      return data;
    }
    if (bcdFeatureData.spec_url !== undefined && doFullUpdate) {
      delete bcdFeatureData.spec_url;
    }
    if (bcdFeatureData.status.deprecated) {
      deprecated = true;
      skip(`${feature}: deprecated`);
    }
    if (
      bcdFeatureData.status.standard_track !== undefined &&
      bcdFeatureData.status.standard_track !== true
    ) {
      nonstandard = true;
      skip(`${feature}: non-standard`);
    }
    if (!mdnURL) {
      if (!key.includes('_')) {
        warn(`${feature}: no mdn_url`);
      }
      return data;
    }
    if (URL.parse(mdnURL).hash) {
      skip(`${feature}: ${mdnURL} skipped`);
      return data;
    }
    let specURLs = processMdnUrl(mdnURL, feature, deprecated, nonstandard);
    if (specURLs && specURLs.length !== 0) {
      if (deprecated && warnAboutDeprecatedOrNonStandard(mdnURL)) {
        warn(`${feature}: deprecated but ${mdnURL} has spec_url.`);
      }
      if (nonstandard && warnAboutDeprecatedOrNonStandard(mdnURL)) {
        warn(`${feature}: nonstandard but ${mdnURL} has spec_url.`);
      }
      insertSpecURLKeyIntoData(bcdFeatureData, specURLs);
    }
  }
  return data;
};

/**
 * @param {Promise<void>} filename
 */
const processFile = filename => {
  log(`Processing ${filename}`);

  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(JSON.parse(actual, addSpecs), null, 2);

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
  }

  if (actual !== expected) {
    fs.writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

if (require.main === module) {
  /**
   * @param {string[]} files
   */
  const load = (...files) => {
    const options = {
      headers: { 'User-Agent': 'bcd-migration-script' },
      gzip: true,
    };
    const response = request(
      'GET',
      'https://raw.githubusercontent.com/w3c/mdn-spec-links/master/SPECURLS.json',
      options,
    );
    SPECURLS = JSON.parse(response.getBody('utf8'));
    for (let file of files) {
      if (file.indexOf(__dirname) !== 0) {
        file = PATH.resolve(__dirname, '..', file);
      }

      if (!fs.existsSync(file)) {
        continue; // Ignore non-existent files
      }

      if (fs.statSync(file).isFile()) {
        if (PATH.extname(file) === '.json') {
          processFile(file);
        }

        continue;
      }

      load(...subFiles(file));
    }
  };

  const subFiles = file =>
    fs.readdirSync(file).map(subfile => {
      return PATH.join(file, subfile);
    });

  if (process.argv.includes('fullupdate')) {
    doFullUpdate = true;
  }

  if (process.argv[2] && process.argv[2] !== 'fullupdate') {
    load(process.argv[2]);
  } else {
    load(
      'api',
      'css',
      'html',
      'http',
      'mathml',
      'svg',
      'webdriver',
      'xpath',
      'xslt',
    );
  }
}

module.exports = { addSpecs, processFile };
