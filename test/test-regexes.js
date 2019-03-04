const assert = require('assert');

const bcd = require('..');

function testToken(feature, matches, misses) {
  const regexp = new RegExp(feature.__compat.matches.regex_token);
  matches.forEach(match => assert.ok(regexp.test(match), `${regexp} did not match ${match}`));
  misses.forEach(miss => assert.ok(!regexp.test(miss), `${regexp} erroneously matched ${miss}`));
}

const tests = [
  {
    features: [
      bcd.css.properties.color.alpha_hexadecimal_notation
    ],
    matches: [
      '#003399ff',
      '#0af9',
    ],
    misses: [
      '#00aaff',
      '#0af',
      'green',
      '#greenish',
    ]
  }
];

tests.forEach(({features, matches, misses}) => {
  features.forEach(feature => testToken(feature, matches, misses));
});
