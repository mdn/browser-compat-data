# Upgrading from `mdn-browser-compat-data` 1.1 to `@mdn/browser-compat-data` 2.0.x

`mdn-browser-compat-data` has been renamed to `@mdn/browser-compat-data` (note the `@mdn` scope). Follow these instructions to upgrade to the new package name.

## Before you start

This upgrade causes two breaking changes:

- The old package name no longer works, which means you'll have to update `require()` calls and your `package.json` dependencies.
- Node.js 8 is no longer supported, which means you'll have to upgrade to Node.js 10 or later.

The schema, public API, and other details of the package remain the same since `1.1.x`.

## Upgrade

1. If you have not done so already, upgrade to Node.js 10 or later. Visit the [Node.js site](https://nodejs.org/) for downloads and changelogs.

2. Remove `mdn-browser-compat-data` from your package dependencies.

   In the same directory as your `package.json` file, run `npm uninstall mdn-browser-compat-data`.

3. Add `@mdn/browser-compat-data` to your package dependencies.

   In the same directory as your `package.json` file, run `npm install @mdn/browser-compat-data`.

4. In your code, replace any `require("mdn-browser-compat-data")` calls with `require("@mdn/browser-compat-data")`.

   If possible, run your test suite to make sure this worked.

If you encountered any undocumented [breaking changes](#Before-you-start) as a result of this upgrade, please [open an issue](https://github.com/mdn/browser-compat-data/issues/new).
