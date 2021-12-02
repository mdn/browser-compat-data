const http = require('https');
const readline = require('readline');
const { exec, releaseYargsBuilder } = require('./utils');
const { walk } = require('../../utils');

const { argv } = require('yargs').command(
  '$0 [start-version-tag [end-version-tag]]',
  'Generate statistics for release notes',
  releaseYargsBuilder,
);

const getJSON = url =>
  new Promise((resolve, reject) =>
    http.get(
      url,
      { headers: { 'User-Agent': 'bcd-release-script' } },
      response => {
        let body = '';
        response.on('data', data => {
          body += data;
        });
        response.on('error', error => reject(error));
        response.on('end', () => {
          resolve(JSON.parse(body));
        });
      },
    ),
  );

const question = async query => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const response = await new Promise(resolve => rl.question(query, resolve));
  rl.close();
  console.log();
  return response;
};

const prompt = async questions => {
  const results = {};
  for (const q of questions) {
    results[q.name] = await question(`${q.message} `).then(q.type);
  }
  return results;
};

const stargazers = () =>
  getJSON('https://api.github.com/repos/mdn/browser-compat-data').then(
    json => json.stargazers_count,
  );

function stats(start, end) {
  // Get just the diff stats summary
  const diff = exec(`git diff --shortstat ${start}...${end}`);
  if (diff === '') {
    console.log('No changes for which to generate statistics.');
    process.exit(1);
  }

  // Extract the numbers from a line like this:
  // 50 files changed, 1988 insertions(+), 2056 deletions(-)
  const [, changed, insertions, deletions] = diff.match(
    /(\d+) files* changed, (\d+) insertions*\(\+\), (\d+) deletions*/,
  );

  // Get the number of commits
  const commits = exec(`git rev-list --count ${start}...${end}`);

  return {
    commits,
    changed,
    insertions,
    deletions,
  };
}

const contributors = (start, end) =>
  prompt([
    {
      name: 'releaseContributors',
      type: Number,
      message: `Find "contributors" at https://github.com/mdn/browser-compat-data/compare/${start}...${end}\nHow many people have contributed to this release?`,
    },
    {
      name: 'totalContributors',
      type: Number,
      message:
        'Find "contributors" at https://github.com/mdn/browser-compat-data/\nHow many people have contributed to browser-compat-data overall?',
    },
  ]);

function countFeatures() {
  return [...walk()].length;
}

const formatter = new Intl.NumberFormat('en-US');

function formatNumber(n) {
  return formatter.format(n);
}

function formatStats(details) {
  const releaseContributors = formatNumber(details.releaseContributors);
  const totalContributors = formatNumber(details.totalContributors);
  const changed = formatNumber(details.changed);
  const insertions = formatNumber(details.insertions);
  const deletions = formatNumber(details.deletions);
  const commits = formatNumber(details.commits);
  const features = formatNumber(details.features);
  const stars = formatNumber(details.stars);
  const { start, end } = details;

  return `\
### Statistics
- ${releaseContributors} contributors have changed ${changed} files with ${insertions} additions and ${deletions} deletions in ${commits} commits ([\`${start}...${end}\`](https://github.com/mdn/browser-compat-data/compare/${start}...${end}))
- ${features} total features
- ${totalContributors} total contributors
- ${stars} total stargazers`;
}

async function main() {
  const { startVersionTag: start, endVersionTag: end } = argv;

  console.log(
    formatStats({
      start,
      end,
      ...stats(start, end),
      ...(await contributors(start, end)),
      stars: await stargazers(),
      features: countFeatures(),
    }),
  );
}

main();
