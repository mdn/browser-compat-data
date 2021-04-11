const http = require('https');
const readline = require('readline');
const chalk = require('chalk');

const bcd = require('..');
const { exec, releaseYargsBuilder } = require('./release-utils');

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

const question = query => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => rl.question(query, resolve)).then(response => {
    rl.close();
    return response;
  });
};

const confirm = str => !['n', 'no'].includes(str.toLowerCase());

const prompt = async questions => {
  const results = {};
  for (const q of questions) {
    const options = q.type === confirm ? '(Y/n) ' : '';
    results[q.name] = await question(`${q.message} ${options}`).then(q.type);
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

const countFeatures = () => {
  let count = 0;
  JSON.parse(JSON.stringify(bcd), k => {
    if (k === '__compat') {
      count++;
    }
    return count;
  });
  return count;
};

const main = async () => {
  const { startVersionTag: start, endVersionTag: end } = argv;
  const { commits, changed, insertions, deletions } = stats(start, end);
  const { releaseContributors, totalContributors } = await contributors(
    start,
    end,
  );
  const stars = await stargazers();
  const features = countFeatures();

  const body = `\
### Statistics
- ${releaseContributors} contributors have changed ${changed} files with ${insertions} additions and ${deletions} deletions in ${commits} commits (https://github.com/mdn/browser-compat-data/compare/${start}...${end})
- ${features} total features
- ${totalContributors} total contributors
- ${stars} total stargazers`;

  console.log();
  console.log(body);
};

main();
