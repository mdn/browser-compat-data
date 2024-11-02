/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import esMain from 'es-main';
import { temporaryWriteTask } from 'tempy';

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
  spawn,
} from './utils.js';

/**
 * Perform the commit and submit a pull request
 * @param message The commit message
 * @param wait Whether to wait for user to update the release notes (used when semver bump is minor or major)
 * @param options Commit options
 * @param options.branch the branch to commit to
 * @param options.pr PR options
 * @param options.pr.title Title of the PR
 * @param options.pr.body Body of the PR
 */
const commitAndPR = async (
  message: string,
  wait: boolean,
  {
    branch,
    pr,
  }: {
    branch: string;
    pr: {
      title: string;
      body: string;
    };
  },
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
    git stash
    git switch -C ${branch}
    git stash pop
    git add package.json package-lock.json RELEASE_NOTES.md
  `);

  await temporaryWriteTask(message, (commitFile) =>
    exec(`git commit --file ${commitFile}`),
  );

  exec(`git push --force --set-upstream origin ${branch}`);

  console.log('BEFORE');
  await temporaryWriteTask(pr.body, (bodyFile) => {
    console.log('BEGIN');
    const commonArgs = ['--title', pr.title, '--body-file', bodyFile];
    try {
      console.log('creating PR');
      const stdout = spawn('gh', ['pr', 'create', ...commonArgs]);
      console.log('created PR', { stdout });
    } catch (e) {
      console.log('editing PR', { e });
      const stdout = spawn('gh', ['pr', 'edit', ...commonArgs]);
      console.log('edited PR', { stdout });
    }
    console.log('END');
  });
  console.log('AFTER');

  exec(`
    git switch -
    git branch -d ${branch}
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
  const title = `Release ${thisVersion}`;
  const body = `(This release was generated by the project's release script.)\n\n${notes}`;
  await commitAndPR(
    title,
    !process.env.GITHUB_ACTIONS && versionBump !== 'patch',
    {
      branch: 'release',
      pr: { title, body },
    },
  );

  console.log(chalk`{blue {bold Done!}}`);
};

if (esMain(import.meta)) {
  await main();
}
