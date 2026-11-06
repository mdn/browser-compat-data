/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { marked } from 'marked';

/**
 * Share the build renderer so lint checks match the published output.
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
