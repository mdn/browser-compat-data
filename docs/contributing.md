# Contributing to browser-compat-data

First of all, thank you very much for your interest in contributing to BCD! We're really happy to accept contributions from everyone, whether you're a browser engineer, a spec writer or a web developer. This document contains the information you need to get started.

## Table of contents

1. [Before you begin](#before-you-begin)
   1. [Guidelines](#guidelines)
   1. [Prerequisites](#prerequisites)
1. [Helpful resources](#helpful-resources)
1. [Ways to contribute](#ways-to-contribute)
   1. [Updating the compat data](#updating-the-compat-data)
   1. [Finding browser version numbers for features](#finding-browser-version-numbers-for-features)
1. [Opening pull requests](#opening-pull-requests)
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

#### Required (Basic Changes)

To contribute to this project, you must have all of the following:

- A GitHub account
- A basic understanding of [JSON](https://www.json.org/json-en.html)
- A basic understanding of the GitHub UI or Git version control
- Experience with web development (preferably 3+ years)
- A willingness to search deep through articles, documentation, forums and social media posts to find answers to questions

#### Required (Substantial Changes)

Most simple changes can be done within the GitHub website. For more substantial changes, you will need to clone the repository locally, and as such will need the following:

- A familiarity with your terminal and Git (for example, you know how to switch directories, clone a repository, and run scripts)
- A text editor, preferably one that supports [EditorConfig](https://editorconfig.org/)
- Node.js, with [an Active LTS or more recent release](https://nodejs.org/en/download/)

#### Optional

At times, you may need to search through browser source code. To do so, you should have the following:

- A basic understanding of C++ (or other C-based language)
- A basic understanding of WebIDL (easy to pick up)

### Helpful resources

While contributing to BCD, there are a number of tools and other resources we regularly use. Some of them are the following:

#### General

- [MDN Web Docs](https://developer.mozilla.org): yes, we use our own documentation regularly to obtain code examples and determine what a feature is meant to do!
- [mdn-bcd-collector](https://mdn-bcd-collector.gooborg.com): this tool is designed to test feature compatibility in browsers, and its reports are used to [update our own data](#optional-generating-data-using-the-mdn-bcd-collector-project).
- [BrowserStack](https://www.browserstack.com), [SauceLabs](https://www.saucelabs.com), [LambdaTest](https://www.lambdatest.com/): these tools offer cloud services to test websites in any browser with virtually any version, which allows us to determine the exact version a feature has been added in. We are very grateful to each and every one of these services for providing us with open source plans.

#### Chromium

These resources are helpful for updating Chromium-based browsers, including Chrome, Edge (79+), Opera, Quest, Samsung Internet, WebView and more.

- [Chrome Platform Status](https://chromestatus.com/features): A list of features that have been added or are planned to be added in Chrome.
- [Chromium Bugs](https://bugs.chromium.org/p/chromium/issues/list): The bug tracker for the Chromium open source project.
- [Chromium Code Search](https://source.chromium.org/chromium): Source code search for Chromium source code. Useful to find specific behavior changes that are hard to test in the browser.
- [Chromium Dash](https://chromiumdash.appspot.com/): A dashboard for Chromium data. Useful to determine which Chromium version a commit was released in, and for release data.
- [`not-webview-exposed.txt`](https://source.chromium.org/chromium/chromium/src/+/master:android_webview/tools/system_webview_shell/test/data/webexposed/not-webview-exposed.txt): A list of interfaces and interface members that are not exposed on WebView Android.

#### Firefox

- [Firefox Releases](https://www.mozilla.org/en-US/firefox/releases/): A list of release notes for different versions of Firefox.
- [Bugzilla](https://bugzil.la): The bug tracker for Firefox.
- [Searchfox](https://searchfox.org/): Source code search for Firefox source code. Useful to find specific behavior changes that are hard to test in the browser, and to determine which Firefox version the change was included in.

#### Safari

- [Safari Release Notes](https://developer.apple.com/documentation/safari-release-notes): A list of release notes for different versions of Safari.
- [WebKit Bugzilla](https://bugs.webkit.org/): The bug tracker for Safari/WebKit.
- [WebKit Repo](https://github.com/WebKit/WebKit): The source code repository for WebKit, the engine for Safari. Useful to find specific behavior changes that are hard to test in the browser.
- [Backported Releases List](issue-triage-checklist.md#backported-releases): A list of Safari releases that were backports of newer versions and should be ignored.

#### Edge

- [New Release Notes](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-relnote-stable-channel): A list of release notes for latest Microsoft Edge Stable Channel.
- [Archived Release Notes](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-relnote-stable-channel): A list of archived release notes for Microsoft Edge Stable Channel.

## Ways to contribute

There are many ways you can help improve this repository! For example:

- **Fix a bug:** we have a list of [issues](https://github.com/mdn/browser-compat-data/issues), or maybe you found your own. We recommend checking out issues labeled as ["good first issue"](https://github.com/mdn/browser-compat-data/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue+%3A100%3A%22) or ["help wanted"](https://github.com/mdn/browser-compat-data/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted+%3Asos%3A%22) first.
- **Fix existing compat data**: maybe a browser now supports a certain feature. Yay! If you open a PR to fix a browser's data, it would be most helpful if you include a link to a bug report or similar so that we can double-check the good news.
- **Add new compat data**: familiarize yourself with the [compat data schema](../schemas/compat-data-schema.md) and [data guidelines](data-guidelines/index.md) to add new features.
- **Review a pull request:** there is a list of [PRs](https://github.com/mdn/browser-compat-data/pulls). Let us know if these look good to you.

### Updating the compat data

If you're going to submit a pull request modifying the compat data, we highly recommend reading the [compat data schema](../schemas/compat-data-schema.md) document for a rundown of the compatibility data structure.

### Finding browser version numbers for features

When adding data for a particular feature, you'll often need to find which version of each browser the feature first shipped in. For how-to guidance which will help you do that, see [Matching web features to browser release version numbers](./matching-browser-releases/index.md).

## Opening pull requests

Before submitting your pull request, [validate your new data against the schema](testing.md).

Not everything is enforced or validated by the schema. A few things to pay attention to:

- Feature identifiers (the data namespaces, like `css.properties.background`) should make sense and are spelled correctly.
- Nesting of feature identifiers should make sense.
- Notes use correct grammar and spelling. They should be complete sentences ending with a period.

### Optional: Generating data using the mdn-bcd-collector project

If the feature you're interested in is an API, CSS or JavaScript feature, you can cross-reference data against [mdn-bcd-collector](https://mdn-bcd-collector.gooborg.com/). See the project's guide on [updating BCD using the results](https://mdn-bcd-collector.gooborg.com/docs/update-bcd.md) for instructions.

### Optional: Generating data by mirroring

Many browsers within BCD can be derived from other browsers given they share the same engine, for example Opera derives from Chrome, and Firefox Android derives from Firefox. To help cut down time working on copying values between browsers, contributors may specify a special value in the data to automatically mirror the data from their upstream counterparts. See the [schema documentation](../schemas/compat-data-schema.md#mirroring-data) for more info.

Note: originally, this functionality used to be provided as an executable script. However, because the script had to be run manually, this meant that mirrored data would become stale rapidly. It was proposed in [#15083](https://github.com/mdn/browser-compat-data/issues/15083) to move the mirroring into a build step to reduce maintenance time.

## Getting help

If you need help with this repository or have any questions, first check the [FAQ](faq.md) to see if your question has been answered. If your question is not listed or you still need help, contact the MDN team on [chat.mozilla.org#mdn](https://chat.mozilla.org/#/room/#mdn:mozilla.org) or write to us on [Discourse](https://discourse.mozilla-community.org/c/mdn).
