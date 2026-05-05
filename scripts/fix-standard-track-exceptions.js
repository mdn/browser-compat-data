/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/**
 * Interactive script to eliminate entries from standard-track-exceptions.txt.
 *
 * Usage: node scripts/fix-standard-track-exceptions.js
 *
 * Walks through each exception and prompts for an action:
 *
 *   https://...  — Add the URL as spec_url (space-separated for multiple)
 *   f / false    — Set standard_track to false (includes all subfeatures)
 *   p            — Copy the parent feature's spec_url
 *   p=https://.. — Set spec_url on both the parent and this subfeature
 *   (empty)      — Skip this entry
 *   /foo         — Skip ahead until the next entry containing "foo"
 *   o            — Open ancestor spec_url(s) in the browser
 *   u            — Undo last change and revisit that feature
 *   ?            — Print instructions
 *
 * Changes are written to disk immediately. The exception list is updated
 * on exit (including Ctrl+C).
 */

import { execFile } from 'node:child_process';
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

/**
 * Index of spec URLs used by other BCD features with the same last path segment.
 * Built at startup by traversing the full BCD dataset, and updated during the
 * session as the user assigns new spec URLs.
 * @type {Map<string, { url: string; count: number }[]>}
 */
const specUrlBySegment = (() => {
  /** @type {Map<string, Map<string, number>>} */
  const counts = new Map();
  /**
   * Recursively index spec URLs from a BCD identifier subtree.
   * @param {Identifier} node BCD identifier node to traverse
   */
  const traverse = (node) => {
    for (const [key, val] of Object.entries(node)) {
      if (key === '__compat' || typeof val !== 'object' || val === null) {
        continue;
      }
      const child = /** @type {Identifier} */ (val);
      if (child.__compat?.spec_url) {
        let urlCounts = counts.get(key);
        if (!urlCounts) {
          urlCounts = new Map();
          counts.set(key, urlCounts);
        }
        for (const url of [child.__compat.spec_url].flat()) {
          urlCounts.set(url, (urlCounts.get(url) ?? 0) + 1);
        }
      }
      traverse(child);
    }
  };
  for (const topLevel of Object.values(bcd)) {
    traverse(/** @type {Identifier} */ (topLevel));
  }
  /** @type {Map<string, { url: string; count: number }[]>} */
  const result = new Map();
  for (const [seg, urlCounts] of counts) {
    result.set(
      seg,
      [...urlCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([url, count]) => ({ url, count })),
    );
  }
  return result;
})();

/**
 * Record a newly assigned spec URL so it appears in future suggestions.
 * @param {string} featurePath Dot-separated feature path that received the URL
 * @param {string | string[]} specUrl The spec URL(s) that were assigned
 */
const recordSpecUrl = (featurePath, specUrl) => {
  const segment = featurePath.split('.').pop() ?? featurePath;
  const newUrls = [specUrl].flat();
  const existing = specUrlBySegment.get(segment) ?? [];
  const toAdd = newUrls
    .filter((u) => !existing.some((e) => e.url === u))
    .map((url) => ({ url, count: 1 }));
  if (toAdd.length > 0) {
    specUrlBySegment.set(segment, [...toAdd, ...existing]);
  }
};

/**
 * Cached map from respec shortname to spec base URL, loaded on first `x` use.
 * @type {Map<string, string> | null}
 */
let xrefSpecMap = null;

/**
 * Lazy-load the shortname → base URL map from the respec xref meta endpoint.
 * @returns {Promise<Map<string, string>>}
 */
const loadXrefSpecMap = async () => {
  if (xrefSpecMap) {
    return xrefSpecMap;
  }
  xrefSpecMap = new Map();
  try {
    const res = await fetch('https://respec.org/xref/meta?fields=specs');
    if (res.ok) {
      const data =
        /** @type {{ specs: { current: Record<string, { url: string }> } }} */ (
          await res.json()
        );
      for (const [shortname, info] of Object.entries(
        data.specs?.current ?? {},
      )) {
        if (info.url) {
          xrefSpecMap.set(shortname, info.url.replace(/\/?$/, ''));
        }
      }
    }
  } catch {
    // non-fatal: xref queries will just lack spec filtering
  }
  return xrefSpecMap;
};

