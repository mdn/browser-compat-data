/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import esMain from 'es-main';

import { lowLevelWalk } from '../utils/walk.js';
import packageJson from '../package.json' with { type: 'json' };

const VERSION = packageJson.version;
const USER_AGENT = `MDN-BCD-Implementation-Status-Checker/${VERSION} (+https://github.com/mdn/browser-compat-data)`;

const checkFirefox = false;
const checkSafari = true;

/**
 * Checks the status of all `impl_url` values.
 */
const checkImplUrlStatus = async () => {
  const byImplUrl = new Map<string, { path: string; browser: string }[]>();

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
  await checkImplUrlStatus();
}
