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

    /*
     * Before adding an exception, open an issue with https://github.com/w3c/browser-specs to
     * see if a spec should be added there instead.
     * When adding an exception here, provide a reason and indicate how the exception can be removed.
     */
    const specsExceptions = [
      // Remove once https://github.com/whatwg/html/pull/6715 is resolved
      'https://wicg.github.io/controls-list/',

      // Remove once Window.{clearImmediate,setImmediate} are irrelevant and removed
      'https://w3c.github.io/setImmediate/',

      // Remove if supported in browser-specs https://github.com/w3c/browser-specs/issues/280
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

      // Unfortunately this doesn't produce a rendered spec, so it isn't in browser-specs
      // Remove if it is in the main ECMA spec
      'https://github.com/tc39/proposal-regexp-legacy-features/',

      // For the 'shared' flag in WebAssembly.Memory
      // Remove if this spec will be merged with the main WebAssembly spec
      'https://webassembly.github.io/threads/js-api/',

      // Not really a browser feature, thus not in browser-specs
      // Remove if it is in the main ECMA spec
      'https://tc39.es/proposal-hashbang/out.html',

      // Remove if https://github.com/w3c/mathml/issues/216 is resolved
      'https://w3c.github.io/mathml/',

      // Remove when xpath/xslt data is removed in https://github.com/mdn/browser-compat-data/pull/9830
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
