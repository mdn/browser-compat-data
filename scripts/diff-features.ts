/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';
import path from 'node:path';

import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { temporaryDirectoryTask } from 'tempy';

import { spawn, spawnAsync } from '../utils/index.js';

/**
 * Compare two references and print diff as Markdown or JSON
 * @param opts Options
 * @param opts.ref1 First reference to compare
 * @param opts.ref2 Second reference to compare
 * @param opts.format Format to export data as (either 'markdown' or 'json', default 'json')
 * @param opts.github Whether to obtain artifacts from GitHub
 */
const main = async (opts: {
  ref1: string | undefined;
  ref2: string | undefined;
  format?: string;
  github?: boolean;
}): Promise<void> => {
  const { ref1, ref2, format, github } = opts;
  const results = await diff({ ref1, ref2, github });

  if (format === 'markdown') {
    printMarkdown(results.added, results.removed);
  } else {
    console.log(JSON.stringify(results, undefined, 2));
  }
};

/**
 * Compare two references and get feature diff
 * @param opts Options
 * @param opts.ref1 First reference to compare
 * @param opts.ref2 Second reference to compare
 * @param opts.github Whether to obtain artifacts from GitHub
 * @param opts.quiet If true, don't log to console
 * @returns Diff between two refs
 */
const diff = async (opts: {
  ref1?: string;
  ref2?: string;
  github?: boolean;
  quiet?: boolean;
}): Promise<{ added: string[]; removed: string[] }> => {
  const { ref1, ref2, github, quiet } = opts;
  let refA, refB;

  if (ref1 === undefined && ref2 === undefined) {
    // No refs: compare HEAD to parent commit
    refA = 'HEAD^';
    refB = 'HEAD';
  } else if (ref2 === undefined) {
    // One ref: compare ref to parent of ref
    refB = `${ref1}`;
    refA = `${ref1}^`;
  } else {
    // Two refs: compare ref2 to ref1
    refA = `${ref2}`;
    refB = `${ref1}`;
  }

  const aSide = await enumerate(refA, github === false, quiet);
  const bSide = await enumerate(refB, github === false, quiet);

  return {
    added: [...bSide].filter((feature) => !aSide.has(feature)),
    removed: [...aSide].filter((feature) => !bSide.has(feature)),
  };
};

/**
 * Enumerate features from GitHub or local checkout
 * @param ref Reference to obtain features for
 * @param skipGithub Skip fetching artifacts from GitHub
 * @param quiet If true, don't log to console
 * @returns Feature list from reference
 */
const enumerate = async (
  ref: string,
  skipGithub: boolean,
  quiet = false,
): Promise<Set<string>> => {
  if (!skipGithub) {
    try {
      return new Set(await getEnumerationFromGithub(ref));
    } catch (e) {
      if (!quiet) {
        console.error(
          `Fetching artifact from GitHub failed: ${e} Using fallback.`,
        );
      }
    }
  }

  return new Set(enumerateFeatures(ref, quiet));
};

/**
 * Enumerate features from GitHub
 * @param ref Reference to obtain features for
 * @returns Feature list from reference
 */
const getEnumerationFromGithub = async (ref: string): Promise<string[]> => {
  const ENUMERATE_WORKFLOW = '15595228';
  const ENUMERATE_WORKFLOW_ARTIFACT = 'enumerate-features';
  const ENUMERATE_WORKFLOW_FILE = 'features.json';

  const hash = await spawnAsync('git', ['rev-parse', ref]);
  const workflowRun = await spawnAsync('gh', [
    'api',
    `/repos/:owner/:repo/actions/workflows/${ENUMERATE_WORKFLOW}/runs?head_sha=${hash}&per_page=1`,
    '--jq',
    `[.workflow_runs[] | select(.head_sha=="${hash}") | .id] | first`,
  ]);

  if (!workflowRun) {
    throw Error('No workflow run found for commit.');
  }

  return await temporaryDirectoryTask(async (tempdir) => {
    await spawnAsync('gh', [
      'run',
      'download',
      workflowRun,
      '-n',
      ENUMERATE_WORKFLOW_ARTIFACT,
      '--dir',
      tempdir,
    ]);
    const file = path.join(tempdir, ENUMERATE_WORKFLOW_FILE);

    return JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }));
  });
};

/**
 * Enumerate features from local checkout
 * @param ref Reference to obtain features for
 * @param quiet If true, don't log to console
 * @returns Feature list from reference
 */
const enumerateFeatures = (ref = 'HEAD', quiet = false): string[] => {
  // GitHub API returns wrong merge commit for https://github.com/mdn/browser-compat-data/pull/25668.
  ref = ref.replace(
    '19d8ce0fd1016c3cd1cb6f7b98f72e99ae2f3f16',
    '3af3a24bdf71f5393893f3724bc47acdd23acfe0',
  );

  // Get the short hash for this ref.
  // Most of the time, you check out named references (a branch or a tag).
  // However, if `ref` is already checked out, then `git worktree add` fails. As
  // long as you haven't checked out a detached HEAD for `ref`, then
  // `git worktree add` for the hash succeeds.
  const hash = spawn('git', ['rev-parse', '--short', ref]);

  const worktree = `__enumerating__${hash}`;

  if (!quiet) {
    console.error(`Enumerating features for ${ref} (${hash})`);
  }

  try {
    spawn('git', ['worktree', 'add', worktree, hash]);

    try {
      spawn('npm', ['ci'], { cwd: worktree });
    } catch (e) {
      // If the clean install fails, proceed anyways
    }

    spawn('npx', [
      'tsx',
      './scripts/enumerate-features.ts',
      `--data-from=${worktree}`,
    ]);

    return JSON.parse(fs.readFileSync('.features.json', { encoding: 'utf-8' }));
  } finally {
    spawn('git', ['worktree', 'remove', worktree]);
  }
};

/**
 * Format feature for Markdown printing
 * @param feat Feature
 * @returns Formatted feature
 */
const fmtFeature = (feat: string) => `- \`${feat}\``;

/**
 * Print feature diff as Markdown
 * @param added List of added features
 * @param removed List of removed features
 */
const printMarkdown = (added: string[], removed: string[]): void => {
  if (removed.length) {
    console.log('## Removed\n');
    console.log(removed.map(fmtFeature).join('\n'));
  }
  if (added.length) {
    if (removed.length) {
      console.log('');
    }
    console.log('## Added\n');
    console.log(added.map(fmtFeature).join('\n'));
  }
};

if (esMain(import.meta)) {
  const { argv } = yargs(hideBin(process.argv)).command(
    '$0 [ref1] [ref2]',
    'Compare the set of features at refA and refB',
    (yargs) => {
      yargs
        .positional('ref1', {
          description: 'A Git ref (branch, tag, or commit)',
          defaultDescription: 'ref1^',
        })
        .positional('ref2', {
          description: 'A Git ref (branch, tag, or commit)',
          defaultDescription: 'HEAD',
        })
        .option('format', {
          type: 'string',
          nargs: 1,
          choices: ['json', 'markdown'],
          demandOption: 'a named format is required',
          default: 'markdown',
        })
        .option('no-github', {
          type: 'boolean',
          description: "Don't fetch artifacts from GitHub.",
        })
        .example('$0', 'compare HEAD to parent commit')
        .example('$0 176d4ed', 'compare 176d4ed to its parent commit')
        .example('$0 topic-branch main', 'compare a branch to main');
    },
  );

  await main(argv as any);
}

export default diff;