/**
 * Derive a respec spec shortname from a spec_url using the xref meta map.
 * @param {string | string[]} specUrl Spec URL from an ancestor feature
 * @param {Map<string, string>} specMap Shortname map from loadXrefSpecMap
 * @returns {string | undefined}
 */
const guessSpecShortname = (specUrl, specMap) => {
  const url = [specUrl].flat()[0].split('#')[0];
  for (const [shortname, base] of specMap) {
    if (url.startsWith(base)) {
      return shortname;
    }
  }
  return undefined;
};

/**
 * Fetch spec URL suggestions from the respec xref API.
 * @param {string} featurePath Dot-separated feature path
 * @param {string | string[] | undefined} ancestorSpecUrl Ancestor spec_url for spec filtering
 * @param {string} [overrideTerm] Custom search term; skips for/spec filtering when set
 * @returns {Promise<string[]>}
 */
const fetchXrefSuggestions = async (
  featurePath,
  ancestorSpecUrl,
  overrideTerm,
) => {
  const parts = featurePath.split('.');
  /** @type {{ term: string; for?: string; specs?: string[] }} */
  const xrefQuery = { term: overrideTerm ?? parts[parts.length - 1] };
  if (!overrideTerm) {
    if (parts[0] === 'api' && parts.length >= 3) {
      xrefQuery.for = parts[parts.length - 2];
    }
    if (ancestorSpecUrl) {
      const specMap = await loadXrefSpecMap();
      const shortname = guessSpecShortname(ancestorSpecUrl, specMap);
      if (shortname) {
        xrefQuery.specs = [shortname];
      }
    }
  }
  try {
    const res = await fetch('https://respec.org/xref/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queries: [xrefQuery] }),
    });
    if (!res.ok) {
      return [];
    }
    // result[0] is [cacheHash, matchesArray]
    const data =
      /** @type {{ result: [string, { shortname: string; uri: string }[]][] }} */ (
        await res.json()
      );
    const specMap = await loadXrefSpecMap();
    return (data.result?.[0]?.[1] ?? [])
      .flatMap((m) => {
        const base = specMap.get(m.shortname);
        if (!base) {
          return [];
        }
        try {
          return [new URL(m.uri, `${base}/`).href];
        } catch {
          return [];
        }
      })
      .slice(0, 5);
  } catch {
    return [];
  }
};

const instructions = `
  ${styleText('bold', 'Actions:')}
    ${styleText('cyan', 'https://...')}  Add the URL as spec_url (space-separated for multiple)
    ${styleText('cyan', '1-9')}          Accept a numbered suggestion
    ${styleText('cyan', 'x')}            Fetch xref suggestions for the current feature
    ${styleText('cyan', 'x <term>')}     Fetch xref suggestions for a custom search term
    ${styleText('cyan', 'p')}            Use parent feature's spec_url
    ${styleText('cyan', 'p https://...')} Use parent spec_url + extra URL on this subfeature
    ${styleText('cyan', 'p=https://...')} Set spec_url on parent + this subfeature
    ${styleText('cyan', 'f')}            Set standard_track to false (+ all subfeatures)
    ${styleText('cyan', 'r')}            Repeat the previous action
    ${styleText('cyan', '(Enter)')}      Skip this entry
    ${styleText('cyan', '/foo')}         Skip ahead until an entry containing "foo"
    ${styleText('cyan', 'o')}            Open ancestor spec_url(s) in the browser
    ${styleText('cyan', 'u')}            Undo last change and revisit that feature
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

/**
 * Open one or more URLs in the default browser.
 * @param {string | string[]} urls
 */
const openUrls = (urls) => {
  const cmd = process.platform === 'darwin' ? 'open' : 'xdg-open';
  for (const url of Array.isArray(urls) ? urls : [urls]) {
    execFile(cmd, [url]);
  }
};

const exceptions = await getStandardTrackExceptions();
const remaining = new Set(exceptions);
const total = exceptions.length;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = `  ${styleText('dim', 'URL, 1-9 (suggestion), x [term] (xref), p, f, r (repeat), /skip-to, or ?')}
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
let lastInput = '';

