/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

type FeatureChange = {
  mergeCommit?: string;
  number: number;
  url: string;
  feature: string;
};

import fs from 'node:fs/promises';
import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import {
  exec,
  releaseYargsBuilder,
  ReleaseYargs,
  requireGitHubCLI,
  buildQuery,
} from './utils.js';
import diffFeatures from '../diff-features.js';

/**
 *
 * @param {ReleaseYargs} argv
 */
const main = async (argv: ReleaseYargs): Promise<void> => {
  const { startVersionTag, endVersionTag } = argv;

  requireGitHubCLI();

  const allAdds: FeatureChange[] = [];
  const allRemoves: FeatureChange[] = [];

  console.error(
    `Generating release notes from ${startVersionTag} to ${endVersionTag}`,
  );
  for (const pull of pullsFromGitHub(startVersionTag, endVersionTag)) {
    process.stderr.write(`Diffing features for #${pull.number}`);

    let diff;

    try {
      diff = diffFeatures({ ref1: pull.mergeCommit });
    } catch (e) {
      console.error(
        `${e}\n (Failed to diff features for #${pull.number}, skipping)`,
      );
      continue;
    }

    console.error(
      ` (${diff.added.length} added, ${diff.removed.length} removed)`,
    );

    for (const feature of diff.added) {
      allAdds.push({
        number: pull.number,
        url: pull.url,
        feature,
      });
    }

    for (const feature of diff.removed) {
      allRemoves.push({
        number: pull.number,
        url: pull.url,
        feature,
      });
    }
  }

  console.error(); // White space for more convenient copying and pasting from a terminal

  allRemoves.sort((a, b) => a.feature.localeCompare(b.feature));
  allAdds.sort((a, b) => a.feature.localeCompare(b.feature));

  console.log(await preamble());
  console.log(markdownifyChanges(allRemoves, allAdds));
  console.log('<!-- TODO: replace with `npm run release-stats` -->');
};

/**
 *
 * @param {string} start
 * @param {string} end
 * @returns {FeatureChange[]}
 */
const pullsFromGitHub = (start: string, end: string): FeatureChange[] => {
  const searchDetails = {
    limit: 1000, // As many PRs as GitHub will allow
    search: `${buildQuery(end, start, false)}`,
    json: 'number,url,mergeCommit',
    jq: '[.[] | { mergeCommit: .mergeCommit.oid, number: .number, url: .url }]', // Flatten the structure provided by GitHub
  };
  const args = Object.entries(searchDetails)
    .map(([key, value]) => `--${key}='${value}'`)
    .join(' ');
  const command = `gh pr list ${args}`;

  return JSON.parse(exec(command));
};

/**
 * @returns {string}
 */
const preamble = async (): Promise<string> => {
  const packageJson = await fs.readFile(
    new URL('../../package.json', import.meta.url),
  );
  const upcomingVersion = JSON.parse(packageJson.toString('utf8')).version;

  return [
    `## [v${upcomingVersion}](https://github.com/mdn/browser-compat-data/releases/tag/v${upcomingVersion})`,
    '',
    `${new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })} <!-- TODO: replace with final release date-->`,
    '',
  ].join('\n');
};

/**
 *
 * @param {FeatureChange} obj
 * @returns {string}
 */
const featureBullet = (obj: FeatureChange) =>
  `- \`${obj.feature}\` ([#${obj.number}](${obj.url}))`;

/**
 *
 * @param {FeatureChange[]} removed
 * @param {FeatureChange[]} added
 * @returns {string}
 */
const markdownifyChanges = (
  removed: FeatureChange[],
  added: FeatureChange[],
): string => {
  const notes: string[] = [];

  if (removed.length) {
    notes.push('### Removals', '');
    for (const removal of removed) {
      notes.push(featureBullet(removal));
    }
    notes.push('');
  }

  if (added.length) {
    notes.push('### Additions', '');
    for (const addition of added) {
      notes.push(featureBullet(addition));
    }
    notes.push('');
  }

  return notes.join('\n');
};

if (esMain(import.meta)) {
  const { argv } = yargs(hideBin(process.argv)).command(
    '$0 [start-version-tag [end-version-tag]]',
    'Generate release notes text',
    (yargs) => {
      releaseYargsBuilder(yargs);
      yargs.example('$0', 'Generate the release notes for the next release');
      yargs.example(
        '$0 v4.1.14 v4.1.13',
        'Generate the release notes for v4.1.14',
      );
    },
  );

  await main(argv as unknown as ReleaseYargs);
}
