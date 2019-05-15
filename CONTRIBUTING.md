## Generating data using the Web API Confluence Dashboard
If the feature you're interested in is a JavaScript API, you can cross-reference data against [Web API Confluence](https://web-confluence.appspot.com/) using the `confluence` command. This command overwrites data in your current working tree according to data from the dashboard. See [Using Confluence](USING-CONFLUENCE.md) for instructions.

## Publishing a new package version

Regularly, a new release of [mdn-browser-compat-data](https://www.npmjs.com/package/mdn-browser-compat-data) is created by MDN staff and will then be [deployed to the MDN site](https://github.com/mdn/browser-compat-data#browser-compatibility-tables-on-mdn). Usually this is done every Thursday (MDN never deploys to production on Fridays). Releases should be coordinated with the project owner [Florian Scholz](https://github.com/Elchi3), but anyone with owner permissions on the mdn/browser-compat-data repository has the ability to run the following steps which will create a new package version:

 1. Figure out the new version number by looking at [past releases](https://github.com/mdn/browser-compat-data/releases). The project is in alpha, so we're using only patch versions. Lets assume the next version should be `0.0.43`.
 2. On your updated and clean master branch, run `npm version patch -m "43rd alpha version"`. Locally, this updates `package.json`, creates a new commit, and creates a new release tag (see also the docs for [npm version](https://docs.npmjs.com/cli/version)).
 3. Push the commit to master: `git push origin master`.
 4. Check if the commit passes fine on [Travis CI](https://travis-ci.org/mdn/browser-compat-data).
 5. If Travis is alright, push the git tag as well: `git push origin v0.0.43`.
 This step will trigger Travis to publish to npm automatically (see our [.travis.yml file](https://github.com/mdn/browser-compat-data/blob/master/.travis.yml)).
 6. Check [Travis CI](https://travis-ci.org/mdn/browser-compat-data) again for the v0.0.43 build and also check [mdn-browser-compat-data on npm](https://www.npmjs.com/package/mdn-browser-compat-data) to see if `0.0.43` shows up correctly once Travis has finished its work.
 7. Notify the [#mdndev](irc://irc.mozilla.org/mdndev) IRC channel on irc.mozilla.org about the new release and coordinate with jwhitlock or rjohnson a deployment of the new package to the MDN site.
 8. Create a new [release on GitHub](https://github.com/mdn/browser-compat-data/releases) by running `npm run release-notes -- v0.0.43`).

## Licensing

Please note that the compatibility data is made available under the
[CC0 license](https://github.com/mdn/browser-compat-data/blob/master/LICENSE),
so any contributions must be compatible with that license. If you're not sure about that, just ask.

## Getting help

If you need help with this repository or have any questions, contact the MDN team
in the [#mdn](irc://irc.mozilla.org/mdn) IRC channel on irc.mozilla.org or write us on [discourse](https://discourse.mozilla-community.org/c/mdn).
