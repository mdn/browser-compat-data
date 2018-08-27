# mdn-browser-compat-data

[https://github.com/mdn/browser-compat-data](https://github.com/mdn/browser-compat-data)

This repository contains compatibility data for Web technologies.
Browser compatibility data describes which platforms (where "platforms" are
usually, but not always, web browsers) support particular Web APIs.

This data can be used in documentation, to build compatibility tables listing
browser support for APIs. For example:
[Browser support for WebExtension APIs](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs).

[![npm](https://img.shields.io/npm/v/mdn-browser-compat-data.svg)](https://www.npmjs.com/package/mdn-browser-compat-data)
[![Build Status](https://travis-ci.org/mdn/browser-compat-data.svg?branch=master)](https://travis-ci.org/mdn/browser-compat-data)
[![Twitter Follow](https://img.shields.io/twitter/follow/mozdevnet.svg?style=social&label=Follow&style=plastic)](https://twitter.com/MozDevNet)

Maintained by the [MDN team at Mozilla](https://wiki.mozilla.org/MDN).

## Installation
You can install mdn-browser-compat-data as a node package.
```
npm install mdn-browser-compat-data
```

## Usage
```js
const bcd = require('mdn-browser-compat-data');
bcd.css.properties.background;
// returns a compat data object (see schema)
```

## Repository contents

There's a top-level directory for each broad area covered: for example, "http",
"javascript", "webextensions". Inside each of these directories is one or more
JSON file containing the compatibility data.

*Please note that we have not (yet) migrated all compatibility data from the MDN wiki pages into this repository.*

- [api/](https://github.com/mdn/browser-compat-data/tree/master/api) contains data for each [Web API](https://developer.mozilla.org/en-US/docs/Web/API) interface.

- [css/](https://github.com/mdn/browser-compat-data/tree/master/css) contains data for [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) properties, selectors, and at-rules.

- [html/](https://github.com/mdn/browser-compat-data/tree/master/html) contains data for
[HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) elements, attributes, and global attributes.

- [http/](https://github.com/mdn/browser-compat-data/tree/master/http) contains data for [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) headers, statuses, and methods.

- [javascript/](https://github.com/mdn/browser-compat-data/tree/master/javascript) contains data for [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) built-in Objects, statement, operators, and other ECMAScript language features.

- [mathml/](https://github.com/mdn/browser-compat-data/tree/master/mathml) contains data for [MathML](https://developer.mozilla.org/docs/Web/MathML) elements, attributes, and global attributes.

- [svg/](https://github.com/mdn/browser-compat-data/tree/master/svg) contains data for [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) elements, attributes, and global attributes.

- [webdriver/](https://github.com/mdn/browser-compat-data/tree/master/webdriver) contains data for [WebDriver](https://developer.mozilla.org/en-US/docs/Web/WebDriver) commands.

- [webextensions/](https://github.com/mdn/browser-compat-data/tree/master/webextensions) contains data for [WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) JavaScript APIs and manifest keys.

- [xpath/](https://github.com/mdn/browser-compat-data/tree/master/xpath) contains data for [XPath](https://developer.mozilla.org/docs/Web/XPath) axes, and functions.

- [xslt/](https://github.com/mdn/browser-compat-data/tree/master/xslt) contains data for [XSLT](https://developer.mozilla.org/docs/Web/XSLT) elements, attributes, and global attributes.

## Format of the browser compat json files
The definitive description of the format used to represent compatibility data is the [schema file](https://github.com/mdn/browser-compat-data/blob/master/schemas/compat-data.schema.json).
You can also have a look at the [schema documentation](https://github.com/mdn/browser-compat-data/blob/master/schemas/compat-data-schema.md).

*Please note that we do not (yet) guarantee the stability of the data format.
You're welcome to use the data, but its structure is subject to change without notice.*

## Issues?

If you find a problem, please [file a bug](https://github.com/mdn/browser-compat-data/issues/new).

## Contributing

We're very happy to accept contributions to this data. Please familiarize yourself
with the schema and send us a pull request. See also the [Contributing file](https://github.com/mdn/browser-compat-data/blob/master/CONTRIBUTING.md) for more information.

## Browser compatibility tables on MDN

It takes 1-2 weeks for changes in this data to be reflected in MDN's browser compatibility tables. The process is:

1. A pull request is reviewed and merged to master.
2. A new release of [mdn-browser-compat-data](https://www.npmjs.com/package/mdn-browser-compat-data) is created by MDN staff. This happens every 4-14 days.
3. A new image of [Kumascript](https://github.com/mdn/kumascript), which includes the BCD release, is built and deployed to production. This happens within a day of the npm package release.
4. The MDN page using the data is regenerated. For newly converted pages, a staff member switches to the [{{Compat}}](https://github.com/mdn/kumascript/blob/master/macros/Compat.ejs) macro, and re-checks the conversion. For updates to converted pages, a logged-in MDN user [force-refreshes the page](https://en.wikipedia.org/wiki/Wikipedia:Bypass_your_cache#Bypassing_cache) to regenerate it.

## Projects using the data
Here are some projects using the data, as an [npm module](https://www.npmjs.com/browse/depended/mdn-browser-compat-data) or directly:

* [Compat Report](https://addons.mozilla.org/en-US/firefox/addon/compat-report/) - Firefox Add-on that shows compatibility data for the current site in the developer tools.
* [compat-tester](https://github.com/SphinxKnight/compat-tester) - Scan local documents for compatibility issues.
* [mdncomp](https://github.com/epistemex/mdncomp) - View compatibility data on the command line.
* [Browser Compatibility Data Explorer](https://github.com/connorshea/mdn-compat-data-explorer) - View, search, and visualize data from the compatibility dataset.
* [Visual Studio Code](https://code.visualstudio.com) - Shows the compatibility information in [the code completion popup](https://code.visualstudio.com/updates/v1_25#_improved-accuracy-of-browser-compatibility-data).
