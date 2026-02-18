/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import fixStandardTrackExceptions from './standard-track-exceptions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const exceptionListPath = join(
  __dirname,
  '../common/standard-track-exceptions.txt',
);

describe('fixStandardTrackExceptions', () => {
  /** @type {string} */
  let originalContent;

  before(async () => {
    // Save original content
    originalContent = await readFile(exceptionListPath, 'utf-8');
  });

  after(async () => {
    // Restore original content
    await writeFile(exceptionListPath, originalContent, 'utf-8');
  });

  it('should remove non-existent features from exception list', async () => {
    // Add test entries to exception list
    const testEntries = [
      'test.fake.feature.one',
      'test.fake.feature.two',
      'another.fake.feature',
    ];
    const modifiedContent = originalContent + '\n' + testEntries.join('\n');
    await writeFile(exceptionListPath, modifiedContent, 'utf-8');

    // Run the fixer
    await fixStandardTrackExceptions('test.json', '{}');

    // Read updated content
    const updatedContent = await readFile(exceptionListPath, 'utf-8');
    const updatedLines = updatedContent
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));

    // Verify test entries were removed
    for (const entry of testEntries) {
      assert.ok(
        !updatedLines.includes(entry),
        `Expected ${entry} to be removed from exception list`,
      );
    }

    // Verify original entries are still there
    const originalLines = originalContent
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));

    for (const line of originalLines) {
      assert.ok(
        updatedLines.includes(line),
        `Expected ${line} to remain in exception list`,
      );
    }
  });

  it('should preserve header comments in exception list', async () => {
    // Run the fixer
    await fixStandardTrackExceptions('test2.json', '{}');

    // Read updated content
    const updatedContent = await readFile(exceptionListPath, 'utf-8');
    const updatedLines = updatedContent.split('\n');

    // Check that header is preserved
    assert.ok(
      updatedLines[0].startsWith('#'),
      'Expected first line to be a comment',
    );
    assert.ok(
      updatedLines.some((line) =>
        line.includes('Baseline exception list for standard_track'),
      ),
      'Expected header comment to be preserved',
    );
  });
});
