const {
  exec,
  releaseYargsBuilder,
  requireGitHubCLI,
  buildQuery,
} = require('./release-utils');
const diffFeatures = require('./diff-features');

function main(argv) {
  const { startVersionTag, endVersionTag } = argv;

  requireGitHubCLI();

  const allAdds = [];
  const allRemoves = [];

  for (const pull of pullsFromGitHub(startVersionTag, endVersionTag)) {
    process.stderr.write(`Diffing features for #${pull.number}`);

    const diff = diffFeatures({ ref1: pull.mergeCommit });

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

  console.error();

  allRemoves.sort((a, b) => a.feature.localeCompare(b.feature));
  allAdds.sort((a, b) => a.feature.localeCompare(b.feature));

  console.log(markdownify(allRemoves, allAdds));
}

function pullsFromGitHub(start, end) {
  const searchDetails = {
    limit: 1000, // As many PRs as GitHub will allow
    search: `${buildQuery(end, start, false)}`,
    json: `number,url,mergeCommit`,
    jq: '[.[] | { mergeCommit: .mergeCommit.oid, number: .number, url: .url }]', // Flatten the structure provided by GitHub
  };
  const args = Object.entries(searchDetails)
    .map(([key, value]) => `--${key}='${value}'`)
    .join(' ');
  const command = `gh pr list ${args}`;

  return JSON.parse(exec(command));
}

function markdownify(removes, adds) {
  const notes = [];

  const featureBullet = obj =>
    `- \`${obj.feature}\` ([#${obj.number}](${obj.url}))`;

  if (removes.length) {
    notes.push('### Removals', '');
    for (const removal of removes) {
      notes.push(featureBullet(removal));
    }
    notes.push('');
  }

  if (adds.length) {
    notes.push('### Additions', '');
    for (const added of adds) {
      notes.push(featureBullet(added));
    }
    notes.push('');
  }

  return notes.join('\n');
}

if (require.main === module) {
  const { argv } = require('yargs').command(
    '$0 [start-version-tag [end-version-tag]]',
    'Generate release notes text',
    yargs => {
      releaseYargsBuilder(yargs);
      yargs.example('$0', 'Generate the release notes for the next release');
      yargs.example(
        '$0 v4.1.14 v4.1.13',
        'Generate the release notes for v4.1.14',
      );
    },
  );

  main(argv);
}
