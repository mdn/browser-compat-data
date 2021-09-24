# Testing, validating, and linting

## Before you begin

For the best results editing and testing browser compat data, you need the following:

- A familiarity with your terminal and Git (for example, you know how to switch directories, clone a repository, and run scripts)
- A text editor (or editor extension) that supports [EditorConfig](https://editorconfig.org/) and the project's [`.editorconfig` file](../.editorconfig)
- Node.js, with [an Active LTS or more recent release](https://nodejs.org/en/download/)

## Install dependencies

Install the dependencies from npm. From the top-level project directory, run `npm install`.

Dependencies change from time to time. Periodically re-run `npm install` to get the latest dependencies.

## Validate the data

All data must conform to the schema, plus several additional consistency and style checks. To test your changes locally, run `npm test`.

For more information on the schema for feature data, see [`compat-data-schema.md`](../schemas/compat-data-schema.md) and [`compat-data.schema.json`](../schemas/compat-data.schema.json).

For more information on the schema for browser data, see see [`browsers-schema.md`](../schemas/browsers-schema.md) and [`browsers.schema.json`](../schemas/browsers.schema.json).

## Generate statistics

To see how changes will affect the statistics of real (either `false` or a version number, as defined in [issue 3555](https://github.com/mdn/browser-compat-data/issues/3555)), true, and null values, you can run `npm run stats [folder]`. This generates a Markdown-formatted table of the percentages of real, true, and null values for the eight primary browsers that browser-compat-data is focusing on. The script also takes an optional argument regarding a specific folder (such as `api` or `javascript`), which will print statistics result for only that folder. Additionally, you can run the script with `--all` to get statistics for all browsers tracked in BCD, not just the primary eight.

## Traverse features

To find all the entries that are non-real, or of a specified value, you can run `npm run traverse <browser> [folder] [value]`.

The browser may be any single browser defined in the [`browsers/` folder](../browsers/).

The folder may be omitted or set to `all` to search through all data folders, or a comma-separated list of folders to search through.

The value may be omitted to search for all non-real values (or more specifically, `true` and `null` values), or any value accepted by `version_added` and `version_removed`.

For example, to search for all Safari entries that are non-real, run `npm run traverse safari`. To search for all WebView entries that are marked as `true` in `api` and `javascript`, run `npm run traverse webview_android api,javascript true`. To search for all Firefox entries supported since `10` across all folders, run `npm run traverse firefox all 10`.
