# The public JSON schema

This document helps you to understand the structure of the `data.json` file included in the published `@mdn/browser-compat-data` package. The file combines all browser definitions, feature compatibility data, and metadata into one object. Several transformations are applied at build time (see [Build-time transformations](#build-time-transformations)).

## JSON structure

Below is a simplified example of the published data:

```json
{
  "__meta": {
    "version": "6.0.0",
    "timestamp": "2024-01-15T00:00:00.000Z"
  },
  "browsers": {
    "firefox": {
      "name": "Firefox",
      "type": "desktop",
      "preview_name": "Nightly",
      "pref_url": "about:config",
      "accepts_flags": true,
      "accepts_webextensions": true,
      "releases": {
        "1.5": {
          "release_date": "2005-11-29",
          "release_notes": "https://developer.mozilla.org/Firefox/Releases/1.5",
          "status": "retired",
          "engine": "Gecko",
          "engine_version": "1.8"
        }
      }
    }
  },
  "api": {
    "AbortController": {
      "__compat": {
        "source_file": "api/AbortController.json",
        "mdn_url": "https://developer.mozilla.org/docs/Web/API/AbortController",
        "spec_url": "https://dom.spec.whatwg.org/#interface-abortcontroller",
        "support": {
          "chrome": { "version_added": "66" },
          "firefox": { "version_added": "57" }
        },
        "status": {
          "experimental": false,
          "standard_track": true,
          "deprecated": false
        }
      }
    }
  },
  "css": {},
  "html": {},
  "http": {},
  "javascript": {},
  "manifests": {},
  "mathml": {},
  "mediatypes": {},
  "svg": {},
  "webassembly": {},
  "webdriver": {},
  "webextensions": {}
}
```

## Properties

### `__meta`

The `__meta` object is a required property containing metadata about the published data. It has two required properties:

- `version`: a string containing the package version (e.g. `"6.0.0"`).
- `timestamp`: a string containing the ISO 8601 date-time when the data was built (e.g. `"2024-01-15T00:00:00.000Z"`).

### `browsers`

The `browsers` object is a required property containing data for all browsers and JavaScript runtimes, keyed by browser identifier. See [browsers-schema.md](./browsers-schema.md) for the full browser data structure.

### Feature categories

The remaining top-level properties are all required and each contains a tree of feature identifiers and `__compat` objects:

- `api` — Web API interfaces
- `css` — CSS properties, selectors, and at-rules
- `html` — HTML elements and attributes
- `http` — HTTP headers, methods, and status codes
- `javascript` — JavaScript language features
- `manifests` — Web App Manifest keys
- `mathml` — MathML elements and attributes
- `mediatypes` — Media types
- `svg` — SVG elements and attributes
- `webassembly` — WebAssembly features
- `webdriver` — WebDriver commands
- `webextensions` — WebExtension APIs and manifest keys

### The `__compat` object

The `__compat` object describes a feature's compatibility data. It consists of the following:

- A mandatory `support` property for **compat information**.
  A [`support_statement`](#the-support_statement-object) object for each browser identifier with information about versions, prefixes, or alternate names, as well as notes.

- An optional `status` property for **status information**.
  An object containing information about the stability of the feature:
  Is it a functionality that is standard? Is it stable? Has it been deprecated and shouldn't be used anymore? ([see below](#status-information))

- An optional `description` property to **describe the feature**.
  A string containing a human-readable description of the feature.
  It is intended to be used as a caption or title and should be kept short.
  In the published data, this property is formatted as HTML.

- An optional `mdn_url` property which **points to an MDN reference page documenting the feature**.
  It needs to be a valid URL, and should be the language-neutral URL (e.g. use `https://developer.mozilla.org/docs/Web/CSS/text-align` instead of `https://developer.mozilla.org/en-US/docs/Web/CSS/text-align`).

- An optional `spec_url` property as a URL or an array of URLs, each of which is for a specific part of a specification in which this feature is defined.
  Each URL must contain a fragment identifier.

- An optional `tags` property which is an array of strings allowing to assign tags to the feature.

- A mandatory `source_file` property containing the path to the source file that defines this feature, relative to the repository root (e.g. `"api/AbortController.json"`). This is automatically generated at build time.

#### The `support_statement` object

The `support_statement` object describes the support provided by a single browser type for the given subfeature. It is either a `simple_support_statement` object, or an array of two or more `simple_support_statement` objects.

If there is an array, the `simple_support_statement` objects are sorted with the most relevant and general entries first. In other words, entries applying to the most recent browser releases come first and entries with prefixes or flags come after those without.

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
      "version_removed": "9",
      "version_last": "8"
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

The `simple_support_statement` object is the core object containing the compatibility information for a browser. It consists of the following properties:

#### `version_added`

This is the only mandatory property and it contains a string with the version number indicating when a sub-feature has been added (and is therefore supported), or `false` indicating the feature is not supported. Examples:

- Support from version 3.5 (inclusive):

```json
{
  "version_added": "3.5"
}
```

- Support in version 79, but possibly supported earlier:

```json
{
  "version_added": "≤79"
}
```

- Support in latest beta/preview release:

```json
{
  "version_added": "preview"
}
```

- No support:

```json
{
  "version_added": false
}
```

#### `version_removed`

Contains a string with the version number the sub-feature was removed in. If the feature has not been removed from the browser, this property is omitted. When `version_removed` is present, `version_last` is always present as well.

Example:

- Removed in version 10 (added in 4 and supported up until 9):

```json
{
  "version_added": "4",
  "version_removed": "10",
  "version_last": "9"
}
```

#### `version_last`

A string indicating the last browser version that supported the feature. This property is always present when `version_removed` is present. For example, if a feature was removed in version 30, `version_last` will be `"29"`.

```json
{
  "version_added": "20",
  "version_removed": "30",
  "version_last": "29"
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
  "version_added": "4",
  "version_removed": "9",
  "version_last": "8"
}
```

Note that you can't have both `prefix` and `alternative_name`.

#### `flags`

An optional array of objects describing flags that must be configured for this browser to support this feature. Usually this array will have one item, but there are cases where two or more flags can be required to activate a feature. An object in the `flags` array consists of three properties:

- `type` (mandatory): an enum that indicates the flag type:
  - `preference` a flag the user can set (like in `about:config` in Firefox).
  - `runtime_flag` a flag to be set before starting the browser.
- `name` (mandatory): a string giving the name of the flag or preference that must be configured.
- `value_to_set` (optional): representing the actual value to set the flag to. It is a string, that may be converted to the right type (that is `true` or `false` for Boolean value, or `4` for an integer value).

Example for one flag required:

```json
{
  "version_added": "40",
  "flags": [
    {
      "type": "preference",
      "name": "browser.flag.name",
      "value_to_set": "true"
    }
  ]
}
```

#### `impl_url`

An optional changeset/commit URL (or array of URLs) for the revision which implemented the feature in the source code, or the URL to the bug tracking the implementation, for the associated browser.

#### `notes`

A string or array of strings containing additional information. In the published data, notes are formatted as HTML.

#### `partial_implementation`

A `boolean` value indicating whether or not the implementation of the sub-feature deviates from the specification in a way that may cause significant compatibility problems. It defaults to `false` (no interoperability problems expected). If set to `true`, a `notes` field explaining the divergence is always present.

```json
{
  "version_added": "6",
  "partial_implementation": true,
  "notes": "The event handler is supported, but the event never fires."
}
```

### Ranged versions (≤)

Ranged versions indicate that a feature has been confirmed to be supported in at least a certain version of the browser, but may have been added in an earlier release. Ranged versions are indicated by the `Less Than or Equal To (U+2264)` (`≤`) symbol before the version number.

For example, the statement below means, "supported in at least version 37 and possibly in earlier versions as well".

```json
{
  "version_added": "≤37"
}
```

### Status information

The status property contains information about stability of the feature. It is an object named `status` and has three mandatory properties:

- `experimental` (DEPRECATED): a `boolean` value.

  **Warning**: The `experimental` property is deprecated.
  Prefer using a more well-defined stability calculations, such as Baseline, instead.

  If `experimental` is `true`, then it usually means that the feature is implemented in only one browser engine.

  If `experimental` is `false`, then it usually means that the feature is implemented in two or more browser engines.
  Sometimes a `false` value means that a single-implementer feature is not expected to change.

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

## Build-time transformations

The published data differs from the [source data](./compat-data-schema.md) in the following ways:

- All `"mirror"` support statements are resolved to concrete support objects with real version numbers. The string `"mirror"` never appears in published data.
- A `source_file` property is added to every `__compat` object.
- A `version_last` property is added to every support statement that has a `version_removed`.
- Markdown formatting in `description` and `notes` fields is converted to HTML.

## Exports

This structure is exported for consumers of `@mdn/browser-compat-data`:

```js
import bcd from '@mdn/browser-compat-data';
bcd.__meta.version; // "6.0.0"
bcd.browsers.firefox.releases['1.5'].status; // "retired"
bcd.api.AbortController.__compat.support.chrome.version_added; // "66"
bcd.api.AbortController.__compat.source_file; // "api/AbortController.json"
```

```js
const bcd = require('@mdn/browser-compat-data');
bcd.__meta.version;
// "6.0.0"
bcd.browsers.firefox.releases['1.5'].status;
// "retired"
```
