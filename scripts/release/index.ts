/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { temporaryWriteTask } from 'tempy';

import { exec, spawn } from '../../utils/index.js';

import { getSemverBumpPulls } from './semver-pulls.js';
import { getStats } from './stats.js';
import { getChanges } from './changes.js';
import { getNotes, addNotes } from './notes.js';
import {
  requireGitHubCLI,
  requireWriteAccess,
  getLatestTag,
  getRefDate,
  keypress,
  fetchMain,
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

  console.log(chalk`{blue Preparing ${branch} branch...}`);
  exec(`
    git stash
    git switch -C ${branch} origin/main
    git stash pop
    git add package.json package-lock.json RELEASE_NOTES.md release_notes/
  `);

  console.log(chalk`{blue Committing changes...}`);
  await temporaryWriteTask(message, (commitFile) =>
    exec(`git commit --file ${commitFile}`),
  );

  console.log(chalk`{blue Pushing ${branch} branch...}`);
  exec(`git push --force --set-upstream origin ${branch}`);

  console.log(chalk`{blue Creating/editing pull request...}`);
  await temporaryWriteTask(pr.body, (bodyFile) => {
    const commonArgs = ['--title', pr.title, '--body-file', bodyFile];
    try {
      const stdout = spawn('gh', ['pr', 'create', '--draft', ...commonArgs]);
      console.log(stdout);
    } catch (e) {
      const stdout = spawn('gh', ['pr', 'edit', ...commonArgs]);
      console.log(stdout);
    }
  });

  exec(`
    git switch -
    git branch -d ${branch}
  `);
};

/**
 * Perform the release
 * @param options The release options
 * @param options.dryRun Whether to simulate the release locally
 */
const main = async ({ dryRun }: { dryRun: boolean }) => {
  if (dryRun) {
    console.log(chalk`{green Simulating release...}`);
  }

  requireGitHubCLI();
  if (!dryRun) {
    requireWriteAccess();
  }

  console.log(chalk`{blue Fetching main branch...}`);
  fetchMain();

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

  console.log(chalk`{blue Updating release notes...}`);
  const notes = getNotes(thisVersion, changes, stats, versionBump);
  await addNotes(notes, versionBump, lastVersion);

  if (!dryRun) {
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
  }

  console.log(chalk`{blue {bold Done!}}`);
};

if (esMain(import.meta)) {
  const { argv }: { argv } = yargs(hideBin(process.argv)).command(
    '$0',
    'Prepares a release by determining changes since the last release, and creating/updating a release PR',
    (yargs) =>
      yargs.option('dry-run', {
        alias: 'n',
        describe: "Don't commit, push or PR",
        type: 'boolean',
        default: false,
      }),
  );

  await main({ dryRun: argv.dryRun });
}
