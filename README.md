# `@mdn/browser-compat-data`

[https://github.com/mdn/browser-compat-data](https://github.com/mdn/browser-compat-data)

The `browser-compat-data` ("BCD") project contains machine-readable browser (and JavaScript runtime) compatibility data for Web technologies, such as Web APIs, JavaScript features, CSS properties and more. Our goal is to document accurate compatibility data for Web technologies, so web developers may write cross-browser compatible websites easier. BCD is used in web apps and software such as [MDN Web Docs](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs), CanIUse, Visual Studio Code, WebStorm and [more](#Projects-using-the-data).

Read how this project is [governed](./GOVERNANCE.md).

Chat with us on Matrix at [chat.mozilla.org#mdn](https://chat.mozilla.org/#/room/#mdn:mozilla.org)!

## Installation and Import

### NodeJS

You can install `@mdn/browser-compat-data` as a node package.

```bash
npm install @mdn/browser-compat-data
# ...or...
yarn add @mdn/browser-compat-data
```

Then, you can import BCD into your project with either `import` or `require()`:

```js
// ESM with Import Attributes (NodeJS 20+)
import bcd from '@mdn/browser-compat-data' with { type: 'json' };
// ...or...
const { default: bcd } = await import('@mdn/browser-compat-data', {
  with: { type: 'json' },
});

// ...or...

// ESM with Import Assertions (NodeJS 16+)
import bcd from '@mdn/browser-compat-data' assert { type: 'json' };
// ...or...
const { default: bcd } = await import('@mdn/browser-compat-data', {
  assert: { type: 'json' },
});

// ...or...

// ESM Wrapper for older NodeJS versions (NodeJS v12+)
import bcd from '@mdn/browser-compat-data/forLegacyNode';
// ...or...
const { default: bcd } = await import('@mdn/browser-compat-data/forLegacyNode');

// ...or...

// CommonJS Module (Any NodeJS)
const bcd = require('@mdn/browser-compat-data');
```

### Deno/Browsers

You can import `@mdn/browser-compat-data` using a CDN.

```js
// ESM with Import Attributes (Deno 1.37+)
import bcd from 'https://unpkg.com/@mdn/browser-compat-data' with { type: 'json' };
// ...or...
const { default: bcd } = await import(
  'https://unpkg.com/@mdn/browser-compat-data',
  {
    with: { type: 'json' },
  }
);

// ...or...

// ESM with Import Assertions (Deno 1.17+)
import bcd from 'https://unpkg.com/@mdn/browser-compat-data' assert { type: 'json' };
// ...or...
const { default: bcd } = await import(
  'https://unpkg.com/@mdn/browser-compat-data',
  {
    assert: { type: 'json' },
  }
);

// ...or...

// Fetch Method (Deno 1.0+)
const bcd = await fetch('https://unpkg.com/@mdn/browser-compat-data').then(
  (response) => response.json(),
);
```

### Other Languages

You can obtain the raw compatibility data for `@mdn/browser-compat-data` using a CDN and loading the `data.json` file included in releases.

```py
https://unpkg.com/@mdn/browser-compat-data/data.json
```

## Usage

Once you have imported BCD, you can access the compatibility data for any feature by accessing the properties of the dictionary.

```js
// Grab the desired support statement
const support = bcd.css.properties.background.__compat;
// returns a compat data object (see schema)

// You may use any syntax to obtain dictionary items
const support = bcd['api']['Document']['body']['__compat'];
```

## Package contents

The `@mdn/browser-compat-data` package contains a tree of objects, with support and browser data objects at their leaves. There are over 15,000 features in the dataset; this documentation highlights significant portions, but many others exist at various levels of the tree.

The definitive description of the format used to represent individual features and browsers is the [schema definitions](./schemas/).

Apart from the explicitly documented objects below, feature-level support data may change at any time. See [_Semantic versioning policy_](#Semantic-versioning-policy) for details.

The package contains the following top-level objects:

### `__meta`

An object containing the following package metadata:

- `version` - the package version
- `timestamp` - the timestamp of when the package version was built

### [`api`](./api)

Data for [Web API](https://developer.mozilla.org/en-US/docs/Web/API) features.

### [`browsers`](./browsers)

Data for browsers and JavaScript runtimes. See the [browser schema](./schemas/browsers-schema.md) for details.

### [`css`](./css)

Data for [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) features, including:

- `at-rules` - at-rules (e.g. `@media`)
- `properties` - Properties (e.g. `background`, `color`, `font-variant`)
- `selectors` - Selectors (such as basic selectors, combinators, or pseudo elements)
- `types` - Value types for rule values

### [`html`](html)

Data for [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) features, including:

- `elements` - Elements
- `global_attributes` - Global attributes
- `manifest` - Web App manifest keys

### [`http`](http)

Data for [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) features, including:

- `headers` - Request and response headers
- `methods` - Request methods
- `status` - Status codes

### [`javascript`](./javascript)

Data for JavaScript language features, including:

- `builtins` - Built-in objects
- `classes` - Class definition features
- `functions` - Function features
- `grammar` - Language grammar
- `operators` - Mathematical and logical operators
- `statements` - Language statements and expressions

### [`mathml`](./mathml)

Data for [MathML](https://developer.mozilla.org/en-US/docs/Web/MathML) features, including:

- `elements` - Elements

### [`svg`](./svg)

Data for [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) features, including:

- `attributes` - Attributes
- `elements` - Elements

### [`webassembly`](./webassembly)

Data for [WebAssembly](https://developer.mozilla.org/docs/WebAssembly) features.

### [`webdriver`](./webdriver)

Data for [WebDriver](https://developer.mozilla.org/en-US/docs/Web/WebDriver) features.

### [`webextensions`](./webextensions)

Data for [WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) features, including:

- `api` - WebExtension-specific APIs
- `manifest` - `manifest.json` keys

## Semantic versioning policy

For the purposes of [semantic versioning](https://semver.org/) (SemVer), the public API consists of:

- The high-level namespace objects documented in [_Package contents_](#Package-contents)
- The schema definitions for browser and support data structures
- The TypeScript definitions

The details of browser compatibility change frequently, as browsers ship new features, standards organizations revise specifications, and Web developers discover new bugs. We routinely publish updates to the package to reflect these changes.

You should expect lower-level namespaces, feature data, and browser data to be added, removed, or modified at any time. That said, we strive to communicate changes and preserve backward compatibility; if you rely on a currently undocumented portion of the package and want SemVer to apply to it, please [open an issue](https://github.com/mdn/browser-compat-data/issues).

## What isn't tracked?

Now that you know what this project _is_, let's mention what this project _isn't_. This project is not:

- An extensive description of every possible detail about a feature in a browser. We do not track UI changes, [irrelevant features](./docs/data-guidelines/index.md#removal-of-irrelevant-features) or [irrelevant flag data](./docs/data-guidelines/index.md#removal-of-irrelevant-flag-data).
- A source for custom features added by web frameworks (e.g. React, Vue) or corporate runtimes (e.g. AWS Lambda, Azure Functions).
- A documentation of screen reader compatibility; for screen reader compatibility, check out https://a11ysupport.io/ instead.
- The location where Baseline data is hosted; while Baseline pulls from BCD, the Baseline data is managed by the W3C WebDX Community Group on their own [GitHub repo](https://github.com/web-platform-dx/web-features).

## Issues?

If you find a problem with the compatibility data (such as incorrect version numbers) or there is a new web feature you think we should document, please [file a bug](https://github.com/mdn/browser-compat-data/issues/new).

## Contributing

Thank you for your interest in contributing to this project! See [Contributing to browser-compat-data](./docs/contributing.md) for more information.

## Projects using the data

Here are some projects using the data, as an [npm module](https://www.npmjs.com/browse/depended/@mdn/browser-compat-data) or directly:

- [Add-ons Linter](https://github.com/mozilla/addons-linter) - the Add-ons Linter is used on [addons.mozilla.org](https://addons.mozilla.org/) and the [web-ext](https://github.com/mozilla/web-ext/) tool. It uses browser-compat-data to check that the Firefox version that the add-on lists support for does in fact support the APIs used by the add-on.
- [caniuse](https://caniuse.com/) - In addition to the existing caniuse database, caniuse includes features from the MDN BCD project, formatted and interactive like any other caniuse support table.
- [CanIUse Embed](https://caniuse.bitsofco.de/) - Thanks to the inclusion of MDN BCD data in caniuse, this embed tool allows for embedding BCD data into any project.
- [Compat Report](https://addons.mozilla.org/en-US/firefox/addon/compat-report/) - Firefox Add-on that shows compatibility data for the current site in the developer tools.
- [compat-tester](https://github.com/SphinxKnight/compat-tester) - Scan local documents for compatibility issues.
- [Visual Studio Code](https://code.visualstudio.com) - Shows the compatibility information in [the code completion popup](https://code.visualstudio.com/updates/v1_25#_improved-accuracy-of-browser-compatibility-data).
- [webhint.io](https://webhint.io/docs/user-guide/hints/hint-compat-api/) - Hints to check if your CSS HTML and JavaScript have deprecated or not broadly supported features.
- [WebStorm](https://www.jetbrains.com/webstorm/whatsnew/#v2019-1-html-and-css) - JavaScript IDE allowing you to check whether all CSS properties you use are supported in the target browser version.

## Acknowledgments

Thanks to:

<table>
  <tr align="center">
    <td>
      <img
        src="https://user-images.githubusercontent.com/498917/52569900-852b3080-2e12-11e9-9bd0-f1e256b13e53.png"
        height="56"
        alt="BrowserStack"
      />
      <p>
        The
        <a href="https://www.browserstack.com/open-source"
          >BrowserStack Open Source Program</a
        >
        for testing services
      </p>
    </td>
    <td>
      <img
        src="https://opensource.saucelabs.com/images/opensauce/powered-by-saucelabs-badge-white.png?sanitize=true"
        height="56"
        alt="Testing Powered By Sauce Labs"
      />
      <p>
        <a href="https://opensource.saucelabs.com/">Sauce Labs Open Source</a
        >
        for testing services
      </p>
    </td>
    <td>
      <img
        src="https://user-images.githubusercontent.com/5179191/203835995-e4cf2b3f-483f-419f-afda-bad1200c04f2.png"
        height="56"
        alt="LambdaTest"
      />
      <p>
        <a href="https://www.lambdatest.com/hyperexecute">LambdaTest Open Source</a
        >
        for testing services
      </p>
    </td>
  </tr>
</table>
