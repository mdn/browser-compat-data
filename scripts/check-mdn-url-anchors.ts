/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import esMain from 'es-main';
import chalk from 'chalk-template';

import { lowLevelWalk } from '../utils/walk.js';

/**
 * Checks the anchors of all `mdn_url` values.
 */
const checkAnchors = async () => {
  const bySlug = new Map<string, { path: string; hash: string }[]>();

  for (const support of lowLevelWalk()) {
    const { compat, path } = support;
    if (!compat) {
      continue;
    }

    const { mdn_url } = compat;
    if (!mdn_url) {
      continue;
    }

    const { pathname, hash } = new URL(mdn_url);
    if (!hash) {
      continue;
    }

    const item = {
      path,
      hash,
    };

    const items = bySlug.get(pathname) ?? [];
    items.push(item);
    bySlug.set(pathname, items);
  }

  await Promise.all(
    [...bySlug.entries()].map(async ([slug, items]) => {
      const url = `https://developer.mozilla.org${slug}`;
      const res = await fetch(url);
      const text = await res.text();
      if (!res.ok) {
        console.error(`Failed to fetch ${url}`, text);
        return;
      }
      for (const { path, hash } of items) {
        if (!text.includes(`id="${hash.slice(1)}"`)) {
          console.warn(
            chalk`{yellow Invalid mdn_url anchor https://developer.mozilla.org${slug}{bold ${hash}}} in {italic ${path}}`,
          );
        }
      }
    }),
  );
};

if (esMain(import.meta)) {
  await checkAnchors();
}
