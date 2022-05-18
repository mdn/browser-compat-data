/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { strict as assert } from 'node:assert';

import visit from './visit.js';
import { walk } from './walk.js';

describe('visit()', function () {
  it('runs the function on all features if no other entry point is specified', function () {
    const walker = walk();
    visit((visitorPath) => {
      assert.equal(visitorPath, walker.next().value.path);
    });
  });

  it('skips features not selected by testFn', function () {
    const hits = new Set();
    const misses = new Set();
    visit(
      (path) => {
        hits.add(path);
      },
      {
        entryPoint: 'css',
        test(path) {
          if (path.includes('at-rules')) {
            return true;
          }
          misses.add(path);
          return false;
        },
      },
    );

    for (const miss in misses) {
      assert.ok(!hits.has(miss));
    }
  });

  it('visitorFn can break iteration', function () {
    visit((path) => {
      if (path.startsWith('css')) {
        return visit.BREAK;
      }
      if (path.startsWith('html')) {
        assert.fail(
          `visitorFn should never be invoked after the css tree. Reached ${path}`,
        );
      }
    });
  });

  it('visitorFn can skip traversal of children', function () {
    visit((path) => {
      if (path === 'css.at-rules.counter-style') {
        return visit.CONTINUE;
      }
      if (path.startsWith('css.at-rules-counter-style.')) {
        assert.fail(
          `visitorFn should never reach a child of counter-style. Reached ${path}`,
        );
      }
    });
  });
});
