const { execSync } = require('child_process');
const http = require('https');
const readline = require('readline');
const chalk = require('chalk');

const bcd = require('..');

const { argv } = require('yargs').command(
  '$0 <version-tag>',
  'Initiate a release of this package on GitHub',
  yargs => {
    yargs.positional('version-tag', {
      describe: 'the version tag to generate release notes for',
      type: 'string',
    });
  },
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

const stats = (version, previousVersion) => {
  // Get just the diff stats summary
  const diff = execSync(
    `git diff --shortstat ${previousVersion}...${version}`,
    { encoding: 'utf8' },
  ).trim();
  // Extract the numbers from a line like this:
  // 50 files changed, 1988 insertions(+), 2056 deletions(-)
  const [, changed, insertions, deletions] = diff.match(
    /(\d+) files* changed, (\d+) insertions*\(\+\), (\d+) deletions*/,
  );

  // Get the number of commits
  const commits = execSync(
    `git rev-list --count ${previousVersion}...${version}`,
    { encoding: 'utf8' },
  ).trim();

  return {
    commits,
    changed,
    insertions,
    deletions,
  };
};

const contributors = (version, previousVersion) =>
  prompt([
    {
      name: 'releaseContributors',
      type: Number,
      message: `Find "contributors" at https://github.com/mdn/browser-compat-data/compare/${previousVersion}...${version}\nHow many people have contributed to this release?`,
    },
    {
      name: 'totalContributors',
      type: Number,
      message:
        'Find "contributors" at https://github.com/mdn/browser-compat-data/\nHow many people have contributed to browser-compat-data overall?',
    },
  ]);

const notableChanges = previousReleaseDate => {
  const searchUrl = new URL('https://github.com/mdn/browser-compat-data/pulls');
  const querySafeDate = previousReleaseDate.replace('+', '%2B');
  searchUrl.search = `q=is:pr merged:>=${querySafeDate} label:"needs-release-note :newspaper:"`;

  return `SUMMARIZE THESE PRs: ${searchUrl.href}`;
};

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

const makeURL = (version, body) => {
  const baseURL = 'https://github.com/mdn/browser-compat-data/releases/new';

  // Adhering to RFC 3986 makes the full link clickable in Terminal.app
  const encodedBody = encodeURIComponent(body).replace(
    /[!'()*]/g,
    c => `%${c.charCodeAt(0).toString(16)}`,
  );

  return `${baseURL}?title=${version}&tag=${version}&body=${encodedBody}`;
};

const main = async () => {
  const version = argv.versionTag;
  const previousVersion = execSync(`git describe --abbrev=0 ${version}^`, {
    encoding: 'utf8',
  }).trim();
  const previousReleaseDate = execSync(
    `git log -1 --format=%aI ${previousVersion}`,
    {
      encoding: 'utf8',
    },
  ).trim();

  const { commits, changed, insertions, deletions } = stats(
    version,
    previousVersion,
  );

  const { releaseContributors, totalContributors } = await contributors(
    version,
    previousVersion,
  );
  const changeMessage = notableChanges(previousReleaseDate);
  const stars = await stargazers();
  const features = countFeatures();

  const body = `\
**Notable changes**
- ${changeMessage}

**Statistics**
- ${releaseContributors} contributors have changed ${changed} files with ${insertions} additions and ${deletions} deletions in ${commits} commits (https://github.com/mdn/browser-compat-data/compare/${previousVersion}...${version})
- ${features} total features
- ${totalContributors} total contributors
- ${stars} total stargazers`;

  console.log(chalk.bold('\nOpen this URL in a browser:'));
  console.log(makeURL(version, body));
};

main();
