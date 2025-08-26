/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import { diffArrays } from 'diff';
import esMain from 'es-main';
import stripAnsi from 'strip-ansi';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { CompatData, SimpleSupportStatement } from '../types/types.js';
import { spawn, walk } from '../utils/index.js';

import { addVersionLast, applyMirroring, transformMD } from './build/index.js';
import { getMergeBase, getFileContent, getGitDiffStatuses } from './lib/git.js';
import dataFolders from './lib/data-folders.js';

type Format = 'color' | 'html' | 'patch';

const BROWSER_NAMES = [
  'chrome',
  'chrome_android',
  'edge',
  'firefox',
  'firefox_android',
  'safari',
  'safari_ios',
  'webview_android',
];

// FIXME This is bad.
const allFlags: string[] = [];
const allNotes: string[] = [];

/**
 * Formats a flag reference.
 * @param index the flag index.
 * @returns formatted reference.
 */
const formatFlagIndex = (index: number): string => `[^f${index + 1}]`;

/**
 * Formats a flag reference.
 * @param index the flag index.
 * @returns formatted reference.
 */
const formatNoteIndex = (index: number): string => `[^n${index + 1}]`;

/**
 * Flattens an object.
 * @param obj the object to flatten.
 * @param parentKey the parent key path.
 * @param result the intermediate result.
 * @returns the flattened object.
 */
const flattenObject = (
  obj: any,
  parentKey = '',
  result = {},
): Record<string, any> => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      if (
        key !== 'version' &&
        typeof obj[key] === 'string' &&
        obj[key] === 'mirror'
      ) {
        obj[key] = {
          version: 'mirror',
        };
      }

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Merge values.
        if ('status' in obj[key]) {
          const { deprecated, standard_track, experimental } = obj[key].status;
          const statusFlags = [
            deprecated && 'deprecated',
            standard_track && 'standard_track',
            experimental && 'experimental',
          ].filter(Boolean);

          obj[key].status = statusFlags.join(',');
        }

        if ('tags' in obj[key]) {
          obj[key].tags = obj[key].tags.join(',');
        }

        if ('version_added' in obj[key]) {
          if ('flags' in obj[key]) {
            // Deduplicate flag.
            const flagsJson = JSON.stringify(obj[key].flags);
            if (!allFlags.includes(flagsJson)) {
              allFlags.push(flagsJson);
            }
            const flagIndex = allFlags.indexOf(flagsJson);
            obj[key].flags = formatFlagIndex(flagIndex);
          }

          if ('notes' in obj[key]) {
            const notes = toArray(obj[key].notes);
            obj[key].notes = notes
              .map((note) => {
                const notesJson = JSON.stringify(note);
                if (!allNotes.includes(notesJson)) {
                  allNotes.push(notesJson);
                }
                const noteIndex = allNotes.indexOf(notesJson);
                return noteIndex;
              })
              .sort()
              .map((index) => formatNoteIndex(index))
              .join(',');
          }

          const {
            version_added,
            version_last,
            partial_implementation,
            alternative_name,
            prefix,
            flags,
            notes,
          } = obj[key] as SimpleSupportStatement;

          const parts = [
            typeof version_added === 'string'
              ? typeof version_last === 'string'
                ? `${version_added}−${version_last}`
                : `${version_added}+`
              : `${version_added}`,
            partial_implementation && '(partial)',
            flags,
            prefix && `prefix=${prefix}`,
            alternative_name && `altname=${alternative_name}`,
            notes,
          ].filter(Boolean);

          obj[key].version = parts.join(' ');
          delete obj[key].version_added;
          delete obj[key].version_last;
          delete obj[key].version_removed;
          delete obj[key].partial_implementation;
          delete obj[key].alternative_name;
          delete obj[key].prefix;
          delete obj[key].flags;
          delete obj[key].notes;
        }

        // Recursively flatten nested objects
        flattenObject(
          BROWSER_NAMES.includes(key) ? toArray(obj[key]).reverse() : obj[key],
          fullKey,
          result,
        );
      } else {
        // Assign value to the flattened key
        result[fullKey] = obj[key];
      }
    }
  }

  return result;
};

/**
 * Converts value to array unless it isn't.
 * @param value array or any value.
 * @returns the array, or an array with the value as a single item.
 */
const toArray = (value: any): any[] => {
  if (!Array.isArray(value)) {
    value = [value];
  }

  return value;
};

/**
 * Formats a key diff'ed with the previous key.
 * @param key the current key
 * @param lastKey the previous key
 * @param options Options
 * @param options.fill The number of characters to fill up to
 * @param options.format Whether to return HTML, otherwise plaintext
 * @returns diffed key
 */
