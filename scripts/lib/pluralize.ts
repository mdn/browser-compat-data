/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

const formatter = new Intl.NumberFormat('en-US');

/**
 *
 * @param {number} n
 * @returns {string}
 */
const formatNumber = (n: number): string => formatter.format(n);

/**
 * Pluralizes a string
 *
 * @param {string} word Word in singular form
 * @param {number} quantifier
 * @param {boolean} useChalk
 * @returns {string}
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
