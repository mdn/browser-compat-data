const assert = require("assert");

const bcd = require("./bcd");
const query = require("./query");
const { joinPath, isBrowser, isFeature } = require("./walkingUtils");

describe("joinPath()", function () {
  it("joins dotted paths to features", function () {
    assert.strictEqual(joinPath("html", "elements"), "html.elements");
  });

  it("silently discards undefineds", function () {
    assert.strictEqual(joinPath(undefined, undefined, undefined), "");
    assert.strictEqual(joinPath(undefined, "api"), "api");
  });
});

describe("isBrowser()", function () {
  it("returns true for browser-like objects", function () {
    assert.ok(isBrowser(bcd.browsers.firefox));
  });

  it("returns false for feature-like objects", function () {
    assert.strictEqual(isBrowser(query("html.elements.a")), false);
  });
});

describe("isFeature()", function () {
  it("returns false for browser-like objects", function () {
    assert.strictEqual(isFeature(bcd.browsers.chrome), false);
  });

  it("returns true for feature-like objects", function () {
    assert.ok(isFeature(query("html.elements.a")));
  });
});