const diffKeys = (
  key: string,
  lastKey: string,
  options: { fill?: number; format: Format },
): string => {
  const len = key.length;
  let fill = options.fill ?? 0;
  /**
   * Filters out irrelevant keys.
   * @param part the key part.
   * @returns true, if the part should be ignored, false otherwise
   */
  const keyFilter = (part) => part !== '__compat' && part !== 'support';
  return diffArrays(
    lastKey.split('.').filter(keyFilter),
    key.split('.').filter(keyFilter),
  )
    .filter((part) => !part.removed)
    .map((part) => {
      const key = part.value.join('.');

      if (part.added) {
        const space = fill && len < fill ? ' '.repeat(fill - len) : '';
        fill = 0;
        return (
          (options.format === 'html'
            ? `<strong>${key}</strong>`
            : chalk`{blue ${key}}`) + space
        );
      }

      return key;
    })
    .join('.');
};

/**
 * Deeply merges a source object into a target object.
 * @param target The target object to merge into.
 * @param source The source object to merge.
 * @returns the target object with source merged.
 */
const deepMerge = (target: any, source: any): any => {
  if (typeof target !== 'object' || target === null) {
    return source;
  }
  if (typeof source !== 'object' || source === null) {
    return source;
  }

  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (
      typeof sourceValue === 'object' &&
      typeof targetValue === 'object' &&
      sourceValue !== null &&
      targetValue !== null
    ) {
      target[key] = deepMerge({ ...targetValue }, sourceValue);
    } else {
      target[key] = sourceValue;
    }
  }

  return target;
};

/**
 * Print diffs
 * @param base Base ref
 * @param head Head ref
 * @param options Options
 * @param options.group Whether to group by value, rather than the common feature
 * @param options.format What output format to use ("color", "html" or "patch")
 * @param options.mirror Whether to apply mirroring, rather than ignore "mirror" values
 * @param options.transform Whether to apply transforms
 */
