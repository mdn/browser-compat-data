/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const path = require('path');
const url = require('url');
const zlib = require('zlib');

const chalk = require('chalk');
const request = require('sync-request');
const { JSDOM } = require('jsdom');

const { Logger } = require('./utils.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

const downloadResource = (resource_url) => {
  const options = {
    headers: { 'User-Agent': 'mdn-browser-compat-data' },
    gzip: true,
  };
  console.log(`Downloading ${resource_url}...`);
  let response = request('GET', resource_url, options);
  console.log(`Downloading ${resource_url}... Done!`);
  return response;
};

/**
 * @returns {string[]}
 */
const getSpecURLs = () => {
  const specUrls = downloadResource(
    'https://raw.githubusercontent.com/w3c/mdn-spec-links/main/SPECURLS.json',
  );
  return JSON.parse(specUrls.getBody('utf8'));
};

/**
 * @returns {string[]}
 */
const getMDNURLs = () => {
  const mdnSitemap = downloadResource(
    'https://developer.mozilla.org/sitemaps/en-us/sitemap.xml.gz',
  );

  const xml = zlib.gunzipSync(mdnSitemap.getBody()).toString('utf8');
  const dom = new JSDOM('');
  const DOMParser = dom.window.DOMParser;
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const loc_elements = doc.documentElement.querySelectorAll('loc');

  return Array.from(loc_elements).map(
    (el) => 'https://developer.mozilla.org/' + el.textContent.substring(36),
  );
};

const SPECURLS = getSpecURLs();
const MDNURLS = getMDNURLs();

/**
 * @param {string} mdnURL
 * @returns {boolean}
 */
const needsSpecURL = (mdnURL) => {
  const exceptions = [
    'https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/createConicGradient',
    'https://developer.mozilla.org/docs/Web/API/Document/featurePolicy',
    'https://developer.mozilla.org/docs/Web/API/FeaturePolicy/allowedFeatures',
    'https://developer.mozilla.org/docs/Web/API/FeaturePolicy/allowsFeature',
    'https://developer.mozilla.org/docs/Web/API/FeaturePolicy/features',
    'https://developer.mozilla.org/docs/Web/API/FeaturePolicy/getAllowlistForFeature',
    'https://developer.mozilla.org/docs/Web/API/FeaturePolicy',
    'https://developer.mozilla.org/docs/Web/API/GlobalEventHandlers/onloadend',
    'https://developer.mozilla.org/docs/Web/API/HTMLElement/inert',
    'https://developer.mozilla.org/docs/Web/API/HTMLIFrameElement/featurePolicy',
    'https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/controller',
    'https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/mediaGroup',
    'https://developer.mozilla.org/docs/Web/API/MouseEvent/region',
  ];
  if (exceptions.includes(mdnURL)) {
    return false;
  }
  const slugSubstringsNotNeedingSpecURLs = [];
  return !slugSubstringsNotNeedingSpecURLs.some((substring) =>
    mdnURL.includes(substring),
  );
};

const checkSpecURL = (spec_url, mdn_url, standard_track, deprecated) => {
  if (
    spec_url.startsWith('https://datatracker.ietf.org/doc/html/rfc2324') ||
    spec_url.startsWith('https://datatracker.ietf.org/doc/html/rfc7168')
  ) {
    // "I'm a teapot" RFC; ignore
    return true;
  }
  if (
    spec_url.match(
      /https:\/\/www.khronos.org\/registry\/webgl\/extensions\/[^/]+\//,
    )
  ) {
    return true;
  }
  if (SPECURLS.includes(spec_url)) {
    return true;
  }
  return !(mdn_url && standard_track && !deprecated);
};

/**
 * @param {Identifier} data
 * @param {Logger} logger
 * @param {string} [path]
 */
function processData(data, logger, path = '') {
  if (data.__compat && data.__compat.status) {
    const {
      status: { standard_track, deprecated },
      mdn_url,
      spec_url,
    } = data.__compat;

    if (!mdn_url && !(deprecated || !standard_track)) {
      if (!path.includes('_')) {
        logger.error(chalk`{red → {bold ${path}} requires an {bold mdn_url}}`);
      }
    }
    if (spec_url && spec_url.length !== 0) {
      if (!standard_track) {
        logger.error(
          chalk`{red → {bold ${path}} is marked as {bold non-standard}, but has a {bold spec_url}}`,
        );
      }
      for (const u of spec_url instanceof Array ? spec_url : [spec_url]) {
        if (!checkSpecURL(u, mdn_url, standard_track, deprecated)) {
          logger.error(
            chalk`{red → {bold ${path}} has a bad {bold spec_url} (${u}). Bad fragment?}`,
          );
        }
      }
    } else if (
      mdn_url &&
      !url.parse(mdn_url).hash &&
      standard_track &&
      !deprecated
    ) {
      if (needsSpecURL(mdn_url) && MDNURLS.includes(mdn_url)) {
        logger.error(chalk`{red → {bold ${path}} requires a {bold spec_url}}`);
      }
    }
  }

  for (const key in data) {
    if (key === '__compat') continue;

    processData(
      data[key],
      logger,
      path && path.length > 0 ? `${path}.${key}` : key,
    );
  }
}

/**
 * @param {string} filename
 * @returns {boolean} If the file contains errors
 */
function testSpecLinks(filename) {
  /** @type {Identifier} */
  const data = require(filename);

  const logger = new Logger('Spec Links');

  processData(data, logger);

  logger.emit();
  return logger.hasErrors();
}

module.exports = testSpecLinks;
