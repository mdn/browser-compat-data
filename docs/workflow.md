# Issue and pull requests workflow

Or, _How changes are considered, accepted, merged, and published_

## Label usage

Some labels act as special-use flags. Use the following labels according to these guidelines.

### not ready ⛔

| Pulls | Issues | Blocker |
| ----- | ------ | ------- |
| Yes   | Yes    | Yes     |

For issues, this label indicates that the issue cannot be completed right now. For pull requests, the label indicates that the pull request cannot be merged.

Set this label on any issue or PR that cannot proceed without some additional action. If you set this label, then leave a comment that says why it's not ready and what needs to happen for it to be ready.

For example, if a pull request cannot be merged without another issue being resolved first, then set the label and leave a comment linking to the blocking issue.

### needs content update 📝

| Pulls | Issues | Blocker |
| ----- | ------ | ------- |
| Yes   | Yes    | Yes     |

This label indicates that a pull request needs corresponding changes to [mdn/content](https://github.com/mdn/content/).

You must set this label on a pull request when it:

- Removes or renames features that are referenced by page front matter or `{{Compat}}` macro calls
- Removes data that has corresponding content on MDN (for example, `mdn_url` links to a non-404 page)
- Changes anything else you suspect negatively impacts content on MDN (for example, creates confusion on a page that references a feature dropped from BCD)

When in doubt, set the label. Better to find that content changes are unnecessary than to discover they're required after the fact.

Remove this label after a pull request, which makes the required content changes, has been opened. A content change in progress is sufficient to merge compat data changes.

### needs-release-note 📰

| Pulls | Issues | Blocker |
| ----- | ------ | ------- |
| Yes   | No     | Yes     |

This label indicates that a pull request needs a corresponding entry in [`RELEASE_NOTES.md`](../RELEASE_NOTES.md).

You must set this label on a pull request when it:

- Breaks backward compatibility (see [_Semantic versioning policy_](../README.md#semantic-versioning-policy))
- Removes or renames data (for example, removing an irrelevant feature)
- Adds or changes a data guideline or schema document
- Adds, removes, or changes linting and other non-schematic data restrictions
- Does anything else that would trigger a SemVer minor release

You may set this label on a pull request when it changes anything else interesting to consumers. Use your best judgment and leave a comment on the PR to explain.

Remove this label upon committing a release note to a release note pull request (see [_Publishing a new version of `@mdn/browser-compat-data`_](./publishing.md#publishing-a-new-version-of-mdnbrowser-compat-data)).
