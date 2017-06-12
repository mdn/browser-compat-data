We're really happy to accept contributions to the mdn-browser-compat-data repository!
This file lists some general guidelines to help you contributing effectively.

## Types of contribution

There are many ways you can help improve this repository! For example:

* **Adding new compat data**: familiarize yourself with the [schema](https://github.com/mdn/browser-compat-data/blob/master/compat-data.schema.json) and read the [schema docs](https://github.com/mdn/browser-compat-data/blob/master/compat-data-schema.md) to add new files.
* **Fixing existing compat data**: maybe a browser now supports a certain feature. Yay! If you open a PR to fix a browser's data, it would be most helpful if you include a link to a bug report or similar so that we can double-check the good news.
* **Fixing a bug:** we have a list of [issues](https://github.com/mdn/browser-compat-data/issues),
or maybe you found your own.
* **Reviewing a pull request:** there is a list of [PRs](https://github.com/mdn/browser-compat-data/pulls).
Let us know if these look good to you.

## Validating the data
You can use [`ajv`](http://epoberezkin.github.io/ajv/) to validate data against the schema. For example, to validate the css folder:

```js
ajv validate -s compat-data.schema.json -d "css/**/*.json"
```
We are planning to add proper test runner soon. Stay tuned!

## Checklist
Not everything is enforced or validated by the schema. A few things to pay attention to:

* Feature identifiers (the data namespaces, like `css.properties.background`) should make sense and are spelled correctly.
* Distinction between [features and sub-features](https://github.com/mdn/browser-compat-data/blob/master/compat-data-schema.md#features-and-sub-features) makes sense.
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
