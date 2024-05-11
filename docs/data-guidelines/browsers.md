# Data guidelines for browser data

This file contains guidelines that are specific to the browser data.

## Initial versions for browsers

The schema docs list [initial versions](../../schemas/browsers-schema.md#initial-versions) for BCD browsers. These are the earliest possible version numbers allowed to be used.

If the table indicates an initial version of "1" and an information source says a feature was implemented in a (beta) version "0.8", record the initial version number "1" for it. In other words, a lower version number is always elevated to a browser's initial version number.

This guideline was proposed in [#6861](https://github.com/mdn/browser-compat-data/pull/6861).

## Adding new browser versions

When a browser releases a new major or minor version, we will want to add it to our browser data. In some cases, the new browser version may already be defined, and we simply need to mark it as the current version.

To add a new browser release:

1. Open the relevant JSON file within the `browsers/` folder (ex. `browsers/chrome.json` for Google Chrome)
2. In the `browsers.[browser_id].releases` object...
   1. ...add a new entry with the version number as the key, referencing the [schema](../../schemas/browsers-schema.md#releases)
   2. ...update the existing entry if it exists.
3. Set the `status` of the current browser to `"current"`
   - If you are adding a beta browser release, set the `status` to `"beta"`
4. Set the `status` of the previous browser release to `"retired"`
   - If you are adding a beta browser release, skip this step

You should only add releases with major and minor semver bump. See [Choosing a version number](./index.md#choosing-a-version-number) for more details.

### Node.js

Node.js follows a different release cycle than most software. Every even-numbered major release (ex. v14, v16, v18) is considered a Long-Term Support version and receives new features and bug fixes even after the next major version is released. For example, Node.js may release v16.10.0, then v17.0.0, and then v16.11.0 to backport a feature that is also introduced in v17.0.0.

The most recent minor release of an LTS release of Node.js should be marked as `status: "esr"` instead of `status: "current"`; only the Node.js version with the highest version number should be marked as `status: "current"`. For example, if Node.js releases v16.10.0, v17.0.0, and v16.11.0 in that order, v17.0.0 should be marked as `status: "current"`, v16.11.0 as `status: "esr"`, and v16.10.0 as `status: "retired"`.

For Node.js, new versions may be added if:

- The Node.js version includes a V8 engine bump
- It is a major semver bump (ex. v19 -> v20)
- Support has changed for feature tracked in BCD (ex. if Node.js v14.3.0 supports a new Web API builtin, but the V8 engine is the same version)

To add a new Node.js release:

1. Open `browsers/nodejs.json`
2. In the `browsers.nodejs.releases` object, add a new entry with the version number as the key, referencing the [schema](../../schemas/browsers-schema.md#releases)
3. Set the `status` property to...
   - ...`"current"`, if it is the version with the highest semver
   - ...`"esr"`, if it is the latest version within that major version
4. Set the `status` all other versions within that major version to `"retired"`

## Addition of browsers

BCD's [owners](../../GOVERNANCE.md) may choose to adopt a new browser or engine. To add a new browser to BCD, we need evidence of (in decreasing order of importance):

- a compelling downstream-consumer story (e.g., MDN or caniuse express an interest, or someone is planning to do something with the data that might plausibly grow BCD's reach)
- reviewers (e.g., two or more people with interest and ability to test data relating to new and existing releases, or at least one reviewer acting on behalf of the vendor)
- a release process allowing BCD to publish stable release information in a `browsers/` file (containing release notes with version numbers and dates)
- documentation (e.g., how to get and test a feature in that browser, links to resources that might help with it, etc.)

This decision was proposed in [#7238](https://github.com/mdn/browser-compat-data/issues/7238) and adopted in [#7244](https://github.com/mdn/browser-compat-data/pull/7244).

## Removal of browsers

To maintain data quality, BCD's [owners](../../GOVERNANCE.md) may choose to remove a browser or engine from the project. To remove a browser from BCD, we need habitual (six months or more) evidence of (in decreasing order of importance):

- negative/neutral downstream-consumer interest in the browser's data (e.g., MDN and caniuse don't object to removal)
- poor data coverage with negative trends (e.g., our data for the browser covers only a few features, with limited/flat growth in more data being added for it, or few features with real version numbers rather than just `null` or `true`, etc.)
- infrequent community or vendor involvement in issues or PRs relating to the browser
- infrequent new PRs relating to the browser (e.g., weeks or months go by without PRs touching the browser's data)

Removing a browser from BCD does not constitute a ban; browsers may be readmitted under the [Addition of browsers](#addition-of-browsers) guideline.

This decision was proposed in [#7238](https://github.com/mdn/browser-compat-data/issues/7238) and adopted in [#7244](https://github.com/mdn/browser-compat-data/pull/7244).
