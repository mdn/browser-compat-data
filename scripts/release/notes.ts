/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs/promises';

import { formatStats, Stats } from './stats.js';
import { formatChanges, Changes } from './changes.js';

const dirname = new URL('.', import.meta.url);

/**
 * Get the release notes to add
 * @param {string} thisVersion The current version number
 * @param {Changes} changes The changes to format
 * @param {Stats} stats The statistics from the changes
 * @param {string} versionBump Which part of the semver has been bumped
 * @returns {string} The Markdown-formatted release notes
 */
export const getNotes = (
  thisVersion: string,
  changes: Changes,
  stats: Stats,
  versionBump: string,
): string =>
  [
    `## [${thisVersion}](https://github.com/mdn/browser-compat-data/releases/tag/${thisVersion})`,
    '',
    `${new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })}`,
    '',
    ...(versionBump !== 'patch'
      ? [
          '### Notable changes',
          '',
          '<!-- TODO: Fill me out with the appropriate information about breaking changes or new backwards-compatible additions! -->',
          '',
        ]
      : []),
    formatChanges(changes),
    formatStats(stats),
  ].join('\n');

/**
 * Add new release notes to the file
 * @param {string} notesToAdd The notes to add to the release notes
 * @param {string} versionBump Which part of the semver has been bumped
 * @param {string} lastVersion The previous version number
 */
export const addNotes = async (
  notesToAdd: string,
  versionBump: string,
  lastVersion: string,
): Promise<void> => {
  const notesFilepath = new URL('../../RELEASE_NOTES.md', dirname);
  const currentNotes = (await fs.readFile(notesFilepath))
    .toString()
    .split('\n');
  let newNotes = '';

  // If we are doing a major version bump, move old changelog results to another file
  if (versionBump === 'major') {
    const lastMajorVersion = lastVersion.split('.')[0];
    const olderVersionsHeader = '## Older Versions';

    const oldChangelog =
      `# @mdn/browser-compat-data release notes (v${lastMajorVersion}.x)\n\n` +
      currentNotes
        .slice(
          2,
          currentNotes.findIndex((l) => l === olderVersionsHeader),
        )
        .join('\n');
    await fs.writeFile(
      new URL(`../../release_notes/v${lastMajorVersion}.md`, dirname),
      oldChangelog,
      'utf8',
    );

    newNotes = [
      currentNotes[0],
      currentNotes[1],
      notesToAdd,
      olderVersionsHeader,
      '',
      `- [v${lastMajorVersion}.x](./release_notes/v${lastMajorVersion}.md)`,
      ...currentNotes.slice(
        currentNotes.findIndex((l) => l === olderVersionsHeader) + 2,
      ),
    ].join('\n');
  } else {
    newNotes = [
      currentNotes[0],
      currentNotes[1],
      notesToAdd,
      ...currentNotes.slice(2),
    ].join('\n');
  }

  await fs.writeFile(notesFilepath, newNotes);
};
