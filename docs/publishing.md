# Publishing a new version of `@mdn/browser-compat-data`

[Project owners](./GOVERNANCE.md#owners) publish new releases of the [`@mdn/browser-compat-data`](https://www.npmjs.com/package/@mdn/browser-compat-data) NPM package, usually every Tuesday and Friday.

The release process is mostly automated using two GitHub workflows:

1. The [`release-pr` workflow](https://github.com/mdn/browser-compat-data/blob/main/.github/workflows/release-pr.yml) manages a pull request draft that bumps the `package.json` version and updates the release notes.
2. The [`release` workflow](https://github.com/mdn/browser-compat-data/blob/main/.github/workflows/release.yml) creates the GitHub release and tag, and publishes the release on NPM.

## Performing a release

A release is usually performed by merging the pull request managed by the `release-pr` workflow:

1. The merge commit will trigger the `create-release` job of the `release` workflow.
2. The `create-release` job publishes a [GitHub release](https://github.com/mdn/browser-compat-data/releases) and [tag](https://github.com/mdn/browser-compat-data/tags) based on the updated `package.json` and release notes.
3. The published GitHub release will trigger the `publish-release` job of the `release` workflow.
4. The `publish-release` job performs the following steps:
   - Builds the release.
   - Publishes the release to NPM.
   - Adds the `data.json` as an asset to the GitHub release.
   - Dispatches a `bcd_release` event on the [mdn/bcd-utils](https://github.com/mdn/bcd-utils) repository, which triggers the deployment of the new BCD release on MDN.

### Before merging the release PR

> [!WARNING]
>
> To ensure the release PR is up-to-date, care should be taken that no other PR is merged at the same time, and that all checks have passed on the latest `main` commit.

> [!TIP]
>
> For major and minor releases, the `RELEASE_NOTES.md` can be edited manually on the `release` branch. However, as the next `release-pr` workflow run will overwrite the changes, it is advisable to keep a copy, or to disable the workflow temporarily.

## Behind the scenes

The `release-pr` workflow runs `npm run release` with a personal access token (PAT) that is owned by [@mdn-bot](https://github.com/mdn-bot), and has read and write access to code and pull requests on the repository.

The release script performs the following steps:

1. Fetches the latest `main` branch.
2. Determines the previous release version.
3. Determines whether a major or minor version bump is needed, based on PRs with the `semver-major-bump` or `semver-minor-bump` label merged since the previous release.
4. Updates the `package.json` by running `npm version`.
5. Updates the `RELEASE_NOTES.md` by determining release notes based on the following input:
   - Release and repository statistics.
   - List of added and removed features, determined by iterating over all merged pull requests since the previous release, and enumerating all features before and after the merge commit.
6. Commits and pushes the changes to the `release` branch, and creates or updates the release PR accordingly.
