# @mdn/browser-compat-data release notes

## [v6.0.2](https://github.com/mdn/browser-compat-data/releases/tag/v6.0.2)

April 1, 2025

### Additions

- `api.AudioWorklet.port` ([#26371](https://github.com/mdn/browser-compat-data/pull/26371))
- `browsers.chrome_android.releases.138` ([#26363](https://github.com/mdn/browser-compat-data/pull/26363))
- `browsers.chrome.releases.138` ([#26363](https://github.com/mdn/browser-compat-data/pull/26363))
- `browsers.webview_android.releases.138` ([#26363](https://github.com/mdn/browser-compat-data/pull/26363))
- `css.selectors.after.nested_marker` ([#26240](https://github.com/mdn/browser-compat-data/pull/26240))
- `css.selectors.before.nested_marker` ([#26240](https://github.com/mdn/browser-compat-data/pull/26240))

### Statistics

- 6 contributors have changed 328 files with 1,406 additions and 1,186 deletions in 52 commits ([`v6.0.1...v6.0.2`](https://github.com/mdn/browser-compat-data/compare/v6.0.1...v6.0.2))
- 17,079 total features
- 1,138 total contributors
- 5,178 total stargazers

## [v6.0.1](https://github.com/mdn/browser-compat-data/releases/tag/v6.0.1)

March 28, 2025

### Additions

- `html.elements.link.rel.compression-dictionary` ([#26257](https://github.com/mdn/browser-compat-data/pull/26257))
- `http.headers.Accept-Encoding.br` ([#26257](https://github.com/mdn/browser-compat-data/pull/26257))
- `http.headers.Accept-Encoding.dcb` ([#26257](https://github.com/mdn/browser-compat-data/pull/26257))
- `http.headers.Accept-Encoding.dcz` ([#26257](https://github.com/mdn/browser-compat-data/pull/26257))
- `http.headers.Accept-Encoding.zstd` ([#26257](https://github.com/mdn/browser-compat-data/pull/26257))
- `http.headers.Available-Dictionary` ([#26257](https://github.com/mdn/browser-compat-data/pull/26257))
- `http.headers.Content-Encoding.dcb` ([#26257](https://github.com/mdn/browser-compat-data/pull/26257))
- `http.headers.Content-Encoding.dcz` ([#26257](https://github.com/mdn/browser-compat-data/pull/26257))
- `http.headers.Dictionary-ID` ([#26257](https://github.com/mdn/browser-compat-data/pull/26257))
- `http.headers.Link.compression-dictionary` ([#26257](https://github.com/mdn/browser-compat-data/pull/26257))
- `http.headers.Use-As-Dictionary` ([#26257](https://github.com/mdn/browser-compat-data/pull/26257))

### Statistics

- 7 contributors have changed 22 files with 783 additions and 259 deletions in 11 commits ([`v6.0.0...v6.0.1`](https://github.com/mdn/browser-compat-data/compare/v6.0.0...v6.0.1))
- 17,076 total features
- 1,138 total contributors
- 5,171 total stargazers

## [v6.0.0](https://github.com/mdn/browser-compat-data/releases/tag/v6.0.0)

March 25, 2025

### Breaking changes

This major release introduces **three breaking changes** that may require updates from consumers of `@mdn/browser-compat-data`.

#### 1. Removal of `null` and `true` version values ([#24174](https://github.com/mdn/browser-compat-data/pull/24174))

Previously, the `version_added`, `version_removed` and `version_last` fields allowed `null` (indicating support is unknown) and `true` (indicating support added/removed in an unknown version).

Now, these values have been **removed from the schema**. All existing instances have been replaced with explicit or ranged version numbers (e.g. “≤37“).

**Impact**: Consumers handling `null` or `true` values may need to update their code.

#### 2. Improved TypeScript definitions for array values ([#26172](https://github.com/mdn/browser-compat-data/pull/26172))

Several fields, such as `notes`, accept either a single value or an array of at least two values.

Previously, TypeScript definitions used `string | string[]`, requiring consumers to validate array values manually.

Now, these types are more precisely defined as `string | [string, string, ...string[]]`, ensuring that **arrays contain at least two values** when used.

**Impact**: Consumers validating array values may need to update their code.

#### 3. New top-level `manifests` folder ([#26109](http://github.com/mdn/browser-compat-data/pull/26109))

Previously, support data for the Web Application Manifest was placed under `html/manifest`, which inaccurately implied it was an HTML subfeature.

Now, a new top-level `manifests` folder has been created to host the Web Application Manifest under `manifests/webapp` to better reflect its independence, and to support future manifest types like the Payment Method Manifest.

**Impact**: Consumers referencing Web Application Manifest data may need to update their code.

### Renamings

- `html.manifest.*` to `manifest.webapp.*` ([#26109](https://github.com/mdn/browser-compat-data/pull/26109))

### Statistics

- 3 contributors have changed 38 files with 132 additions and 221 deletions in 3 commits ([`v5.7.6...v6.0.0`](https://github.com/mdn/browser-compat-data/compare/v5.7.6...v6.0.0))
- 17,065 total features
- 1,136 total contributors
- 5,167 total stargazers

## Older Versions

- [v5.x](./release_notes/v5.md)
- [v4.x](./release_notes/v4.md)
- [v3.x](./release_notes/v3.md)
- [v2.x](./release_notes/v2.md)
- [v1.x](./release_notes/v1.md)
- [v0.x](./release_notes/v0.md)
