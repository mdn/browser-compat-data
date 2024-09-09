/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { walk } from '../../utils/index.js';

import {
  generateMeta,
  applyMirroring,
  addVersionLast,
  createManifest,
} from './index.js';

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
                version_added: '1',
                version_removed: '4',
              },
            ],
            safari: {
              version_added: '10',
              version_removed: 'preview',
              version_last: 'preview',
            },
            edge: {
              version_added: '12',
              version_removed: true,
              version_last: true,
            },
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
    assert.equal(data.feature.__compat.support.firefox[1].version_last, '3.6');
    assert.equal(data.feature.__compat.support.safari.version_last, 'preview');
    assert.equal(data.feature.__compat.support.edge.version_last, true);
  });
  it('createManifest', () => {
    const manifest = createManifest();
    assert.ok(manifest.main);
    assert.ok(manifest.exports);
    assert.ok(manifest.types);
    assert.ok(manifest.name);
    assert.ok(manifest.description);
    assert.ok(manifest.repository);
    assert.ok(manifest.keywords);
    assert.ok(manifest.author);
    assert.ok(manifest.license);
    assert.ok(manifest.bugs);
    assert.ok(manifest.homepage);
  });
});
