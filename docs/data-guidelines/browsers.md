# Data guidelines for browser data

This file contains guidelines that are specific to the browser data.

## Initial versions for browsers

The schema docs list [initial versions](../../schemas/browsers-schema.md#initial-versions) for BCD browsers. These are the earliest possible version numbers allowed to be used.

If the table indicates an initial version of "1" and an information source says a feature was implemented in a (beta) version "0.8", record the initial version number "1" for it. In other words, a lower version number is always elevated to a browser's initial version number.

This guideline was proposed in [#6861](https://github.com/mdn/browser-compat-data/pull/6861).

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
