/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { replaceCodeTagsWithBackticks } from '../utils.js';
import walk from '../../utils/walk.js';

/**
 * @param {string | string[]} notes
 * @returns {string | string[]}
 */
export const fixNotes = (notes) => {
  if (Array.isArray(notes)) {
    return notes.map(replaceCodeTagsWithBackticks);
  }
  return replaceCodeTagsWithBackticks(notes);
};

/**
 * Fixes HTML in notes that should use Markdown syntax instead.
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
        if (statement.notes) {
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
