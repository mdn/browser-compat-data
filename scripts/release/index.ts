/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs/promises';

import chalk from 'chalk-template';
import esMain from 'es-main';

import { getSemverBumpPulls } from './semver-pulls.js';
import { getStats, formatStats, Stats } from './stats.js';
import { getChanges, formatChanges, Changes } from './changes.js';
import {
  exec,
  requireGitHubCLI,
  requireWriteAccess,
  getLatestTag,
  getRefDate,
  keypress,
} from './utils.js';

const dirname = new URL('.', import.meta.url);

/**
 * Get the release notes to add
 *
 * @param {string} thisVersion The current version number
 * @param {Changes} changes The changes to format
 * @param {Stats} stats The statistics from the changes
 * @param {string} versionBump Which part of the semver has been bumped
 * @returns {string} The Markdown-formatted release notes
 */
const getNotes = (
  thisVersion: string,
  changes: Changes,
  stats: Stats,
  versionBump: string,
): string =>
  [
    `## [${thisVersion}](https://github.com/mdn/browser-compat-data/releases/tag/${thisVersion})`,
    '',
    `${new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })}`,
    '',
    ...(versionBump !== 'patch'
      ? [
          '### Notable changes',
          '',
          '<!-- TODO: Fill me out with the appropriate information about breaking changes or new backwards-compatible additions! -->',
          '',
        ]
      : []),
    formatChanges(changes),
    formatStats(stats),
  ].join('\n');

/**
 * Add new release notes to the file
 *
 * @param {string} notesToAdd The notes to add to the release notes
 */
const addNotes = async (notesToAdd: string): Promise<void> => {
  const notesFilepath = new URL('../../RELEASE_NOTES.md', dirname);
  const currentNotes = (await fs.readFile(notesFilepath))
    .toString()
    .split('\n');
  const newNotes = [
    currentNotes[0],
    currentNotes[1],
    notesToAdd,
    ...currentNotes.slice(2),
  ].join('\n');
  await fs.writeFile(notesFilepath, newNotes);
};

/**
 * Perform the commit and submit a pull request
 *
 * @param {string} thisVersion The current version number
 * @param {boolean} wait Whether to wait for user to update the release notes (used when semver bump is minor or major)
 */
const commitAndPR = async (
  thisVersion: string,
  wait: boolean,
): Promise<void> => {
  exec('git switch main');
  exec('git switch -c release');
  exec('git add package.json package-lock.json RELEASE_NOTES.md');

  if (wait) {
    console.log('');
    console.log(
      chalk`{yellow Please {bold modify RELEASE_NOTES.md} and fill out the {bold Notable changes} section. I'll wait for you.}`,
    );
    console.log(chalk`{yellow Press any key to continue.}`);
    await keypress();
    console.log('');
  }

  exec(`git commit -m "Release ${thisVersion}"`);
  exec('git push --set-upstream origin release');
  exec('gh pr create --fill');
  exec('git switch main');
  exec('git branch -d release');
};

/**
 * Perform the release
 */
const main = async () => {
  requireGitHubCLI();
  requireWriteAccess();

  console.log(chalk`{blue Getting last version...}`);
  const lastVersion = getLatestTag();
  const lastVersionDate = getRefDate(lastVersion);

  // Determine what semver part to bump
  console.log(
    chalk`{blue Checking merged PRs to determine semver bump level...}`,
  );
  let versionBump: 'major' | 'minor' | 'patch' = 'patch';
  const semverBumpPulls = getSemverBumpPulls(lastVersionDate);

  if (semverBumpPulls.major.length) {
    versionBump = 'major';
  } else if (semverBumpPulls.minor.length) {
    versionBump = 'minor';
  }

  // Perform version bump
  exec(`npm version --no-git-tag-version ${versionBump}`);
  const thisVersion =
    'v' + JSON.parse(exec('npm version --json'))['@mdn/browser-compat-data'];

  console.log(
    chalk`{green Performed {bold ${versionBump}} bump from {bold ${lastVersion}} to {bold ${thisVersion}}}`,
  );

  console.log(chalk`{blue Getting statistics...}`);
  const stats = await getStats(lastVersion, thisVersion, lastVersionDate);

  console.log(chalk`{blue Getting lists of added/removed features...}`);
  const changes = await getChanges(lastVersionDate);

  console.log(chalk`{blue Applying changelog...}`);
  const notes = getNotes(thisVersion, changes, stats, versionBump);
  await addNotes(notes);

  console.log(chalk`{blue Creating pull request...}`);
  await commitAndPR(thisVersion, versionBump !== 'patch');

  console.log(chalk`{blue {bold Done!}}`);
};

if (esMain(import.meta)) {
  await main();
}
