# Data guidelines

This file contains recommendations to help you record data in a consistent and understandable way. It covers the project's preferences for the way features should be represented, rather than hard requirements encoded in the schema definitions or linter logic.

- [Data guidelines](#data-guidelines)
  - [Constructors](#constructors)
  - [DOM events (`eventname_event`)](#dom-events-eventname_event)
  - [Secure context required (`secure_context_required`)](#secure-context-required-secure_context_required)
  - [Web Workers (`worker_support`)](#web-workers-worker_support)
  - [Permissions API permissions (`permissionname_permission`)](#permissions-api-permissions-permissionname_permission)
  - [Non-functional defined names imply `partial_implementation`](#non-functional-defined-names-imply-partial_implementation)
  - [Release lines and backported features](#release-lines-and-backported-features)
  - [Safari for iOS versioning](#safari-for-ios-versioning)
  - [Removal of irrelevant features](#removal-of-irrelevant-features)

<!-- BEGIN TEMPLATE

## Short title in sentence case

A description of what to do, preferably in the imperative. If applicable, include an example to illustrate the rule.

If it's helpful to understanding the rule, summarize the rationale. Definitely cite the issue or pull request where this was decided (it may be the PR that merges the policy).

-- END TEMPLATE -->

## Constructors

Name a constructor for an API feature the same as the parent feature (unless the constructor doesn't share the name of its parent feature) and have a description with text in the form of `<code>Name()</code> constructor`.

For example, the `ImageData` constructor, `ImageData()`, is represented as `api.ImageData.ImageData`. It has the description `<code>ImageData()</code> constructor`, like this:

```json
{
  "api": {
    "ImageData": {
      "__compat": {},
      "ImageData": {
        "__compat": {
          "description": "<code>ImageData()</code> constructor",
          "support": {}
        }
      }
    }
  }
}
```

## DOM events (`eventname_event`)

Add DOM events as features of their target interfaces, using the name _eventname_\_event with the description text set to `<code>eventname</code> event`. If an event can be sent to multiple interfaces, add the event as a feature of each interface that can receive it.

For example, the feature for a `focus` event targeting the `Element` interface would be named `focus_event` with the description text `<code>focus</code> event`, like this:

```json
{
  "api": {
    "Element": {
      "__compat": {},
      "focus_event": {
        "__compat": {
          "description": "<code>focus</code> event",
          "support": {}
        }
      }
    }
  }
}
```

This rule applies to the event features themselves, not the features for the event handlers. For example, `focus_event` and `onfocus` are two separate features.

This practice emerged through several discussions:

- [#935](https://github.com/mdn/browser-compat-data/issues/935#issuecomment-464691417)
- [#3420](https://github.com/mdn/browser-compat-data/pull/3420)
- [#3469](https://github.com/mdn/browser-compat-data/pull/3469)

## Secure context required (`secure_context_required`)

Use a subfeature named `secure_context_required` with the description text `Secure context required` to record data about whether a feature requires HTTPS. For example, the `ImageData` API requires a secure context, recorded like this:

```json
{
  "api": {
    "ImageData": {
      "__compat": {},
      "secure_context_required": {
        "__compat": {
          "description": "Secure context required",
          "support": {}
        }
      }
    }
  }
}
```

This convention is discussed in more detail in [#190](https://github.com/mdn/browser-compat-data/issues/190).

## Web Workers (`worker_support`)

Use a subfeature named `worker_support` with description text `Available in workers` to record data about an API's support for Web Workers.

For example, the `ImageData` API has worker support, recorded like this:

```json
{
  "api": {
    "ImageData": {
      "__compat": {},
      "worker_support": {
        "__compat": {
          "description": "Available in workers",
          "support": {}
        }
      }
    }
  }
}
```

Formerly named `available_in_workers`, this policy was set in [#2362](https://github.com/mdn/browser-compat-data/pull/2362).

## Permissions API permissions (`permissionname_permission`)

Add [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API) permissions as subfeatures of [`api.Permissions`](https://developer.mozilla.org/en-US/docs/Web/API/Permissions) using the name _permissionname_\_permission with the description text set to `<code>permissionname</code> permission`.

For example, the Geolocation permission is named `geolocation_permission` with the description text `<code>geolocation</code> permission`, like this:

```
{
  "api": {
    "Permissions": {
      "__compat": { ... },
      "geolocation_permission": {
        "__compat": {
          "description": "<code>geolocation</code> permission",
          "support": { ... }
        }
      }
    }
  }
}
```

This guideline was proposed in [#6156](https://github.com/mdn/browser-compat-data/pull/6156).

## Non-functional defined names imply `partial_implementation`

If a browser recognizes an API name, but the API doesn’t have any discernable behavior, use `"partial_implementation": true` instead of `"version_added": false`, as if the feature has non-standard support, rather than no support.

For example, suppose there is some specification for a Web API `NewFeature.method()`. Running `typeof NewFeature.method` in some browser returns `function` (not `undefined`), but the method, when called, returns `null` instead of an expected value. For that feature, set `"partial_implementation": true` and write a note describing the feature’s misbehavior.

See [#3904](https://github.com/mdn/browser-compat-data/pull/3904#issuecomment-484433603) for additional background (and nuance).

## Release lines and backported features

Use version numbers to reflect which _release line_ (major or minor but not patch-level releases) first supported a feature, rather than absolute version numbers.

Typically, BCD does not record absolute version numbers, such as Chrome 76.0.3809.46; instead BCD records significant releases (such as Chrome 76). Use the earliest applicable release line for recording support for a given feature, even when that support change was backported to a previous release of the browser.

For example, if the current release of browser X is version 10.2, but a new feature was backported to previous versions including a new 9.7.1 release, then the supported version is 9.7 (not 10.2 or 9.7.1).

This decision was made in [#3953, under the expectation that most users are likely to run the latest minor version of their browser](https://github.com/mdn/browser-compat-data/pull/3953#issuecomment-485847399), but not necessarily the latest version overall.

## Safari for iOS versioning

For Safari for iOS, use the iOS version number, not the Safari version number or WebKit version number.

This versioning scheme came at [Apple's request, in #2006](https://github.com/mdn/browser-compat-data/issues/2006#issuecomment-457277312).

## Removal of irrelevant features

Features can be removed from BCD if it is considered irrelevant. A feature can be considered irrelevant if any of these conditions are met:

- a feature was never implemented in any browser and the specification has been abandoned.
- a feature was implemented and has since been removed from all browsers dating back two or more years ago.
- a feature is unsupported in all releases in the past five years.

This guideline was proposed in [#6018](https://github.com/mdn/browser-compat-data/pull/6018).
