# BCD FAQ

This document describes frequently asked questions and their answers. If your question is not listed or you still need help, contact the MDN team on [chat.mozilla.org#mdn](https://chat.mozilla.org/#/room/#mdn:mozilla.org) or write to us on [Discourse](https://discourse.mozilla-community.org/c/mdn).

## The tables on MDN haven't updated yet!

Once a pull request is merged to update BCD, it takes a week or two for a new version of the repository to be released, and then a few days for it to launch on MDN. The process is:

1. A pull request is reviewed and merged to `main`.
2. Project owners publish a new release of [`@mdn/browser-compat-data`](https://www.npmjs.com/package/@mdn/browser-compat-data).
   See [Publishing a new version of `@mdn/browser-compat-data`](publishing.md) for details.
3. MDN staff merge a pull request that updates the BCD version in [Yari](https://github.com/mdn/yari), the MDN engine. This typically happens within a day of the release of the npm package.
4. Tables are then generated on MDN Web Docs:

   - Existing compatibility tables will automatically update.
   - For new pages, or for pages without existing compatibility tables, you must add the `{{Compat}}` macro and the `browser-compat` front-matter key to the page.
     For instructions, see [Inserting the data into MDN pages](https://developer.mozilla.org/en-US/docs/MDN/Structures/Compatibility_tables#inserting_the_data_into_mdn_pages).

## I opened a PR but it hasn't been reviewed yet.

Sorry for the wait. Many outside factors, such as our other projects, may grab our attention and slow BCD PR reviews. If it has been more than a month and there has been no repsonse from a reviewer, please feel free to ping one of us and request a review. You can find a list of peers and owners in the [governance doc](../GOVERNANCE.md).

## My PR was closed due to inactivity, may I reopen it?

Of course! If we have requested more information from you (the pull request author) and do not hear back from you in two months, we will close the PR. You are more than welcome to reopen the PR and address the feedback at any time.

## If another PR is idle, may I take over it?

If the PR has been closed due to inactivity, you may open a new PR to supersede it. Please do not open a new PR if the existing PR has not been closed.
