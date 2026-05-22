# @mdn/browser-compat-data release notes

## [v8.0.0](https://github.com/mdn/browser-compat-data/releases/tag/v8.0.0)

May 22, 2026

### Breaking changes

This release introduces **two breaking changes** that may require you to take action.

#### 1. `source_file` is now required on `CompatStatement` ([#29041](https://github.com/mdn/browser-compat-data/pull/29041))

Previously, the `CompatStatement.source_file` property was optional in the TypeScript definitions, even though it is always present in published `data.json` releases (it is generated at build time).

Now, `source_file` is typed as required, matching the actual shape of the data.

**Impact**: Consumers that guarded against a missing `source_file` (e.g. `if (compat.source_file)`) can drop those checks. No data changes are required.

#### 2. `BrowserStatement.upstream` is narrowed to `UpstreamBrowserName` ([#29041](https://github.com/mdn/browser-compat-data/pull/29041))

Previously, the `BrowserStatement.upstream` property was typed as `BrowserName`, allowing any of the 17 known browser keys.

Now, `upstream` is typed as the new `UpstreamBrowserName`, a subset of `BrowserName` containing only the browsers that other browsers actually derive from: `"chrome" | "chrome_android" | "firefox" | "safari" | "safari_ios"`.

**Impact**: Consumers that pass `upstream` into functions expecting a full `BrowserName` may need to widen the type, or switch on the narrower set.

### Statistics

- 2 contributors have changed 91 files with 1,681 additions and 784 deletions in 1 commit ([`v7.3.17...v8.0.0`](https://github.com/mdn/browser-compat-data/compare/v7.3.17...v8.0.0))
- 19,752 total features
- 1,250 total contributors
- 5,671 total stargazers

## Older Versions

- [v7.x](./release_notes/v7.md)
- [v6.x](./release_notes/v6.md)
- [v5.x](./release_notes/v5.md)
- [v4.x](./release_notes/v4.md)
- [v3.x](./release_notes/v3.md)
- [v2.x](./release_notes/v2.md)
- [v1.x](./release_notes/v1.md)
- [v0.x](./release_notes/v0.md)
