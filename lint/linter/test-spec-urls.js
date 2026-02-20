/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { styleText } from 'node:util';

/** @import {Linter, LinterData} from '../types.js' */
/** @import {Logger} from '../utils.js' */
/** @import {CompatStatement} from '../../types/types.js' */

/**
 * @typedef {object} ValidSpecHosts
 * @property {string} url
 * @property {string} alternateUrl
 */

/*
 * Before adding an exception, open an issue with https://github.com/w3c/browser-specs to
 * see if a spec should be added there instead.
 * When adding an exception here, provide a reason and indicate how the exception can be removed.
 */
const specsExceptions = [
  // Remove once SVG specs are more compatible with reffy
  // See https://github.com/mdn/browser-compat-data/pull/23958#issuecomment-3108406135
  'https://svgwg.org/',
  'https://www.w3.org/TR/SVG11/',

  // Remove once https://github.com/w3c/fxtf-drafts/issues/599 is resolved
  'https://drafts.fxtf.org/filter-effects/',

  // Remove once https://github.com/whatwg/html/pull/6715 is resolved
  'https://wicg.github.io/controls-list/',

  // Unfortunately this doesn't produce a rendered spec, so it isn't in browser-specs
  // Remove if it is in the main ECMA spec
  'https://github.com/tc39/proposal-regexp-legacy-features/',

  // See https://github.com/w3c/browser-specs/issues/305
  // Features with this URL need to be checked after some time
  // if they have been integrated into a real spec
  'https://w3c.github.io/webrtc-extensions/',

  // This is being used to develop Error.captureStackTrace() standard
  // Need to be checked after some time to see if integrated into a real spec
  'https://github.com/tc39/proposal-error-capturestacktrace',

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
  'https://github.com/WebAssembly/js-promise-integration',
  'https://github.com/WebAssembly/branch-hinting/blob/main/proposals/branch-hinting/Overview.md',

  // Media types
  'https://developers.google.com/speed/webp/docs/riff_container',
  'https://developers.google.com/speed/webp/docs/webp_lossless_bitstream_specification',
  'https://jpeg.org/jpeg/',
  'https://www.adobe.com/devnet-apps/photoshop/fileformatashtml/',
  'https://www.iso.org/standard/89035.html',
  'https://www.rfc-editor.org/rfc/rfc7903',
  'https://www.w3.org/Graphics/GIF/spec-gif87.txt',
];

/** @type {ValidSpecHosts[]} */
const validSpecHosts = [];

/**
 * Get valid specification URLs from webref ids
 * @returns {Promise<string[]>} array of valid spec urls (including fragment id)
 */
const getValidSpecURLs = async () => {
  const indexFile = await fetch(
    'https://raw.githubusercontent.com/w3c/webref/main/ed/index.json',
  );
  const index = JSON.parse(await indexFile.text());
  /** @type {string[]} */
  const webrefFiles = [];

  index.results.forEach((spec) => {
    if (spec.standing === 'good') {
      if (spec.shortname === 'webnn') {
        validSpecHosts.push({
          url: spec.series.releaseUrl,
          alternateUrl: spec.nightly?.url,
        });
      } else {
        validSpecHosts.push({
          url: spec.series.nightlyUrl,
          alternateUrl: spec.nightly?.url,
        });
      }
      if (spec.dfns) {
        webrefFiles.push(spec.dfns);
      }
      if (spec.headings) {
        webrefFiles.push(spec.headings);
      }
    }
  });

  const responses = await Promise.all(
    webrefFiles.map(async (file) => {
      const res = await fetch(
        `https://raw.githubusercontent.com/w3c/webref/main/ed/${file}`,
      );
      const type = file.match(/^([^/]+)\//)?.[1] ?? 'dfns';
      const json = await res.json();
      const dfns = json[type];
      return dfns
        .map((entry) =>
          [entry].concat(entry.links ?? []).concat(
            (entry.alternateIds ?? []).map((altId) => {
              const url = new URL(entry.href);
              return url.origin + url.pathname + '#' + altId;
            }),
          ),
        )
        .flatMap((links) =>
          links.map((link) => {
            const url = new URL(link.href ?? link);
            return url.origin + url.pathname + decodeURIComponent(url.hash);
          }),
        );
    }),
  );
  return responses.flat();
};

const validSpecURLsWithFragments = await getValidSpecURLs();

/**
 * Process the data for spec URL errors
 * @param {CompatStatement} data The data to test
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
const processData = (data, logger) => {
  if (!data.spec_url) {
    return;
  }

  const featureSpecURLs = Array.isArray(data.spec_url)
    ? data.spec_url
    : [data.spec_url];

  for (const specURL of featureSpecURLs) {
    if (specsExceptions.some((host) => specURL.startsWith(host))) {
      continue;
    }

    if (specURL.includes('#') && !specURL.includes('#:~:text=')) {
      const hasSpec = validSpecURLsWithFragments.includes(specURL);

      const alternateSpecURLs = validSpecHosts.filter(
        (spec) => spec.url === specURL.split('#')[0],
      );

      const hasAlternateSpec = alternateSpecURLs.some((altSpecURL) => {
        const specToLookup =
          altSpecURL.alternateUrl + '#' + specURL.split('#')[1];
        if (validSpecURLsWithFragments.includes(specToLookup)) {
          return true;
        }
        return false;
      });

      if (!hasSpec && !hasAlternateSpec) {
        logger.error(
          chalk`Invalid specification fragment found: {bold ${specURL}}.`,
        );
      }
    } else if (
      !validSpecHosts.some((host) => specURL.startsWith(host.url)) &&
      !validSpecHosts.some((host) => specURL.startsWith(host.alternateUrl))
    ) {
      logger.error(
        `Invalid specification URL found: ${styleText('bold', specURL)}. Check if:
         - there is a more current specification URL
         - the specification is listed in https://github.com/w3c/browser-specs
         - the specification has a "good" standing`,
      );
    }
  }
};

/** @type {Linter} */
export default {
  name: 'Spec URLs',
  description:
    'Ensure the spec_url values match spec URLs in w3c/browser-specs (or defined exceptions)',
  scope: 'feature',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data }) => {
    processData(/** @type {CompatStatement} */ (data), logger);
  },
};
