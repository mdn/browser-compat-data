/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

const formatter = new Intl.NumberFormat('en-US');

/**
 * Format a number using Intl.NumberFormat
 * @param {number} n The number to format
 * @returns {string} The formatted number
 */
const formatNumber = (n: number): string => formatter.format(n);

/**
 * Pluralizes a string
 * @param {string} word Word in singular form
 * @param {number} quantifier The quantifier
 * @param {boolean} useChalk Use chalk formatting
 * @returns {string} The pluralized string
 */
const pluralize = (
  word: string,
  quantifier: number,
  useChalk = false,
): string => {
  const formattedQuantifier = formatNumber(quantifier);
  const formattedWord = `${word}${quantifier === 1 ? '' : 's'}`;
  return useChalk
    ? chalk`{bold ${formattedQuantifier}} ${formattedWord}`
    : `${formattedQuantifier} ${formattedWord}`;
};

export default pluralize;
