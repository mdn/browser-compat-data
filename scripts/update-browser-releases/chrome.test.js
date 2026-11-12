/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { getReleaseNotesURLForVersion } from './chrome.js';

describe('getReleaseNotesURLForVersion', () => {
  const cases = [
    { version: '53', expected: '' },
    {
      version: '54',
      expected: 'https://developer.chrome.com/blog/new-in-chrome-54',
    },
    {
      version: '123',
      expected: 'https://developer.chrome.com/blog/new-in-chrome-123',
    },
    {
      version: '124',
      expected: 'https://developer.chrome.com/release-notes/124',
    },
    {
      version: '154',
      expected: 'https://developer.chrome.com/release-notes/154',
    },
    {
      version: '155',
      expected: 'https://chromestatus.com/release-notes/155',
    },
  ];

  for (const { version, expected } of cases) {
    it(`returns ${expected || 'no URL'} for Chrome ${version}`, () => {
      assert.equal(getReleaseNotesURLForVersion(version), expected);
    });
  }
});
