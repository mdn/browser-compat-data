/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { execSync } from 'node:child_process';
import fs from 'node:fs';

import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

/**
 * Compare two references and print diff as Markdown or JSON
 * @param opts Options
 * @param opts.ref1 First reference to compare
 * @param opts.ref2 Second reference to compare
 * @param opts.format Format to export data as (either 'markdown' or 'json', default 'json')
 * @param opts.github Whether to obtain artifacts from GitHub
 */
const main = (opts: {
  ref1: string | undefined;
  ref2: string | undefined;
  format?: string;
  github?: boolean;
}): void => {
  const { ref1, ref2, format, github } = opts;
  const results = diff({ ref1, ref2, github });

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
const diff = (opts: {
  ref1?: string;
  ref2?: string;
  github?: boolean;
  quiet?: boolean;
}): { added: string[]; removed: string[] } => {
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

  const aSide = enumerate(refA, github === false, quiet);
  const bSide = enumerate(refB, github === false, quiet);

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
const enumerate = (
  ref: string,
  skipGithub: boolean,
  quiet = false,
): Set<string> => {
  if (!skipGithub) {
    try {
      return new Set(getEnumerationFromGithub(ref));
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
const getEnumerationFromGithub = (ref: string): string[] => {
  const ENUMERATE_WORKFLOW = '15595228';
  const ENUMERATE_WORKFLOW_ARTIFACT = 'enumerate-features';
  const ENUMERATE_WORKFLOW_FILE = 'features.json';

  /**
   * Unlinks the workflow file
   */
  const unlinkFile = () => {
    try {
      fs.unlinkSync(ENUMERATE_WORKFLOW_FILE);
    } catch (err: any) {
      if (err.code == 'ENOENT') {
        return;
      }
      throw err;
    }
  };

  const hash = execSync(`git rev-parse ${ref}`, {
    encoding: 'utf-8',
  }).trim();
  const workflowRun = execSync(
    `gh api /repos/:owner/:repo/actions/workflows/${ENUMERATE_WORKFLOW}/runs?per_page=100 --jq '[.workflow_runs[] | select(.head_sha=="${hash}") | .id] | first'`,
    {
      encoding: 'utf-8',
    },
  ).trim();

  if (!workflowRun) {
    throw Error('No workflow run found for commit.');
  }

  try {
    unlinkFile();
    execSync(
      `gh run download ${workflowRun} -n ${ENUMERATE_WORKFLOW_ARTIFACT}`,
    );
    return JSON.parse(
      fs.readFileSync(ENUMERATE_WORKFLOW_FILE, { encoding: 'utf-8' }),
    );
  } finally {
    unlinkFile();
  }
};

/**
 * Enumerate features from local checkout
 * @param ref Reference to obtain features for
 * @param quiet If true, don't log to console
 * @returns Feature list from reference
 */
const enumerateFeatures = (ref = 'HEAD', quiet = false): string[] => {
  // Get the short hash for this ref.
  // Most of the time, you check out named references (a branch or a tag).
  // However, if `ref` is already checked out, then `git worktree add` fails. As
  // long as you haven't checked out a detached HEAD for `ref`, then
  // `git worktree add` for the hash succeeds.
  const hash = execSync(`git rev-parse --short ${ref}`, {
    encoding: 'utf-8',
  }).trim();

  const worktree = `__enumerating__${hash}`;

  if (!quiet) {
    console.error(`Enumerating features for ${ref} (${hash})`);
  }

  try {
    execSync(`git worktree add ${worktree} ${hash}`);

    try {
      execSync('npm ci', { cwd: worktree });
    } catch (e) {
      // If the clean install fails, proceed anyways
    }

    execSync(
      `node --loader=ts-node/esm --no-warnings=ExperimentalWarning ./scripts/enumerate-features.ts --data-from=${worktree}`,
    );

    return JSON.parse(fs.readFileSync('.features.json', { encoding: 'utf-8' }));
  } finally {
    execSync(`git worktree remove ${worktree}`);
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

  main(argv as any);
}

export default diff;
