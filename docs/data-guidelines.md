# Data guidelines

This file contains recommendations to help you record data in a consistent and understandable way. It covers the project's preferences for the way features should be represented, rather than hard requirements encoded in the schema definitions or linter logic.

- [Data guidelines](#data-guidelines)
  * [Naming event features: `eventname_event`](#naming-event-features---eventname-event-)
  * [Defined names without behaviors imply `partial_implementation`](#defined-names-without-behaviors-imply--partial-implementation-)
  * [Release lines and backported features](#release-lines-and-backported-features)
  * [Node.js versioning](#nodejs-versioning)
  * [Safari for iOS versioning](#safari-for-ios-versioning)

<!-- BEGIN TEMPLATE

## Short title in sentence case

A description of what to do, preferable in the imperative. If applicable, include an example to illustrate the rule.

If it's helpful to understanding the rule, summarize the rationale. Definitely cite the issue or pull request where this was decided (it may be the PR that merges the policy).

-- END TEMPLATE -->

## Naming event features: `eventname_event`

Name DOM event features in the form _eventname_\_event. For example, the feature for a `focus` event would be named `focus_event`.

Note: this rule applies to the event features themselves, not the features for their handlers. For example, `onfocus` and `focus_event` are two separate features.

This practice emerged through several discussions:

* [#935](https://github.com/mdn/browser-compat-data/issues/935#issuecomment-464691417)
* [#3420](https://github.com/mdn/browser-compat-data/pull/3420)
* [#3469](https://github.com/mdn/browser-compat-data/pull/3469)


## Defined names without behaviors imply `partial_implementation`

If a browser recognizes an API name, but the API doesn’t have any discernable behavior, use `"partial_implementation": true` instead of `"version_added": false`, as if the feature has non-standard support, rather than no support.

For example, suppose there is some specification for a Web API `NewFeature.method()`. Running `typeof NewFeature.method` in some browser returns `function` (not `undefined`), but the method, when called, returns `null` instead of an expected value. For that feature, set `"partial_implementation": true` and write a note describing the feature’s misbehavior.

See [#3904](https://github.com/mdn/browser-compat-data/pull/3904#issuecomment-484433603) for additional background (and nuance).


## Release lines and backported features

BCD does not record absolute version numbers; instead, BCD follows release lines (generally, major and minor, but not patch-level releases). Use the earliest applicable release line for recording support for a given feature, even when that support change was backported to a previous release of the browser.

For example, if the current release of browser X is version 10.2, but a new feature was backported to previous versions including a new 9.7.1 release, then the supported version is 9.7 (not 10.2 or 9.7.1).

This decision was made in [#3953, under the expectation that most users are likely to run the latest minor version of their browser](https://github.com/mdn/browser-compat-data/pull/3953#issuecomment-485847399), but not necessarily the latest version overall.


## Node.js versioning

Unlike other browsers, we include pre-1.0 releases of Node.js because Node did not use major version numbers during its early history. BCD permits including any Node.js release that introduces a feature (typically, these are `major.minor.0` releases).

See [#3160](https://github.com/mdn/browser-compat-data/pull/3160) for a discussion of this approach.


## Safari for iOS versioning

Browser data for Safari for iOS uses the iOS version number, not the Safari version number or the WebKit version number. This versioning scheme came at [Apple's request, in #2006](https://github.com/mdn/browser-compat-data/issues/2006#issuecomment-457277312).
