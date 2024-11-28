/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import specData from 'web-specs' assert { type: 'json' };

import { Linter, Logger, LinterData } from '../utils.js';
import { CompatStatement } from '../../types/types.js';

/*
 * Before adding an exception, open an issue with https://github.com/w3c/browser-specs to
 * see if a spec should be added there instead.
 * When adding an exception here, provide a reason and indicate how the exception can be removed.
 */
const specsExceptions = [
  // Remove once https://github.com/whatwg/html/pull/6715 is resolved
  'https://wicg.github.io/controls-list/',

  // Exception for April Fools' joke for "418 I'm a teapot"
  'https://www.rfc-editor.org/rfc/rfc2324',

  // Unfortunately this doesn't produce a rendered spec, so it isn't in browser-specs
  // Remove if it is in the main ECMA spec
  'https://github.com/tc39/proposal-regexp-legacy-features/',

  // Remove once tc39/ecma262#3221 is merged
  'https://github.com/tc39/proposal-regexp-modifiers',

  // See https://github.com/w3c/browser-specs/issues/305
  // Features with this URL need to be checked after some time
  // if they have been integrated into a real spec
  'https://w3c.github.io/webrtc-extensions/',

  // Proposals for WebAssembly
  'https://github.com/WebAssembly/spec/blob/main/proposals',
  'https://github.com/WebAssembly/exception-handling/blob/main/proposals',
  'https://github.com/WebAssembly/extended-const/blob/main/proposals',
  'https://github.com/WebAssembly/tail-call/blob/main/proposals',
  'https://github.com/WebAssembly/threads/blob/main/proposal',
  'https://github.com/WebAssembly/relaxed-simd/blob/main/proposals',
  'https://github.com/WebAssembly/multi-memory/blob/main/proposals',
  'https://github.com/WebAssembly/memory64/blob/main/proposals/memory64/Overview.md',
  'https://github.com/WebAssembly/js-string-builtins/blob/main/proposals/js-string-builtins/Overview.md',
  'https://github.com/WebAssembly/function-references/blob/main/proposals/function-references/Overview.md',
];

const allowedSpecURLs = [
  ...(specData
    .filter((spec) => spec.standing == 'good')
    .map((spec) => [
      spec.url,
      spec.nightly?.url,
      ...(spec.nightly ? spec.nightly.alternateUrls : []),
      spec.series.nightlyUrl,
    ])
    .flat()
    .filter((url) => !!url) as string[]),
  ...specsExceptions,
];

/**
 * Process the data for spec URL errors
 * @param data The data to test
 * @param logger The logger to output errors to
 */
const processData = (data: CompatStatement, logger: Logger): void => {
  if (!data.spec_url) {
    return;
  }

  const featureSpecURLs = Array.isArray(data.spec_url)
    ? data.spec_url
    : [data.spec_url];

  for (const specURL of featureSpecURLs) {
    if (!allowedSpecURLs.some((prefix) => specURL.startsWith(prefix))) {
      logger.error(
        chalk`Invalid specification URL found: {bold ${specURL}}. Check if:
         - there is a more current specification URL
         - the specification is listed in https://github.com/w3c/browser-specs
         - the specification has a "good" standing`,
      );
    }
  }
};

export default {
  name: 'Spec URLs',
  description:
    'Ensure the spec_url values match spec URLs in w3c/browser-specs (or defined exceptions)',
  scope: 'feature',
  /**
   * Test the data
   * @param logger The logger to output errors to
   * @param root The data to test
   * @param root.data The data to test
   */
  check: (logger: Logger, { data }: LinterData) => {
    processData(data, logger);
  },
} as Linter;
