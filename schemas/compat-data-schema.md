# The compat data JSON schema

This document helps you to understand how compatibility data is organized and structured.

## Where to find compat data

### The folder structure

Compatibility data is organized in top-level directories for each broad area covered: for example, `http`, `javascript`, and `webextensions`. Inside each of these directories is one or more JSON files containing the compatibility data.

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

The JSON files contain [feature identifiers](#feature-identifiers), which are relevant for accessing the data. Except for the top-level directories, the file and sub-folder hierarchies aren't of any meaning for the exports. Compatibility data can be stored in a single large file or might be divided in smaller files and put into sub folders.

## Understanding the schema

### Feature hierarchies

Each feature is identified by a unique hierarchy of strings, e.g the `text-align` property is identified by `css.properties.text-align`.

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

The hierarchy of identifiers is not defined by the schema and is a convention of the project using the schema.

#### Features

A feature is described by an identifier containing the `__compat` property. In other words, identifiers without `__compat` aren't necessarily features, but help to nest the features properly.

When an identifier has a `__compat` block, it represents its basic support, indicating that a minimal implementation of a functionality is included. What it represents exactly depends of the evolution of the feature over time, both in terms of specifications and of browser support.

#### Sub-features

To add a sub-feature, a new identifier is added below the main feature at the level of a `__compat` object (see the sub-features "start" and "end" above). The same could be done for sub-sub-features. There is no depth limit.

See [Data guidelines](/docs/data-guidelines/index.md) for more information about feature naming conventions and other best practices.

### The `__compat` object

In BCD, every feature is defined using a `__compat` object, which contains information such as an optional description of the feature, a link to the associated MDN article, the specification URL(s), standard track status, and the browser support.

Here is an example of a `__compat` statement, with all of the properties and the common possible support statements.

```js
{
  "api": {
    "Document": {
      "fake_event": {
        "__compat": { // <---
          "description": "<code>fake</code> event", // A friendly description of the feature
          "mdn_url": "https://developer.mozilla.org/docs/Web/API/Document/fake_event", // The associated MDN article
          "spec_url": [ // The spec URL(s) for the feature if applicable, may be one or many
            "https://example.com/a-fake-spec#fake-event",
            "https://example.com/a-fake-spec#onfake"
          ],
          "support": { // The support data for each browser
            "chrome": { // Supported since Chrome 57 on
              "version_added": "57"
            },
            "chrome_android": "mirror", // Mirrors from Chrome Desktop, so "57"
            "edge": {  // Supported since Edge 12, with a note about a difference in behavior
              "version_added": "12",
              "notes": "Before Edge 79, the event interface included additional proprietary properties."
            },
            "firefox": { // Added in Firefox 59, then removed in Firefox 80 (AKA supported from 59 until 79)
              "version_added": "59",
              "version_removed": "80"
            },
            "firefox_android": { // Supported in Firefox Android, we just don't know what version it was added in
              "version_added": true
            },
            "ie": { // Supported since IE 10, but has a caveat that impacts compatibility
              "version_added": "10",
              "partial_implementation": true,
              "notes": "The <code>onfake</code> event handler property is not supported."
            },
            "oculus": "mirror",
            "opera": { // Not supported at all in Opera
              "version_added": false
            },
            "opera_android": { // We don't know if Opera Android supports this or not
              "version_added": null
            },
            "safari": [ // A support statement can be an array of multiple statements to better describe the compatibility story
              {
                "version_added": "13" // Supported since Safari 13...
              },
              {
                "version_added": "10.1", // ...but also supported since Safari 10.1 with the "webkit" prefix (AKA "webkitfake")...
                "prefix": "webkit"
              },
              {
                "version_added": "4", // ...and supported between Safari 4 (inclusive) and 10.1 (exclusive) as "webkitnonreal"
                "version_removed": "10.1",
                "alternative_name": "webkitnonreal"
              }
            ],
            "safari_ios": "mirror",
            "samsunginternet_android": "mirror",
            "webview_android": "mirror"
          },
          "status": { // Standards track, deprecation and experimental status
            "experimental": false,
            "standard_track": true,
            "deprecated": false
          }
        }
      }
    }
  }
}
```

The `__compat` object consists of the following:

- A mandatory `support` property for **compat information**.
  A [`support_statement`](#the-support_statement-object) object or array of objects listing the compatibility information for each browser.

- A mandatory `status` property for **status information**.
  An object containing information about the stability of the feature:
  Is it a functionality that is standard? Is it stable? Has it been deprecated and shouldn't be used anymore? ([see below](#status-information))

- An optional `description` property to **describe the feature**.
  A string containing a human-readable description of the feature.
  It is intended to be used as a caption or title and should be kept short.
  The `<code>`, `<kbd>`, `<em>`, and `<strong>` HTML elements may be used.

- An automated `source_file` property containing the path to the source file containing the feature. This is used to create links to the repository source (in the form of `https://github.com/mdn/browser-compat-data/blob/main/<source_file>`). For example, `api.History.forward` will contain a `source_file` property of `api/History.json` since the feature is defined in that file.

- An optional `mdn_url` property which **points to an MDN reference page documenting the feature**.
  It needs to be a valid URL, and should be the language-neutral URL (e.g. use `https://developer.mozilla.org/docs/Web/CSS/text-align` instead of `https://developer.mozilla.org/en-US/docs/Web/CSS/text-align`).

- An optional `spec_url` property as a URL or an array of URLs, each of which is for a specific part of a specification in which this feature is defined.
  Each URL must either contain a fragment identifier (e.g. `https://tc39.es/proposal-promise-allSettled/#sec-promise.allsettled`), or else must match the regular-expression pattern `^https://registry.khronos.org/webgl/extensions/[^/]+/` (e.g. `https://registry.khronos.org/webgl/extensions/ANGLE_instanced_arrays/`).
  Each URL must link to a specification published by a standards body or a formal proposal that may lead to such publication.

#### Browser identifiers

The currently accepted browser identifiers should be declared in alphabetical order:

- `chrome`, Google Chrome (on desktops)
- `chrome_android`, Google Chrome (on Android)
- `deno`, Deno JavaScript runtime built on Chrome's V8 JavaScript engine
- `edge`, Microsoft Edge (on Windows), based on the EdgeHTML version (before version 79), and later on the Chromium version
- `firefox`, Mozilla Firefox (on desktops)
- `firefox_android`, Firefox for Android, sometimes nicknamed Fennec
- `ie`, Microsoft Internet Explorer (discontinued; BCD is frozen)
- `nodejs` Node.js JavaScript runtime built on Chrome's V8 JavaScript engine
- `oculus`, Meta Quest Browser (formerly Oculus Quest), based on Google Chrome (on Android)
- `opera`, the Opera browser (desktop), based on Blink since Opera 15
- `opera_android`, the Opera browser (Android version)
- `safari`, Safari on macOS
- `safari_ios`, Safari on iOS, based on the iOS version
- `samsunginternet_android`, the Samsung Internet browser (Android version)
- `webview_android`, WebView, the built-in browser for Android

Desktop browser identifiers are mandatory, with the `version_added` property set to `null` if support is unknown.

#### The `support_statement` object

The `support_statement` object describes the support provided by a single browser type for the given subfeature. It is either a `simple_support_statement` object, an array of two or more `simple_support_statement` objects, or the string `"mirror"`.

If there is an array, the `simple_support_statement` objects should be sorted with the most relevant and general entries first. In other words, sort such arrays with entries applying to the most recent browser releases first and sort entries with prefixes or flags after those without. If in doubt, reverse-chronological order with respect to the `"version_removed"` and then `"version_added"` values usually works well. For more information on sorting support statements, see [#1596](https://github.com/mdn/browser-compat-data/issues/1596).

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

#### Mirroring data

Most of the browsers are derivatives of other browsers, such as mobile counterparts (Firefox -> Firefox Android) or other forks (Chrome -> Edge, Opera, Samsung Internet). Usually in such cases, the support for a feature is the exact same across the derivatives, or will be when a matching version is released. To make maintenance easier, contributors may specify a simple string, `"mirror"`, as the support statement for the browser, and the version data will be mirrored from its upstream counterpart (as defined in `browsers/<browser>.json`).

An example of this would be the following:

```js
"support": {
  "chrome": {
    "version_added": "66"
  },
  "chrome_android": "mirror", // will become { version_added: "66" }
}
```

This also helps with maintaining derivatives with a different release schedule than their upstream counterpart. For example, let's say that a new feature was introduced in Chrome 100, but the latest Samsung Internet release is based on Chrome 96. Rather than setting Samsung Internet to `{version_added: false}` and then following up to update the data when a new version is released, we can set it to `"mirror"` instead, which will automatically change to the version number of the new, matching release.

### Compat data in support statements

The `simple_support_statement` object is the core object containing the compatibility information for a browser. It consist of the following properties:

#### `version_added`

This is the only mandatory property and it contains a string with the version number indicating when a sub-feature has been added (and is therefore supported). The Boolean values indicate that a sub-feature is supported (`true`, with the additional meaning that it is unknown in which version support was added) or not supported (`false`). A value of `null` indicates that support information is entirely unknown. Examples:

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

Note: many data categories no longer allow for `version_added` to be set to `true` or `null`, as we are working to [improve the quality of the compatibility data](https://github.com/mdn/browser-compat-data/issues/3555).

#### `version_removed`

Contains a string with the version number the sub-feature was removed in. It may also be `true`, meaning that it is unknown in which version support was removed. If the feature has not been removed from the browser, this property is omitted, rather than being set to `false`.

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

Note: many data categories no longer allow for `version_removed` to be set to `true`, as we are working to [improve the quality of the compatibility data](https://github.com/mdn/browser-compat-data/issues/3555).

### Ranged versions (≤)

For certain browser versions, ranged versions (also called "ranged values") are allowed as it is sometimes impractical to find out in which early version of a browser a feature shipped. Ranged versions are a way to include some version data in BCD, while also stating the version number may not be accurate. These values state that the feature has been confirmed to be supported in at least a certain version of the browser, but may have been added in an earlier release. Ranged versions are indicated by the `Less Than or Equal To (U+2264)` (`≤`) symbol before the version number.

For example, the statement below means, "supported in at least version 37 and possibly in earlier versions as well".

```json
{
  "version_added": "≤37"
}
```

Ranged versions should be used sparingly and only when it is impossible or highly impractical to find out the version number a feature initially shipped in. Ranged versions are allowed for browser releases dating back two years or earlier. Contributors are encouraged to eliminate ranged versions and replace them with exact version numbers whenever possible.

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
  "version_added": "4",
  "version_removed": "9"
}
```

Note that you can’t have both `prefix` and `alternative_name`.

#### `flags`

An optional array of objects describing flags that must be configured for this browser to support this feature. Usually this array will have one item, but there are cases where two or more flags can be required to activate a feature. An object in the `flags` array consists of three properties:

- `type` (mandatory): an enum that indicates the flag type:
  - `preference` a flag the user can set (like in `about:config` in Firefox).
  - `runtime_flag` a flag to be set before starting the browser.
- `name` (mandatory): a string giving the value which the specified flag must be set to for this feature to work.
- `value_to_set` (optional): representing the actual value to set the flag to. It is a string, that may be converted to the right type (that is `true` or `false` for Boolean value, or `4` for an integer value). It doesn't need to be enclosed in `<code>` tags.

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

#### `impl_url`

An optional changeset/commit URL for the revision which implemented the feature in the source code, or the URL to the bug tracking the implementation, for the associated browser. The presence of an `impl_url` value indicates that the associated browser has implemented the feature or intends to implement the feature.

For changeset/commit URLs, this is typically a https://trac.webkit.org/changeset/, https://hg.mozilla.org/mozilla-central/rev/, or https://crrev.com/ URL for a changeset with a subject line that will typically be something of the form _"Implement [feature]"_, _"Support [feature]"_, or _"Enable [feature]"_. For bug URLs, this is typically a https://webkit.org/b/, https://bugzil.la/, or https://crbug.com/ URL indicating an intent to implement and ship the feature.

#### `notes`

A string or `array` of strings containing additional information. If there is only one entry, the value of `notes` must simply be a string instead of an array.

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

The `<code>`, `<kbd>`, `<em>`, and `<strong>` HTML elements may be used. In addition, `<a>` tags may be used, such as to link to a browser's bug report, or MDN documentation. Do not format `notes` as Markdown.

#### `partial_implementation`

A `boolean` value indicating whether or not the implementation of the sub-feature deviates from the specification in a way that may cause significant compatibility problems. It defaults to `false` (no interoperability problems expected). If set to `true`, it is [required](../docs/data-guidelines/index.md#partial_implementation-requires-a-note). that you add a note explaining how it diverges from the standard (such as that it implements an old version of the standard).

```json
{
  "version_added": "6",
  "partial_implementation": true,
  "notes": "The event handler is supported, but the event never fires."
}
```

### Status information

The mandatory status property contains information about stability of the feature. It is an object named `status` and has three mandatory properties:

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

We are planning to localize some of this data (e.g. notes, descriptions). At this point we haven't decided how or when we are going to do that. See [issue 114](https://github.com/mdn/browser-compat-data/issues/114) for more information.
