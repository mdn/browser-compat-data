# Data guidelines for tagging BCD features

This file contains guidelines that are specific to the `tags` property that can be added optionally to BCD features.

The optional `tags` property is an array of strings allowing to assign tags to any BCD feature. It can look like this:

```json
"tags": [
  "web-features:idle-detection"
],
```

Tags are always an array and the items consist of namespaced names. A namespace must be provided (see below). The name (after the colon) can only be lowercase alphanumeric characters (`a-z` and `0-9`) plus the `-` character (hyphen or minus sign) as a word separator.

## Tag namespaces

Each tag in the `tags` array must be namespaced. This helps us to understand the purpose of the tag, lets us validate tags more easily, run linting, and perform mass-changes to all tags that belong to a namespace.

This document governs the list of allowed namespaces in BCD tags.

The currently allowed namespaces are:

- `web-features`: A namespace to tag features belonging to a web platform feature group as defined by [web-platform-dx/web-features](https://github.com/web-platform-dx/web-features/blob/main/features/README.md). This is an experimental namespace and it might change in breaking ways. Don't rely on it yet.

### The `web-features` namespace

The `web-features` namespace is reserved to tag BCD features that belong to a particular [web platform feature group](https://github.com/web-platform-dx/web-features/blob/main/features/README.md).

The [web-platform-dx/web-features](https://github.com/web-platform-dx/web-features) project is importing web platform feature groups using this BCD tag. If you want to create a group of BCD features and don't want it to be exported to the web-platform-dx/web-features project, don't use the `web-features` namespace.

#### Naming guidelines for `web-features` tags

There are a few guidelines for naming `web-features` groups:

- Prefer identifiers known to be in widespread use by web developers.
  Favor describing things as they are most-widely known, even if it's not the most technically correct option.
  - 👍 Recommended: `web-features:javascript`
  - 👎 Not recommended: `web-features:ecmascript`

- Avoid prefixing identifiers that mark a feature as specific to a technology, such as `css-` or `js-`.
  Features can and do cross such boundaries.
  - 👍 Recommended: `web-features:container-queries`
  - 👎 Not recommended: `web-features:css-container-queries`

- Avoid frequently-used abbreviations and nouns in identifiers, such as `api` or `web`.
  - 👍 Recommended: `web-features:navigation`
  - 👎 Not recommended: `web-features:navigation-api`

- Prefer common, descriptive noun phrases over abbreviations, metonymy, and syntax.
  - 👍 Recommended: `web-features:offscreen-canvas`
  - 👎 Not recommended: `web-features:offscreencanvas` (as in `OffscreenCanvas`)
  - 👍 Recommended: `web-features:grid`
  - 👎 Not recommended: `web-features:display-grid` (as in `display: grid`)

- Prefer shorter identifiers to longer identifiers, as long as they're unique and unambiguous.
  - 👍 Recommended: `web-features:has`
  - 👎 Not recommended: `web-features:has-pseudo-class`

Feature identifiers may use common suffixes (such as `-api`) to resolve naming conflicts.

## Working with tags

In order to comply with these guidelines, BCD provides some tooling to help you work with tags.

### Getting a list of all features with a specific tag

To see all features tagged with `"web-features:idle-detection"`, you can use BCD's `traverse` script like this:

```bash
npm run traverse -- -t web-features:idle-detection
```

This will log all the BCD paths and the total number of features tagged with `"web-features:idle-detection"`:

```
api.IdleDetector
api.IdleDetector.IdleDetector
api.IdleDetector.change_event
api.IdleDetector.requestPermission_static
api.IdleDetector.screenState
api.IdleDetector.start
api.IdleDetector.userState
http.headers.Permissions-Policy.idle-detection
8
```

### Bulk editing tags

Currently, BCD doesn't provide a command line tool to bulk update tags. We will provide such a tool soon.
