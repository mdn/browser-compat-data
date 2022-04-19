# Contributing to browser-compat-data

We're really happy to accept contributions to the mdn/browser-compat-data repository!

## Table of contents

1. [Before you begin](#before-you-begin)
2. [Ways to contribute](#ways-to-contribute)
3. [Finding browser version numbers for features](#finding-browser-version-numbers-for-features)
4. [Updating compatibility tables on MDN](#updating-compatibility-tables-on-mdn)
5. [Opening issues and pull requests](#opening-issues-and-pull-requests)
   1. [Optional: Generating data using the Web API Confluence Dashboard](#optional-generating-data-using-the-web-api-confluence-dashboard)
   2. [Optional: Generating data using the mirroring script](#optional-generating-data-using-the-mirroring-script)
6. [Getting help](#getting-help)

## Before you begin

The browser-compat-data project (BCD) welcomes contributors of all kinds, but we ask that you keep these guidelines in mind when you're contributing.

The project requires that all contributors follow [Mozilla's code of conduct and etiquette guidelines](/CODE_OF_CONDUCT.md).

This project has [a formal governance document](/GOVERNANCE.md), which describes how various types of contributors work within the project and how decisions are made.

The repository is made available under the terms the [Creative Commons CC0 Public Domain Dedication](/LICENSE). Any contributions must be compatible with its terms. If you're not sure about that, [please ask](#getting-help).

## Ways to contribute

There are many ways you can help improve this repository! For example:

- **Add new compat data**: familiarize yourself with the [schema](../schemas/compat-data.schema.json) and read the [schema docs](../schemas/compat-data-schema.md) and [data guidelines](data-guidelines.md) to add new files.
- **Fix existing compat data**: maybe a browser now supports a certain feature. Yay! If you open a PR to fix a browser's data, it would be most helpful if you include a link to a bug report or similar so that we can double-check the good news.
- **Fix a bug:** we have a list of [issues](https://github.com/mdn/browser-compat-data/issues),
  or maybe you found your own.
- **Review a pull request:** there is a list of [PRs](https://github.com/mdn/browser-compat-data/pulls).
  Let us know if these look good to you.

## Finding browser version numbers for features

When adding data for a particular feature, you'll often need to find which version of each browser the feature first shipped in. For how-to guidance which will help you do that, see [Matching web features to browser release version numbers](https://developer.mozilla.org/docs/MDN/Contribute/Processes/Matching_features_to_browser_version).

## Updating compatibility tables on MDN

It takes up to four weeks for BCD changes to be reflected in MDN's browser compatibility tables.
The process is:

1. A pull request is reviewed and merged to `main`.
2. Project owners publish a new release of [`@mdn/browser-compat-data`](https://www.npmjs.com/package/@mdn/browser-compat-data).
   See [Publishing a new version of `@mdn/browser-compat-data`](publishing.md) for details.
3. MDN staff build and deploy a new image of [Kumascript](https://github.com/mdn/kumascript), which includes the BCD release, to production.
   This typically happens within a day of the release of the npm package.
4. Tables are generated on MDN:

   - Existing tables automatically regenerate monthly.
     Alternatively, logged-in MDN users can [force-refresh a page](https://en.wikipedia.org/wiki/Wikipedia:Bypass_your_cache#Bypassing_cache) to regenerate it.
   - For new pages, you must add the [`{{Compat}}`](https://github.com/mdn/kumascript/blob/master/macros/Compat.ejs) macro to the page.
     For instructions, see [Inserting the data into MDN pages](https://developer.mozilla.org/en-US/docs/MDN/Contribute/Structures/Compatibility_tables#Inserting_the_data_into_MDN_pages).

Large-scale changes follow a different process. See [Migrations](migrations.md) for details.

## Opening issues and pull requests

Before submitting your pull request, [validate your new data against the schema](testing.md).

Not everything is enforced or validated by the schema. A few things to pay attention to:

- Feature identifiers (the data namespaces, like `css.properties.background`) should make sense and are spelled correctly.
- Nesting of feature identifiers should make sense.
- Notes use correct grammar and spelling. They should be complete sentences ending with a period.

### Optional: Generating data using the Web API Confluence Dashboard

If the feature you're interested in is a JavaScript API, you can cross-reference data against [Web API Confluence](https://web-confluence.appspot.com/) using the `confluence` command. This command overwrites data in your current working tree according to data from the dashboard. See [Using Confluence](using-confluence.md) for instructions.

### Optional: Generating data using the mirroring script

Many browsers within BCD can be derived from other browsers given they share the same engine, for example Opera derives from Chrome, and Firefox Android derives from Firefox. To help cut down time working on copying values between browsers, a mirroring script is provided. You can run `npm run mirror <browser> <feature_or_file> -- [--source=""] [--modify="nonreal"] [--target_version=""]` to automatically copy values.

The <browser> argument is the destination browser that values will be copied to. The script automatically determines what browser to copy from based upon the destination (see table below), but manual specification is possible through the `--source=""` argument.

| Destination      | Default Source    |
| ---------------- | ----------------- |
| Chrome Android   | Chrome            |
| Edge             | Internet Explorer |
| Firefox Android  | Firefox           |
| Opera            | Chrome            |
| Opera Android    | Chrome Android    |
| Safari iOS       | Safari            |
| Samsung Internet | Chrome Android    |
| WebView          | Chrome Android    |

The <feature_or_filename> argument is either the identifier of the feature to update (i.e. `css.at-rules.namespace`), a filename (`javascript/operators/arithmetic.json`), or an entire folder (`api`).

Note when using feature identifiers:

- Updates aren't applied recursively; only the given data point is updated when using a feature ID. Use a filename or folder for mass mirroring.
- The script assumes a predictable file structure when passing in a feature identifier, which BCD doesn't have right now. (See [issue 3617](https://github.com/mdn/browser-compat-data/issues/3617).) For example, even if "html.elements.input.input-button" is a valid query, it will fail because the file structure for input-button isn't consistent with the rest right now.

By default, the mirroring script will only overwrite values in the destination that are `true` or `null`, but can take a `--modify` (or `-m`) argument to specify whether to overwrite values that are `false` as well (`--modify=bool`), or any values (`--modify=always`).

The script can also take a `--target_version` (or `-t`) argument to only perform mirroring if the data affects a specific browser release. This is used to update data when a new Opera or Opera Android version is released, and we wish to update data that only affects the new version.

## Getting help

If you need help with this repository or have any questions, contact the MDN team on [chat.mozilla.org#mdn](https://chat.mozilla.org/#/room/#mdn:mozilla.org) or write to us on [Discourse](https://discourse.mozilla-community.org/c/mdn).
