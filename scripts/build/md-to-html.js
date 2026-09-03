/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { marked } from 'marked';

/**
 * Converts Markdown to HTML and sanitizes output.
 *
 * This is the conversion the build applies to `description` and `notes`
 * fields. The linter shares it so that it can verify that replacing HTML in
 * those fields with Markdown leaves the built output unchanged.
 * @param {string} markdown The Markdown to convert
 * @returns {string} The HTML output
 */
const mdToHtml = (markdown) =>
  marked
    .parseInline(markdown, { async: false })
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;([\w#]+);/g, '&$1;');

export default mdToHtml;