const printDiffs = (
  base: string,
  head = '',
  options: {
    group: boolean;
    format: Format;
    mirror: boolean;
    transform: boolean;
  },
): void => {
  if (options.format === 'html') {
    console.log('<pre style="font-family: monospace">');
  }

  const groups = new Map<string, Set<string>>();

  const baseContents = {};
  const headContents = {};

  for (const status of getGitDiffStatuses(base, head)) {
    if (
      !(
        status.headPath.endsWith('.json') &&
        dataFolders.some((folder) => status.headPath.startsWith(`${folder}/`))
      )
    ) {
      continue;
    }

    const baseFileContents = (
      status.value !== 'A'
        ? JSON.parse(getFileContent(base, status.basePath))
        : {}
    ) as CompatData;
    const headFileContents = (
      status.value !== 'D'
        ? JSON.parse(getFileContent(head, status.headPath))
        : {}
    ) as CompatData;

    deepMerge(baseContents, baseFileContents);
    deepMerge(headContents, headFileContents);
  }

  if (options.mirror) {
    for (const feature of walk(undefined, baseContents)) {
      applyMirroring(feature);
    }
    for (const feature of walk(undefined, headContents)) {
      applyMirroring(feature);
    }
  }
  for (const feature of walk(undefined, baseContents)) {
    addVersionLast(feature);
  }
  for (const feature of walk(undefined, headContents)) {
    addVersionLast(feature);
  }
  if (options.transform) {
    for (const feature of walk(undefined, baseContents)) {
      transformMD(feature);
    }
    for (const feature of walk(undefined, headContents)) {
      transformMD(feature);
    }
  }

  const baseData = flattenObject(baseContents);
  const headData = flattenObject(headContents);

  const keys = [
    ...new Set<string>([
      ...Object.keys(baseData),
      ...Object.keys(headData),
    ]).values(),
  ].sort();

  if (!keys.length) {
    console.log('✔ No data file changed.');
    return;
  }

  const prefix = diffArrays(
    keys.at(0)?.split('.') ?? [],
    keys.at(-1)?.split('.') ?? [],
  )[0]?.value.join('.');

  const commonName =
    options.format === 'html' ? `<h3>${prefix}</h3>` : `${prefix}`;

  let lastKey = '';

  for (const key of keys) {
    const baseValue = JSON.stringify(baseData[key] ?? null);
    const headValue = JSON.stringify(headData[key] ?? null);
    if (baseValue === headValue) {
      continue;
    }
    if (!lastKey) {
      lastKey = key;
    }
    const keyDiff = diffKeys(
      key.slice(prefix.length),
      lastKey.slice(prefix.length),
      options,
    );

    const splitRegexp =
      /(?<=^")|(?<=[\],/ ])|(?=[[,/ ])|(?="$)|(?<=\d)(?=−)|(?<=−)(?=\d)|(?=#)/;
    let headValueForDiff = headValue;
    let baseValueForDiff = baseValue;

    if (baseValue == 'null') {
      baseValueForDiff = '';
      if (headValue == '"mirror"' || headValue == '"false"') {
        // Ignore initial "mirror"/"false" values.
        headValueForDiff = '';
      }
    } else if (headValue == 'null') {
      headValueForDiff = '';
    }

    const valueDiff = diffArrays(
      headValueForDiff.split(splitRegexp),
      baseValueForDiff.split(splitRegexp),
    )
      .map((part) => {
        // Note: removed/added is deliberately inversed here, to have additions first.
        const value = part.value.join('');
        if (part.removed) {
          return options.format == 'html'
            ? `<ins style="color: green">${value}</ins>`
            : chalk`{green ${value}}`;
        } else if (part.added) {
          return options.format == 'html'
            ? `<del style="color: red">${value}</del>`
            : chalk`{red ${value}}`;
        }

        return value;
      })
      .join('');

    const value = valueDiff;

    if (!value.length) {
      // e.g. null => "mirror"
      continue;
    }

    if (options.group) {
      const reverseKeyParts = key.split('.').reverse();
      const browser = reverseKeyParts.find((part) =>
        BROWSER_NAMES.includes(part),
      );
      const field = reverseKeyParts.find((part) => !/^\d+$/.test(part));
      const groupKey = `${!browser ? '' : options.format == 'html' ? `<strong>${browser}</strong>.` : chalk`{cyan ${browser}}.`}${field} = ${value}`;
      const groupValue = key
        .split('.')
        .map((part) => (part !== browser && part !== field ? part : '{}'))
        .reverse()
        .filter((value, index) => index > 0 || value !== '{}')
        .reverse()
        .map((value) =>
          value !== '{}'
            ? value
            : options.format == 'html'
              ? '<small>{}</small>'
              : chalk`{dim \{\}}`,
        )
        .join('.');
      const group = groups.get(groupKey) ?? new Set();
      group.add(groupValue);
      groups.set(groupKey, group);
    } else {
      const change =
        options.format == 'html'
          ? `${keyDiff} = ${value}`
          : chalk`${keyDiff} = ${value}`;
      const group = groups.get(commonName) ?? new Set();
      group.add(change);
      groups.set(commonName, group);
    }
    lastKey = key;
  }

  if (groups.size === 0) {
    console.log('✔ No changes.');
    return;
  }

  const originalEntries: [string, string[]][] = [...groups.entries()].map(
    ([key, set]) => [key, [...set.values()]],
  );

  const entryGroups = new Map<string, string[]>();
  for (const [key, values] of originalEntries) {
    const groupKey = JSON.stringify(values);
    const keys = entryGroups.get(groupKey) ?? [];
    keys.push(key);
    entryGroups.set(groupKey, keys);
  }

  const rawEntries = [...entryGroups.entries()];

  if (options.group) {
    // Natural sort.
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base',
    });
    rawEntries.sort(([, a], [, b]) =>
      collator.compare(
        stripAnsi(a.at(0) as string),
        stripAnsi(b.at(0) as string),
      ),
    );
  }

  const entries = rawEntries.map(([valuesJson, keys]) => [
    keys,
    JSON.parse(valuesJson),
  ]);

  const json = JSON.stringify(entries);
  for (const flagIndex of allFlags.keys()) {
    if (!json.includes(formatFlagIndex(flagIndex))) {
      allFlags[flagIndex] = '';
    }
  }
  for (const noteIndex of allNotes.keys()) {
    if (!json.includes(formatNoteIndex(noteIndex))) {
      allNotes[noteIndex] = '';
    }
  }

  /**
   * Prints references found in the inputs.
   * @param inputs the inputs to scan for references.
   */
  const printRefs = (...inputs: string[]): void => {
    const lines: string[] = [];
    for (const [index, content] of allFlags.entries()) {
      const ref = formatFlagIndex(index);
      if (inputs.some((input) => input.includes(ref))) {
        lines.push(`${ref}: ${content}`);
      }
    }
    for (const [index, content] of allNotes.entries()) {
      const ref = formatNoteIndex(index);
      if (inputs.some((input) => input.includes(ref))) {
        lines.push(`${ref}: ${content}`);
      }
    }
    if (lines.length > 0) {
      console.log();
      lines.forEach((line) =>
        console.log(
          options.format == 'html'
            ? `<em>${line}</em>`
            : chalk`{italic ${line}}`,
        ),
      );
    }
  };

  for (const entry of entries) {
    let previousKey: string | null = null;
    if (options.group) {
      const [values, keys] = entry;
      if (keys.length == 1) {
        const key = keys.at(0) as string;
        const keyDiff = diffKeys(key, previousKey ?? key, options);
        values.forEach((value) => console.log(`${value}`));
        console.log(`  ${keyDiff}`);
        printRefs(...values);
        previousKey = key;
      } else {
        previousKey = null;
        console.log(values.join('\n'));
        const maxKeyLength = Math.max(...keys.map((key) => key.length));
        if (options.format == 'html') {
          process.stdout.write(
            `<details><summary>${keys.length} ${keys.length === 1 ? 'path' : 'paths'}</summary>`,
          );
        }
        for (const key of keys) {
          const keyDiff = diffKeys(key, previousKey ?? (keys.at(1) as string), {
            ...options,
            fill: maxKeyLength,
          });
          console.log(`  ${keyDiff}`);
          previousKey = key;
        }
        if (options.format == 'html') {
          process.stdout.write('</details>');
        }
        printRefs(...values);
        previousKey = null;
      }
    } else {
      const [keys, values] = entry;
      if (values.length == 1) {
        for (const key of keys) {
          const keyDiff = diffKeys(key, previousKey ?? key, options);
          console.log(`${keyDiff}`);
          previousKey = key;
        }
        values.forEach((value) => console.log(`  ${value}`));
        printRefs(...values);
      } else {
        for (const key of keys) {
          const keyDiff = diffKeys(key, previousKey ?? key, options);
          console.log(`${keyDiff}`);
          previousKey = key;
        }
        values.forEach((value) => console.log(`  ${value}`));
        printRefs(...values);
      }
      previousKey = null;
    }
    console.log('');
  }

  if (options.format == 'html') {
    console.log('</pre>');
  }
};

