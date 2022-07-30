# The browser JSON schema

This document helps you to understand the structure of the browser (and JavaScript runtime) data in BCD, including the browser type, a display-friendly name, release data and more. Each browser is defined by a unique identifier (e.g. `firefox` or `chrome_android`).

Note: while NodeJS and Deno are JavaScript runtimes and not browsers, data for them is placed in `browsers`, and are included whenever we use the term "browsers".

## JSON structure

Below is an example of the browser data:

```json
{
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
  }
}
```

## Properties

### `name`

The `name` string is a required property which should use the browser brand name and avoid English words if possible, for example `"Firefox"`, `"Firefox Android"`, `"Safari"`, `"iOS Safari"`, etc.

### `type`

The `type` string is a required property which indicates the platform category the browser runs on. Valid options are `"desktop"`, `"mobile"`, `"server"` and `"xr"`.

### `upstream`

The `upstream` string is an optional property which indicates the upstream browser updates are derived from. For example, Firefox Android's upstream browser is Firefox (desktop), and Edge's upstream browser is Chrome. This is used for mirroring data between browsers. Valid options are any browser defined in the data.

### `accepts_flags`

An optional boolean indicating whether the browser supports flags. If it is set to `false`, flag data will not be allowed for that browser.

### `accepts_webextensions`

An optional boolean indicating whether the browser supports web extensions. A `true` value will allow this browser to be defined in web extensions support.

### `pref_url`

An optional string containing the URL of the page where feature flags can be changed (e.g. `"about:config"` for Firefox or `"chrome://flags"` for Chrome).

### `preview_name`

An optional string containing the name of the preview browser. For example, "Nightly" for Firefox, "Canary" for Chrome, and "TP" for Safari.

### `releases`

The `releases` object contains data regarding the browsers' releases, using the version number as the index for each entry within. A release object contains the following properties:

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

- An optional `engine` property which is the name of the browser's engine. This property is placed on the individual release as a browser may switch to a different engine (e.g. Microsoft Edge switched to Chrome as its base engine).

- An optional `engine_version` property which is the version of the browser's engine. Depending on the browser, this may or may not differ from the browser version.

- An optional `upstream_version` which is the upstream browser's version that will map to this release. Used in mirroring when the engine version does not match.

## Exports

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
