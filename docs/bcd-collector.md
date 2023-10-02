# Updating BCD from mdn-bcd-collector results

The [mdn-bcd-collector](https://mdn-bcd-collector.gooborg.com/) helps to keep BCD up-to-date and as accurate as possible, by running predefined JavaScript code in browsers to determine what features are and are not supported. See also [About the mdn-bcd-collector](https://mdn-bcd-collector.gooborg.com/docs/about.md).

The `update` script can update BCD according to results collected from the mdn-bcd-collector.

## Prerequisites

To update BCD from mdn-bcd-collector results, you will need:

- A folder with mdn-bcd-collector results, at `../mdn-bcd-results`.

You can get pre-collected results from [openwebdocs/mdn-bcd-results](https://github.com/openwebdocs/mdn-bcd-results).
The reports in this repository are collected on every new release of the collector for almost every release of Chrome, Edge, Firefox and Safari since January 2020, and for the latest release of mobile browsers.

To generate your own result files, see the [mdn-bcd-collector](https://mdn-bcd-collector.gooborg.com/) project for instructions.

If you use a different tool to generate results for BCD, see the [collector report schema](browser-compat-data/schemas/collector-report.md) for how to structure the JSON data for the BCD `update` script.

## BCD update script

To update BCD using mdn-bcd-collector results, run the following command:

```sh
npm run update
```

This will update BCD using all of the results files in the ``../mdn-bcd-results` folder.

Tp use results from a different path, and/or to use a specific file, you may specify any number of paths as arguments:

```sh
npm run update-bcd ../local-results
npm run update-bcd ../mdn-bcd-results/9.1.0-chrome-112.0.0.0-mac-os-10.15.7-79d130f929.json
```

### Path argument

To limit changes to a specific BCD path, such as by category or a specific interface, you may use the `-p/--path` argument.

Updating a specific category:

```sh
npm run update -- --path=css.properties
npm run update -- -p css.properties
```

Updating a specific entry, ex. the `appendChild()` method on `Node`:

```sh
npm run update -- --path=api.Node.appendChild
npm run update -- -p api.Node.appendChild
```

Updating a specific feature and its children, ex. the `Document` API (also updates `api.Document.*`, ex. `api.Document.body`):

```sh
npm run update -- --path=api.Document
npm run update -- -p api.Document
```

Updating paths matched with wildcards, ex. everything related to WebRTC:

```sh
npm run update -- --path="api.RTC*"
npm run update -- -p "api.RTC*"
```

### Limit changes by browser

The `-b/--browser` argument can be used to only update data for one or more browsers:

```sh
npm run update -- --browser=safari --browser=safari_ios
npm run update -- -b safari -b safari_ios
```

The `-r/--release` argument can be used to only update data for a specific browser release, ex. Firefox 84:

```sh
npm run update -- --browser=firefox --release=84
npm run update -- -b firefox -r 84
```

This will only make changes that set either `version_added` or `version_removed` to "84".

### Limit changes to non-ranged only

The `-e/--exact-only` argument can be used to only update BCD when we have an exact version number and skip any ranges (ex. `≤37`):

```sh
npm run update-bcd -- --exact-only
npm run update-bcd -- -e
```

## Custom ranged version format

When the results don't have enough data to determine an exact version, ranges which aren't valid in BCD may be added:

- "≤N" for any release, not just the ranged versions allowed by BCD.
- "M> ≤N" when a feature is _not_ in M and _is_ in N, but there are releases between the two for which support is unknown.

In both cases, the uncertainty has to be resolved by hand before submitting the data to BCD.
