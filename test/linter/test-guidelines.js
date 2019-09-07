/**
 * @param {string} filename
 */
function testGuidelines(filename) {
  /** @type {Identifier} */
  const data = require(filename);

  /** @type {string[]} */
  const errors = [];
  const logger = {
    /** @param {...unknown} message */
    error: (...message) => {
      errors.push(message.join(' '));
    },
  };

  if (errors.length) {
    console.error(chalk`{red   Guidelines – {bold ${errors.length}} ${errors.length === 1 ? 'error' : 'errors'}:}`);
    for (const error of errors) {
      console.error(`    ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testGuidelines;
