/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import fixNotesFixer, { fixNotes } from './notes.js';

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

  describe('fixer', () => {
    /**
     * Run the default fixer over a walkable data object.
     * @param {string} filename
     * @param {object} data
     * @returns {object}
     */
    const run = (filename, data) =>
      JSON.parse(fixNotesFixer(filename, JSON.stringify(data)));

    it('fixes a string note in a support statement', () => {
      const out = run('api/Foo.json', {
        Foo: {
          __compat: {
            support: {
              chrome: {
                version_added: '80',
                notes: 'Use <code>foo</code> instead.',
              },
            },
          },
        },
      });
      assert.equal(out.Foo.__compat.support.chrome.notes, 'Use `foo` instead.');
    });

    it('fixes each note in an array-valued statement', () => {
      const out = run('api/Foo.json', {
        Foo: {
          __compat: {
            support: {
              chrome: {
                version_added: '80',
                notes: [
                  'Use <code>foo</code> instead.',
                  'And <code>bar</code> too.',
                ],
              },
            },
          },
        },
      });
      assert.deepEqual(out.Foo.__compat.support.chrome.notes, [
        'Use `foo` instead.',
        'And `bar` too.',
      ]);
    });

    it('fixes notes across an array of support statements', () => {
      const out = run('api/Foo.json', {
        Foo: {
          __compat: {
            support: {
              chrome: [
                { version_added: '80', notes: 'Use <code>foo</code>.' },
                { version_added: '10', notes: 'Old <code>bar</code>.' },
              ],
            },
          },
        },
      });
      assert.equal(out.Foo.__compat.support.chrome[0].notes, 'Use `foo`.');
      assert.equal(out.Foo.__compat.support.chrome[1].notes, 'Old `bar`.');
    });

    it('leaves browser data untouched', () => {
      const input = JSON.stringify({
        browsers: { chrome: { notes: 'Use <code>foo</code>.' } },
      });
      assert.equal(fixNotesFixer('/browsers/chrome.json', input), input);
    });
  });
});
