/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/**
 * Deeply merges a source object into a target object.
 * @param {*} target The target object to merge into.
 * @param {*} source The source object to merge.
 * @returns {*} the target object with source merged.
 */
export const deepMerge = (target, source) => {
  if (typeof target !== 'object' || target === null) {
    return source;
  }
  if (typeof source !== 'object' || source === null) {
    return source;
  }

  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (
      typeof sourceValue === 'object' &&
      typeof targetValue === 'object' &&
      sourceValue !== null &&
      targetValue !== null
    ) {
      target[key] = deepMerge({ ...targetValue }, sourceValue);
    } else {
      target[key] = sourceValue;
    }
  }

  return target;
};
