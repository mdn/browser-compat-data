# mdn-browser-compat-data — plus spec data

This repo is a fork of
[https://github.com/mdn/browser-compat-data](https://github.com/mdn/browser-compat-data)
that adds spec URLs in the `*.json` sources for all features that have an
`mdn_url` for an article with a *Specifications* table.

To (re)generate the additional data for all features:

This data can be used in documentation, to build compatibility tables listing
browser support for APIs. For example:
[Browser support for WebExtension APIs](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs).

[![npm](https://img.shields.io/npm/v/mdn-browser-compat-data.svg)](https://www.npmjs.com/package/mdn-browser-compat-data)
[![Build Status](https://travis-ci.org/mdn/browser-compat-data.svg?branch=master)](https://travis-ci.org/mdn/browser-compat-data)
[![Twitter Follow](https://img.shields.io/twitter/follow/mozdevnet.svg?style=social&label=Follow&style=plastic)](https://twitter.com/MozDevNet)

Read how this project is [governed](https://github.com/mdn/browser-compat-data/blob/master/GOVERNANCE.md).

## Installation
You can install mdn-browser-compat-data as a node package.
```
npm install mdn-browser-compat-data
```
time python -u ./add-specs.py fullupdate 2>&1 | tee LOG
```

To (re)generate the additional data only for features that don’t already
have spec URLs in the `*.json` sources:

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

We're very happy to accept contributions to this data. See [Contributing to browser-compat-data](/docs/contributing.md) for more information.

## Projects using the data
Here are some projects using the data, as an [npm module](https://www.npmjs.com/browse/depended/mdn-browser-compat-data) or directly:

* [Add-ons Linter](https://github.com/mozilla/addons-linter) - the Add-ons Linter is used on [addons.mozilla.org](https://addons.mozilla.org/) and the [web-ext](https://github.com/mozilla/web-ext/) tool. It uses browser-compat-data to check that the Firefox version that the add-on lists support for does in fact support the APIs used by the add-on.
* [Browser Compatibility Data Explorer](https://github.com/connorshea/mdn-compat-data-explorer) - View, search, and visualize data from the compatibility dataset.
* [Compat Report](https://addons.mozilla.org/en-US/firefox/addon/compat-report/) - Firefox Add-on that shows compatibility data for the current site in the developer tools.
* [compat-tester](https://github.com/SphinxKnight/compat-tester) - Scan local documents for compatibility issues.
* [Visual Studio Code](https://code.visualstudio.com) - Shows the compatibility information in [the code completion popup](https://code.visualstudio.com/updates/v1_25#_improved-accuracy-of-browser-compatibility-data).
* [webhint.io](https://webhint.io/docs/user-guide/hints/hint-compat-api/) - Hints to check if your CSS HTML and JavaScript have deprecated or not broadly supported features.
* [WebStorm](https://www.jetbrains.com/webstorm/whatsnew/#v2019-1-html-and-css) - JavaScript IDE allowing you to check whether all CSS properties you use are supported in the target browser version.
