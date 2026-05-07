/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { styleText } from 'node:util';

import { getSpecURLsExceptions } from '../common/spec-urls-exceptions.js';

/** @import {Linter, LinterData} from '../types.js' */
/** @import {Logger} from '../utils.js' */
/** @import {CompatStatement} from '../../types/types.js' */

const validSpecHosts = [];
const specsExceptions = await getSpecURLsExceptions();

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
          `Invalid specification URL found: ${styleText('bold', specURL)}.`,
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
