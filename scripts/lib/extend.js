/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/**
 * Error class for duplicate compat statements during object merge
 */
class DuplicateCompatError extends Error {
  /**
   * Construct the error
   * @param {string} feature The feature path
   */
  constructor(feature) {
    super(`${feature} already exists! Remove duplicate entries.`);
    this.name = 'DuplicateCompatError';
  }
}

/**
 * Check if the variable is an object ({})
 * @param {*} v The object to test
 * @returns {v is object} Whether the object is a plain object
 */
const isPlainObject = (v) =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Combine two objects containing browser compat data together
 * @param {object} target The object to extend
 * @param {object} source The object to copy from
 * @param {string} [feature] The feature path so far (internal for recursive calls)
 * @returns {void}
 */
const extend = (target, source, feature = '') => {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    throw new Error('Both target and source must be plain objects');
  }

  // iterate over own enumerable properties
  for (const [key, value] of Object.entries(source)) {
    // recursively extend if target has the same key, otherwise just assign
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      if (key == '__compat') {
        // If attempting to merge __compat, we have a double-entry
        throw new DuplicateCompatError(feature);
      }
      extend(target[key], value, feature + `${feature ? '.' : ''}${key}`);
    } else {
      target[key] = value;
    }
  }
};

export default extend;
