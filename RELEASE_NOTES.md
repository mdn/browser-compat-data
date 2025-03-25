# @mdn/browser-compat-data release notes

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
