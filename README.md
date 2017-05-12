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
JSON files containing the compatibility data.

### api
Contains experimental data for [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API).

### css
Contains experimental data for [Web APIs](https://developer.mozilla.org/en-US/docs/Web/CSS).

### http

Contains experimental data for [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP).

### javascript

Contains experimental data for [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

### webextensions

Contains data for [WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions).

## Format of the browser compat json files
The definitive description of the format used to represent compatibility data is the [schema file](https://github.com/mdn/browser-compat-data/blob/master/compat-data.schema.json).
But since the schema is hard to read, we have created a [human-readable description](https://github.com/mdn/browser-compat-data/blob/master/compat-data-schema.md) of it.

*Please note that we do not (yet) guarantee the stability of the data format.
You're welcome to use the data, but its structure is subject to change without notice.*

## Problems?

If you find a problem, please [file a bug](https://github.com/mdn/browser-compat-data/issues/new).

## Contributing

We're very happy to accept contributions to this data. Please familiarize yourself
with the schema and send us a pull request.

[![Build Status](https://travis-ci.org/mdn/browser-compat-data.svg?branch=master)](https://travis-ci.org/mdn/browser-compat-data)
