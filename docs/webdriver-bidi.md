# WebDriver BiDi compatibility data updates

WebDriver BiDi implementers maintain the [WebDriver BiDi Implementation Status spreadsheet](https://docs.google.com/spreadsheets/d/1bkiPU5eDBCqFkx5p_VSBx_OK8gy9TeHRKQVPHKMATGQ/view). It predates the BCD data and already held implementation information, alongside specification status and planning. BCD syncs its implementation status and version information to reduce duplicate maintenance and keep compatibility data up to date.

The spreadsheet is not publicly editable. Contact the WebDriver BiDi maintainers if you need editing access. For help making a change, contact [`@caugner`](https://github.com/caugner), who can make the update or ping the implementers.

The data flows through these steps:

- The Google Apps Script, which has access to the spreadsheet, transforms its data into a BCD-formatted JSON export.
- GitHub Actions downloads the export from a URL stored in the `WEBDRIVER_BIDI_UPDATE_URL` repository secret.
- The Apps Script and its spreadsheet-to-JSON mapping are maintained outside this repository by [`@caugner`](https://github.com/caugner). Contact them about export or mapping changes.

## Rationale and tradeoffs

WebDriver BiDi is difficult to feature-detect. Having implementers update the spreadsheet as they implement features makes it easier for them to contribute to BCD and helps reduce gaps or stale support data.

A spreadsheet row cannot represent every structure or level of detail in BCD, though this has not been a blocker in practice so far. Reviewers should check the generated feature hierarchy and descriptions against the BCD data guidelines, and resolve mismatches upstream.

## Update process

The [`update-webdriver-bidi-data` workflow](../.github/workflows/update-webdriver-bidi-data.yml) can run on this schedule or on request:

- **Scheduled:** Weekdays at 04:30 UTC.
- **Manual:** In the repository's **Actions** tab, select **Update WebDriver BiDi Data** > **Run workflow**. A maintainer can do this after a spreadsheet update.

The workflow:

1. Downloads the JSON export from `WEBDRIVER_BIDI_UPDATE_URL`.
2. Replaces the current `webdriver/bidi/` data with the downloaded export, split into one JSON file per WebDriver BiDi module.
3. Runs the web-features tagging script and the pre-commit checks.
4. If the generated data differs, opens or updates a pull request titled **Update WebDriver BiDi data** on the `webdriver-bidi` branch.

It requires the `WEBDRIVER_BIDI_UPDATE_URL` and `GH_TOKEN` secrets. Their values are not stored in the repository. A repository maintainer must update the Actions secrets if the export URL or workflow credentials need maintenance.

## Reviewing an update

Review the generated pull request like other compatibility data changes. Check that:

- Expected spreadsheet changes appear under the corresponding `webdriver/bidi/` features.
- Support values and versions match the spreadsheet and implementation evidence.
- The feature hierarchy and descriptions follow the [BCD data guidelines](./data-guidelines/README.md). If not, fix them upstream in the spreadsheet or its Apps Script, as appropriate, before merging.

Automated BiDi pull requests require human review and approval before merging.

Make corrections at their source:

- Update implementation status and version information in the spreadsheet.
- Update export or mapping behavior in the Apps Script, coordinating with its maintainer above.

Changes to the BCD files can still be merged, but until the corresponding correction is made upstream, a later sync will attempt to restore the exported values.