if (esMain(import.meta)) {
  const { argv } = yargs(hideBin(process.argv)).command(
    '$0 [base] [head]',
    'Print a formatted diff for changes between base and head commits',
    (yargs) => {
      yargs
        .positional('base', {
          describe:
            'The base commit; may be commit hash or other git ref (e.g. "origin/main")',
          type: 'string',
          default: 'origin/main',
        })
        .positional('head', {
          describe:
            'The head commit that changes are applied to; may be commit hash or other git ref (e.g. "origin/main")',
          type: 'string',
          default: 'HEAD',
        })
        .option('format', {
          alias: 'f',
          type: 'string',
          default: 'plain',
          choices: ['html', 'plain'],
        })
        .option('group', {
          type: 'boolean',
          default: true,
        })
        .option('mirror', {
          type: 'boolean',
          default: false,
        })
        .option('transform', {
          type: 'boolean',
          default: false,
        });
    },
  );

  const options = argv as any;

  if (/^\d+$/.test(options.base)) {
    options.head = `pull/${options.base}/merge`;
    options.base = 'origin/main';
  }

  const remote =
    spawn('git', ['remote', '-v'])
      .split('\n')
      .find((line) => line.includes('mdn/browser-compat-data'))
      ?.split(/\s+/, 2)
      .at(0) ?? 'origin';

  /**
   * Runs `git fetch` for a reference.
   * @param ref - the reference to fetch.
   * @returns Combined standard output/error of the command.
   */
  const gitFetch = (ref: string) => spawn('git', ['fetch', remote, ref]);

  /**
   * Runs `git rev-parse` for a reference.
   * @param ref - the reference to parse.
   * @returns Standard output of the command.
   */
  const gitRevParse = (ref: string) => spawn('git', ['rev-parse', ref]);

  /**
   * Resolves and fetches the reference.
   * @param ref - the reference to fetch and resolve.
   * @returns Commit hash corresponding to the reference.
   */
  const fetchAndResolve = (ref: string) => {
    if (ref.startsWith('origin/')) {
      const remoteRef = ref.slice('origin/'.length);
      gitFetch(remoteRef);
      return gitRevParse(ref);
    } else if (ref.startsWith(`${remote}/`)) {
      const remoteRef = ref.slice(`${remote}/`.length);
      gitFetch(remoteRef);
      return gitRevParse(ref);
    } else if (ref.startsWith('pull/')) {
      gitFetch(ref);
      return gitRevParse('FETCH_HEAD');
    } else if (ref.includes(':')) {
      const remoteRef = `gh pr view ${ref} --json headRefOid -q '.headRefOid'`;
      gitFetch(remoteRef);
      return remoteRef;
    } else if (/^[0-9a-f]{40}$/.test(ref)) {
      try {
        gitRevParse(ref);
      } catch {
        gitFetch(ref);
      }
      return ref;
    }

    return gitRevParse(ref);
  };

  options.base = fetchAndResolve(options.base);
  options.head = fetchAndResolve(options.head);

  const { base, head, group, format, mirror, transform } = options;

  printDiffs(getMergeBase(base, head), head, {
    group,
    format,
    mirror,
    transform,
  });
}
