# Label usage

Use labels to classify issues and pull requests, indicate the next action, and flag changes that need coordination. The [repository label list](https://github.com/mdn/browser-compat-data/labels) includes all available labels.

## Triage and investigation

| Label                  | Usage                                                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `needs triage`         | An issue needs confirmation and classification. Added automatically when an issue is opened, reopened, or transferred into the repository; remove it after triage. |
| `info needed`          | More information is needed to review or act on an issue or pull request. Explain what is missing in a comment.                                                     |
| `needs research`       | Manual research is needed to identify browser support, usually when BCD collector tests do not apply.                                                              |
| `needs collector test` | A custom BCD collector test is needed to determine support and keep the compatibility data maintained automatically.                                               |
| `needs browser bug`    | The behavior needs to be reported in the browser's bug tracker so its evolution can be tracked. Check for an existing bug before filing a new report.              |
| `needs expert input`   | Input from an expert, such as a browser implementer, is needed.                                                                                                    |
| `meeting agenda`       | An issue or pull request needs discussion in the weekly BCD project meeting.                                                                                       |
| `early features`       | Support for a feature is exclusively behind a flag or preference.                                                                                                  |

When requesting information, research, or a related change, leave a comment describing the next action. Remove the corresponding label when that action is complete.

### Browser scope

Use `browser:*` labels to classify issues by the affected browser or engine. Multiple labels can apply when an issue specifically concerns multiple browsers, such as Chrome and Safari:

- `browser:chrome`, `browser:firefox`, and `browser:safari` include their mobile variants when support matches. `browser:chrome` also includes Edge when support matches Chrome.
- Use `browser:chrome_android`, `browser:firefox_android`, or `browser:safari_ios` when mobile support diverges from desktop support, and `browser:edge` when Edge diverges from Chrome.
- Use `browser:bun`, `browser:deno`, `browser:nodejs`, `browser:opera`, `browser:samsunginternet_android`, `browser:webview_android`, or `browser:webview_ios` for issues specifically about those browsers or runtimes. `browser:opera` includes Opera for Android.
- Use `browser:multiple` for issues specifically affecting more than two browsers, or multiple browsers in general. This distinguishes them from issues without a browser label that may still benefit from browser classification.

### Priority

| Label | Priority                                                                                                                                                                                                                                                           |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `p0`  | Critical issues, such as failures blocking the BCD release workflow. Must be addressed within days.                                                                                                                                                                |
| `p1`  | Other very important issues that do not block the BCD release workflow, such as browser release updater failures with temporary workarounds (manual pull requests), or maintenance workflow failures (syncing web feature tags). Should be addressed within weeks. |
| `p2`  | Reserved for recently introduced data errors with significant impact, such as causing an incorrect Baseline status downstream. Community pull requests are highly encouraged.                                                                                      |
| `p3`  | Data issues considered more impactful than others, such as those affecting prominent features. Community pull requests are encouraged.                                                                                                                             |
| `p4`  | Data issues considered less impactful than others, such as those affecting niche features. Community pull requests are accepted.                                                                                                                                   |

## Blocked or deferred work

| Label or state     | Usage                                                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `blocked`          | An issue or pull request cannot proceed because of a blocker.                                                                                                       |
| `on hold`          | Work is temporarily paused, for example because the author has no capacity to continue. It is not necessarily blocked by a dependency.                              |
| `not ready`        | A pull request is not ready to merge because it awaits a decision, another pull request, or a prerequisite action. For work still being prepared, use draft status. |
| Draft pull request | A pull request is not ready for review or merging.                                                                                                                  |

For `blocked`, `on hold`, and `not ready`, leave a comment explaining the blocker, prerequisite, or reason for pausing. Link to prerequisite issues or pull requests where applicable. Remove the label when the blocker or prerequisite is resolved, or paused work resumes.

Use draft status while preparing a pull request, and mark it ready for review when it is ready. A draft can also carry `blocked` to track a dependency or `on hold` to indicate that work is paused.

## Categories and automated labels

The [pull request labeler configuration](../.github/labeler.yml) assigns and synchronizes labels based on changed file paths. Issues can use the same category labels; the [issue labeler](../.github/issue-regex-labeler.yml) adds data categories based on feature paths and documentation URLs in issue bodies.

| Label                            | Scope and automation                                                                                                                                                                                                                                                 |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data:*`                         | Compatibility data categories: `api`, `css`, `html`, `http`, `js`, `manifests`, `mathml`, `mediatypes`, `svg`, `wasm`, `webdriver`, and `webext`. `data:browsers` covers browser versions and release metadata. Applied automatically to pull requests by directory. |
| `infra`                          | Repository infrastructure and tooling. Applied automatically to pull requests touching matching code, configuration, and infrastructure paths.                                                                                                                       |
| `docs`                           | Project documentation. Applied automatically to pull requests changing Markdown files.                                                                                                                                                                               |
| `docs:guidelines`                | Data guidelines.                                                                                                                                                                                                                                                     |
| `linter`, `scripts`, `schema`    | Linters and tests, scripts, or schemas, respectively. Applied automatically to pull requests changing the corresponding directories.                                                                                                                                 |
| `bulk_update`                    | Mass data updates or related scripts and linters. Applied automatically to pull requests changing migration scripts.                                                                                                                                                 |
| `dependencies`                   | Dependency updates. The path labeler applies this to pull requests changing `package-lock.json`.                                                                                                                                                                     |
| `javascript`, `github_actions`   | JavaScript or GitHub Actions updates, including dependency pull requests from Dependabot. `javascript` is distinct from the compatibility data category `data:js`.                                                                                                   |
| `size:*`                         | Pull request size, assigned automatically by the [labeler workflow](../.github/workflows/labeler.yml): `size:xs` (0-6 changed lines), `size:s` (7-24), `size:m` (25-100), `size:l` (101-1000), and `size:xl` (more than 1000). Release pull requests are excluded.   |
| `merge conflicts :construction:` | A pull request needs to merge the latest `main` to resolve a conflict or another issue.                                                                                                                                                                              |

### Other common issue labels

| Label                             | Usage                                                                                                                                                                                        |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bug`                             | A confirmed repository bug, such as a linter bug, rather than a browser implementation bug.                                                                                                  |
| `enhancement`                     | A feature request. The enhancement issue template adds this label automatically.                                                                                                             |
| `question`                        | A question or problem requiring discussion.                                                                                                                                                  |
| `help wanted`, `good first issue` | Work open to community contributions, or suitable for new contributors, respectively.                                                                                                        |
| `idle`                            | An issue or pull request with no recent activity.                                                                                                                                            |
| `duplicate`                       | An issue or pull request closed in favor of another. Link to the original item.                                                                                                              |
| `out of scope`                    | A request outside the project's scope.                                                                                                                                                       |
| `invalid`, `spam`                 | An invalid report or junk submission, respectively. The [incomplete issue workflow](../.github/workflows/close-incomplete-issues.yml) can apply these labels and close issues automatically. |

## Cross-repository coordination

### needs collector update

An update to [the BCD collector](https://github.com/openwebdocs/mdn-bcd-collector) is needed, such as updating existing tests or fixing a collector bug.

### needs content update

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

## Release versioning

### semver-minor-bump

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

### semver-major-bump

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
