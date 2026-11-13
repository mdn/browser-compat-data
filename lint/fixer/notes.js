/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { convertHtmlToMarkdown, preservesRenderedHtml } from '../utils.js';
import walk from '../../utils/walk.js';

/**
 * The fixer rechecks rendering because it does not consume linter results.
 * @param {string} note The note to fix
 * @returns {string} The note with Markdown syntax, if it renders identically
 */
const fixNote = (note) => {
  const converted = convertHtmlToMarkdown(note);
  return preservesRenderedHtml(note, converted) ? converted : note;
};

/**
 * Replace HTML in one or more notes with Markdown syntax.
 * @param {string | string[]} notes The note(s) to fix
 * @returns {string | string[]} The note(s) with Markdown syntax
 */
export const fixNotes = (notes) => {
  if (Array.isArray(notes)) {
    return notes.map(fixNote);
  }
  return fixNote(notes);
};

/**
 * Fixes HTML in notes that should use Markdown syntax instead.
 *
 * Unlike the descriptions fixer, this re-walks the data and applies
 * {@link fixNotes} directly rather than reusing the notes linter: the notes
 * linter logs errors instead of returning structured `{expected}` values, so
 * there is nothing to consume. The shared `replace*` helpers keep the linter's
 * detection and this fixer's transformation in sync.
 * @param {string} filename The filename containing compatibility info
 * @param {string} actual The current content of the file
 * @returns {string} expected content of the file
 */
const fixNotesFixer = (filename, actual) => {
  if (filename.includes('/browsers/')) {
    return actual;
  }

  const data = JSON.parse(actual);
  const walker = walk(undefined, data);

  for (const feature of walker) {
    for (const support of Object.values(feature.compat.support)) {
      for (const statement of Array.isArray(support) ? support : [support]) {
        if (statement !== 'mirror' && statement.notes) {
          statement.notes =
            /** @type {string | [string, string, ...string[]]} */ (
              fixNotes(statement.notes)
            );
        }
      }
    }
  }

  return JSON.stringify(data, null, 2);
};

export default fixNotesFixer;
