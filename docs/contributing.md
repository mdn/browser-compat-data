# Contributing to browser-compat-data

First of all, thank you very much for your interest in contributing to BCD! We're really happy to accept contributions from everyone, whether you're a browser engineer, a spec writer or a web developer. This document contains the information you need to get started.

## Table of contents

1. [Before you begin](#before-you-begin)
   1. [Guidelines](#guidelines)
   1. [Prerequisites](#prerequisites)
1. [Ways to contribute](#ways-to-contribute)
1. [Finding browser version numbers for features](#finding-browser-version-numbers-for-features)
1. [Updating compatibility tables on MDN](#updating-compatibility-tables-on-mdn)
1. [Opening issues and pull requests](#opening-issues-and-pull-requests)
   1. [Optional: Generating data using the Web API Confluence Dashboard](#optional-generating-data-using-the-web-api-confluence-dashboard)
   1. [Optional: Generating data using the mdn-bcd-collector project](#optional-generating-data-using-the-mdn-bcd-collector-project)
   1. [Optional: Generating data by mirroring](#optional-generating-data-by-mirroring)
1. [Getting help](#getting-help)

## Before you begin

The BCD project welcomes contributors of all kinds, however there are a few requirements that all contributors must follow.

### Guidelines

The project requires that all contributors follow [Mozilla's code of conduct and etiquette guidelines](/CODE_OF_CONDUCT.md). Violations of these guidelines may result in exclusion from all MDN Web Docs projects.

This project has [a formal governance document](/GOVERNANCE.md), which describes how various types of contributors work within the project and how decisions are made.

The repository is licensed under the [Creative Commons CC0 Public Domain Dedication](/LICENSE) license. Any contributions must be compatible with its terms. If you are contributing for a company or other organization, please ask your employer.

### Prerequisites

To contribute to this project, you must have all of the following:

- A GitHub account
- A basic understanding of [JSON](https://www.json.org/json-en.html)
- A basic understanding of the GitHub UI or Git version control
- Experience with web development (preferably 3+ years)

### Helpful resources

While contributing to BCD, there are a number of tools and other resources we regularly use. Some of them are the following:

- [MDN Web Docs](https://developer.mozilla.org): yes, we use our own documentation regularly to obtain code examples and determine what a feature is meant to do!
- [mdn-bcd-collector](https://mdn-bcd-collector.appspot.com): this tool is designed to test feature compatibility in browsers, and its reports are used to [update our own data](#optional-generating-data-using-the-mdn-bcd-collector-project).
- [BrowserStack](https://www.browserstack.com), [SauceLabs](https://www.saucelabs.com), [LambdaTest](https://www.lambdatest.com/): these tools offer cloud services to test websites in any browser with virtually any version, which allows us to determine the exact version a feature has been added in. We are very grateful to each and every one of these services for providing us with a free plan.

## Ways to contribute

There are many ways you can help improve this repository! For example:

- **Fix a bug:** we have a list of [issues](https://github.com/mdn/browser-compat-data/issues), or maybe you found your own. We recommend checking out issues labeled as ["good first issue"](https://github.com/mdn/browser-compat-data/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue+%3A100%3A%22) or ["help wanted"](https://github.com/mdn/browser-compat-data/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted+%3Asos%3A%22) first.
- **Fix existing compat data**: maybe a browser now supports a certain feature. Yay! If you open a PR to fix a browser's data, it would be most helpful if you include a link to a bug report or similar so that we can double-check the good news.
- **Add new compat data**: familiarize yourself with the [compat data schema](../schemas/compat-data-schema.md) and [data guidelines](data-guidelines.md) to add new features.
- **Review a pull request:** there is a list of [PRs](https://github.com/mdn/browser-compat-data/pulls). Let us know if these look good to you.

## Finding browser version numbers for features

When adding data for a particular feature, you'll often need to find which version of each browser the feature first shipped in. For how-to guidance which will help you do that, see [Matching web features to browser release version numbers](https://developer.mozilla.org/docs/MDN/Contribute/Processes/Matching_features_to_browser_version).

## Updating compatibility tables on MDN

Once a pull request is merged to update BCD, it takes a week or two for a new version of the repository to be released, and then a few days for it to launch on MDN. The process is:

1. A pull request is reviewed and merged to `main`.
2. Project owners publish a new release of [`@mdn/browser-compat-data`](https://www.npmjs.com/package/@mdn/browser-compat-data).
   See [Publishing a new version of `@mdn/browser-compat-data`](publishing.md) for details.
3. MDN staff build and deploy a new image of [Kumascript](https://github.com/mdn/yari/tree/main/kumascript), which includes the BCD release, to production.
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

### Optional: Generating data using the mdn-bcd-collector project

If the feature you're interested in is an API, CSS or JavaScript feature, you can cross-reference data against [mdn-bcd-collector](https://mdn-bcd-collector.appspot.com/). See the project's guide on [updating BCD using the results](https://github.com/foolip/mdn-bcd-collector#updating-bcd-using-the-results) for instructions.

### Optional: Generating data by mirroring

Many browsers within BCD can be derived from other browsers given they share the same engine, for example Opera derives from Chrome, and Firefox Android derives from Firefox. To help cut down time working on copying values between browsers, contributors may specify a special value in the data to automatically mirror the data from their upstream counterparts. See the [schema documentation](../schemas/compat-data-schema.md#mirroring-data) for more info.

Note: originally, this functionality used to be provided as an executable script. However, because the script had to be run manually, this meant that mirrored data would become stale rapidly. It was proposed in [#15083](https://github.com/mdn/browser-compat-data/issues/15083) to move the mirroring into a build step to reduce maintenance time.

## Getting help

If you need help with this repository or have any questions, contact the MDN team on [chat.mozilla.org#mdn](https://chat.mozilla.org/#/room/#mdn:mozilla.org) or write to us on [Discourse](https://discourse.mozilla-community.org/c/mdn).
