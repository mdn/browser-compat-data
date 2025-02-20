# Publishing a new version of `@mdn/browser-compat-data`

New releases of the [`@mdn/browser-compat-data`](https://www.npmjs.com/package/@mdn/browser-compat-data) NPM package are published twice per week on Tuesday and Friday, except during year-end holidays.

The release process is mostly automated using two GitHub workflows:

1. The [`release-pr` workflow](https://github.com/mdn/browser-compat-data/blob/main/.github/workflows/release-pr.yml) manages a pull request that bumps the `package.json` version and updates the release notes.
2. The [`release` workflow](https://github.com/mdn/browser-compat-data/blob/main/.github/workflows/release.yml) creates the GitHub release and tag, publishes the release on NPM, and triggers MDN deployment.

The release itself is triggered manually, to help ensure that as many ready pull requests make it into the release.

## Performing a release

Any project owner (or release designee) can complete the following steps to publish a new version.

To publish a release:

1. _If this is a major or minor release_: Align with project owners on the release notes entries, i.e. "Breaking changes" for major releases, and "Notable changes" for major/minor releases.
2. Mark the release pull request (titled `Release vX.Y.Z`) as ready for review.
3. Ensure that the pull request is up-to-date, i.e. that all checks have passed on the latest `main` commit, and that no other pull request is merged right before.
4. _If this is a major or minor release_: Add the release notes entries manually to the `RELEASE_NOTES.md` on the `release` branch (_below_ the release date).
5. Merge the pull request.

## Behind the scenes

The release pull request is managed by the [`release-pr` workflow](https://github.com/mdn/browser-compat-data/blob/main/.github/workflows/release-pr.yml), which runs `npm run release` with a personal access token (PAT) that is owned by [@mdn-bot](https://github.com/mdn-bot), and has read and write access to code and pull requests on the repository.

The [release script](https://github.com/mdn/browser-compat-data/tree/main/scripts/release) performs the following steps:

1. Fetches the latest `main` branch.
2. Determines the previous release version.
3. Determines whether a major or minor version bump is needed, based on pull requests with the `semver-major-bump` or `semver-minor-bump` label merged since the previous release.
4. Updates the `package.json` by running `npm version`.
5. Updates the `RELEASE_NOTES.md` by determining release notes based on the following input:
   - Release and repository statistics.
   - List of added and removed features, determined by iterating over all merged pull requests since the previous release, and enumerating all features before and after the merge commit.
6. Commits and pushes the changes to the `release` branch.
7. Creates or updates the release pull request accordingly.

Merging the release pull request yields the following result:

1. The merge commit triggers the `create-release` job of the [`release` workflow](https://github.com/mdn/browser-compat-data/blob/main/.github/workflows/release.yml) workflow.
2. The `create-release` job publishes a [GitHub release](https://github.com/mdn/browser-compat-data/releases) and [tag](https://github.com/mdn/browser-compat-data/tags) based on the updated `package.json` and release notes.
3. The published GitHub release triggers the `publish-release` job of the `release` workflow.
4. The `publish-release` job performs the following steps:
   - Builds the release.
   - Publishes the release to NPM.
   - Adds the `data.json` as an asset to the GitHub release.
   - Dispatches a `bcd_release` event on the [mdn/bcd-utils](https://github.com/mdn/bcd-utils) repository, which triggers the deployment of the new BCD release on MDN.
