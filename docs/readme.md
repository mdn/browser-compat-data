# Contributing to browser-compat-data

We're really happy to accept contributions to the mdn-browser-compat-data repository!

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
