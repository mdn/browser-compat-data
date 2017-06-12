# The mdn-browser-compat-data JSON schema

This document helps you to understand how mdn-browser-compat-data is organized and structured.

## Where to find compat data
### The folder structure

Compatibility data is organized in top-level directories for each broad area covered: for example, "http",
"javascript", "webextensions". Inside each of these directories is one or more
JSON file containing the compatibility data.

- [api/](https://github.com/mdn/browser-compat-data/tree/master/api) contains data for each [Web API](https://developer.mozilla.org/en-US/docs/Web/API) interface.

- [css/](https://github.com/mdn/browser-compat-data/tree/master/css) contains data for [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) properties, selectors and at-rules.

- [http/](https://github.com/mdn/browser-compat-data/tree/master/http) contains data for [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) headers, statuses and methods.

- [javascript/](https://github.com/mdn/browser-compat-data/tree/master/javascript) contains data for [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) built-in Objects, statement, operators and or other ECMAScript language features.

- [webextensions/](https://github.com/mdn/browser-compat-data/tree/master/webextensions) contains data for [WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) JavaScript APIs and manifest keys.

### File and folder breakdown
The JSON files contain [feature identifiers](#feature-identifiers),
which are relevant for accessing the data. Except for the top-level directories,
the file and sub folder hierarchies aren't of any meaning for the exports.
Compatibility data can be stored in a single large file or might be divided in
smaller files and put into sub folders.

## Understanding the schema

### Schema versions
There are two top-level properties that are mandatory. First, `version`
indicating which schema version is used inside the file, and `data` containing
the actual compatibility data.
```json
{
  "version": "1.0.0",
  "data": { }
}
```
The `version` property must be a string following the `MAJOR.MINOR.PATCH` format
of the [Semantic Versioning 2.0.0 specification](http://semver.org/).
You cannot add more than one schema versions, `version` is unique in a given file.

The `data` property contains feature identifier objects which then contain the
actual compatibility data.

### Feature identifiers

#### Features and sub-features
A _feature_ is a functionality of the platform. It is an entity that can be used
independently. A _sub-feature_ is a specific value or behavior of a feature.
This division is a bit arbitrary, but matches the way developers perceive features of a platform.

* For CSS: an entity like a property, a pseudo-class, a pseudo-element,
an at-rule, or a descriptor is a feature. A value, a new syntax, or a specific
behavior (like if a property applies to a set of elements or another) are sub-features.

* For HTML: an element or an attribute are features, while specific values of
an attribute are sub-features.

* For Web APIs or JavaScript: an interface, a method, a property, a constructor
are features, while arguments or special values of an enumerated type are sub-features.

#### Hierarchies

Each feature is identified by a unique hierarchy of strings.
E.g the `text-align` property is identified by `css.properties.text-align`.

In the JSON file it looks like this:
```json
{
  "version": "1.0.0",
  "data": {
    "css": {
      "properties": {
        "text-align":{},
      }
    }
  }
}
```

Each feature is uniquely accessible, independently of the file it is defined in.

The hierarchy of identifiers is not defined by the schema and is a convention of
the project using the schema.

### Features

A feature is described by an identifier containing the `__compat` property.
It lists the sub-features associated to the feature.

A feature has at least one sub-feature, representing basic support.
It is always named `basic_support`.

Basic support indicates that a minimal implementation of a functionality is included.
What it represents exactly depends of the evolution of the feature over time,
both in terms of specifications and of browser support. Another way of seeing it
is to consider `basic_support` as representing all the functionality of the
feature that doesn't have its own sub-feature(s).

### Sub-features

A sub-feature is the basic entity containing browser compatibility information. As
explained in the previous section, any feature has at least one sub-feature
called `basic_support`, but it may have many more.

A sub-feature may have three properties.
* A mandatory `support` property for __compat information__.
An object listing the compatibility information for each browser ([see below](#the-support-object)).

* An optional `desc` property for __sub-feature description__.
A string containing a human-readable description of the sub-feature.
It is intended to be used as a caption or title and should be kept short.
The `<code>` and `<a>` HTML elements can be used.

* An optional `status` property for __status information__.
An object containing information about the stability of the sub-feature:
Is it a functionality that is standard? Is it stable? Has it been deprecated
and shouldn't be used anymore ([see below](#status-information)).

### The `support` object
Each sub-feature has support information. For each browser identifier,
it contains a [`support_statement`](#the-support_statement-object) object with
information about versions, prefixes or alternate names, as well as notes.

#### Browser identifiers

The currently accepted browser identifiers are:
* `webview_android`, Webview, the former stock browser on Android,
* `chrome`, Google Chrome (on desktops),
* `chrome_android`, Google Chrome (on Android),
* `edge`, MS Edge (on Windows),
* `edge_mobile`, MS Edge, the mobile version,
* `firefox`, Mozilla Firefox (on desktops),
* `firefox_android`, Firefox for Android, sometimes nicknamed Fennec,
* `ie_mobile`, Microsoft Internet Explorer, the mobile version,
* `ie`, Microsoft Internet Explorer (discontinued),
* `nodejs` Node.js JavaScript runtime built on Chrome's V8 JavaScript engine,
* `opera`, the Opera browser (desktop), based on Blink since Opera 15,
* `opera_android`, the Opera browser (Android version),
* `safari`, Apple Safari, on Mac OS,
* `safari_ios`, Apple Safari, on iOS.

No browser identifier is mandatory.

#### The `support_statement` object
The `support_statement` object describes the support provided by a single browser type for the given subfeature.
It is an array of `simple_support_statement` objects, but if there
is only one of them, the array can be omitted.


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
  "version_added" : null
}
```

#### `version_removed`
Contains a string with the version number the sub-feature is
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

#### `flags`
An optional object indicating what kind of flags must be set for this feature to work.
It consists of three properties:
* `type` (mandatory): an enum that indicates the flag type:
  * `preference` represents
a flag that the user can set (like in `about:config` in Firefox)
  * `compile_flag` a flag that has to be set before compiling the browser.
* `name` (mandatory): a `string` representing the flag or preference to modify.
* `value_to_set` (optional): representing the actual value to set the flag to.
It is a string, that may be converted to the right type
(that is `true` or `false` for Boolean value, or `4` for an integer value). It doesn't need to be enclosed in `<code>` tags.

#### `partial_implementation`
A `boolean` value indicating whether or not the implementation of the sub-feature
follows the current specification close enough to not create major interoperability problems.
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
    "Has not been updated to the latest specification, see <a href=\"https://bugzilla.mozilla.org/show_bug.cgi?id=1234567\">bug 1234567</a>."
  ]
}
```
The `<code>` and `<a>` HTML elements can be used.

### Status information
The status property informs about stability of the feature. It is an optional object named
`status` and has four mandatory properties:
* `experimental`: a `boolean` value that indicates this functionality is
intended to be an addition to the Web platform. Some features are added to
conduct tests. Set to `false`, it means the functionality is mature, and no
significant incompatible changes are expected in the future.
* `standard_track`: a `boolean` value indicating if the feature is part of an
active specification or specification process.
* `obsolete`: a `"boolean"` value that indicates if the functionality is only
kept for compatibility purpose and shouldn't be used anymore. It may be removed
from the Web platform in the future.

### Localization
We are planning localize some of this data (e.g. notes, descriptions).
At this point we haven't decided how and when we are going to do that.
See [issue 114](https://github.com/mdn/browser-compat-data/issues/114) for more information.
