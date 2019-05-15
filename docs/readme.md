# Contributing to browser-compat-data

We're really happy to accept contributions to the mdn-browser-compat-data repository!

## Table of contents

1. [Before you begin](#before-you-begin)
2. [Ways to contribute](#ways-to-contribute)
3. [Updating compatibility tables on MDN](#updating-compatibility-tables-on-mdn)
4. [Opening issues and pull requests](#opening-issues-and-pull-requests)
   1. [Generating data using the Web API Confluence Dashboard](#generating-data-using-the-web-api-confluence-dashboard)
5. [Getting help](#getting-help)

## Before you begin

Please note that the compatibility data is made available under the
[CC0 license](https://github.com/mdn/browser-compat-data/blob/master/LICENSE),
so any contributions must be compatible with that license. If you're not sure about that, just ask.

## Ways to contribute

There are many ways you can help improve this repository! For example:

* **Add new compat data**: familiarize yourself with the [schema](https://github.com/mdn/browser-compat-data/blob/master/schemas/compat-data.schema.json) and read the [schema docs](https://github.com/mdn/browser-compat-data/blob/master/schemas/compat-data-schema.md) to add new files.
* **Fix existing compat data**: maybe a browser now supports a certain feature. Yay! If you open a PR to fix a browser's data, it would be most helpful if you include a link to a bug report or similar so that we can double-check the good news.
* **Fix a bug:** we have a list of [issues](https://github.com/mdn/browser-compat-data/issues),
or maybe you found your own.
* **Review a pull request:** there is a list of [PRs](https://github.com/mdn/browser-compat-data/pulls).
Let us know if these look good to you.

## Updating compatibility tables on MDN

It takes 1-2 weeks for changes in this data to be reflected in MDN's browser compatibility tables. The process is:

1. A pull request is reviewed and merged to master.
2. A new release of [mdn-browser-compat-data](https://www.npmjs.com/package/mdn-browser-compat-data) is created by MDN staff. This happens every 4-14 days.
3. A new image of [Kumascript](https://github.com/mdn/kumascript), which includes the BCD release, is built and deployed to production. This happens within a day of the npm package release.
4. The MDN page using the data is regenerated. For newly converted pages, a staff member switches to the [{{Compat}}](https://github.com/mdn/kumascript/blob/master/macros/Compat.ejs) macro, and re-checks the conversion. For updates to converted pages, a logged-in MDN user [force-refreshes the page](https://en.wikipedia.org/wiki/Wikipedia:Bypass_your_cache#Bypassing_cache) to regenerate it.

## Opening issues and pull requests

Before submitting your pull request, [validate your new data against the schema](testing.md).

Not everything is enforced or validated by the schema. A few things to pay attention to:

* Feature identifiers (the data namespaces, like `css.properties.background`) should make sense and are spelled correctly.
* Nesting of feature identifiers should make sense.
* Notes use correct grammar and spelling. They should be complete sentences ending with a period.

### Generating data using the Web API Confluence Dashboard

If the feature you're interested in is a JavaScript API, you can cross-reference data against [Web API Confluence](https://web-confluence.appspot.com/) using the `confluence` command. This command overwrites data in your current working tree according to data from the dashboard. See [Using Confluence](USING-CONFLUENCE.md) for instructions.

## Getting help

If you need help with this repository or have any questions, contact the MDN team
in the [#mdn](irc://irc.mozilla.org/mdn) IRC channel on irc.mozilla.org or write us on [discourse](https://discourse.mozilla-community.org/c/mdn).
