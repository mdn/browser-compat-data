const assert = require('assert');

const iterSupport = require('./iter-support');

describe('iterSupport()', function () {
  it('returns an empty array for non-existent browsers', function () {
    assert.deepStrictEqual(
      iterSupport({ support: { firefox: [] } }, 'chrome'),
      [],
    );
  });

  it('returns a single support statement as an array', function () {
    assert.deepStrictEqual(
      iterSupport({ support: { firefox: { version_added: true } } }, 'firefox'),
      [{ version_added: true }],
    );
  });

  it('returns an array of support statements as an array', function () {
    const compatObj = {
      support: { firefox: [{ version_added: true }, { version_added: '1' }] },
    };
    const support = [{ version_added: true }, { version_added: '1' }];

    assert.deepStrictEqual(iterSupport(compatObj, 'firefox'), support);
  });
});
