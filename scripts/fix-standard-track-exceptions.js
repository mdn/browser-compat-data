/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/**
 * Interactive script to eliminate entries from standard-track-exceptions.txt.
 *
 * Usage: node scripts/fix-standard-track-exceptions.js
 *
 * Walks through each exception and prompts for an action:
 *
 *   https://...  — Add the URL as spec_url (comma-separated for multiple)
 *   f / false    — Set standard_track to false (includes all subfeatures)
 *   p            — Copy the parent feature's spec_url
 *   (empty)      — Skip this entry
 *   /foo         — Skip ahead until the next entry containing "foo"
 *   ?            — Print instructions
 *
 * Changes are written to disk immediately. The exception list is updated
 * on exit (including Ctrl+C).
 */

import readline from 'node:readline/promises';
import { styleText } from 'node:util';

/** @import {Identifier} from '../types/types.js' */

import bcd from '../index.js';
import query from '../utils/query.js';
import {
  getStandardTrackExceptions,
  setStandardTrackExceptions,
} from '../lint/common/standard-track-exceptions.js';

import { updateFeatures } from './bulk-editor/utils.js';

const instructions = `
  ${styleText('bold', 'Actions:')}
    ${styleText('cyan', 'https://...')}  Add the URL as spec_url (comma-separated for multiple)
    ${styleText('cyan', 'p')}            Use parent feature's spec_url
    ${styleText('cyan', 'f')}            Set standard_track to false (+ all subfeatures)
    ${styleText('cyan', '(Enter)')}      Skip this entry
    ${styleText('cyan', '/foo')}         Skip ahead until an entry containing "foo"
    ${styleText('cyan', '?')}            Show these instructions
`;

/**
 * Find the closest ancestor that has a spec_url.
 * @param {string} featurePath Dot-separated feature path
 * @returns {{ path: string, spec_url: string | string[] } | null}
 */
const findAncestorSpecUrl = (featurePath) => {
  const parts = featurePath.split('.');
  for (let i = parts.length - 1; i >= 1; i--) {
    const ancestorPath = parts.slice(0, i).join('.');
    try {
      const node = /** @type {Identifier} */ (query(ancestorPath, bcd));
      if (node?.__compat?.spec_url) {
        return { path: ancestorPath, spec_url: node.__compat.spec_url };
      }
    } catch {
      // ancestor not found, keep going up
    }
  }
  return null;
};

const exceptions = await getStandardTrackExceptions();
const remaining = new Set(exceptions);
const total = exceptions.length;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = `  ${styleText('dim', 'Paste spec url, p(arent), f(alse), /skip-to, or ?')}
  > `;

/** Save progress and exit */
const save = async () => {
  await setStandardTrackExceptions(remaining);
  const removed = total - remaining.size;
  if (removed > 0) {
    console.log(
      `\n${styleText('green', `Removed ${removed} exception(s).`)} ${remaining.size} remaining.`,
    );
  }
  rl.close();
};

process.on('SIGINT', async () => {
  console.log('\nInterrupted.');
  await save();
  process.exit(0);
});

console.log(instructions);

let skipUntil = null;

for (const [i, featurePath] of exceptions.entries()) {
  // Handle skip-until filter
  if (skipUntil) {
    if (!featurePath.includes(skipUntil)) {
      continue;
    }
    skipUntil = null;
  }

  // Skip if already handled (e.g. as a subfeature of a previous "f" action)
  if (!remaining.has(featurePath)) {
    continue;
  }

  // Load feature data
  let compat;
  try {
    const node = /** @type {Identifier} */ (query(featurePath, bcd));
    compat = node?.__compat;
  } catch {
    console.log(
      styleText(
        'yellow',
        `[${i + 1}/${total}] ${featurePath} — not found, skipping`,
      ),
    );
    continue;
  }

  if (!compat) {
    console.log(
      styleText(
        'yellow',
        `[${i + 1}/${total}] ${featurePath} — no __compat, skipping`,
      ),
    );
    continue;
  }

  // Skip if exception no longer applies (spec_url was added or standard_track is false)
  if (compat.spec_url || compat.status?.standard_track === false) {
    remaining.delete(featurePath);
    continue;
  }

  // Print header
  console.log(
    `\n${styleText('bold', `[${i + 1}/${total}]`)} ${styleText('cyan', featurePath)}`,
  );

  // Print description
  if (compat.description) {
    console.log(`  desc:   ${compat.description}`);
  }

  // Print mdn_url
  if (compat.mdn_url) {
    console.log(`  mdn:    ${styleText('underline', compat.mdn_url)}`);
  }

  // Print ancestor spec_url
  const ancestor = findAncestorSpecUrl(featurePath);
  if (ancestor) {
    const urls = Array.isArray(ancestor.spec_url)
      ? ancestor.spec_url
      : [ancestor.spec_url];
    console.log(`  parent: ${ancestor.path}`);
    for (const url of urls) {
      console.log(`    spec: ${styleText('underline', url)}`);
    }
  } else {
    console.log(styleText('dim', '  (no ancestor with spec_url)'));
  }

  // Prompt loop (re-prompt on ? and invalid p)
  while (true) {
    const answer = (await rl.question(prompt)).trim();

    if (answer === '?') {
      console.log(instructions);
      continue;
    }

    if (answer === '') {
      break;
    }

    if (answer.startsWith('/')) {
      skipUntil = answer.slice(1);
      break;
    }

    if (answer === 'f' || answer === 'false') {
      // Update this feature and all subfeatures
      updateFeatures([featurePath, featurePath + '.*'], (c) => {
        c.status.standard_track = false;
        return c;
      });
      remaining.delete(featurePath);
      // Also remove subfeatures from exception list
      const prefix = featurePath + '.';
      for (const entry of remaining) {
        if (entry.startsWith(prefix)) {
          remaining.delete(entry);
        }
      }
      break;
    }

    if (answer === 'p') {
      if (!ancestor) {
        console.log(styleText('red', '  No ancestor with spec_url found.'));
        continue;
      }
      updateFeatures([featurePath], (c) => {
        c.spec_url = ancestor.spec_url;
        return c;
      });
      remaining.delete(featurePath);
      break;
    }

    if (answer.startsWith('https://')) {
      const urls = answer.split(',').map((u) => u.trim());
      const specUrl = urls.length === 1 ? urls[0] : urls;
      updateFeatures([featurePath], (c) => {
        c.spec_url = specUrl;
        return c;
      });
      remaining.delete(featurePath);
      break;
    }

    console.log(
      styleText('yellow', '  Unknown input, try again. Type ? for help.'),
    );
  }
}

await save();
