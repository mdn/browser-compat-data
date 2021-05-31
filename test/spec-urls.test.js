'use strict';
const assert = require('assert');
const specData = require('browser-specs');
const { visit } = require('../utils');

describe('spec_url data', () => {
  it('spec_url specifications only use allow listed hosts by w3c/browser-specs (and those we allow list for now)', () => {
    const toVisit = [
      'api',
      'css',
      'html',
      'http',
      'javascript',
      'mathml',
      'svg',
      'webdriver',
    ];

    let specURLs = [];
    for (const key of toVisit) {
      visit(
        (path, feature) => {
          if (feature.spec_url) {
            if (Array.isArray(feature.spec_url)) {
              specURLs.push(...feature.spec_url);
            } else {
              specURLs.push(feature.spec_url);
            }
          }
        },
        {
          entryPoint: key,
        },
      );
    }

    let specsNotInBrowserSpecs = [];
    specURLs.forEach(url => {
      let spec = specData.find(
        spec =>
          url.startsWith(spec.url) ||
          url.startsWith(spec.nightly.url) ||
          url.startsWith(spec.series.nightlyUrl),
      );
      if (!spec) {
        specsNotInBrowserSpecs.push(url.split('#')[0]);
      }
    });

    let uniqueSpecsNotInBrowserSpecs = [
      ...new Set(specsNotInBrowserSpecs.sort()),
    ];

    let temporaryAllowList = [
      'https://wicg.github.io/controls-list/',
      'https://w3c.github.io/webrtc-extensions/',
      'https://w3c.github.io/setImmediate/',
      'https://datatracker.ietf.org/doc/html/rfc2397',
      'https://datatracker.ietf.org/doc/html/rfc8942',
      'https://datatracker.ietf.org/doc/html/rfc7231',
      'https://datatracker.ietf.org/doc/html/rfc7233',
      'https://datatracker.ietf.org/doc/html/rfc7234',
      'https://datatracker.ietf.org/doc/html/rfc7838',
      'https://datatracker.ietf.org/doc/html/rfc8246',
      'https://datatracker.ietf.org/doc/html/rfc7230',
      'https://datatracker.ietf.org/doc/html/rfc6266',
      'https://datatracker.ietf.org/doc/html/rfc7578',
      'https://datatracker.ietf.org/doc/html/rfc6265',
      'https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-digest-headers-05',
      'https://datatracker.ietf.org/doc/html/rfc8470',
      'https://datatracker.ietf.org/doc/html/rfc7232',
      'https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-expect-ct-08',
      'https://datatracker.ietf.org/doc/html/rfc7239',
      'https://datatracker.ietf.org/doc/html/draft-thomson-hybi-http-timeout-03',
      'https://datatracker.ietf.org/doc/html/rfc6454',
      'https://datatracker.ietf.org/doc/html/rfc7235',
      'https://datatracker.ietf.org/doc/html/rfc7469',
      'https://datatracker.ietf.org/doc/html/rfc6797',
      'https://datatracker.ietf.org/doc/html/rfc7540',
      'https://datatracker.ietf.org/doc/html/rfc7034',
      'https://datatracker.ietf.org/doc/html/rfc7538',
      'https://datatracker.ietf.org/doc/html/rfc2324',
      'https://datatracker.ietf.org/doc/html/rfc7725',
      'https://github.com/tc39/proposal-regexp-legacy-features/',
      'https://webassembly.github.io/threads/js-api/',
      'https://tc39.es/proposal-hashbang/out.html',
      'https://tc39.es/proposal-pipeline-operator/',
      'https://mathml-refresh.github.io/mathml/',
    ].sort();

    // Ideally browser-specs has all relevant specs included
    // and so uniqueSpecsNotInBrowserSpecs should be []
    // However, for the moment we need an allow list
    assert.deepStrictEqual(uniqueSpecsNotInBrowserSpecs, temporaryAllowList);
  });
});
