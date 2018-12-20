const { execSync } = require('child_process');
const http = require('https');

const bcd = require('..');
const inquirer = require('inquirer');

const { argv } = require('yargs')
  .command('$0 <version-tag>', 'Initiate a release of this package on GitHub', (yargs) => {
    yargs.positional('version-tag', {
      describe: 'the version tag to generate release notes for',
      type: 'string',
    });
  });

const getJSON = (url) => new Promise((resolve, reject) => http.get(url, { headers: { 'User-Agent': 'bcd-release-script' } }, (response) => {
  let body = '';
  response.on('data', (data) => {
    body += data;
  });
  response.on('error', error => reject(error));
  response.on('end', () => {
    resolve(JSON.parse(body));
  });
}));

const stargazers = () => getJSON('https://api.github.com/repos/mdn/browser-compat-data').then(json => json.stargazers_count);

const stats = (version, previousVersion) => {
  // Get just the diff stats summary
  const diff = execSync(`git diff --shortstat ${previousVersion}...${version}`, { encoding: 'utf8' })
    .trim();
  // Extract the numbers from a line like this:
  // 50 files changed, 1988 insertions(+), 2056 deletions(-)
  const [, changed, insertions, deletions] = diff.match(/(\d+) files* changed, (\d+) insertions*\(\+\), (\d+) deletions*/);

  // Get the number of commits
  const commits = execSync(`git rev-list --count ${previousVersion}...${version}`, { encoding: 'utf8' })
    .trim();

  return {
    commits,
    changed,
    insertions,
    deletions,
  };
};

const contributors = (version, previousVersion) => inquirer.prompt([
  {
    name: 'releaseContributors',
    type: Number,
    message: `Find "contributors" at https://github.com/mdn/browser-compat-data/compare/${previousVersion}...${version}\n  How many people have contributed to this release?`,
  },
  {
    name: 'totalContributors',
    type: Number,
    message: 'Find "contributors" at https://github.com/mdn/browser-compat-data/\n  How many people have contributed to browser-compat-data overall?',
  },
]);

const notableChanges = async () => {
  const { result } = await inquirer.prompt([
    {
      name: 'result',
      message: 'Does this release contain any schema, test, or infrastructure changes?',
      type: 'confirm',
    },
  ]);

  if (!result) {
    return 'None';
  }
  return 'REPLACE ME WITH ACTUAL RELEASE NOTES';
};

const countFeatures = () => {
  let count = 0;
  JSON.parse(JSON.stringify(bcd), (k) => {
    if (k === '__compat' ) {
      count++;
    }
    return count;
  });
  return count;
};

const makeURL = (version, body) => {
  const baseURL = 'https://github.com/mdn/browser-compat-data/releases/new';

  // Adhering to RFC 3986 makes the full link clickable in Terminal.app
  const encodedBody = encodeURIComponent(body).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16)}`);

  return `${baseURL}?title=${version}&tag=${version}&prerelease=true&body=${encodedBody}`;
};

const main = async () => {
  const version = argv.versionTag;
  const previousVersion = execSync(`git describe --abbrev=0 ${version}^`, { encoding: 'utf8' }).trim();

  const { commits, changed, insertions, deletions } = stats(version, previousVersion);

  const { releaseContributors, totalContributors } = await contributors(version, previousVersion);
  const changeMessage = await notableChanges();
  const stars = await stargazers();
  const features = countFeatures();

  const body = `\
**Notable changes**
- ${changeMessage}

**Statistics**
- ${features} total features
- ${releaseContributors} contributors have changed ${changed} files with ${insertions} additions and ${deletions} deletions in ${commits} commits (https://github.com/mdn/browser-compat-data/compare/${previousVersion}...${version})
- ${totalContributors} total contributors
- ${stars} total stargazers`;

  console.log('\n\x1b[1mOpen this URL in a browser:\x1b[0m');
  console.log(makeURL(version, body));
};

main();
