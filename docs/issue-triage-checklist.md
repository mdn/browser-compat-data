# Issue triage checklist

Helping process and understand new issues is a great way to help the project. To review a new issue, follow these steps. It looks lengthy, but with practice, many issues can be processed in a few minutes.

## Close irrelevant issues fast

Avoid wasting time on issues which are not relevant to the repository by closing them quickly.

- **Is it obvious spam?** Close it without comment and label it [_spam_](https://github.com/mdn/browser-compat-data/labels/spam).
- **Is the issue template wholly incomplete?** Close it and label it [_invalid_](https://github.com/mdn/browser-compat-data/labels/invalid).
- **Is the issue template largely incomplete?** Close it with a suggestion to reopen with more details and label it [_invalid_](https://github.com/mdn/browser-compat-data/labels/invalid).
- **Is the issue a duplicate of another issue?** Close it with a comment stating it is a duplicate, mentioning the original issue number, and label it [_duplicate_](https://github.com/mdn/browser-compat-data/labels/duplicate).
- **Is the issue a request for web development or other unrelated help?** Close it with a brief explanation of what the repository is for and label it [_invalid_](https://github.com/mdn/browser-compat-data/labels/invalid).

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
  3. Label the issue [_duplicate_](https://github.com/mdn/browser-compat-data/labels/duplicate).
  4. Close the issue.

- **If there are related issues, link to them.** Comment or edit the issue description.
- For new features, **link to relevant specifications**.

## Fill in additional details

Most reporters won't do these things on their own, but these are important steps to confirming a report, testing for verification, or invalidating an issue.

### Get testing details

- **If there is an [mdn-bcd-collector](https://mdn-bcd-collector.gooborg.com/) test for this feature, link to it.**
- **If there's a live sample or interactive example on MDN that can be used as a test, link to it.**
- **Ask the reporter if they have a minimal test case** (e.g., on CodePen).
- If applicable, **comment if a more detailed or specific test is required.** For example, tests often work by checking whether a prototype has a particular member, not the actual behavior of that member.
- **If there is a bug or commit, link to it.** Bugs can be found using the links provided in the [helpful resources section of the contributing document](./contributing.md#helpful-resources).

## Propose next steps

After we've collected all of the required information, make a plan for what to do next.

- **Comment suggesting next steps**, such as:
  - Finding or writing a minimal test case.
  - Running tests in BrowserStack or Sauce Labs.
  - Updating the data files with a pull request.

  Or, if you're not sure what the next step is, ask for ideas, input, or help.

- If applicable, **set labels seeking help**. Use the [_good first issue_](https://github.com/mdn/browser-compat-data/labels/good%20first%20issue) or [_help wanted_](https://github.com/mdn/browser-compat-data/labels/help%20wanted) labels.

- **Thank the reporter.**
