# Publishing a new version of `mdn-browser-compat-data`

[Project owners](/GOVERNANCE.md#owners) publish new releases of [mdn-browser-compat-data](https://www.npmjs.com/package/mdn-browser-compat-data) on npm.
MDN staff [deploy the package to the MDN site](contributing.md#updating-compatibility-tables-on-mdn).
Usually, this happens every Thursday (MDN never deploys to production on Fridays).

Any owner can complete the following steps to publish a new version, but please coordinate releases with [Florian Scholz](https://github.com/Elchi3).

To create and publish a new version of `mdn-browser-compat-data`:

1. Figure out the new version number by looking at [past releases](https://github.com/mdn/browser-compat-data/releases). If the release is a non-breaking and data-only update, we're using patch versions. Lets assume that's the case and the next version should be `1.0.3`.
2. On your updated and clean master branch, run `npm version patch -m "Patch release containing data or non-breaking updates only"`. Locally, this updates `package.json`, creates a new commit, and creates a new release tag (see also the docs for [npm version](https://docs.npmjs.com/cli/version)).
3. Push the commit to `master`: `git push origin master`.
4. Check if the commit passes fine on [Travis CI](https://travis-ci.org/mdn/browser-compat-data).
5. If Travis is alright, push the git tag as well: `git push origin v1.0.3`.
   This step will trigger Travis to publish to npm automatically (see our [.travis.yml file](https://github.com/mdn/browser-compat-data/blob/master/.travis.yml)).
6. Check [Travis CI](https://travis-ci.org/mdn/browser-compat-data) again for the v1.0.3 build and also check [mdn-browser-compat-data on npm](https://www.npmjs.com/package/mdn-browser-compat-data) to see if `1.0.3` shows up correctly once Travis has finished its work.
7. Notify the #mdn-dev IRC channel on Mozilla Slack about the new release.
8. Create a new [release on GitHub](https://github.com/mdn/browser-compat-data/releases) by running `npm run release-notes -- v1.0.3`).
9. Update tracking issues ([#6369](https://github.com/mdn/browser-compat-data/issues/6369) for every release, [#3555](https://github.com/mdn/browser-compat-data/issues/3555) if there is significant progress) by running `npm run stats`.
