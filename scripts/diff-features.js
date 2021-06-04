const { execSync } = require('child_process');
const fs = require('fs');

const yargs = require('yargs');

function main({ ref1, ref2, format }) {
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

  const aSide = new Set(enumerateFeatures(refA));
  const bSide = new Set(enumerateFeatures(refB));

  const results = {
    added: [...bSide].filter(feature => !aSide.has(feature)),
    removed: [...aSide].filter(feature => !bSide.has(feature)),
  };

  if (format === 'markdown') {
    printMarkdown(results);
  } else {
    console.log(JSON.stringify(results, undefined, 2));
  }
}

function enumerateFeatures(ref = 'HEAD') {
  console.error(`Enumerating features on ${ref}`);
  try {
    if (ref !== 'HEAD') {
      execSync(`git checkout --quiet ${ref}`);
    }
    execSync(`node ./scripts/enumerate-features.js`);
    return JSON.parse(fs.readFileSync('.features.json', { encoding: 'utf-8' }));
  } finally {
    if (ref !== 'HEAD') {
      execSync(`git switch -`);
    }
  }
}

function printMarkdown({ added, removed }) {
  const fmtFeature = feat => `- \`${feat}\``;

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

const { argv } = yargs.command(
  '$0 [ref1] [ref2]',
  'Compare the set of features at refA and refB',
  yargs => {
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
      .example('$0', 'compare HEAD to parent commmit')
      .example('$0 176d4ed', 'compare 176d4ed to its parent commmit')
      .example('$0 topic-branch main', 'compare a branch to main');
  },
);

if (require.main === module) {
  main(argv);
}
