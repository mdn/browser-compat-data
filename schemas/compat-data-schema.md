# The mdn-browser-compat-data JSON schema

This document helps you to understand how mdn-browser-compat-data is organized and structured.

## Where to find compat data
### The folder structure

Compatibility data is organized in top-level directories for each broad area covered: for example, `http`,
`javascript`, and `webextensions`. Inside each of these directories is one or more
JSON files containing the compatibility data.

- [api/](https://github.com/mdn/browser-compat-data/tree/master/api) contains data for each [Web API](https://developer.mozilla.org/en-US/docs/Web/API) interface.

- [css/](https://github.com/mdn/browser-compat-data/tree/master/css) contains data for [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) properties, selectors, and at-rules.

- [html/](https://github.com/mdn/browser-compat-data/tree/master/html) contains data for [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) elements, attributes, and global attributes.

- [http/](https://github.com/mdn/browser-compat-data/tree/master/http) contains data for [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) headers, statuses, and methods.

- [javascript/](https://github.com/mdn/browser-compat-data/tree/master/javascript) contains data for [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) built-in Objects, statement, operators, and other ECMAScript language features.

- [mathml/](https://github.com/mdn/browser-compat-data/tree/master/mathml) contains data for [MathML](https://developer.mozilla.org/docs/Web/MathML) elements, attributes, and global attributes.

- [svg/](https://github.com/mdn/browser-compat-data/tree/master/svg) contains data for [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) elements, attributes, and global attributes.

- [webdriver/](https://github.com/mdn/browser-compat-data/tree/master/webdriver) contains data for [WebDriver](https://developer.mozilla.org/en-US/docs/Web/WebDriver) commands.

- [webextensions/](https://github.com/mdn/browser-compat-data/tree/master/webextensions) contains data for [WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) JavaScript APIs and manifest keys.

### File and folder breakdown
The JSON files contain [feature identifiers](#feature-identifiers),
which are relevant for accessing the data. Except for the top-level directories,
the file and sub-folder hierarchies aren't of any meaning for the exports.
Compatibility data can be stored in a single large file or might be divided in
smaller files and put into sub folders.

## Understanding the schema

#### Feature hierarchies

Each feature is identified by a unique hierarchy of strings.
E.g the `text-align` property is identified by `css.properties.text-align`.

In the JSON file it looks like this:
```json
{
  "css": {
    "properties": {
      "text-align": {
        "__compat": {},
        "start": {
          "__compat": {}
        },
        "end": {
          "__compat": {}
        }
      }
    }
  }
}
```

Each feature is uniquely accessible, independently of the file it is defined in.

The hierarchy of identifiers is not defined by the schema and is a convention of
the project using the schema.

#### Features

A feature is described by an identifier containing the `__compat` property. In other words, identifiers without `__compat` aren't necessarily features, but help to nest the features properly.

When an identifier has a `__compat` block, it represents its basic support, indicating that a minimal implementation of a functionality is included.
What it represents exactly depends of the evolution of the feature over time, both in terms of specifications and of browser support.

#### Sub-features

To add a sub-feature, a new identifier is added below the main feature at the level of a `__compat` object (see the sub-features "start" and "end" above). The same could be done for sub-sub-features. There is no depth limit.

#### API-specific subfeatures

The following conventions apply to compatibility data in the `api/` directory.

Worker support for a given feature in `api/` should be in a subfeature titled `worker_support`. It should also have the description `Available in workers`.

```json
{
  "api": {
    "ImageData": {
      "__compat": {},
      "worker_support": {
        "__compat": {
          "description": "Available in workers",
          "support": {}
        }
      }
    }
  }
}
```

A constructor for a given feature in `api/` should have the same name as the parent feature (except in special cases where the constructor doesn't share the name of its parent feature). For example, the ImageData constructor, `ImageData()`, would be represented as `api.ImageData.ImageData`. It should also have the description `<code>ImageData()</code> constructor`.

```json
{
  "api": {
    "ImageData": {
      "__compat": {},
      "ImageData": {
        "__compat": {
          "description": "<code>ImageData()</code> constructor",
          "support": {}
        }
      }
    }
  }
}
```

### The `__compat` object
The `__compat` object consists of the following:

* A mandatory `support` property for __compat information__.
An object listing the compatibility information for each browser ([see below](#the-support-object)).

* An optional `description` property to __describe the feature__.
A string containing a human-readable description of the feature.
It is intended to be used as a caption or title and should be kept short.
The `<code>` and `<a>` HTML elements can be used.

* An optional `status` property for __status information__.
An object containing information about the stability of the feature:
Is it a functionality that is standard? Is it stable? Has it been deprecated and shouldn't be used anymore? ([see below](#status-information))

* An optional `mdn_url` property which __points to an MDN reference page documenting the feature__.
It needs to be a valid URL, and should be the language-neutral URL (e.g. use `https://developer.mozilla.org/docs/Web/CSS/text-align` instead of `https://developer.mozilla.org/en-US/docs/Web/CSS/text-align`).

### The `support` object
Each `__compat` object contains support information. For each browser identifier, it contains a [`support_statement`](#the-support_statement-object) object with
information about versions, prefixes, or alternate names, as well as notes.

#### Browser identifiers

The currently accepted browser identifiers should be declared in alphabetical order:
* `chrome`, Google Chrome (on desktops)
* `chrome_android`, Google Chrome (on Android)
* `edge`, MS Edge (on Windows)
* `edge_mobile`, MS Edge, the mobile version
* `firefox`, Mozilla Firefox (on desktops)
* `firefox_android`, Firefox for Android, sometimes nicknamed Fennec
* `ie`, Microsoft Internet Explorer (discontinued)
* `nodejs` Node.js JavaScript runtime built on Chrome's V8 JavaScript engine
* `opera`, the Opera browser (desktop), based on Blink since Opera 15
* `opera_android`, the Opera browser (Android version)
* `qq_android`, the QQ browser (Android version)
* `safari`, Safari on macOS
* `safari_ios`, Safari on iOS
* `samsunginternet_android`, the Samsung Internet browser (Android version)
* `uc_android`, UC Browser (Android version)
* `uc_chinese_android`, UC Browser (Chinese Android version)
* `webview_android`, Webview, the former stock browser on Android

No browser identifier is mandatory.

#### The `support_statement` object
The `support_statement` object describes the support provided by a single browser type for the given subfeature.
It is an array of `simple_support_statement` objects, but if there
is only one of them, the array must be omitted.

If there is an array, the `simple_support_statement` objects should be sorted with the most relevant and general entries first.
In other words, sort such arrays with entries applying to the most recent browser releases first and sort entries with prefixes or flags after those without.
If in doubt, reverse-chronological order with respect to the `"version_removed"` and then `"version_added"` values usually works well. For more information on sorting support statements, see [#1596](https://github.com/mdn/browser-compat-data/issues/1596).

Example of a `support` compat object (with an `array_support_statement` containing 2 entries):
```json
"support": {
  "firefox": [
    {
      "version_added": "6"
    },
    {
      "prefix": "-moz-",
      "version_added": "3.5",
      "version_removed": "9"
    }
  ]
}
```

Example of a `support` compat object (with 1 entry, array omitted):
```json
"support": {
  "ie": { "version_added": "6.0" }
}
```

### Compat data in support statements
The `simple_support_statement` object is the core object containing the compatibility information for a browser.
It consist of the following properties:

#### `version_added`
This is the only mandatory property and it contains a string with the version
number indicating when a sub-feature has been added (and is therefore supported).
The Boolean values indicate that a sub-feature is supported (`true`, with the
additional meaning that it is unknown in which version support was added) or
not supported (`false`). A value of `null` indicates that support information is
entirely unknown. Examples:

* Support from version 3.5 (inclusive):
```json
{
 "version_added": "3.5"
}
```
* Supported, but version unknown:
```json
{
  "version_added": true
}
```
* No support:
```json
{
  "version_added": false
}
```
* Support unknown (default value, if browser omitted):
```json
{
  "version_added": null
}
```

#### `version_removed`
Contains a string with the version number the sub-feature was
removed in. It may also be a Boolean value of (`true` or `false`), or the
`null` value.

Default values:
* If `version_added` is set to `true`, `false`, or a string, `version_removed` defaults to `false`.
* if `version_added` is set to `null`, the default value of `version_removed` is also `null`.

Examples:

* Removed in version 10 (added in 3.5):
```json
{
  "version_added": "3.5",
  "version_removed": "10"
}
```
* Not removed (default if `version_added` is not `null`):
```json
{
  "version_added": "3.5",
  "version_removed": false
}
```

#### `prefix`
A prefix to add to the sub-feature name (defaults to empty string).
Note that leading and trailing `-` must be included. Example:

* Prefixed sub-feature:
```json
{
  "prefix": "-moz-",
  "version_added": "3.5"
}
```

#### `alternative_name`
In some cases features are named entirely differently and not just prefixed. Example:

* Prefixed version had a different capitalization
```json
{
  "alternative_name": "mozRequestFullScreen",
  "version_added": "true",
  "version_removed": "9.0"
}
```

Note that you can’t have both `prefix` and `alternative_name`.

#### `flags`
An optional array of objects indicating what kind of flags must be set for this feature to work. Usually this array will have one item, but there are cases where two or more flags can be required to activate a feature.
An object in the `flags` array consists of three properties:
* `type` (mandatory): an enum that indicates the flag type:
  * `preference` a flag the user can set (like in `about:config` in Firefox).
  * `compile_flag` a flag to be set before compiling the browser.
  * `runtime_flag` a flag to be set before starting the browser.
* `name` (mandatory): a `string` representing the flag or preference to modify.
* `value_to_set` (optional): representing the actual value to set the flag to.
It is a string, that may be converted to the right type
(that is `true` or `false` for Boolean value, or `4` for an integer value). It doesn't need to be enclosed in `<code>` tags.

Example for one flag required:
```json
{
  "version_added": true,
  "flags": [
    {
      "type": "preference",
      "name": "browser.flag.name",
      "value_to_set": "true"
    }
  ]
}
```
Example for two flags required:
```json
{
  "version_added": true,
  "flags": [
    {
      "type": "preference",
      "name": "dom.streams.enabled",
      "value_to_set": "true"
    },
    {
      "type": "preference",
      "name": "javascript.options.streams",
      "value_to_set": "true"
    }
  ]
}
```

#### `partial_implementation`
A `boolean` value indicating whether or not the implementation of the sub-feature
follows the current specification closely enough to not create major interoperability problems.
It defaults to `false` (no interoperability problem expected).
If set to `true`, it is recommended to add a note indicating how it diverges from
the standard (implements an old version of the standard, for example).

#### `notes`
An `array` of zero or more strings containing
additional information. If there is only one entry in the array,
the array can be a just a string. Example:

* Indicating a restriction:
```json
{
  "version_added": "3.5",
  "notes": [
    "Does not work on ::first-letter pseudo-elements.",
    "Has not been updated to the latest specification, see <a href='https://bugzil.la/1234567'>bug 1234567</a>."
  ]
}
```
The `<code>` and `<a>` HTML elements can be used.

### Status information
The status property contains information about stability of the feature. It is
an optional object named `status` and has three mandatory properties:
* `experimental`: a `boolean` value that indicates this functionality is
intended to be an addition to the Web platform. Some features are added to
conduct tests. Set to `false`, it means the functionality is mature, and no
significant incompatible changes are expected in the future.
* `standard_track`: a `boolean` value indicating if the feature is part of an
active specification or specification process.
* `deprecated`: a `boolean` value that indicates if the feature is no longer recommended.
It might be removed in the future or might only be kept for compatibility purposes. Avoid using this functionality.

```json
"__compat": {
  "status": {
    "experimental": true,
    "standard_track": true,
    "deprecated": false
  }
}
```

### Localization
We are planning to localize some of this data (e.g. notes, descriptions).
At this point we haven't decided how or when we are going to do that.
See [issue 114](https://github.com/mdn/browser-compat-data/issues/114) for more information.
