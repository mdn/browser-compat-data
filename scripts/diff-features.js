import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

function main({ ref1, ref2, format, github }) {
  const results = diff({ ref1, ref2, github });

  if (format === 'markdown') {
    printMarkdown(results);
  } else {
    console.log(JSON.stringify(results, undefined, 2));
  }
}

function diff({ ref1, ref2, github }) {
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

  let aSide = enumerate(refA, github === false);
  let bSide = enumerate(refB, github === false);

  const results = {
    added: [...bSide].filter((feature) => !aSide.has(feature)),
    removed: [...aSide].filter((feature) => !bSide.has(feature)),
  };

  return results;
}

function enumerate(ref, skipGitHub) {
  if (!skipGitHub) {
    try {
      return new Set(getEnumerationFromGithub(ref));
    } catch {
      console.error('Fetching artifact from GitHub failed. Using fallback.');
    }
  }

  return new Set(enumerateFeatures(ref));
}

function getEnumerationFromGithub(ref) {
  const ENUMERATE_WORKFLOW = '15595228';
  const ENUMERATE_WORKFLOW_ARTIFACT = 'enumerate-features';
  const ENUMERATE_WORKFLOW_FILE = 'features.json';

  const unlinkFile = () => {
    try {
      fs.unlinkSync(ENUMERATE_WORKFLOW_FILE);
    } catch (err) {
      if (err.code == 'ENOENT') {
        return;
      } else {
        throw err;
      }
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

  if (!workflowRun) throw Error('No workflow run found for commit.');

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
}

function enumerateFeatures(ref = 'HEAD') {
  // Get the short hash for this ref.
  // Most of the time, you check out named references (a branch or a tag).
  // However, if `ref` is already checked out, then `git worktree add` fails. As
  // long as you haven't checked out a detached HEAD for `ref`, then
  // `git worktree add` for the hash succeeds.
  const hash = execSync(`git rev-parse --short ${ref}`, {
    encoding: 'utf-8',
  }).trim();

  const worktree = `__enumerating__${hash}`;

  console.error(`Enumerating features for ${ref} (${hash})`);
  try {
    execSync(`git worktree add ${worktree} ${hash}`);
    execSync(`npm ci`, { cwd: worktree });
    execSync(`node ./scripts/enumerate-features.js --data-from=${worktree}`);

    return JSON.parse(fs.readFileSync('.features.json', { encoding: 'utf-8' }));
  } finally {
    execSync(`git worktree remove ${worktree}`);
  }
}

function printMarkdown({ added, removed }) {
  const fmtFeature = (feat) => `- \`${feat}\``;

  if (removed.length) {
    console.log('## Removed\n');
    console.log(removed.map(fmtFeature).join('\n'));
  }
  if (added.length) {
    if (removed.length) console.log('');
    console.log('## Added\n');
    console.log(added.map(fmtFeature).join('\n'));
  }
}

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
          demand: 'a named format is required',
          default: 'markdown',
        })
        .option('no-github', {
          type: 'boolean',
          description: "Don't fetch artifacts from GitHub.",
        })
        .example('$0', 'compare HEAD to parent commmit')
        .example('$0 176d4ed', 'compare 176d4ed to its parent commmit')
        .example('$0 topic-branch main', 'compare a branch to main');
    },
  );

  main(argv);
}

module.exports = diff;
