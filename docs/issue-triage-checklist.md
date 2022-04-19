# Issue triage checklist

Helping process and understand new issues is a great way to help the project. To review a new issue, follow these steps. It looks lengthy, but with practice, many issues can be processed in a few minutes.

## Close fast

Avoid wasting time on issues which are not relevant to the repository by closing them quickly.

- **Is it obvious spam?** Close it without comment and label it [_spam :wastebasket:_](https://github.com/mdn/browser-compat-data/labels/spam%20%3Awastebasket%3A).
- **Is the issue template wholly incomplete?** Close it and label it [_invalid :no_entry_sign:_](https://github.com/mdn/browser-compat-data/labels/invalid%20%3Ano_entry_sign%3A).
- **Is the issue template largely incomplete?** Close it with a suggestion to reopen with more details and label it [_invalid :no_entry_sign:_](https://github.com/mdn/browser-compat-data/labels/invalid%20%3Ano_entry_sign%3A).
- **Is the issue a request for web development or other unrelated help?** Close it with a brief explanation of what the repository is for and label it [_invalid :no_entry_sign:_](https://github.com/mdn/browser-compat-data/labels/invalid%20%3Ano_entry_sign%3A).

## Confirm the title, description, and metadata

Make sure the issue is well-described. If these details aren't satisfied, ask for more information or update the issue title, description, or labels yourself (or @ mention a Peer or Owner who can do this for you).

- **Does the title summarize the issue?**
- **Does the issue uniquely identify relevant feature(s)?** Ideally with a dotted path to a feature (e.g., `javascript.builtins.Date.now`) or an unambiguous name (`Date.now()`).
- **Is the issue labeled correctly?** For example, if it's about CSS, does it have the CSS label?
- As applicable, **are specific browsers, versions, and operating systems identified?**
- If applicable, **is there a link to a relevant MDN page?**

## Confirm the existing data

Make sure the data is consistent with the issue reported before investing time in more research or testing.

- **Check if the existing data makes sense.** Sometimes there's confusion about what the data shows (e.g., ranged data) or where it should be recorded (e.g., different event features).
- **Check if the data has already been updated.** Data doesn't reach consumers immediately; make sure the data hasn't been fixed already.
- **Link to the relevant data files.** If the data does in fact need changes, link to the source files that will need be changed.

## Related information

Make sure the issue is connected to other relevant information.

- **Link to related issues.** Search for other issues with the same dotted path to a feature (or a parent feature) or using similar keywords.
- **If the issue is a duplicate, close it.** Follow these steps:

  1. Copy any new information into the original issue.
  2. Comment to thank the reporter and link to the original issue.
  3. Label the issue [_duplicate :dancing_women:_](https://github.com/mdn/browser-compat-data/labels/duplicate%20%3Adancing_women%3A).
  4. Close the issue.

- **If there are related issues, link to them.** Comment or edit the issue description.
- For new features, **link to relevant specifications**.

## Fill in additional details

Most reporters won't do these things on their own, but these are important steps to confirming a report, testing for verification, or invalidating an issue.

### Get testing details

- **If there is an [mdn-bcd-collector](https://mdn-bcd-collector.appspot.com/) test for this feature, link to it.**
- **If there's a live sample or interactive example on MDN that can be used as a test, link to it.**
- **Ask the reporter if they have a minimal test case** (e.g., on CodePen).
- If applicable, **comment if a more detailed or specific test is required.** For example, tests often work by checking whether a prototype has a particular member, not the actual behavior of that member.

### Chrome (and Chromium-based browsers)

These details can be helpful if an issue is specific to the Chromium-based browsers: Chrome, Chrome for Android, Android WebView, Edge (versions ≥79), Opera, Opera for Android, and Samsung Internet.

- **Link to a Chrome Platform Status entry, if it exists.**
- If applicable, **request or link to a relevant issue on [the Chromium issue tracker](https://bugs.chromium.org/p/chromium/issues/list)**.
- If applicable, **comment if the interface is listed in [`not-webview-exposed.txt`](https://source.chromium.org/chromium/chromium/src/+/master:android_webview/tools/system_webview_shell/test/data/webexposed/not-webview-exposed.txt).**

### Firefox and Firefox for Android

- If applicable, **request or link to a relevant bug on [Bugzilla](http://bugzilla.mozilla.org/).**
- If the issue affects Firefox for Android only, **check whether the feature was introduced before or after Firefox 68 and make a note of it in a comment or the issue description**.

### Safari

- If applicable, **request or link to a relevant bug on [WebKit Bugzilla](https://bugs.webkit.org/).**
- If a version has been identified for addition or removal, **check the release notes linked from [`safari.json`](https://github.com/mdn/browser-compat-data/blob/main/browsers/safari.json)**.

## Propose next steps

After we've collected all of the required information, make a plan for what to do next.

- **Comment suggesting next steps**, such as:

  - Finding or writing a minimal test case.
  - Running tests in BrowserStack or Sauce Labs.
  - Updating the data files with a pull request.

  Or, if you're not sure what the next step is, ask for ideas, input, or help.

- If applicable, **set labels seeking help**. Use the [_good first issue:100:_](https://github.com/mdn/browser-compat-data/labels/good%20first%20issue%20%3A100%3A) or [_help wanted :sos:_](https://github.com/mdn/browser-compat-data/labels/help%20wanted%20%3Asos%3A) labels.

- **Thank the reporter.**
