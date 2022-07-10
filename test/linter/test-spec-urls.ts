/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Linter, Logger } from '../utils.js';
import { CompatStatement } from '../../types/types.js';

import chalk from 'chalk-template';

import specData from 'browser-specs' assert { type: 'json' };

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

  // Remove if supported in browser-specs https://github.com/w3c/browser-specs/issues/339
  'https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-digest-headers-05',
  'https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-expect-ct-08',

  // Exception for April Fools' joke for "418 I'm a teapot"
  'https://www.rfc-editor.org/rfc/rfc2324',

  // Unfortunately this doesn't produce a rendered spec, so it isn't in browser-specs
  // Remove if it is in the main ECMA spec
  'https://github.com/tc39/proposal-regexp-legacy-features/',

  // For the 'shared' flag in WebAssembly.Memory
  // Remove if this spec will be merged with the main WebAssembly spec
  'https://webassembly.github.io/threads/js-api/',

  // Not really a browser feature, thus not in browser-specs
  // Remove if it is in the main ECMA spec
  'https://tc39.es/proposal-hashbang/out.html',

  // Remove if https://github.com/w3c/webrtc-extensions/issues/108 is closed
  'https://w3c.github.io/webrtc-extensions/',

  // Remove if https://github.com/w3c/mathml/issues/216 is resolved
  'https://w3c.github.io/mathml/',

  // Remove once https://www.w3.org/TR/largest-contentful-paint/ updates,
  // and browser-specs picks up the update; see discussion at
  // https://github.com/mdn/browser-compat-data/pull/16527#issuecomment-1145773922
  'https://w3c.github.io/largest-contentful-paint/',
];

const allowedSpecURLs = [
  ...specData.map((spec) => spec.url),
  ...specData.map((spec) => spec.nightly.url),
  ...specData.map((spec) => spec.series.nightlyUrl),
  ...specsExceptions,
];

/**
 * Process the data for spec URL errors
 *
 * @param {CompatStatement} data The data to test
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
function processData(data: CompatStatement, logger: Logger): void {
  if (!data.spec_url) {
    return;
  }

  const featureSpecURLs = Array.isArray(data.spec_url)
    ? data.spec_url
    : [data.spec_url];

  for (const specURL of featureSpecURLs) {
    if (!allowedSpecURLs.some((prefix) => specURL.startsWith(prefix))) {
      logger.error(
        chalk`Invalid specification URL found: {bold ${specURL}}. Try a more current specification URL and/or check if the specification URL is listed in https://github.com/w3c/browser-specs.`,
      );
    }
  }
}

export default {
  name: 'Spec URLs',
  description:
    'Ensure the spec_url values match spec URLs in w3c/browser-specs (or defined exceptions)',
  scope: 'feature',
  check(logger: Logger, { data }: { data: CompatStatement }) {
    processData(data, logger);
  },
} as Linter;
