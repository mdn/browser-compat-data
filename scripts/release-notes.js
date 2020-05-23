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

/**
 * Get the JSON response from a specified URL
 *
 * @param {string} url The URL to get the JSON from
 * @returns {object} The JSON obtained from the specified URL
 */
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

/**
 * Display a prompt to the user and await input, then return the user's input
 *
 * @param {string} query The query to present to the user
 * @returns {string} The user's response to said query
 */
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

/**
 * Checks whether a user's input is a confirmation -- in other words, not "n" or "no" (case-insensitive).  Used as a type to questions passed to the prompt() function.
 *
 * @param {string} str The string to check against
 * @returns {boolean} True if the string represents a confirmation
 */
const confirm = str => !['n', 'no'].includes(str.toLowerCase());

/**
 * Display a series of prompts to the user and collect the input, converting it to the specified type.
 *
 * @param {{name: string, type: object, message: string}} questions The prompts to display to the user
 * @returns {object.<string, string>} The results from each and every prompt
 */
const prompt = async questions => {
  const results = {};
  for (const q of questions) {
    const options = q.type === confirm ? '(Y/n) ' : '';
    results[q.name] = await question(`${q.message} ${options}`).then(q.type);
  }
  return results;
};

/**
 * Get the number of stargazers from the BCD repository and return it
 *
 * @returns {number} The number of stargazers for the BCD repository
 */
const stargazers = () =>
  getJSON('https://api.github.com/repos/mdn/browser-compat-data').then(
    json => json.stargazers_count,
  );

/**
 * Obtain the number of changes (commits, files changed, insertions, deletions)
 *
 * @param {string} version The current version
 * @param {string} previousVersion The previous version
 * @returns {{commits: string, changed: string, insertions: string, deletions: string}} The commits, files changed, insertions, and deletions between the current and previous versions
 */
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

/**
 * Obtain the number of changes (commits, files changed, insertions, deletions)
 *
 * @param {string} version The current version
 * @param {string} previousVersion The previous version
 * @returns {{commits: string, changed: string, insertions: string, deletions: string}} The commits, files changed, insertions, and deletions between the current and previous versions
 */
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

/**
 * Generates a URL containing a filter of all PRs merged since the last release that have been marked as needing a release note
 *
 * @param {string} previousReleaseDate The date of the previous release
 * @returns {string} A UI string with a link
 */
const notableChanges = previousReleaseDate => {
  const searchUrl = new URL('https://github.com/mdn/browser-compat-data/pulls');
  const querySafeDate = previousReleaseDate.replace('+', '%2B');
  searchUrl.search = `q=is:pr merged:>=${querySafeDate} label:"needs-release-note :newspaper:"`;

  return `SUMMARIZE THESE PRs: ${searchUrl.href}`;
};

/**
 * Count the number of features throughout BCD
 *
 * @returns {number} The count of features in BCD
 */
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

/**
 * Generate the URL to create a release on GitHub
 *
 * @param {string} version The version tag to use
 * @param {string} body The body of the release
 * @returns {string} The generated URL
 */
const makeURL = (version, body) => {
  const baseURL = 'https://github.com/mdn/browser-compat-data/releases/new';

  // Adhering to RFC 3986 makes the full link clickable in Terminal.app
  const encodedBody = encodeURIComponent(body).replace(
    /[!'()*]/g,
    c => `%${c.charCodeAt(0).toString(16)}`,
  );

  return `${baseURL}?title=${version}&tag=${version}&body=${encodedBody}`;
};

/**
 * Initiate a release of the package on GitHub
 *
 * @returns {void}
 */
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
