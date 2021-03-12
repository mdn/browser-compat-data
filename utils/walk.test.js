const assert = require('assert');

const bcd = require('./bcd');
const { walk } = require('./index');
const { lowLevelWalk } = require('./walk');

describe('lowLevelWalk()', function () {
  it('visits every top-level tree', function () {
    const expectedPaths = [
      'api',
      'browsers',
      'css',
      'html',
      'http',
      'javascript',
      'mathml',
      'svg',
      'webdriver',
      'webextensions',
      'xpath',
      'xslt',
    ];

    const steps = Array.from(lowLevelWalk(undefined, undefined, 1));
    const paths = steps.map(step => step.path);
    assert.strictEqual(steps.length, expectedPaths.length);
    assert.deepStrictEqual(paths, expectedPaths);
  });
  it('visits every point in the tree', function () {
    const paths = Array.from(lowLevelWalk()).map(step => step.path);
    assert.ok(paths.length > 13000);
  });
});

describe('walk()', function () {
  it('should visit html.elements.a.href.href_top', function () {
    let results = Array.from(walk('html')).map(feature => feature.path);
    assert.ok(results.includes('html.elements.a.href.href_top'));
  });

  it('should walk a single tree', function () {
    let results = Array.from(walk('api.Notification'));
    assert.strictEqual(results.length, 27);
    assert.strictEqual(results[0].path, 'api.Notification');
    assert.strictEqual(results[1].path, 'api.Notification.Notification');
  });

  it('should walk multiple trees', function () {
    let results = Array.from(
      walk(['api.Notification', 'css.properties.color']),
    );
    assert.strictEqual(results.length, 28);
    assert.strictEqual(results[0].path, 'api.Notification');
    assert.strictEqual(
      results[results.length - 1].path,
      'css.properties.color',
    );
  });

  it('should yield every feature by default', function () {
    const featureCountFromString = JSON.stringify(bcd, undefined, 2)
      .split('\n')
      .filter(line => line.includes('__compat')).length;
    const featureCountFromWalk = Array.from(walk()).length;

    assert.strictEqual(featureCountFromString, featureCountFromWalk);
  });
});
