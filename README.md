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
You can install mdn-browser-compat-data as a node package ([tutorial](https://www.npmjs.com/package/mdn-browser-compat-data/tutorial)).
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

- [css/](https://github.com/mdn/browser-compat-data/tree/master/css) contains data for [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) properties, selectors and at-rules.

- [html/](https://github.com/mdn/browser-compat-data/tree/master/html) contains data for
[HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) elements, attributes and global attributes.

- [http/](https://github.com/mdn/browser-compat-data/tree/master/http) contains data for [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) headers, statuses and methods.

- [javascript/](https://github.com/mdn/browser-compat-data/tree/master/javascript) contains data for [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) built-in Objects, statement, operators and or other ECMAScript language features.

- [webextensions/](https://github.com/mdn/browser-compat-data/tree/master/webextensions) contains data for [WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) JavaScript APIs and manifest keys.

## Format of the browser compat json files
The definitive description of the format used to represent compatibility data is the [schema file](https://github.com/mdn/browser-compat-data/blob/master/compat-data.schema.json).
You can also have a look at the [schema documentation](https://github.com/mdn/browser-compat-data/blob/master/compat-data-schema.md).

*Please note that we do not (yet) guarantee the stability of the data format.
You're welcome to use the data, but its structure is subject to change without notice.*

## Issues?

If you find a problem, please [file a bug](https://github.com/mdn/browser-compat-data/issues/new).

## Contributing

We're very happy to accept contributions to this data. Please familiarize yourself
with the schema and send us a pull request. See also the [Contributing file](https://github.com/mdn/browser-compat-data/blob/master/CONTRIBUTING.md) for more information.
