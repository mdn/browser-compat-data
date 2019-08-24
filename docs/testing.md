# Testing, validating, and linting

## Code style

The JSON files should be formatted according to the [.editorconfig](https://github.com/mdn/browser-compat-data/blob/master/.editorconfig) file.

## Validating the data

All data in the repo must conform to the schema. The formal feature data schema is defined in [`compat-data.schema.json`](https://github.com/mdn/browser-compat-data/blob/master/schemas/compat-data.schema.json); see [`compat-data-schema.md`](https://github.com/mdn/browser-compat-data/blob/master/schemas/compat-data-schema.md) for more info. The browser data schema is defined in [`browsers.schema.json`](https://github.com/mdn/browser-compat-data/blob/master/schemas/browsers.schema.json); see [`browsers-schema.md`](https://github.com/mdn/browser-compat-data/blob/master/schemas/browsers-schema.md) for more info.

You can use `npm test` to validate data against the schema. You might need to install the `devDependencies` using `npm install`.
The JSON data is validated against the schema using [`ajv`](http://epoberezkin.github.io/ajv/).

## Rendering

You can use `npm run render $query $depth $aggregateMode` to output an HTML like it would be rendered on MDN.
The parameters are the same as the [`{{compat}}` macro](https://github.com/mdn/kumascript/blob/master/macros/Compat.ejs).

Paste the generated HTML into the MDN editor (source mode). You can use a new page, for example: https://developer.mozilla.org/en-US/docs/new and verify if the output looks correct.

## Statistics

To see how changes will affect the statistics of real*, true, and null values, you can run `npm run stats [folder]`.  This generates a Markdown-formatted table of the percentages of real, true, and null values for the eight primary browsers that browser-compat-data is focusing on.  The script also takes an optional argument regarding a specific folder (such as `api` or `javascript`), which will print statistics result for only that folder.

## Traverse
To find all the entries that are non-real, or of a specified value, you can run `npm run traverse <browser> [folder] [value]`.  The browser may be any single browser defined in the [`browsers/` folder](https://github.com/mdn/browser-compat-data/blob/master/browsers/).  The folder may be omitted to search through all data folders, or a comma-separated list of folders to search through.  The value may be omitted to search for all non-real values (or more specifically, `true` and `null` values), or any value accepted by `version_added` and `version_removed`.  For example, to search for all Safari entries that are non-real, run `npm run traverse safari`.  To search for all WebView entries that are marked as `true` in `api` and `javascript`, run `npm run traverse webview_android api,javascript true`.

\* _Real_ values are values of which are either `false` or a version number, as defined in [#3555](https://github.com/mdn/browser-compat-data/issues/3555).
