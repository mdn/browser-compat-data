/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { fixNotes } from './notes.js';

describe('fix -> notes', () => {
  it('replaces <code> tags with backticks in a string note', () => {
    assert.equal(
      fixNotes('Before version 90, <code>foo</code> was required.'),
      'Before version 90, `foo` was required.',
    );
  });

  it('replaces <code> tags in each note in an array', () => {
    assert.deepEqual(
      fixNotes([
        'Before version 90, <code>foo</code> was required.',
        'Use `bar` instead.',
      ]),
      ['Before version 90, `foo` was required.', 'Use `bar` instead.'],
    );
  });

  it('leaves notes without <code> tags unchanged', () => {
    assert.equal(fixNotes('Use `foo` instead.'), 'Use `foo` instead.');
  });

  it('does not replace <code> inside backticks', () => {
    assert.equal(
      fixNotes('The `<code>` element is not supported.'),
      'The `<code>` element is not supported.',
    );
  });
});
