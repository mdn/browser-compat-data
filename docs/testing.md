# Testing, validating, and linting

## Code style

The JSON files should be formatted according to the [.editorconfig](../.editorconfig) file.

## Validating the data

All data in the repo must conform to the schema. The formal feature data schema is defined in [`compat-data.schema.json`](../schemas/compat-data.schema.json); see [`compat-data-schema.md`](../schemas/compat-data-schema.md) for more info. The browser data schema is defined in [`browsers.schema.json`](../schemas/browsers.schema.json); see [`browsers-schema.md`](../schemas/browsers-schema.md) for more info.

You can use `npm test` to validate data against the schema. You might need to install the `devDependencies` using `npm install`.
The JSON data is validated against the schema using [`ajv`](http://epoberezkin.github.io/ajv/).

## Statistics

To see how changes will affect the statistics of real (either `false` or a version number, as defined in [issue 3555](https://github.com/mdn/browser-compat-data/issues/3555)), true, and null values, you can run `npm run stats [folder]`. This generates a Markdown-formatted table of the percentages of real, true, and null values for the eight primary browsers that browser-compat-data is focusing on. The script also takes an optional argument regarding a specific folder (such as `api` or `javascript`), which will print statistics result for only that folder. Additionally, you can run the script with `--all` to get statistics for all browsers tracked in BCD, not just the primary eight.

## Traverse

To find all the entries that are non-real, or of a specified value, you can run `npm run traverse -- [options] [folder]`.

By default, the script will traverse and print the dotted path to every feature. One or more positional arguments can limit the traversal to a specific folder (for example, `api`). Additional options can limit the features listed to features with data matching specific browser and version values (for example, `--non-real`).

Run `npm run traverse -- --help` for a complete list of options and examples.

The `-b` or `--browser` argument may be any browser in the [`browsers/` folder](https://github.com/mdn/browser-compat-data/blob/master/browsers/). This argument may be repeated to traverse multiple browsers. By default, the script will traverse all browsers.

The `-f` or `--filter` argument may be any value accepted by `version_added` or `version_removed`. This argument may be repeated to test multiple values. By default, the script will traverse all features regardless of their value. The `--nonreal` argument may be included as a convenience alias for `-f null -f true`.

Examples: to search for all Safari entries that are non-real, run `npm run traverse -- -b safari --noreal`. To search for all WebView entries that are marked as `true` in `api` and `javascript`, run `npm run traverse api,javascript -- -b webview_android -f true`. To search for all Firefox entries supported since `10` across all folders, run `npm run traverse -- -b firefox -f 10`.
