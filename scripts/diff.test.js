'use strict';
const assert = require('assert');
const { bcdDiff, pretty } = require('./diff.js');

describe('bcdDiff', () => {
  // Mock data resembling BCD. Used as the lhs and cloned/updated for rhs.
  const bcd = {
    browsers: {
      chrome: { name: 'Chrome' },
      edge: { name: 'Edge' },
      firefox: { name: 'Firefox' },
      safari: { name: 'Safari' },
    },
    api: {
      Node: {
        __compat: {
          mdn_url: 'https://developer.mozilla.org/docs/Web/API/Node',
          support: {
            chrome: { version_added: '1' },
            edge: { version_added: '12', note: 'Notes on a node' },
            firefox: { version_added: '1' },
            safari: { version_added: '1' },
          },
          status: {
            experimental: false,
            standard_track: true,
            deprecated: false,
          },
        },
        localName: {
          __compat: {
            support: {
              chrome: [
                { version_added: '50' },
                { version_added: '1', version_removed: '45' },
              ],
              edge: { version_added: null },
              firefox: { version_added: false },
              safari: { version_added: '1', version_removed: '14' },
            },
            status: {
              experimental: false,
              standard_track: false,
              deprecated: true,
            },
          },
        },
      },
    },
  };

  let lhs;
  let rhs;

  beforeEach(() => {
    lhs = bcd;
    rhs = JSON.parse(JSON.stringify(bcd));
  });

  it('no changes', () => {
    const diff = bcdDiff(lhs, rhs);
    assert.strictEqual(diff, undefined);
  });

  it('add mdn_url', () => {
    rhs.api.Node.localName.__compat.mdn_url =
      'https://developer.mozilla.org/docs/Web/API/Node/localName';
    const diff = bcdDiff(lhs, rhs);
    assert.deepStrictEqual(diff.other, ['api.Node.localName.__compat.mdn_url']);
  });

  it('change version_added in simple statement', () => {
    rhs.api.Node.__compat.support.chrome.version_added = '2';
    const diff = bcdDiff(lhs, rhs);
    assert.deepStrictEqual(diff.compat, {
      'api.Node': {
        support: {
          chrome: {
            lhs: { version_added: '1' },
            rhs: { version_added: '2' },
          },
        },
      },
    });
  });

  it('change version_added in multiple simple statement', () => {
    rhs.api.Node.__compat.support.firefox.version_added = '2';
    rhs.api.Node.__compat.support.safari.version_added = '3';
    const diff = bcdDiff(lhs, rhs);
    assert.deepStrictEqual(diff.compat, {
      'api.Node': {
        support: {
          firefox: {
            lhs: { version_added: '1' },
            rhs: { version_added: '2' },
          },
          safari: {
            lhs: { version_added: '1' },
            rhs: { version_added: '3' },
          },
        },
      },
    });
  });

  it('change version_added in array statement', () => {
    rhs.api.Node.localName.__compat.support.chrome[0].version_added = '55';
    const diff = bcdDiff(lhs, rhs);
    assert.deepStrictEqual(diff.compat, {
      'api.Node.localName': {
        support: {
          chrome: {
            lhs: [
              { version_added: '50' },
              { version_added: '1', version_removed: '45' },
            ],
            rhs: [
              { version_added: '55' }, // this changed
              { version_added: '1', version_removed: '45' },
            ],
          },
        },
      },
    });
  });

  it('change simple statement into array statement', () => {
    rhs.api.Node.__compat.support.chrome = [
      { version_added: '80' },
      { version_added: '1', version_removed: '40' },
    ];
    const diff = bcdDiff(lhs, rhs);
    assert.deepStrictEqual(diff.compat, {
      'api.Node': {
        support: {
          chrome: {
            lhs: { version_added: '1' },
            rhs: [
              { version_added: '80' },
              { version_added: '1', version_removed: '40' },
            ],
          },
        },
      },
    });
  });

  it('add entry into array statement', () => {
    rhs.api.Node.localName.__compat.support.chrome.splice(0, 0, {
      version_removed: '55',
    });
    const diff = bcdDiff(lhs, rhs);
    assert.deepStrictEqual(diff.compat, {
      'api.Node.localName': {
        support: {
          chrome: {
            lhs: [
              { version_added: '50' },
              { version_added: '1', version_removed: '45' },
            ],
            rhs: [
              { version_removed: '55' }, // this was added
              { version_added: '50' },
              { version_added: '1', version_removed: '45' },
            ],
          },
        },
      },
    });
  });

  it('change array statement into simple statement', () => {
    rhs.api.Node.localName.__compat.support.chrome = {
      version_added: '1',
    };
    const diff = bcdDiff(lhs, rhs);
    assert.deepStrictEqual(diff.compat, {
      'api.Node.localName': {
        support: {
          chrome: {
            lhs: [
              { version_added: '50' },
              { version_added: '1', version_removed: '45' },
            ],
            rhs: { version_added: '1' },
          },
        },
      },
    });
  });

  it('add new browser support statement', () => {
    rhs.api.Node.__compat.support.opera = {
      version_added: '1',
    };
    const diff = bcdDiff(lhs, rhs);
    assert.deepStrictEqual(diff.compat, {
      'api.Node': {
        support: {
          opera: {
            lhs: undefined,
            rhs: { version_added: '1' },
          },
        },
      },
    });
  });

  it('remove existing browser support statement', () => {
    delete rhs.api.Node.__compat.support.chrome;
    const diff = bcdDiff(lhs, rhs);
    assert.deepStrictEqual(diff.compat, {
      'api.Node': {
        support: {
          chrome: {
            lhs: { version_added: '1' },
            rhs: undefined,
          },
        },
      },
    });
  });

  it('change experimental status', () => {
    rhs.api.Node.__compat.status.experimental = true;
    const diff = bcdDiff(lhs, rhs);
    assert.deepStrictEqual(diff.compat, {
      'api.Node': {
        status: { experimental: true },
      },
    });
  });

  it('change standard_track status', () => {
    rhs.api.Node.__compat.status.standard_track = false;
    const diff = bcdDiff(lhs, rhs);
    assert.deepStrictEqual(diff.compat, {
      'api.Node': {
        status: { standard_track: false },
      },
    });
  });

  it('change deprecated status', () => {
    rhs.api.Node.__compat.status.deprecated = true;
    const diff = bcdDiff(lhs, rhs);
    assert.deepStrictEqual(diff.compat, {
      'api.Node': {
        status: { deprecated: true },
      },
    });
  });

  it('change multiple statuses', () => {
    rhs.api.Node.__compat.status.experimental = true;
    rhs.api.Node.__compat.status.deprecated = true;
    const diff = bcdDiff(lhs, rhs);
    assert.deepStrictEqual(diff.compat, {
      'api.Node': {
        status: { deprecated: true, experimental: true },
      },
    });
  });

  it('add bogus status', () => {
    rhs.api.Node.__compat.status.bogus = 42;
    const diff = bcdDiff(lhs, rhs);
    assert.deepStrictEqual(diff.compat, {
      'api.Node': {
        status: { bogus: 42 },
      },
    });
  });

  it('add new feature', () => {
    rhs.api.AudioNode = {
      __compat: {
        support: {
          firefox: { version_added: '12' },
          safari: { version_added: '13' },
        },
        status: { standard_track: true },
      },
    };
    const diff = bcdDiff(lhs, rhs);
    assert.deepStrictEqual(diff.compat, {
      'api.AudioNode': {
        support: {
          firefox: {
            lhs: undefined,
            rhs: { version_added: '12' },
          },
          safari: {
            lhs: undefined,
            rhs: { version_added: '13' },
          },
        },
        status: { standard_track: true },
      },
    });
  });

  // Deletions aren't explained in detail, as that's not very useful.
  it('delete feature', () => {
    delete rhs.api.Node;
    const diff = bcdDiff(lhs, rhs);
    assert.deepStrictEqual(diff.other, ['api.Node']);
  });

  it('delete subfeature', () => {
    delete rhs.api.Node.localName;
    const diff = bcdDiff(lhs, rhs);
    assert.deepStrictEqual(diff.other, ['api.Node.localName']);
  });
});

describe('pretty', () => {
  it('unset', () => {
    assert.strictEqual(pretty(false), 'unset');
    assert.strictEqual(pretty(null), 'unset');
    assert.strictEqual(pretty(undefined), 'unset');
  });

  it('just added', () => {
    assert.strictEqual(pretty({ version_added: '40' }), '40');
  });

  it('added and removed', () => {
    assert.strictEqual(
      pretty({
        version_added: '40',
        version_removed: '45',
      }),
      '40-45',
    );
  });

  it('added, removed and added again', () => {
    assert.strictEqual(
      pretty([
        { version_added: '40', version_removed: '45' },
        { version_added: '50' },
      ]),
      '(40-45, 50)',
    ); // TODO not that great?
  });
});
