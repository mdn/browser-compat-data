/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import _compareVersions from 'compare-versions';

/**
 * Compare version strings to find greater, equal or lesser.
 *
 * @param {string} v1
 * @param {string} v2
 * @returns {(1 | 0 | -1)}
 */
export default function compareVersions(v1, v2) {
  if (v1 === 'preview') v1 = '65535';
  if (v2 === 'preview') v2 = '65535';
  v1 = v1.replace('≤', '');
  v2 = v2.replace('≤', '');
  return _compareVersions(v1, v2);
}

/**
 * Validate version strings.
 *
 * @param {string} v
 * @returns {bool}
 */
compareVersions.validate = function (v) {
  v = v.replace('≤', '');
  return v === 'preview' || _compareVersions.validate(v);
};

/**
 * Compare version strings using the specified operator.
 *
 * @param {string} v1
 * @param {string} v2
 * @param {string} operator
 * @returns {bool}
 */
compareVersions.compare = function (v1, v2, operator) {
  if (v1 === 'preview') v1 = '65535';
  if (v2 === 'preview') v2 = '65535';
  v1 = v1.replace('≤', '');
  v2 = v2.replace('≤', '');
  return _compareVersions.compare(v1, v2, operator);
};
