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
* **Publishing a new package (staff only):** A new npm package should be published regularly, [see below](#publishing-a-new-package-version) for details.

## Validating the data
You can use `npm test` to validate data against the schema. You might need to install the devDependencies using `npm install --only=dev`.
The JSON data is validated against the schema using [`ajv`](http://epoberezkin.github.io/ajv/).

### Optional: Validate/cross-reference against Web API Confluence Dashboard
If the feature you're interested in is a JavaScript API, you can cross-reference data against the [Web API Confluence Dashboard](https://web-confluence.appspot.com/) using the `confluence` npm script. This script will overwrite data in your current working tree according to data from the dashboard.

**Note: Web API Confluence Dashboard data should not be regarded as perfect knowledge of JavaScript APIs.**
The dashboard derives its data from the JavaScript object graph on a sample page loaded in each browser. For example, an own property named `URL` on `Document.prototype` implies the "`Document` interface has a member named `URL`. For various reasons, not all APIs are exposed on JavaScript prototypes, even when the API is available in the browser.

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

## Code style

The JSON files should be formatted according to the [.editorconfig](https://github.com/mdn/browser-compat-data/blob/master/.editorconfig) file.


## Publishing a new package version

Regularly, a new release of [mdn-browser-compat-data](https://www.npmjs.com/package/mdn-browser-compat-data) is created by MDN staff and will then be [deployed to the MDN site](https://github.com/mdn/browser-compat-data#browser-compatibility-tables-on-mdn). Usually this is done every Thursday (MDN never deploys to production on Fridays). Releases should be coordinated with the project owner [Florian Scholz](https://github.com/Elchi3), but anyone with merge permissions on the mdn/browser-compat-data repository has the ability to run the following steps which will create a new package version:

 1. Figure out the new version number by looking at [past releases](https://github.com/mdn/browser-compat-data/releases). The project is in alpha, so we're using only patch versions. Lets assume the next version should be `0.0.43`.
 2. On your updated and clean master branch, run `npm version patch -m "43rd alpha version"`. Locally, this updates `package.json`, creates a new commit, and creates a new release tag (see also the docs for [npm version](https://docs.npmjs.com/cli/version)).
 3. Push the commit to master: `git push origin master`.
 4. Check if the commit passes fine on [Travis CI](https://travis-ci.org/mdn/browser-compat-data).
 5. If Travis is alright, push the git tag as well: `git push origin v0.0.43`.
 This step will trigger Travis to publish to npm automatically (see our [.travis.yml file](https://github.com/mdn/browser-compat-data/blob/master/.travis.yml)).
 6. Check [Travis CI](https://travis-ci.org/mdn/browser-compat-data) again for the v0.0.43 build and also check [mdn-browser-compat-data on npm](https://www.npmjs.com/package/mdn-browser-compat-data) to see if `0.0.43` shows up correctly once Travis has finished its work.
 7. Notify the [#mdndev](irc://irc.mozilla.org/mdndev) IRC channel on irc.mozilla.org about the new release and coordinate with jwhitlock or rjohnson a deployment of the new package to the MDN site.

## Licensing

Please note that the compatibility data is made available under the
[CC0 license](https://github.com/mdn/browser-compat-data/blob/master/LICENSE),
so any contributions must be compatible with that license. If you're not sure about that, just ask.

## Getting help

If you need help with this repository or have any questions, contact the MDN team
in the [#mdn](irc://irc.mozilla.org/mdn) IRC channel on irc.mozilla.org or write us on [discourse](https://discourse.mozilla-community.org/c/mdn).
