'use strict';

const assert = require('assert');
const compareVersions = require('compare-versions');

// Like compareVersions, but returns NaN if it's not possible to compare
// the versions because one or both is ranged (starts with ≤). A ranged
// version is a specific but unknown version, not all versions in the range.
// When a number is returned:
//  -1 means range a is strictly before than range b
//   0 means range a and b intersect
//  +1 means range a is strictly after range b
function compareRangedVersions(a, b) {
  let aIsRange = a.startsWith('≤');
  let bIsRange = b.startsWith('≤');
  if (aIsRange && bIsRange) {
    return NaN;
  }
  const result = compareVersions(a.replace('≤', ''), b.replace('≤', ''));
  if (aIsRange) {
    return result > 0 ? NaN : result;
  }
  if (bIsRange) {
    return result < 0 ? NaN : result;
  }
  assert(!aIsRange && !bIsRange);
  return result;
}

// Test if a specific |version| is in |range|, which is a
// { version_added: ..., version_removed: ... } object.
function isVersionInRange(version, range) {
  assert(typeof version === 'string' && !version.startsWith('≤'));
  const { version_added, version_removed } = range;
  assert(
    [false, true, null].includes(version_added) ||
      typeof version_added === 'string',
  );
  // version_removed can't be false: https://github.com/mdn/browser-compat-data/pull/9015
  assert(
    [true, undefined].includes(version_removed) ||
      typeof version_removed === 'string',
  );

  // The simple case of a feature never being added:
  if (version_added === false) {
    assert(version_removed === undefined);
    return false;
  }

  // Now check if it was definitely removed or maybe removed. If it was
  // definitely removed we need not consider when it was added.
  let maybeRemoved = false;
  if (version_removed === true) {
    maybeRemoved = true;
  } else if (typeof version_removed === 'string') {
    const cmp = compareRangedVersions(version, version_removed);
    if (cmp >= 0) {
      // Definitely removed.
      return false;
    }
    if (isNaN(cmp)) {
      maybeRemoved = true;
    }
  }

  if (version_added === null || version_added === true) {
    return null;
  }

  assert(typeof version_added === 'string');
  const cmp = compareRangedVersions(version, version_added);
  switch (cmp) {
    case -1:
      // This is before support.
      return false;
    case 0:
      // This is the version when support was added. Any removal doesn't
      // change this.
      return true;
    case 1:
      // Beyond the version when support was added, an uncertain removal
      // makes support uncertain.
      return maybeRemoved ? null : true;
    default:
      assert(isNaN(cmp));
      return null;
  }
}

// Test if a specific |version| is in |ranges|, which is an
// array of { version_added: ..., version_removed: ... } objects.
// Returns two arrays, the first with definite matches and the second
// with potential matches, uncertain due to true/null/ranges.
function matchVersionInRanges(version, ranges, filter) {
  const matches = [];
  const maybeMatches = [];
  for (const range of ranges) {
    if (range.flags && !filter.flags) {
      continue;
    }
    if (range.alternative_name && !filter.alternative_name) {
      continue;
    }
    if (range.prefix && !filter.prefix) {
      continue;
    }
    const result = isVersionInRange(version, range);
    if (result === true) {
      matches.push(range);
    } else if (result === null) {
      maybeMatches.push(range);
    }
  }
  return [matches, maybeMatches];
}

function isSupported(support, browser, version) {
  let ranges = support[browser];
  if (typeof ranges !== 'object') {
    return null;
  }
  if (!Array.isArray(ranges)) {
    ranges = [ranges];
  }
  const [matches, maybeMatches] = matchVersionInRanges(version, ranges, {
    flags: false,
    alternative_name: false,
    prefix: false,
  });
  if (matches.length) {
    return true;
  }
  if (maybeMatches.length) {
    return null;
  }
  return false;
}

function getCompatEntry(bcd, path) {
  let node = bcd;
  for (const key of path.split('.')) {
    if (Object.prototype.hasOwnProperty.call(node, key)) {
      node = node[key];
    } else {
      throw new Error(`No entry found for ${path}`);
    }
  }
  if (node.__compat) {
    return node.__compat;
  }
  throw new Error(`No compat statement found at ${path}`);
}

module.exports = {
  compareRangedVersions,
  isVersionInRange,
  isSupported,
  getCompatEntry,
};
