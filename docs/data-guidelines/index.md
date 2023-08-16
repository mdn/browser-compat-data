# Data guidelines

This folder contains guidelines to help you record data in a consistent and understandable way. It covers the project's requirements for the way features should be represented, including requirements that are not coded into the linter or schema.
This file contains general guidelines that apply to all features added to BCD. For guidelines that apply to specific categories of data, check out their respective files within this folder.

- [API](./api.md)
- [Browsers](./browsers.md)

## Choosing a version number

Use version numbers to reflect which _release line_ (major or minor but not patch-level releases) first supported a feature, rather than absolute version numbers.

BCD does not record absolute version numbers, such as Chrome 76.0.3809.46; instead BCD records significant releases (such as Chrome 76). Use the earliest applicable release line for recording support for a given feature. For example, if a feature was not added in Chrome 76.0.3700.43, but added in Chrome 76.0.3809.46, then the supported version is 76. Likewise, if a feature was not available in Safari 10.1.1, but added in Safari 10.1.3, then the supported version is 10.1.

This decision was made in [#3953, under the expectation that most users are likely to run the latest minor version of their browser](https://github.com/mdn/browser-compat-data/pull/3953#issuecomment-485847399), but not necessarily the latest version overall.

### Backported releases

Some browsers have backport releases, where a feature is added or removed in two or more versions at once that do not follow a linear semantic versioning bump (ex. Safari 6.0 was released, then Safari 7.0, and then Safari 6.1). If not otherwise covered by this guideline, use the earliest applicable version (as described in the [Release lines](#release-lines) guideline). In some cases, however, you must set the version number to the following major version. For example, if a new feature was added in Safari 7.0 and in Safari 6.1, then the supported version is 7.0 (not 6 or 6.1).

| If the browser and its version is... | then set the version to... |
| ------------------------------------ | -------------------------- |
| Safari 4.1                           | Safari 5.0                 |
| Safari 6.1                           | Safari 7.0                 |
| Safari 6.2                           | Safari 8.0                 |
| Safari 7.1                           | Safari 8.0                 |

> **Note:** Since NodeJS follows a different release cycle and features are commonly backported to older major versions (ex. a feature was implemented in 17.0.0, and then included in a new 16.17.0 release), this guideline does not apply to NodeJS.

This decision was made in [#4679](https://github.com/mdn/browser-compat-data/issues/4679) and [#9423](https://github.com/mdn/browser-compat-data/issues/9423).

### Safari for iOS versioning

For Safari for iOS, use the iOS version number, not the Safari version number or WebKit version number.

This versioning scheme came at [Apple's request, in #2006](https://github.com/mdn/browser-compat-data/issues/2006#issuecomment-457277312).

### Choosing `"preview"` values

Use `"preview"` as values for `version_added` and `version_removed` when the future stable version number is unknown or uncertain. Use `"preview"` when:

- You can't be sure a feature will progress (informally, "ride the train") to a numbered stable release.

  For example, use `"preview"` when a feature is explicitly limited to Chrome Canary builds, is supported in the current version of Canary, and is not supported in the same numbered beta and stable versions.

- The next version number is unknown to BCD.

  For example, a feature is supported in Safari Technology Preview only and is expected in the next release of Safari, but Apple has not announced the version number for the next release of Safari.

Do not use `"preview"` for planned but not yet implemented support changes. In other words, if you can't test or use a feature in the current development version of the browser, then use `false`, not `"preview"`.

This guideline was adopted to protect the quality of stable data in the face of schedule uncertainty. To learn more about the adoption of `"preview"` values, see [#12344](https://github.com/mdn/browser-compat-data/issues/12344) and [#10334](https://github.com/mdn/browser-compat-data/pull/10334).

## `"partial_implementation"` requires a note

If you set `"partial_implementation": true`, then write a note describing how the implementation is incomplete.

This guideline was proposed in [#7332](https://github.com/mdn/browser-compat-data/pull/7332).

## Non-functional defined names imply `"partial_implementation"`

If a browser recognizes an API name, but the API doesn’t have any discernable behavior, use `"partial_implementation": true` instead of `"version_added": false`, as if the feature has non-standard support, rather than no support.

For example, suppose there is some specification for a Web API `NewFeature.method()`. Running `typeof NewFeature.method` in some browser returns `function` (not `undefined`), but the method, when called, returns `null` instead of an expected value. For that feature, set `"partial_implementation": true` and write a note describing the feature’s misbehavior.

See [#3904](https://github.com/mdn/browser-compat-data/pull/3904#issuecomment-484433603) for additional background (and nuance).

## Operating system limitations imply `"partial_implementation"`

If a browser or engine is available on more than one operating system and a feature is only implemented on a subset of those operating systems, then the support statement should set `"partial_implementation": true`. For example, if a browser supports both Windows and Linux, but only implements a feature on Windows, then a support statement for that feature should set `"partial_implementation": true` (and a [note](#partial_implementation-requires-a-note)).

However, this guideline does not apply to features where the browser's expected behavior is conditional on the behavior of the operating system itself. For example, a browser can fully implement a CSS media query even if an underlying operating system can never satisfy the media query's condition because it does not support the requisite hardware.

This guideline was proposed in [#6906](https://github.com/mdn/browser-compat-data/issues/6906).

## Removal of irrelevant features

Features can be removed from BCD if it is considered irrelevant. A feature can be considered irrelevant if any of these conditions are met:

- a feature was never implemented in any browser.
- a feature was implemented and has since been removed from all browsers dating back two or more years ago.
- a feature is unsupported in all releases in the past five years.

This guideline was proposed in [#6018](https://github.com/mdn/browser-compat-data/pull/6018) and updated in [#10619](https://github.com/mdn/browser-compat-data/pull/10619).

## Removal of irrelevant flag data

Flag data is helpful for developers who may wish to test features before they are included in a stable release. However, once a feature has landed in a stable browser release, the flag data quickly becomes irrelevant and may be removed from BCD. To be considered irrelevant, the flag support statement must meet these conditions:

- The browser has supported the feature by default.
- The feature can no longer be enabled by toggling the flag.
- The flag has been removed from the browser.

These conditions represent minimum requirements for the removal of valid flag data; other considerations may result in flag data continuing to be relevant, even after the guideline conditions are met.

This guideline was proposed in [#6670](https://github.com/mdn/browser-compat-data/pull/6670) and revised in [#16637](https://github.com/mdn/browser-compat-data/pull/16637).

## Features with no browser support

Browser features that have not been implemented (or planned to be implemented) in any browser, should not be added to BCD. A feature should not be added if all of the following conditions are met:

- The feature has not been included in a stable browser release.
- The feature is not implemented behind a current flag (or Chrome origin trial).
- There is no tracking bug for the browser to indicate intent to implement.

Some features may already be added to BCD that do not have any browser support. These features will be removed over time.

This guideline was proposed in [#10619](https://github.com/mdn/browser-compat-data/pull/10619).

## Choosing status properties

The following guidelines will help you determine when to set certain statuses for features.

### `webextensions` features do not have status blocks

Web extensions are not governed by any specifications and are up to the browser vendors to design and implement. As such, the status blocks would be identical for all web extensions features. Do not add status blocks to the `webextensions` folder.

This guideline was adopted since the beginning of the project.

### Setting `experimental`

Generally, when a feature is supported by one and only one browser engine, set `experimental` to `true`. When a feature is supported by two or more engines, then set `experimental` to `false`. Some exceptions apply, however, for long-standing features and features behind flags and prefixes.

If a feature is supported behind flags only, no matter how many engines, then set `experimental` to `true`.

If a feature is supported behind incompatible prefixes only (such as `-webkit-` in one engine and `-moz-` in another), no matter how many engines support the feature overall, then set `experimental` to `true`. If two or more engines support a feature behind a common prefix (such as `-webkit-` only), then set `experimental` to `false`.

A single-engine feature's `experimental` status may expire and switch to `false` when the following conditions are met:

- The feature has been supported by default and without major changes by some browser for two or more years.
- If any other browser engine supports the feature behind a flag, then the behaviors are mutually compatible.

| Example                                                                     | Experimental |
| --------------------------------------------------------------------------- | ------------ |
| An API supported in Chrome and Firefox, without flags or prefixes.          | No           |
| A CSS property supported in Chrome and Firefox, with the `-webkit-` prefix. | No           |
| An HTTP header supported in Chrome and Firefox, behind flags.               | Yes          |
| A CSS property value supported in Safari, released last week.               | Yes          |
| An API supported in Firefox, released three years ago.                      | No           |

This guideline was proposed in [#6905](https://github.com/mdn/browser-compat-data/issues/6905) and adopted in [#9933](https://github.com/mdn/browser-compat-data/pull/9933).

### Setting `deprecated`

Set `deprecated` to `true` to show that a feature has been authoritatively discouraged from use.

The `deprecated` status captures the many ways standards organizations (and, for non-standard features, vendors) mark features as disfavored. This includes features that are on the path to removal or features that are discouraged from use despite their retention for backwards compatibility.

Evidence for setting `deprecated` to `true` includes:

- _Obsolete_, _legacy_, _deprecated_, _end-of-life_, or similar terminology in a specification
- Removal of a feature from a specification
- Specification text that cautions developers against new use of the feature
- Formal discouragement statements from a relevant standards body (for example, meeting minutes that show a committee achieving consensus for removal from a specification, even if the removal has not yet taken place)
- For non-standard features, notice from implementing browsers (for example, a console deprecation warning) or vendor documentation

Do not set `deprecated` to `true` for features that are merely old or unpopular, no matter how many [_considered harmful_](https://en.wikipedia.org/wiki/Considered_harmful) blog posts they may have garnered. For example, although web developers may prefer `fetch` over `XMLHttpRequest`, `XMLHttpRequest` is not deprecated.

This guideline was proposed in [#15703](https://github.com/mdn/browser-compat-data/pull/15703). See [mdn/content#5549](https://github.com/mdn/content/discussions/5549) and [#10490](https://github.com/mdn/browser-compat-data/issues/10490) for further discussion on the use of "deprecated."

## Parameters and parameter object features

Sometimes it's useful to represent support for specific parameters (also known as arguments) of a function or method, as a subfeature of the function itself. To record data about whether a specific parameter is supported by a function or method, use the following naming conventions:

- For named parameters, use a subfeature named `paramname_parameter` with description text `<code>paramname</code> parameter`. Where _paramname_ is the name of the parameter as it appears on the corresponding function's MDN page (or specification, if no MDN page is available).

  For example, to represent support for the `firstName` parameter of a method `hello(firstName, familyName)`, use a subfeature of `hello` named `firstName_parameter` with the description text `<code>firstName</code> parameter`.

- For unnamed parameters, use a subfeature named `ordinal_parameter` with description text `ordinal parameter` where _ordinal_ is the ordinal number position of the parameter.

  For example, to represent support for the second parameter of a method `count()`, use a subfeature of `count` named `second_parameter` and description text `Second parameter`.

- For properties of parameter objects, use a subfeature named `paramname_prop_parameter` with description text `<code>paramname.prop</code> parameter`, where _paramname_ is the name of the parameter object and _prop_ is the name of the property.

  For example, to represent support for the `year` property of the `date` parameter to a method `schedule(date)` (as in `schedule({"year": 1970 })`), use a subfeature of `schedule` named `date_year_parameter` with description text `<code>date.year</code> parameter`.

For existing data which does not follow this guideline, you may modify it to conform with this data, if you are you otherwise updating the data (or data related to it).

This guideline was proposed and adopted in [#10509](https://github.com/mdn/browser-compat-data/pull/10509).