/** @type {{ index: number, undo: () => void } | null} */
let lastAction = null;

let idx = 0;
while (idx < exceptions.length) {
  const i = idx;
  const featurePath = exceptions[i];
  idx++;

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

  // Print header with last path segment bold
  const lastDot = featurePath.lastIndexOf('.');
  const pathDisplay =
    lastDot === -1
      ? styleText(['cyan', 'bold'], featurePath)
      : styleText('cyan', featurePath.slice(0, lastDot + 1)) +
        styleText(['cyan', 'bold'], featurePath.slice(lastDot + 1));
  console.log(`\n${styleText('bold', `[${i + 1}/${total}]`)} ${pathDisplay}`);

  // Print status flags
  const statusParts = [];
  if (compat.status?.experimental) {
    statusParts.push(styleText('yellow', 'experimental'));
  }
  if (compat.status?.deprecated) {
    statusParts.push(styleText('green', 'deprecated'));
  }
  if (statusParts.length > 0) {
    console.log(`  status: ${statusParts.join(' ')}`);
  }

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

  // Print suggestions from other BCD features with the same segment name
  const lastSegment = featurePath.split('.').pop() ?? featurePath;
  const bcdSuggestions = (specUrlBySegment.get(lastSegment) ?? []).slice(0, 5);
  const suggestionCounts = new Map(bcdSuggestions.map((e) => [e.url, e.count]));
  let suggestions = bcdSuggestions.map((e) => e.url);
  if (suggestions.length > 0) {
    console.log(styleText('dim', '  suggestions:'));
    for (let s = 0; s < suggestions.length; s++) {
      const count = suggestionCounts.get(suggestions[s]) ?? 0;
      const countStr = count > 1 ? ` ${styleText('dim', `×${count}`)}` : '';
      console.log(
        `    ${styleText('dim', `[${s + 1}]`)} ${styleText('underline', suggestions[s])}${countStr}`,
      );
    }
  }

  // Prompt loop (re-prompt on ?, o, and invalid input)
  while (true) {
    let answer = (await rl.question(prompt)).trim();

    if (answer === 'r') {
      if (!lastInput) {
        console.log(styleText('red', '  Nothing to repeat.'));
        continue;
      }
      console.log(styleText('dim', `  Repeating: ${lastInput}`));
      answer = lastInput;
    }

    if (answer === '?') {
      console.log(instructions);
      continue;
    }

    if (answer === 'o') {
      if (ancestor) {
        openUrls(ancestor.spec_url);
      } else {
        console.log(styleText('red', '  No ancestor with spec_url to open.'));
      }
      continue;
    }

    if (answer === 'x' || answer.startsWith('x ')) {
      const overrideTerm = answer.startsWith('x ')
        ? answer.slice(2).trim()
        : undefined;
      console.log(styleText('dim', '  Fetching xref suggestions…'));
      const xrefUrls = await fetchXrefSuggestions(
        featurePath,
        ancestor?.spec_url,
        overrideTerm,
      );
      const newUrls = xrefUrls.filter((u) => !suggestions.includes(u));
      if (newUrls.length === 0) {
        console.log(styleText('yellow', '  No new xref suggestions found.'));
      } else {
        const offset = suggestions.length;
        suggestions = [...suggestions, ...newUrls];
        console.log(styleText('dim', '  xref suggestions:'));
        for (let s = 0; s < newUrls.length; s++) {
          console.log(
            `    ${styleText('dim', `[${offset + s + 1}]`)} ${styleText('underline', newUrls[s])}`,
          );
        }
      }
      continue;
    }

    if (answer === 'u') {
      if (!lastAction) {
        console.log(styleText('red', '  Nothing to undo.'));
        continue;
      }
      lastAction.undo();
      idx = lastAction.index;
      lastAction = null;
      console.log(styleText('dim', '  Undone.'));
      break;
    }

    if (answer === '') {
      break;
    }

    if (answer.startsWith('/')) {
      skipUntil = answer.slice(1);
      break;
    }

    if (answer === 'f' || answer === 'false') {
      // Collect subfeatures that will be removed
      const prefix = featurePath + '.';
      const removedSubs = [...remaining].filter((e) => e.startsWith(prefix));
      // Update this feature and all subfeatures
      updateFeatures([featurePath, featurePath + '.*'], (c) => {
        c.status.standard_track = false;
        return c;
      });
      remaining.delete(featurePath);
      for (const sub of removedSubs) {
        remaining.delete(sub);
      }
      lastAction = {
        index: i,
        /**
         *
         */
        undo: () => {
          updateFeatures([featurePath, featurePath + '.*'], (c) => {
            c.status.standard_track = true;
            return c;
          });
          remaining.add(featurePath);
          for (const sub of removedSubs) {
            remaining.add(sub);
          }
        },
      };
      lastInput = answer;
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
      recordSpecUrl(featurePath, ancestor.spec_url);
      remaining.delete(featurePath);
      lastAction = {
        index: i,
        /**
         *
         */
        undo: () => {
          updateFeatures([featurePath], (c) => {
            delete c.spec_url;
            return c;
          });
          remaining.add(featurePath);
        },
      };
      lastInput = answer;
      break;
    }

    if (answer.startsWith('p https://')) {
      if (!ancestor) {
        console.log(styleText('red', '  No ancestor with spec_url found.'));
        continue;
      }
      const extra = answer.slice(2).trim().split(/\s+/);
      const specUrl = [...[ancestor.spec_url].flat(), ...extra];
      updateFeatures([featurePath], (c) => {
        c.spec_url = specUrl;
        return c;
      });
      recordSpecUrl(featurePath, specUrl);
      remaining.delete(featurePath);
      lastAction = {
        index: i,
        /**
         *
         */
        undo: () => {
          updateFeatures([featurePath], (c) => {
            delete c.spec_url;
            return c;
          });
          remaining.add(featurePath);
        },
      };
      lastInput = answer;
      break;
    }

    if (answer.startsWith('p=https://')) {
      const urls = answer.slice(2).trim().split(/\s+/);
      const specUrl = urls.length === 1 ? urls[0] : urls;
      const parentPath = featurePath.split('.').slice(0, -1).join('.');
      updateFeatures([parentPath], (c) => {
        c.spec_url = specUrl;
        return c;
      });
      updateFeatures([featurePath], (c) => {
        c.spec_url = specUrl;
        return c;
      });
      recordSpecUrl(featurePath, specUrl);
      remaining.delete(featurePath);
      lastAction = {
        index: i,
        /**
         *
         */
        undo: () => {
          updateFeatures([parentPath], (c) => {
            delete c.spec_url;
            return c;
          });
          updateFeatures([featurePath], (c) => {
            delete c.spec_url;
            return c;
          });
          remaining.add(featurePath);
        },
      };
      lastInput = answer;
      break;
    }

    const suggestionNum = Number(answer);
    if (
      Number.isInteger(suggestionNum) &&
      suggestionNum >= 1 &&
      suggestionNum <= suggestions.length
    ) {
      const specUrl = suggestions[suggestionNum - 1];
      updateFeatures([featurePath], (c) => {
        c.spec_url = specUrl;
        return c;
      });
      remaining.delete(featurePath);
      lastAction = {
        index: i,
        /**
         *
         */
        undo: () => {
          updateFeatures([featurePath], (c) => {
            delete c.spec_url;
            return c;
          });
          remaining.add(featurePath);
        },
      };
      lastInput = answer;
      break;
    }

    if (answer.startsWith('https://')) {
      const urls = answer.split(/\s+/);
      const specUrl = urls.length === 1 ? urls[0] : urls;
      updateFeatures([featurePath], (c) => {
        c.spec_url = specUrl;
        return c;
      });
      recordSpecUrl(featurePath, specUrl);
      remaining.delete(featurePath);
      lastAction = {
        index: i,
        /**
         *
         */
        undo: () => {
          updateFeatures([featurePath], (c) => {
            delete c.spec_url;
            return c;
          });
          remaining.add(featurePath);
        },
      };
      lastInput = answer;
      break;
    }

    console.log(
      styleText('yellow', '  Unknown input, try again. Type ? for help.'),
    );
  }
}

await save();
