# Label usage

Some labels act as special-use flags. Use the following labels according to these guidelines.

## not ready

| Pulls | Issues | Blocker |
| ----- | ------ | ------- |
| Yes   | Yes    | Yes     |

For issues, this label indicates that the issue cannot be completed right now. For pull requests, the label indicates that the pull request cannot be merged. Effectively the same as marking a pull request as a draft.

Set this label on any issue or PR that cannot proceed without some additional action. If you set this label, then leave a comment that says why it's not ready and what needs to happen for it to be ready.

For example, if a pull request cannot be merged without another issue being resolved first, then set the label and leave a comment linking to the blocking issue.

## needs content update

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

## semver-minor-bump

| Pulls | Issues | Blocker |
| ----- | ------ | ------- |
| Yes   | No     | No      |

This label indicates that a pull request needs a corresponding entry in [`RELEASE_NOTES.md`](../RELEASE_NOTES.md), and that the next BCD release that includes this change should have a minor semver bump.

Set this label on a pull request when it:

- Adds a new feature to the schema
- Adds a new major category
- Performs a migration that does not break backwards compatibility (see [_Semantic versioning policy_](../README.md#semantic-versioning-policy))
- Does anything else that would trigger a semver minor release

Do not set this label on a pull request when it:

- Only adds or removes a specific BCD feature
- Only updates compatibility data
- Performs anything that would result in a major semver bump (use the next label)

Remove this label upon committing a release note to a release note pull request (see [_Publishing a new version of `@mdn/browser-compat-data`_](./publishing.md#publishing-a-new-version-of-mdnbrowser-compat-data)).

## semver-major-bump

| Pulls | Issues | Blocker |
| ----- | ------ | ------- |
| Yes   | No     | Yes     |

This label indicates that a pull request needs a corresponding entry in [`RELEASE_NOTES.md`](../RELEASE_NOTES.md), and that the next BCD release that includes this change should have a _major_ semver bump.

Set this label on a pull request when it:

- Breaks backward compatibility (see [_Semantic versioning policy_](../README.md#semantic-versioning-policy))
- Does anything else that would trigger a semver major release

Do not set this label on a pull request when it:

- Only adds a new, backwards-compatible feature
- Only adds or removes a specific BCD feature
- Only updates compatibility data
- Only performs a migration that does not break backwards compatibility

Remove this label upon committing a release note to a release note pull request (see [_Publishing a new version of `@mdn/browser-compat-data`_](./publishing.md#publishing-a-new-version-of-mdnbrowser-compat-data)).
