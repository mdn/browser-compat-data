/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { walk } from '../../utils/index.js';

import { generateMeta, applyMirroring, addVersionLast } from './index.js';

describe('Build functions', () => {
  it('generateMeta', () => {
    const result = generateMeta();
    assert.ok(result.version);
    assert.ok(result.timestamp instanceof Date);
  });

  it('applyMirroring', () => {
    const data: any = {
      feature: {
        __compat: {
          support: {
            chrome: {
              version_added: '90',
            },
            edge: 'mirror',
            firefox: {
              version_added: '40',
            },
            ie: {
              version_added: false,
            },
            opera: 'mirror',
            safari: {
              version_added: '10',
            },
          },
        },
      },
    };

    const walker = walk(undefined, data);
    for (const feature of walker) {
      applyMirroring(feature);
    }

    assert.equal(data.feature.__compat.support.edge.version_added, '90');
    assert.equal(data.feature.__compat.support.opera.version_added, '76');
  });

  it('addVersionLast', () => {
    const data: any = {
      feature: {
        __compat: {
          support: {
            chrome: {
              version_added: '10',
              version_removed: '20',
            },
            firefox: [
              {
                version_added: '18',
              },
              {
                version_added: '15',
                version_removed: '16',
              },
            ],
          },
        },
      },
    };

    const walker = walk(undefined, data);
    for (const feature of walker) {
      addVersionLast(feature);
    }

    assert.equal(data.feature.__compat.support.chrome.version_last, '19');
    assert.equal(
      data.feature.__compat.support.firefox[0].version_last,
      undefined,
    );
    assert.equal(data.feature.__compat.support.firefox[1].version_last, '15');
  });
});
