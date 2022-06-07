/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

class DuplicateCompatError extends Error {
  constructor(feature: string) {
    super(`${feature} already exists! Remove duplicate entries.`);
    this.name = 'DuplicateCompatError';
  }
}

function isPlainObject(v: object): boolean {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export default function extend(target: any, source: any, feature = ''): void {
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
}
