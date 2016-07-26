# browser-compat-data

[https://github.com/mdn/browser-compat-data](https://github.com/mdn/browser-compat-data)

Maintained by the [MDN team at Mozilla](https://wiki.mozilla.org/MDN).

This repository contains compatibility data for Web technologies.
Browser compatibility data describes which platforms (where "platforms" are
usually, but not always, web browsers) support particular Web APIs.

This data can be used in documentation, to build compatibility tables listing
browser support for APIs. For example:
[Browser support for JavaScript APIs](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs).

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
[WebExtensions JavaScript APIs](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API). This data is used in a few different places in the MDN docs for WebExtensions. For example: [Browser support for JavaScript APIs](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs)
* [browser-compat-data.schema.json](https://github.com/mdn/browser-compat-data/blob/master/webextensions/browser-compat-data.schema.json): a schema describing the format of the WebExtensions compatibility data.

The definitive description of the format used by WebExtensions is the schema file.
But since the schema is hard to read, here's an English description of it:

* the file contains a single JSON object, which has one property for each
WebExtensions API. The name of the property is the name of the API
(for example, "i18n", or "downloads"). The value is an `api` object.

* an `api` object has one property for each API element in the API (each method,
property, type, and event). The name of the property is the name of the element.
For example, "getMessage" or "create". The value of that property is an
`browser-support` object.

* a `browser-support` object contains a property for each browser for which we
are capturing support data. For WebExtensions, this is: "Chrome", "Edge",
"Firefox", "Firefox for Android", "Opera". Each of these properties is a
`support-statement` object.

* a `support-statement` object has:
    * one mandatory property "support". This can be any of:
        * `true` (it is supported, but we don't know the version that added support)
        * `false`
        * "Unknown"
        * a version string

    * one optional property "notes", which is an array of strings.
    This adds any extra information about support in this browser.
    It's a good idea to use different strings to comment on different
    aspects of support. For example: ["does not support 'byUser'",
    "explodes randomly"].

*Please note that we do not (yet) guarantee the stability of the data format.
You're welcome to use the data, but its structure is subject to change without notice.*

## Problems?

If you find a problem, please [file a bug](https://github.com/mdn/browser-compat-data/issues/new).

## Contributing

We're very happy to accept contributions to this data. Please familiarize yourself
with the schema for the data you're editing, and send us a pull request.

[![Build Status](https://travis-ci.org/mdn/browser-compat-data.svg?branch=master)](https://travis-ci.org/mdn/browser-compat-data)
