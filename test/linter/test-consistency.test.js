const assert = require('assert');
const { ConsistencyChecker } = require('./test-consistency.js');

const testConsistency = require('./test-consistency.js');

describe('ConsistencyChecker', function () {
  describe('isVersionAddedGreater()', function () {
    const cc = new ConsistencyChecker();
    const isVersionAddedGreater = (...args) =>
      cc.isVersionAddedGreater(...args);

    it('fixed versions compare as numbers', function () {
      assert.strictEqual(
        isVersionAddedGreater({ version_added: '2' }, { version_added: '9' }),
        true,
      );
      assert.strictEqual(
        isVersionAddedGreater({ version_added: '9' }, { version_added: '2' }),
        false,
      );
      assert.strictEqual(
        isVersionAddedGreater({ version_added: '0' }, { version_added: '2' }),
        true,
      );
      assert.strictEqual(
        isVersionAddedGreater({ version_added: '2' }, { version_added: '0' }),
        false,
      );
      assert.strictEqual(
        isVersionAddedGreater({ version_added: '0' }, { version_added: '0' }),
        false,
      );
    });

    it('fixed versions compare to ranged versions', () => {
      assert.strictEqual(
        isVersionAddedGreater({ version_added: '2' }, { version_added: '≤9' }),
        false,
      ); // meaning, [2 is less than any value 0 to 9, inclusive] => false
      assert.strictEqual(
        isVersionAddedGreater({ version_added: '≤2' }, { version_added: '9' }),
        true,
      ); // meaning, [any value 0 to 2, inclusive, is less than 9] => true
    });

    it('ranged versions compare to ranged versions', () => {
      assert.strictEqual(
        isVersionAddedGreater({ version_added: '≤2' }, { version_added: '≤9' }),
        false,
      ); // meaning, [every value 0-2 is less than every value 0-9] => false (because 0 < 0 is false and is always a consequence of comparing any two ranged versions)
    });
  });
});
