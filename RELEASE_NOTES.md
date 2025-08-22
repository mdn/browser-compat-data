# @mdn/browser-compat-data release notes

## [v7.0.0](https://github.com/mdn/browser-compat-data/releases/tag/v7.0.0)

August 22, 2025

### Breaking changes

This release introduces **one breaking change** that may require you to take action.

#### 1. Sync TypeScript definitions for versions with schema ([#27428](https://github.com/mdn/browser-compat-data/pull/27428))

Previously, TypeScript definitions for version fields were inconsistent with the schema.

Now, definitions are aligned with the schema:

- `VersionValue` is now `string | false` (previously `string | boolean | null`).
- `version_added` is still `VersionValue` (without `true` or `null`).
- `version_removed` and `version_last` are now string (previously `VersionValue`).

**Impact**: You may need to update your code handling these fields.

### Statistics

- 2 contributors have changed 11 files with 81 additions and 163 deletions in 1 commit ([`v6.1.5...v7.0.0`](https://github.com/mdn/browser-compat-data/compare/v6.1.5...v7.0.0))
- 17,783 total features
- 1,186 total contributors
- 5,364 total stargazers

## Older Versions

- [v6.x](./release_notes/v6.md)
- [v5.x](./release_notes/v5.md)
- [v4.x](./release_notes/v4.md)
- [v3.x](./release_notes/v3.md)
- [v2.x](./release_notes/v2.md)
- [v1.x](./release_notes/v1.md)
- [v0.x](./release_notes/v0.md)
