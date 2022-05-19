# The browser JSON schema

This document helps you to understand the structure of the [browser JSON](../browsers) files.

#### Browser identifiers

The currently accepted browser identifiers are [defined in the compat-data schema](compat-data-schema.md#browser-identifiers). They are re-used for the browser data scheme. No other identifiers are allowed and the file names should also use the browser identifiers.

For example, for the browser identifier `firefox`, the file name is `firefox.json`.

#### File structure

The file `firefox.json` is structured like this:

```json
{
  "browsers": {
    "firefox": {
      "name": "Firefox",
      "preview_name": "Nightly",
      "pref_url": "about:config",
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
  }
}
```

It contains an object with the property `browsers` which then contains an object with the browser identifier as the property name (`firefox`).

Underneath, there is a `releases` object which will hold the various releases of a given browser by their release version number (`"1.5"`).

### `name`

The `name` string is a required property which should use the browser brand name and avoid English words if possible, for example `"Firefox"`, `"Firefox Android"`, `"Safari"`, `"iOS Safari"`, etc.

### `type`

The `type` string is a required property which indicates the platform category the browser runs on. Valid options are `"desktop"`, `"mobile"` and `"server"`.

### `accepts_flags`

An optional boolean indicating whether the browser supports flags. If it is set to `false`, flag data will not be allowed for that browser.

### `accepts_webextensions`

An optional boolean indicating whether the browser supports web extensions. A `true` value will allow this browser to be defined in web extensions support.

### `pref_url`

An optional string containing the URL of the page where feature flags can be changed (e.g. `"about:config"` for Firefox or `"chrome://flags"` for Chrome).

### `preview_name`

An optional string containing the name of the preview browser. For example, "Nightly" for Firefox, "Canary" for Chrome, and "TP" for Safari.

### Release objects

The release objects consist of the following properties:

- A mandatory `status` property indicating where in the lifetime cycle this release is in. It's an enum accepting these values:

  - `retired`: This release is no longer supported (EOL). For NodeJS and Deno, every minor/patch release aside from the latest within the major release is considered "retired".
  - `current`: This release is the official latest release.
  - `exclusive`: This is an exclusive release (for example on a flagship device), not generally available.
  - `beta`: This release will the next official release.
  - `nightly`: This release is the current alpha / experimental release (like Firefox Nightly, Chrome Canary).
  - `esr`: This release is an Extended Support Release or Long Term Support release.
  - `planned`: This release is planned in the future.

- An optional `release_date` property with the `YYYY-MM-DD` release date of the browser's release.

- An optional `release_notes` property which points to release notes. It needs to be a valid URL.

- An optional `engine` property which is the name of the browser's engine.

- An optional `engine_version` property which is the version of the browser's engine. This may or may not differ from the browser version.

### Exports

This structure is exported for consumers of `@mdn/browser-compat-data`:

```js
import bcd from '@mdn/browser-compat-data';
bcd.browsers.firefox.releases['1.5'].status; // "retired"
```

```js
> const bcd = require('@mdn/browser-compat-data');
> bcd.browsers.firefox.releases['1.5'].status;
// "retired"
```
