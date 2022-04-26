import { execSync } from 'node:child_process';

export function exec(command) {
  return execSync(command, { encoding: 'utf8' }).trim();
}

export function requireGitHubCLI() {
  const command = 'gh auth status';
  try {
    execSync(command, {
      encoding: 'utf8',
      stdio: 'ignore',
    });
  } catch (err) {
    console.trace(err);
    console.error(`Error: ${command} failed.`);
    console.error('The GitHub CLI is required.');
    console.error('See https://cli.github.com/ for installation instructions.');
    process.exit(1);
  }
}

export function getLatestTag() {
  return exec('git describe --abbrev=0 --tags');
}

export function getRefDate(ref, querySafe = false) {
  const rawDateString = exec(`git log -1 --format=%aI ${ref}`);

  if (querySafe) {
    return rawDateString.replace('+', '%2B');
  }
  return rawDateString;
}

export function buildQuery(endRef, startRef, urlSafe) {
  let merged;
  if (!['HEAD', 'main'].includes(endRef)) {
    merged = `merged:${getRefDate(startRef, urlSafe)}..${getRefDate(
      endRef,
      urlSafe,
    )}`;
  } else {
    merged = `merged:>=${getRefDate(startRef, urlSafe)}`;
  }

  return `is:pr ${merged}`;
}

export function releaseYargsBuilder(yargs) {
  yargs.positional('start-version-tag', {
    type: 'string',
    defaultDescription: 'most recent tag',
    default: getLatestTag,
  });
  yargs.positional('end-version-tag', {
    type: 'string',
    default: 'main',
  });
}
