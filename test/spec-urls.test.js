'use strict';
const assert = require('assert');
const specData = require('browser-specs');
const { walk } = require('../utils');

describe('spec_url data', () => {
  it('spec_urls only use allow listed hosts by w3c/browser-specs (and our exception list)', () => {
    const specURLs = [];

    for (const { compat } of walk()) {
      const { spec_url } = compat;
      const specs = [].concat(spec_url || []); // coerce spec_url to array, or empty array if undefined
      specURLs.push(...specs);
    }

    const specsFromBrowserSpecs = [
      ...specData.map(spec => spec.url),
      ...specData.map(spec => spec.nightly.url),
      ...specData.map(spec => spec.series.nightlyUrl),
    ];

    const specsExceptions = [
      'https://wicg.github.io/controls-list/',
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
      'https://w3c.github.io/mathml/',
      'https://www.w3.org/TR/xpath-31/',
      'https://www.w3.org/TR/xslt-30/',
    ];

    const allowList = new Set([...specsFromBrowserSpecs, ...specsExceptions]);
    const rejectedSpecs = [];

    for (const spec of specURLs) {
      if (![...allowList].find(host => spec.startsWith(host)))
        rejectedSpecs.push(spec);
    }
    assert.deepStrictEqual(
      rejectedSpecs,
      [],
      `Invalid specification host(s) found. Try a more current specification URL and/or
      check if the specification URL is listed in https://github.com/w3c/browser-specs.`,
    );
  });
});
