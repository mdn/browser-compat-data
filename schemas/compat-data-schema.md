# The compat data JSON schema

This document helps you to understand how compatibility data is organized and structured.

## Where to find compat data

### The folder structure

Compatibility data is organized in top-level directories for each broad area covered: for example, `http`,
`javascript`, and `webextensions`. Inside each of these directories is one or more
JSON files containing the compatibility data.

- [api/](../api) contains data for each [Web API](https://developer.mozilla.org/en-US/docs/Web/API) interface.

- [css/](../css) contains data for [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) properties, selectors, and at-rules.

- [html/](../html) contains data for [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) elements, attributes, and global attributes.

- [http/](../http) contains data for [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) headers, statuses, and methods.

- [javascript/](../javascript) contains data for [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) built-in Objects, statement, operators, and other ECMAScript language features.

- [mathml/](../mathml) contains data for [MathML](https://developer.mozilla.org/docs/Web/MathML) elements, attributes, and global attributes.

- [svg/](../svg) contains data for [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) elements, attributes, and global attributes.

- [webdriver/](../webdriver) contains data for [WebDriver](https://developer.mozilla.org/en-US/docs/Web/WebDriver) commands.

- [webextensions/](../webextensions) contains data for [WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) JavaScript APIs and manifest keys.

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

See [Data guidelines](/docs/data-guidelines.md) for more information about feature naming conventions and other best practices.

### The `__compat` object

The `__compat` object consists of the following:

- A mandatory `support` property for **compat information**.
  An object listing the compatibility information for each browser ([see below](#the-support-object)).

- A mandatory `status` property for **status information**.
  An object containing information about the stability of the feature:
  Is it a functionality that is standard? Is it stable? Has it been deprecated and shouldn't be used anymore? ([see below](#status-information))

- An optional `description` property to **describe the feature**.
  A string containing a human-readable description of the feature.
  It is intended to be used as a caption or title and should be kept short.
  The `<code>`, `<kbd>`, `<em>`, and `<strong>` HTML elements may be used.

- An optional `matches` property to **help match the feature to source code** ([see below](#the-matches-object))
  An object that contains a keyword list or regex that can match values or tokens which correspond to the feature.

- An optional `mdn_url` property which **points to an MDN reference page documenting the feature**.
  It needs to be a valid URL, and should be the language-neutral URL (e.g. use `https://developer.mozilla.org/docs/Web/CSS/text-align` instead of `https://developer.mozilla.org/en-US/docs/Web/CSS/text-align`).

- An optional `spec_url` property as a URL or an array of URLs, each of which is for a specific part of a specification in which this feature is defined.
  - Each URL must either contain a fragment identifier (e.g. `https://tc39.es/proposal-promise-allSettled/#sec-promise.allsettled`), or else must match the regular-expression pattern `^https://www.khronos.org/registry/webgl/extensions/[^/]+/` (e.g. `https://www.khronos.org/registry/webgl/extensions/ANGLE_instanced_arrays/`).
  - This property may only contain specifications published by standards bodies, or formal proposals that may lead to such standards).

### The `support` object

Each `__compat` object contains support information. For each browser identifier, it contains a [`support_statement`](#the-support_statement-object) object with
information about versions, prefixes, or alternate names, as well as notes.

#### Browser identifiers

The currently accepted browser identifiers should be declared in alphabetical order:

- `chrome`, Google Chrome (on desktops)
- `chrome_android`, Google Chrome (on Android)
- `deno`, Deno JavaScript runtime built on Chrome's V8 JavaScript engine
- `edge`, Microsoft Edge (on Windows), based on the EdgeHTML version (before version 79), and later on the Chromium version
- `firefox`, Mozilla Firefox (on desktops)
- `firefox_android`, Firefox for Android, sometimes nicknamed Fennec
- `ie`, Microsoft Internet Explorer (discontinued)
- `nodejs` Node.js JavaScript runtime built on Chrome's V8 JavaScript engine
- `opera`, the Opera browser (desktop), based on Blink since Opera 15
- `opera_android`, the Opera browser (Android version)
- `safari`, Safari on macOS
- `safari_ios`, Safari on iOS, based on the iOS version
- `samsunginternet_android`, the Samsung Internet browser (Android version)
- `webview_android`, Webview, the built-in browser for Android

Desktop browser identifiers are mandatory, with the `version_added` property set to `null` if support is unknown.

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

- Support from version 3.5 (inclusive):

```json
{
  "version_added": "3.5"
}
```

- Supported, but version unknown:

```json
{
  "version_added": true
}
```

- No support:

```json
{
  "version_added": false
}
```

- Support unknown (default value, if browser omitted):

```json
{
  "version_added": null
}
```

#### `version_removed`

Contains a string with the version number the sub-feature was removed in.
It may also be `true`, meaning that it is unknown in which version support
was removed.

Default values:

- If `version_added` is set to `true`, `false`, or a string, `version_removed` defaults to `false`.
- If `version_added` is set to `null`, the default value of `version_removed` is also `null`.

Examples:

- Removed in version 10 (added in 3.5):

```json
{
  "version_added": "3.5",
  "version_removed": "10"
}
```

- Removed in some version after 3.5:

```json
{
  "version_added": "3.5",
  "version_removed": true
}
```

### Initial versions

The following table indicates initial versions for browsers in BCD. These are the earliest possible version numbers allowed to be used. When the earliest version is not naturally "1" or "1.0", see the _Notes_ column for an explanation.

| Browser          | Initial version | Notes                                                                                                                                                                    |
| ---------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Chrome           | 1               |                                                                                                                                                                          |
| Chrome Android   | 18              | Stable versioning started at 18. No Chrome Android 17 or earlier was ever released.                                                                                      |
| Edge             | 12              | EdgeHTML versioning started at 12, continuing from Internet Explorer 11. After version 18, Edge jumped to version 79, synchronizing with the Chromium versioning scheme. |
| Firefox          | 1               |                                                                                                                                                                          |
| Firefox Android  | 4               | Stable versioning started at 4. Earlier non-Android mobile versions are ignored.                                                                                         |
| IE               | 1               |                                                                                                                                                                          |
| Node.js          | 0.10.0          | This project selected 0.10.0 as the first release primarily because the 0.10-series releases was the first to have LTS status applied. See issue #6861.                  |
| Opera            | 2               | Stable versioning started at 2. Opera 1 was demoed at a conference, but never publicly released.                                                                         |
| Opera Android    | 10.1            | Stable versioning started at 10.1.                                                                                                                                       |
| Safari           | 1               |                                                                                                                                                                          |
| iOS Safari       | 1               |                                                                                                                                                                          |
| Samsung Internet | 1.0             |                                                                                                                                                                          |
| WebView Android  | 1               |                                                                                                                                                                          |

### Ranged versions

For certain browsers, ranged versions are allowed as it is sometimes impractical to find out in which early version of a browser a feature shipped. Ranged versions should be used sparingly and only when it is impossible to find out the version number a feature initially shipped in. The following ranged version values are allowed:

- Edge
  - "≤18" (the last EdgeHTML-based Edge and possibly earlier)
  - "≤79" (the first Chromium-based Edge and possibly in EdgeHTML-based Edge)
- Internet Explorer
  - "≤6" (the earliest IE version testable in BrowserStack and possibly earlier)
  - "≤11" (the last IE version and possibly earlier)
- Opera
  - "≤12.1" (the last Presto-based Opera and possibly earlier)
  - "≤15" (the first Chromium-based Opera and possibly in Presto-based Opera)
- Opera Android
  - "≤12.1" (the last Presto-based Opera and possibly earlier)
  - "≤14" (the first Chromium-based Opera and possibly in Presto-based Opera)
- Safari
  - "≤4" (the earliest Safari version testable in BrowserStack and possibly earlier)
- Safari iOS
  - "≤3" (the earliest Safari iOS version testable in BrowserStack and possibly earlier)
- WebView Android
  - "≤37" (the first Chrome-based WebView and possibly previous Android versions)

For example, the statement below means, "supported in at least version 37 and possibly in earlier versions as well".

```json
{
  "version_added": "≤37"
}
```

#### `prefix`

A prefix to add to the sub-feature name (defaults to empty string).
If applicable, leading and trailing `-` must be included.

Examples:

- A CSS property with a standard name of `prop-name` and a vendor-prefixed name of `-moz-prop-name`:

```json
{
  "prefix": "-moz-",
  "version_added": "3.5"
}
```

- An API with a standard name of `FeatureName` and a vendor-prefixed name of `webkitFeatureName`:

```json
{
  "prefix": "webkit",
  "version_added": "9"
}
```

#### `alternative_name`

In some cases features are named entirely differently and not just prefixed. Example:

- Prefixed version had a different capitalization

```json
{
  "alternative_name": "mozRequestFullScreen",
  "version_added": "true",
  "version_removed": "9.0"
}
```

Note that you can’t have both `prefix` and `alternative_name`.

#### `flags`

An optional array of objects describing flags that must be configured for this browser to support this feature. Usually this
array will have one item, but there are cases where two or more flags can be required to activate a feature.
An object in the `flags` array consists of three properties:

- `type` (mandatory): an enum that indicates the flag type:
  - `preference` a flag the user can set (like in `about:config` in Firefox).
  - `runtime_flag` a flag to be set before starting the browser.
- `name` (mandatory): a string giving the value which the specified flag must be set to for this feature to work.
- `value_to_set` (optional): representing the actual value to set the flag to.
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
deviates from the specification in a way that may cause significant compatibility problems.
It defaults to `false` (no interoperability problems expected). If set to `true`, it is
recommended that you add a note explaining how it diverges from the standard (such as
that it implements an old version of the standard, for example).

#### `notes`

A string or `array` of strings containing additional information. If there is only one
entry, the value of `notes` must simply be a string instead of an array.

Example:

- Indicating a restriction:

```json
{
  "version_added": "3.5",
  "notes": [
    "Does not work on ::first-letter pseudo-elements.",
    "Has not been updated to the latest specification, see <a href='https://bugzil.la/1234567'>bug 1234567</a>."
  ]
}
```

The `<code>`, `<kbd>`, `<em>`, and `<strong>` HTML elements may be used. In addition, `<a>` tags may be used, such as to link to a browser's bug report, or MDN documentation.

### The `matches` object

A `matches` object contains hints to help automatically detect whether source code corresponds to a feature, such as a list of keywords or a regular expression. A `matches` object may have one of the following properties (in order of preference):

- `keywords`: an array of one or more literal strings that correspond to the feature.

  Examples:

  - In CSS selector features, they can be literal selectors. See [`css.selectors.backdrop`](../css/selectors/backdrop.json)).
  - In CSS property subfeatures, they can be data type keywords or function keywords. See [`css.properties.transform.3d`](../css/properties/transform.json)).

- `regex_token`: a string containing a regular expression that matches a single token (i.e., text delimited by characters that are excluded from the text to be matched) corresponding to the feature.

  Tests are required for all regular expressions. See [`test-regexes.js`](../tests/test-regexes.js).

  Examples:

  - In CSS property subfeatures, they can be regular expressions that match component value types. See [`css.properties.color.alpha_hexadecimal_notation`](../css/properties/color.json) and corresponding tests.

- `regex_value`: a string containing a regular expression that matches a complete value corresponding to the feature.

  Tests are required for all regular expressions. See [`test-regexes.js`](../tests/test-regexes.js).

  Examples:

  - In CSS property subfeatures, these can be regular expressions that match whole declaration values. See [`css.properties.transform-origin.three_value_syntax`](../css/properties/transform.json) and corresponding tests.

### Status information

The mandatory status property contains information about stability of the feature. It is
an object named `status` and has three mandatory properties:

- `experimental`: a `boolean` value.

  If `experimental` is `true`, it means that Web developers should experiment with this feature and provide feedback to browser vendors and standards authors about this feature. It also means that Web developers _should not_ rely on the feature's continued existence in its current (or potentially any) form in future browser releases.

  If `experimental` is `false`, it means the functionality is mature and no significant changes are expected in the future.

- `standard_track`: a `boolean` value.

  If `standard_track` is `true`, then the feature is part of an active specification or specification process.

- `deprecated`: a `boolean` value.

  If `deprecated` is `true`, then the feature is no longer recommended. It might be removed in the future or might only be kept for compatibility purposes. Avoid using this functionality.

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
