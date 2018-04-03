We're really happy to accept contributions to the mdn-browser-compat-data repository!
This file lists some general guidelines to help you contributing effectively.

## Types of contribution

There are many ways you can help improve this repository! For example:

* **Adding new compat data**: familiarize yourself with the [schema](https://github.com/mdn/browser-compat-data/blob/master/schemas/compat-data.schema.json) and read the [schema docs](https://github.com/mdn/browser-compat-data/blob/master/schemas/compat-data-schema.md) to add new files.
* **Fixing existing compat data**: maybe a browser now supports a certain feature. Yay! If you open a PR to fix a browser's data, it would be most helpful if you include a link to a bug report or similar so that we can double-check the good news.
* **Fixing a bug:** we have a list of [issues](https://github.com/mdn/browser-compat-data/issues),
or maybe you found your own.
* **Reviewing a pull request:** there is a list of [PRs](https://github.com/mdn/browser-compat-data/pulls).
Let us know if these look good to you.

## Validating the data
You can use `npm test` to validate data against the schema. You might need to install the devDependencies using `npm install --only=dev`.
The JSON data is validated against the schema using [`ajv`](http://epoberezkin.github.io/ajv/).

### Optional: Validate/cross-reference against web API confluence dashboard
If the feature you're interested is a JavaScript API you can cross-reference data against the [Web API Confluence Dashboard](https://web-confluence.appspot.com/) using the `confluence` npm script. This script will overwrite data in your current working tree according to data from the dashboard.

Examples:

```shell
# Load confluence data for ServiceWorker
npm run confluence -- --interfaces=ServiceWorker

# Fill in missing/ambiguous Firefox data on known interfaces
npm run confluence -- --browsers=firefox --fill-only

# Print documentation on full list of options
npm run confluence -- --help
```

## Test rendering
You can use `npm run render $query $dept $aggregateMode` to output the table HTML as it would be rendered on MDN.
The parameters are the same as the [`{{compat}}` macro](https://github.com/mdn/kumascript/blob/master/macros/Compat.ejs).

Paste the generated HTML into the MDN editor (source mode). You can use a new page, for example: https://developer.mozilla.org/en-US/docs/new and verify if the output looks correct.

## Checklist
Not everything is enforced or validated by the schema. A few things to pay attention to:

* Feature identifiers (the data namespaces, like `css.properties.background`) should make sense and are spelled correctly.
* Nesting of feature identifiers should make sense.
* Notes use correct grammar and spelling. They should be complete sentences ending with a period.
* Browser versions are valid (planned be validated automatically in the future, see [issue 168](https://github.com/mdn/browser-compat-data/issues/168) which tracks adding tests and docs about browser versions).

## Code style

The JSON files should be formatted according to the [.editorconfig](https://github.com/mdn/browser-compat-data/blob/master/.editorconfig) file.

## Licensing

Please note that the compatibility data is made available under the
[CC0 license](https://github.com/mdn/browser-compat-data/blob/master/LICENSE),
so any contributions must be compatible with that license. If you're not sure about that, just ask.

## Getting help

If you need help with this repository or have any questions, contact the MDN team
in the [#mdn](irc://irc.mozilla.org/mdn) IRC channel on irc.mozilla.org or write us on [discourse](https://discourse.mozilla-community.org/c/mdn).
