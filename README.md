# browser-compat-data

[https://github.com/mdn/browser-compat-data](https://github.com/mdn/browser-compat-data)

Maintained by the [MDN team at Mozilla](https://wiki.mozilla.org/MDN).

This repository contains compatibility data for Web technologies.
Browser compatibility data describes which platforms (where "platforms" are
usually, but not always, web browsers) support particular Web APIs.

This data can be used in documentation, to build compatibility tables listing
browser support for APIs. For example:
[https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs).

## Repository contents

There's a top-level directory for each broad area covered: for example, "http",
"javascript", "webextensions". Inside each of these directories is one or more
JSON files containing the compatibility data. At the moment the format used is
not common across all files, but we're hoping to standardize on a common format.

### javascript

Contains experimental data for  [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

### http

Contains experimental data for [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP).

### webextensions

[WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions)
are a cross-browser system for developing browser add-ons.

The "webextensions" directory contains two files:

* [browser-compat-data.json](https://github.com/mdn/browser-compat-data/blob/master/webextensions/browser-compat-data.json): contains compatibility data for all the
[WebExtensions JavaScript APIs](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API). This data is used in a few different places in the MDN docs for WebExtensions. For example: [https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs)
* [browser-compat-data.schema.json](https://github.com/mdn/browser-compat-data/blob/master/webextensions/browser-compat-data.schema.json): a schema describing the format of the WebExtensions compatibility data.

*Please note that we do not (yet) guarantee the stability of the data format.
You're welcome to use the data, but its structure is subject to change without notice.*

## Problems?

If you find a problem, please [file a bug](https://github.com/mdn/browser-compat-data/issues/new).

## Contributing

We're very happy to accept contributions to this data. Please familiarize yourself
with the schema for the data you're editing, and send us a pull request.

[![Build Status](https://travis-ci.org/mdn/browser-compat-data.svg?branch=master)](https://travis-ci.org/mdn/browser-compat-data)
