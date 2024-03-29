/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import esMain from 'es-main';

import { getSemverBumpPulls } from './semver-pulls.js';
import { getStats } from './stats.js';
import { getChanges } from './changes.js';
import { getNotes, addNotes } from './notes.js';
import {
  exec,
  requireGitHubCLI,
  requireWriteAccess,
  getLatestTag,
  getRefDate,
  keypress,
} from './utils.js';

/**
 * Perform the commit and submit a pull request
 * @param thisVersion The current version number
 * @param wait Whether to wait for user to update the release notes (used when semver bump is minor or major)
 */
const commitAndPR = async (
  thisVersion: string,
  wait: boolean,
): Promise<void> => {
  if (wait) {
    console.log('');
    console.log(
      chalk`{yellow Please {bold modify RELEASE_NOTES.md} and fill out the {bold Notable changes} section. I'll wait for you.}`,
    );
    console.log(chalk`{yellow Press any key to continue.}`);
    await keypress();
    console.log('');
  }

  exec(`
    git switch main
    git switch -c release
    git add package.json package-lock.json RELEASE_NOTES.md
    git commit -m "Release ${thisVersion}" -m "" -m "This release was generated by the project's release script."
    git push --set-upstream origin release
    gh pr create --fill
    git switch main
    git branch -d release
  `);
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
  const semverBumpPulls = getSemverBumpPulls(lastVersionDate);
  const versionBump: 'major' | 'minor' | 'patch' = semverBumpPulls.major.length
    ? 'major'
    : semverBumpPulls.minor.length
      ? 'minor'
      : 'patch';

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
  await addNotes(notes, versionBump, lastVersion);

  console.log(chalk`{blue Creating pull request...}`);
  await commitAndPR(thisVersion, versionBump !== 'patch');

  console.log(chalk`{blue {bold Done!}}`);
};

if (esMain(import.meta)) {
  await main();
}
