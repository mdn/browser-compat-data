/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { lowLevelWalk } from '../utils/walk.js';
import packageJson from '../package.json' with { type: 'json' };

const VERSION = packageJson.version;
const USER_AGENT = `MDN-BCD-Implementation-Status-Checker/${VERSION} (+https://github.com/mdn/browser-compat-data)`;

/**
 * Checks the status of all `impl_url` values.
 * @param {object} options
 * @param {boolean} [options.firefox]
 * @param {boolean} [options.safari]
 */
const checkImplUrlStatus = async ({
  firefox: checkFirefox = false,
  safari: checkSafari = false,
}) => {
  /** @type {Map<string, { path: string; browser: string }[]>} */
  const byImplUrl = new Map();

  for (const support of lowLevelWalk()) {
    const { compat, path } = support;
    if (!compat) {
      continue;
    }

    if (!compat.support) {
      continue;
    }

    for (const [browser, value] of Object.entries(compat.support)) {
      const stmts = Array.isArray(value) ? value : [value];
      for (const stmt of stmts) {
        if (stmt.version_added !== false || !stmt.impl_url) {
          // Only check bugs for unimplemented features.
          continue;
        }

        const impl_urls = Array.isArray(stmt.impl_url)
          ? stmt.impl_url
          : [stmt.impl_url];

        for (const impl_url of impl_urls) {
          const items = byImplUrl.get(impl_url) ?? [];
          items.push({
            path,
            browser,
          });
          byImplUrl.set(impl_url, items);
        }
      }
    }
  }

  // Firefox.
  if (checkFirefox) {
    const ids = [...byImplUrl.keys()]
      .filter((url) => url.startsWith('https://bugzil.la/'))
      .map((url) => url.split('/').at(-1))
      .sort();

    const url = new URL('https://bugzilla.mozilla.org/rest/bug');
    url.searchParams.set('id', ids.join(','));
    url.searchParams.set(
      'include_fields',
      ['id', 'summary', 'status', 'resolution'].join(','),
    );

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': USER_AGENT,
      },
    });
    const result = await response.json();
    for (const bug of result.bugs) {
      if (bug.status !== 'RESOLVED') {
        continue;
      }

      const impl_url = `https://bugzil.la/${bug.id}`;
      console.log(`[${bug.resolution}] ${impl_url} - ${bug.summary}`);
      for (const item of byImplUrl.get(impl_url) ?? []) {
        console.log(`${item.path} -> ${item.browser}`);
      }
      console.log();
    }
  }

  // Safari.
  if (checkSafari) {
    const firefoxBugIds = [...byImplUrl.keys()]
      .filter((url) => url.startsWith('https://webkit.org/b/'))
      .map((url) => url.split('/').at(-1))
      .sort();

    const url = new URL('https://bugs.webkit.org/rest/bug');
    url.searchParams.set('id', firefoxBugIds.join(','));
    url.searchParams.set(
      'include_fields',
      ['id', 'summary', 'status', 'resolution'].join(','),
    );

    const response = await fetch(url.toString());
    const result = await response.json();
    for (const bug of result.bugs) {
      if (bug.status !== 'RESOLVED') {
        continue;
      }

      const impl_url = `https://webkit.org/b/${bug.id}`;
      console.log(`[${bug.resolution}] ${impl_url} - ${bug.summary}`);
      for (const item of byImplUrl.get(impl_url) ?? []) {
        console.log(`${item.path} -> ${item.browser}`);
      }
      console.log();
    }
  }
};

if (esMain(import.meta)) {
  const { firefox, safari } = yargs(hideBin(process.argv))
    .command('$0', 'Check the status of all impl_url values for resolved bugs')
    .option('firefox', {
      describe: 'Check Firefox (Bugzilla) impl_url statuses',
      type: 'boolean',
      default: false,
    })
    .option('safari', {
      describe: 'Check Safari (WebKit) impl_url statuses',
      type: 'boolean',
      default: false,
    })
    .check((argv) => {
      if (!argv.firefox && !argv.safari) {
        throw new Error(
          'At least one of --firefox or --safari must be specified',
        );
      }
      return true;
    })
    .parseSync();

  await checkImplUrlStatus({ firefox, safari });
}
