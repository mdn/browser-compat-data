#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';

/**
 *
 * Sort a list of features based upon a specific order:
 *  1. __compat is always first
 *  2. Alphanumerical features starting with an uppercase letter (without symbols aside from - or _)
 *  3. Alphanumerical features starting with a lowercase letter (without symbols aside from - or _)
 *  4. All other features
 *
 */

const compareFeatures = (a, b) => {
  if (a == '__compat') return -1;
  if (b == '__compat') return 1;

  const capsWordA = /^[A-Z](\w|-)*$/.test(a);
  const capsWordB = /^[A-Z](\w|-)*$/.test(b);
  const wordA = /^[a-zA-Z](\w|-)*$/.test(a);
  const wordB = /^[a-zA-Z](\w|-)*$/.test(b);

  if (wordA || wordB) {
    if (capsWordA || capsWordB) {
      if (capsWordA && capsWordB) return a.localeCompare(b, 'en');
      if (capsWordA) return -1;
      if (capsWordB) return 1;
    }
    if (wordA && wordB) return a.localeCompare(b, 'en');
    if (wordA) return -1;
    return 1;
  }
  return a.localeCompare(b, 'en');
};

module.exports = compareFeatures;
