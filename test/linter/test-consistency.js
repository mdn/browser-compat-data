'use strict';
const ConsistencyChecker = require('./ConsistencyChecker.js');

/**
 * @param {string} filename
 */
function testConsistency(filename) {
  /** @type {Identifier} */
  let data = require(filename);

  const checker = new ConsistencyChecker();
  const errors = checker.check(data);

  if (errors.length) {
    console.error(
      chalk`{red   Consistency - {bold ${errors.length} }${
        errors.length === 1 ? 'error' : 'errors'
      }:}`,
    );
    errors.forEach(({ feature, path, errors }) => {
      console.error(
        chalk`{red   → {bold ${errors.length}} × {bold ${feature}} [${path.join(
          '.',
        )}]: }`,
      );
      errors.forEach(({ errortype, browser, parent_value, subfeatures }) => {
        if (errortype == 'unsupported') {
          console.error(
            chalk`{red     → No support in {bold ${browser}}, but support is declared in the following sub-feature(s):}`,
          );
        } else if (errortype == 'support_unknown') {
          console.error(
            chalk`{red     → Unknown support in parent for {bold ${browser}}, but support is declared in the following sub-feature(s):}`,
          );
        } else if (errortype == 'subfeature_earlier_implementation') {
          console.error(
            chalk`{red     → Basic support in {bold ${browser}} was declared implemented in a later version ({bold ${parent_value}}) than the following sub-feature(s):}`,
          );
        }

        subfeatures.forEach(subfeature => {
          console.error(
            chalk`{red       → {bold ${path.join('.')}.${subfeature[0]}}: ${
              subfeature[1] === undefined ? '[Array]' : subfeature[1]
            }}`,
          );
        });
      });
    });
    return true;
  }
  return false;
}

module.exports = testConsistency;
