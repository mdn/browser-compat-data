/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

const specialOrder = [
  'secure_context_required',
  'worker_support',
  'context_block',
  'context_flex',
  'context_grid',
  'context_multicol',
  'context_position_absolute',
];

const specialOrderMap = new Map(
  specialOrder.map((name, index) => [name, index]),
);

/**
 * Sort a list of features based upon a specific order:
 * 1. '__compat'
 * 2. Alphanumerical features starting with an uppercase letter (without symbols aside from - or _)
 * 3. Special order features (see above)
 * 5. Alphanumerical features starting with a lowercase letter (without symbols aside from - or _)
 * 6. All other features
 * @param {string} a - The name of the first object to perform comparison with
 * @param {string} b - The name of the second object to perform comparison with
 * @returns {number} Result of localeCompare
 */
const compareFeatures = (a, b) => {
  if (a == '__compat') {
    return -1;
  }
  if (b == '__compat') {
    return 1;
  }

  const capsWordA = /^[A-Z](\w|-)*$/.test(a);
  const capsWordB = /^[A-Z](\w|-)*$/.test(b);
  const wordA = /^[a-zA-Z](\w|-)*$/.test(a);
  const wordB = /^[a-zA-Z](\w|-)*$/.test(b);

  const specialA = specialOrderMap.get(a);
  const specialB = specialOrderMap.get(b);

  if (wordA || wordB) {
    if (capsWordA || capsWordB) {
      if (capsWordA && capsWordB) {
        return a.localeCompare(b, 'en');
      }
      if (capsWordA) {
        return -1;
      }
      if (capsWordB) {
        return 1;
      }
    }

    if (specialA !== undefined || specialB !== undefined) {
      if (specialA !== undefined && specialB !== undefined) {
        return specialA - specialB;
      }
      return specialA !== undefined ? -1 : 1;
    }

    if (wordA && wordB) {
      return a.localeCompare(b, 'en');
    }
    if (wordA) {
      return -1;
    }
    return 1;
  }
  return a.localeCompare(b, 'en');
};

export default compareFeatures;
