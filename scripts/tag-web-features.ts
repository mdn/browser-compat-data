/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import esMain from 'es-main';
import { fdir } from 'fdir';
import { features } from 'web-features';

import stringifyAndOrderProperties from '../scripts/lib/stringify-and-order-properties.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

// Map from api.CoolThing.something to cool-thing
const bcdToFeature = new Map();

// Set of the first part of the BCD path encountered.
const bcdDirs = new Set();

for (const [feature, { compat_features }] of Object.entries(features)) {
  if (!compat_features) {
    continue;
  }
  for (const key of compat_features) {
    bcdToFeature.set(key, feature);
    bcdDirs.add(key.split('.')[0]);
  }
}

// FixMe: The idea of scripts/bulk-editor is to have utilities for bulk updating BCD files programmatically. It also features an implementation to update tags which is not used here as the bulk-editor scripts aren't used and/or maintained properly at the moment.

/**
 * Add web-feature tags to BCD keys
 */
const main = async () => {
  const bcdJsons = new fdir()
    .withBasePath()
    .filter((fp) => {
      const dir = path
        .relative(path.resolve(dirname, '..'), fp)
        .split(path.sep)[0];
      return bcdDirs.has(dir);
    })
    .filter((fp) => fp.endsWith('.json'))
    .crawl(path.resolve(dirname, '..'))
    .sync();

  /**
   * Lookup data at a specified key
   * @param root JSON object
   * @param key BCD key
   * @returns BCD data at the specified key
   */
  const lookup = (root, key) => {
    const parts = key.split('.');
    let node = root;
    for (const part of parts) {
      if (Object.hasOwn(node, part)) {
        node = node[part];
      } else {
        return undefined;
      }
    }
    return node;
  };

  /**
   * '{"removed":["foo"],"added":["bar"]}' => ['api.foo', 'api.bar']
   */
  const changes: Record<string, string[]> = {};

  for (const fp of bcdJsons) {
    const src = await fs.readFile(fp, { encoding: 'utf-8' });
    const data = JSON.parse(src);
    let updated = false;
    for (const [key, feature] of bcdToFeature.entries()) {
      const node = lookup(data, key);
      if (!node || !node.__compat) {
        continue;
      }
      bcdToFeature.delete(key);

      const tag = `web-features:${feature}`;
      const compat = node.__compat;
      if (compat.tags?.includes(tag)) {
        continue;
      }

      const added: string[] = [];
      const removed: string[] = [];

      while (true) {
        const index = compat.tags?.findIndex(
          (t) =>
            t.startsWith('web-features:') &&
            !t.startsWith('web-features:snapshot:'),
        );
        if (index === undefined || index === -1) {
          break;
        }

        // Remove any other feature tags (besides snapshots)
        // Compat keys in multiple web-features features creates ambiguity for some consumers, see https://github.com/web-platform-dx/web-features/issues/1173
        const tag = compat.tags[index];
        if (!process.env.GITHUB_ACTIONS) {
          console.info(`Removing tag ${tag} from ${key}`);
        }
        removed.push(tag);
        compat.tags.pop(index);
      }

      if (!process.env.GITHUB_ACTIONS) {
        console.info(`Adding tag ${tag} to ${key}`);
      }
      added.push(tag);

      if (compat.tags) {
        compat.tags.push(tag);
      } else {
        compat.tags = [tag];
      }
      updated = true;

      const change = JSON.stringify({ removed, added });
      changes[change] ??= [];
      changes[change].push(key);
    }
    if (updated) {
      await fs.writeFile(fp, stringifyAndOrderProperties(data) + '\n', {
        encoding: 'utf-8',
      });
    }
  }

  for (const [key, feature] of bcdToFeature) {
    console.warn('Not migrated:', feature, key);
  }

  if (process.env.GITHUB_ACTIONS) {
    console.log(
      '```patch' +
        '\n' +
        Object.entries(changes)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([json, keys]) => [JSON.parse(json), keys])
          .map(([{ removed, added }, keys]) =>
            keys
              .map((key) => `# ${key}`)
              .concat(removed.map((tag) => `- ${tag}`))
              .concat(added.map((tag) => `+ ${tag}`))
              .join('\n'),
          )
          .join('\n\n') +
        '\n' +
        '```',
    );
  }
};

if (esMain(import.meta)) {
  await main();
}
