# Data guidelines

This file contains recommendations to help you record data in a consistent and understandable way. It covers the project's preferences for the way features should be represented, rather than hard requirements encoded in the schema definitions or linter logic.

<!-- BEGIN TEMPLATE

Short title in sentence case

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

The event handler `onfocus` is represented by the `focus_event` entry. Don't create features for `on` event handler properties. If an implementation doesn't support the event handler property, use `partial_implementation` with the note `"The <code>onfocus</code> event handler property is not supported."`. If only the `on` event handler property is supported and not the event itself, use `"version_added": false`.

If a specification has two sections (the event handler property and the event name), add both specification links.

This practice emerged through several discussions:

- [#935](https://github.com/mdn/browser-compat-data/issues/935#issuecomment-464691417)
- [#3420](https://github.com/mdn/browser-compat-data/pull/3420)
- [#3469](https://github.com/mdn/browser-compat-data/pull/3469)
- [mdn/content#9098](https://github.com/mdn/content/discussions/9098)
- [#13595](https://github.com/mdn/browser-compat-data/pull/13595)

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

## `"partial_implementation"` requires a note

If you set `"partial_implementation": true`, then write a note describing how the implementation is incomplete.

For historical reasons, some support statements have the flag set to `true` without a note. Avoid this in new data or revised data. We intend to require this in the schema, after the features which do not conform to this guideline have been removed. Read [#4162](https://github.com/mdn/browser-compat-data/issues/4162) for details.

This guideline was proposed in [#7332](https://github.com/mdn/browser-compat-data/pull/7332).

## Non-functional defined names imply `"partial_implementation"`

If a browser recognizes an API name, but the API doesn’t have any discernable behavior, use `"partial_implementation": true` instead of `"version_added": false`, as if the feature has non-standard support, rather than no support.

For example, suppose there is some specification for a Web API `NewFeature.method()`. Running `typeof NewFeature.method` in some browser returns `function` (not `undefined`), but the method, when called, returns `null` instead of an expected value. For that feature, set `"partial_implementation": true` and write a note describing the feature’s misbehavior.

See [#3904](https://github.com/mdn/browser-compat-data/pull/3904#issuecomment-484433603) for additional background (and nuance).

## Operating system limitations imply `"partial_implementation"`

If a browser or engine is available on more than one operating system and a feature is only implemented on a subset of those operating systems, then the support statement should set `"partial_implementation": true`. For example, if a browser supports both Windows and Linux, but only implements a feature on Windows, then a support statement for that feature should should set `"partial_implementation": true` (and a [note](#partial_implementation-requires-a-note)).

However, this guideline does not apply to features where the browser's expected behavior is conditional on the behavior of the operating system itself. For example, a browser can fully implement a CSS media query even if an underlying operating system can never satisfy the media query's condition because it does not support the requisite hardware.

This guideline was proposed in [#6906](https://github.com/mdn/browser-compat-data/issues/6906).

## Constants

Don't include data for constants in BCD. The rationale for not including them is that they're not known to be a source of any compatibility issues.

For example, although the UI Events specification defines a [`DOM_KEY_LOCATION_STANDARD`](https://w3c.github.io/uievents/#dom-keyboardevent-dom_key_location_standard) constant, we don't include data for it in BCD.

This guideline was proposed in [#7936](https://github.com/mdn/browser-compat-data/issues/7585), based in part on previous discussion in [#7585](https://github.com/mdn/browser-compat-data/issues/7585).

## Release lines

Use version numbers to reflect which _release line_ (major or minor but not patch-level releases) first supported a feature, rather than absolute version numbers.

Typically, BCD does not record absolute version numbers, such as Chrome 76.0.3809.46; instead BCD records significant releases (such as Chrome 76). Use the earliest applicable release line for recording support for a given feature. For example, if a feature was not added in Chrome 76.0.3700.43, but added in Chrome 76.0.3809.46, then the supported version is 76.

This decision was made in [#3953, under the expectation that most users are likely to run the latest minor version of their browser](https://github.com/mdn/browser-compat-data/pull/3953#issuecomment-485847399), but not necessarily the latest version overall.

## Backported releases

Some browsers have backport releases, where a feature is added or removed in two or more versions at once. If not otherwise covered by this guideline, use the earliest applicable version (as described in the [Release lines](#release-lines) guideline). In some cases, however, you must set the the version number to the following major version. For example, if a new feature was added in Safari 7.0 and in Safari 6.1, then the supported version is 7.0 (not 6 or 6.1).

| If the browser and its version is... | then set the version to... |
| ------------------------------------ | -------------------------- |
| Safari 4.1                           | Safari 5.0                 |
| Safari 6.1                           | Safari 7.0                 |
| Safari 6.2                           | Safari 8.0                 |
| Safari 7.1                           | Safari 8.0                 |

This decision was made in [#4679](https://github.com/mdn/browser-compat-data/issues/4679) and [#9423](https://github.com/mdn/browser-compat-data/issues/9423).

## Safari for iOS versioning

For Safari for iOS, use the iOS version number, not the Safari version number or WebKit version number.

This versioning scheme came at [Apple's request, in #2006](https://github.com/mdn/browser-compat-data/issues/2006#issuecomment-457277312).

## Addition of browsers

BCD's [owners](../GOVERNANCE.md) may choose to adopt a new browser or engine. To add a new browser to BCD, we need evidence of (in decreasing order of importance):

- a compelling downstream-consumer story (e.g., MDN or caniuse express an interest, or someone is planning to do something with the data that might plausibly grow BCD's reach)
- reviewers (e.g., two or more people with interest and ability to test data relating to new and existing releases, or at least one reviewer acting on behalf of the vendor)
- a release process allowing BCD to publish stable release information in a `browsers/` file (containing release notes with version numbers and dates)
- documentation (e.g., how to get and test a feature in that browser, links to resources that might help with it, etc.)

This decision was proposed in [#7238](https://github.com/mdn/browser-compat-data/issues/7238) and adopted in [#7244](https://github.com/mdn/browser-compat-data/pull/7244).

## Removal of browsers

To maintain data quality, BCD's [owners](../GOVERNANCE.md) may choose to remove a browser or engine from the project. To remove a browser from BCD, we need habitual (six months or more) evidence of (in decreasing order of importance):

- negative/neutral downstream-consumer interest in the browser's data (e.g., MDN and caniuse don't object to removal)
- poor data coverage with negative trends (e.g., our data for the browser covers only a few features, with limited/flat growth in more data being added for it, or few features with real version numbers rather than just `null` or `true`, etc.)
- infrequent community or vendor involvement in issues or PRs relating to the browser
- infrequent new PRs relating to the browser (e.g., weeks or months go by without PRs touching the browser's data)

Removing a browser from BCD does not constitute a ban; browsers may be readmitted under the [Addition of browsers](#addition-of-browsers) guideline.

This decision was proposed in [#7238](https://github.com/mdn/browser-compat-data/issues/7238) and adopted in [#7244](https://github.com/mdn/browser-compat-data/pull/7244).

## Removal of irrelevant features

Features can be removed from BCD if it is considered irrelevant. A feature can be considered irrelevant if any of these conditions are met:

- a feature was never implemented in any browser and the specification has been abandoned.
- a feature was implemented and has since been removed from all browsers dating back two or more years ago.
- a feature is unsupported in all releases in the past five years.

This guideline was proposed in [#6018](https://github.com/mdn/browser-compat-data/pull/6018).

## Removal of irrelevant flag data

Valid support statements containing flags can be removed from BCD if it is considered irrelevant. To be considered irrelevant, the support statement must meet these conditions:

- As of at least two years ago, the browser has supported the feature by default or removed the flagged feature.
- The removal of the support statement must not create an ambiguous gap or void in the data for that browser (for example, leaving behind only a `"version_added": true` or `null` value).

These conditions represent minimum requirements for the removal of valid flag data; other considerations may result in flag data continuing to be relevant, even after the guideline conditions are met.

This guideline was proposed in [#6670](https://github.com/mdn/browser-compat-data/pull/6670).

## When to add `version_removed` to flagged support

A `version_removed` should be added to support statements containing flags under one of the following conditions, whichever comes first:

- The browser has enabled the feature or flag by default in a stable release (not beta or nightly).
- The feature can no longer be enabled or disabled by toggling the flag.
- The feature has been removed from the browser.
- The flag has been removed from the browser.

## Initial versions for browsers

The schema docs list [initial versions](../schemas/compat-data-schema.md#initial-versions) for BCD browsers. These are the earliest possible version numbers allowed to be used.

If the table indicates an initial version of "1" and an information source says a feature was implemented in a (beta) version "0.8", record the initial version number "1" for it. In other words, a lower version number is always elevated to a browser's initial version number.

If you're adding new data for Node.js, use `0.10.0` or later. If a feature was added in a version before `0.10.0`, use `0.10.0` anyway.

This guideline was proposed in [#6861](https://github.com/mdn/browser-compat-data/pull/6861).

## Mixins

[Interface mixins](https://webidl.spec.whatwg.org/#idl-interface-mixins) in Web IDL are used in specifications to define Web APIs. For web developers, they aren't observable directly; they act as helpers to avoid repeating API definitions. Don't add mixins to BCD where they do not already exist.

For example, [`HTMLHyperlinkElementUtils`](https://html.spec.whatwg.org/multipage/links.html#htmlhyperlinkelementutils) is a mixin defined in the HTML specification.

Members of this mixin are available to `HTMLAnchorElement` and `HTMLAreaElement`, that's where BCD exposes them. Add mixin members to BCD in one of these ways:

1. For smaller mixins, add members of `HTMLHyperlinkElementUtils` directly to the `api/HTMLAnchorElement.json` and `api/HTMLAreaElement.json` files as if they were regular members of these interfaces.

2. For larger mixins, create a file in the `api/_mixins/` folder and indicate for which interface they are using file names like: `HTMLHyperlinkElementUtils__HTMLAnchorElement.json` and `HTMLHyperlinkElementUtils__HTMLAreaElement.json`.
   In these files, expose the data under the correct tree. For `HTMLHyperlinkElementUtils__HTMLAnchorElement.json`, the file needs to start like this:

   ```
   {
     "api": {
       "HTMLAnchorElement": {
         "myFeatureName": {
           "__compat": {
   ```

This guideline was proposed in [#8929](https://github.com/mdn/browser-compat-data/issues/8929), based in part on previous discussion in [#472](https://github.com/mdn/browser-compat-data/issues/472).

## Choosing an experimental status

Generally, when a feature is supported by one and only one browser engine, set `experimental` to `true`. When a feature is supported by two or more engines, then set `experimental` to `false`. Some exceptions apply, however, for long-standing features and features behind flags and prefixes.

If a feature is supported behind flags only, no matter how many engines, then set `experimental` to `true`.

If a feature is supported behind incompatible prefixes only (such as `-webkit-` in one engine and `-moz-` in another), no matter how many engines support the feature overall, then set `experimental` to `true`. If two or more engines support a feature behind a common prefix (such as `-webkit-` only), then set `experimental` to `false`.

A single-engine feature's `experimental` status may expire and switch to `false` when the following conditions are met:

- The feature has been supported by default and without major changes by some browser for two or more years.
- If any other browser engine supports the feature behind a flag, then the behaviors are mutually compatible.

| Example                                                                     | Experimental |
| --------------------------------------------------------------------------- | ------------ |
| An API supported in Chrome and Firefox, without flags or prefixes.          | No           |
| A CSS property supported in Chrome and Firefox, with the `-webkit-` prefix. | No           |
| An HTTP header supported in Chrome and Firefox, behind flags.               | Yes          |
| A CSS property value supported in Safari, released last week.               | Yes          |
| An API supported in Firefox, released three years ago.                      | No           |

This guideline was proposed in [#6905](https://github.com/mdn/browser-compat-data/issues/6905) and adopted in [#9933](https://github.com/mdn/browser-compat-data/pull/9933).

## Parameters and parameter object features

Sometimes it's useful to represent support for specific parameters (also known as arguments) of a function or method, as a subfeature of the function itself. To record data about whether a specific parameter is supported by a function or method, use the following naming conventions:

- For named parameters, use a subfeature named `paramname_parameter` with description text `<code>paramname</code> parameter`. Where _paramname_ is the name of the parameter as it appears on the corresponding function's MDN page (or specification, if no MDN page is available).

  For example, to represent support for the `firstName` parameter of a method `hello(firstName, familyName)`, use a subfeature of `hello` named `firstName_parameter` with the description text `<code>firstName</code> parameter`.

- For unnamed parameters, use a subfeature named `ordinal_parameter` with description text `ordinal parameter` where _ordinal_ is the ordinal number position of the parameter.

  For example, to represent support for the second parameter of a method `count()`, use a subfeature of `count` named `second_parameter` and description text `Second parameter`.

- For properties of parameter objects, use a subfeature named `paramname_prop_parameter` with description text `<code>paramname.prop</code> parameter`, where _paramname_ is the name of the parameter object and _prop_ is the name of the property.

  For example, to represent support for the `year` property of the `date` parameter to a method `schedule(date)` (as in `schedule({"year": 1970 })`), use a subfeature of `schedule` named `date_year_parameter` with description text `<code>date.year</code> parameter`.

For existing data which does not follow this guideline, you may modify it to conform with this data, if you are you otherwise updating the data (or data related to it).

This guideline was proposed and adopted in [#10509](https://github.com/mdn/browser-compat-data/pull/10509).

## APIs moved on the prototype chain

[Web IDL interfaces](https://webidl.spec.whatwg.org/#idl-interface) (and [JavaScript built-in objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)) form prototype chains, with one type inheriting from another. For example, `AudioContext` inherits from `BaseAudioContext`, and `Element` inherits from `Node`.

Some of these interfaces are [abstract](https://en.wikipedia.org/wiki/Abstract_type) and never have instances, while most are concrete and can be instantiated. For example, `BaseAudioContext` and `Node` are abstract, while `AudioContext` and `Element` are concrete.

When attributes and methods are moved between interfaces in specifications and implementations, BCD should make the corresponding change. This guideline covers which versions to use, and whether to use `partial_implementation` and notes in the resulting compat data.

**When members are moved up the prototype chain**

For interface members, use the version when the member is first supported on any concrete interface, regardless of where in the prototype chain the member is, even if that is earlier than the existence of the current interface. If there are any concrete interfaces where the member wasn't supported before the move, then use `partial_implementation` and notes.

For interfaces, use the version when the interface itself is first supported. If there are members supported earlier than the interface itself was introduced, then use `partial_implementation` and notes for that range of versions.

For example, most members of `AudioContext` have moved to a new `BaseAudioContext` parent interface. The data was recorded like this:

- The members were removed from `AudioContext` and added to `BaseAudioContext`.
- Since some of the members were supported on `AudioContext` earlier than on `BaseAudioContext`, `partial_implementation` and notes are used for `BaseAudioContext` for that range of versions.
- Full `BaseAudioContext` support (without `partial_implementation`) is recorded as separate entries from the versions when the `BaseAudioContext` interface itself is supported.

See [#9516](https://github.com/mdn/browser-compat-data/pull/9516) for a part of this data being fixed, and [#9479](https://github.com/mdn/browser-compat-data/pull/9479) for another example.

**When members are moved down the prototype chain**

Use the version when the member is first supported on the current interface, regardless of where in the prototype chain the member is. No `partial_implementation` or notes about the move are needed.

For example, some attributes have moved from `Node` to `Attr` and `Element`. The data was recorded like this:

- The members were removed from `Node` and added to `Attr` and `Element`.
- Support is recorded from when the members were first available via `Node`, without any notes.

See [#9561](https://github.com/mdn/browser-compat-data/pull/9561) for a part of this data being fixed.

This guideline is based on a discussion in [#3463](https://github.com/mdn/browser-compat-data/issues/3463).

## Choosing `"preview"` values

Prefer `"preview"` values for `version_added` and `version_removed` when the future stable version number is unknown or uncertain. Use `"preview"` when:

- You can't be sure a feature will progress (informally, "ride the train") to a numbered stable release.

  For example, use `"preview"` when a feature is explicitly limited to Chrome Canary builds, is supported in the current version of Canary, and is not supported in the same numbered beta and stable versions.

- The next version number is unknown to BCD.

  For example, a feature is supported in Safari Technology Preview only and is expected in the next release of Safari, but Apple has not announced the version number for the next release of Safari.

Do not use `"preview"` for planned but not yet implemented support changes. In other words, if you can't test or use a feature in the current development version of the browser, then use `false` not `"preview"`.

This guideline was adopted to protect the quality of stable data in the face of schedule uncertainty. To learn more about the adoption of `"preview"` values, see [#12344](https://github.com/mdn/browser-compat-data/issues/12344) and [#10334](https://github.com/mdn/browser-compat-data/pull/10334).

## Methods returning promises (`returns_promise`)

When a method returns a promise in some (but not all) browser releases, use a subfeature named `returns_promise` with description text `Returns a <code>Promise</code>` to record when the method returns a promise.

For example, `HTMLMediaElement`'s `play()` method returns a promise, recorded like this:

```json
{
  "api": {
    "HTMLMediaElement": {
      "__compat": {},
      "play": {
        "__compat": {},
        "returns_promise": {
          "__compat": {
            "description": "Returns a <code>Promise</code>",
            "support": {}
          }
        }
      }
    }
  }
}
```

This guideline is based on a discussion in [#11630](https://github.com/mdn/browser-compat-data/pull/11630).

## Global APIs

An API is considered global when it is available for both [`Window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) and [`WorkerGlobalScope`](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope). Such APIs are recorded in the `api/_globals/` folder.

For example, the [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) method is global, recorded like this in `api/_globals/fetch.json`:

```json
{
  "api": {
    "fetch": {
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

All APIs defined on the [`WindowOrWorkerGlobalScope`](https://html.spec.whatwg.org/multipage/webappapis.html#windoworworkerglobalscope-mixin) mixin are considered global.

Note that APIs available on only _some_ types of workers are not considered global. For example:

- The `cookieStore` property, available in `Window` and `ServiceWorkerGlobalScope`.
- The `requestAnimationFrame()` function, available in `Window` and `DedicatedWorkerGlobalScope`.

This guideline is based on a discussion in [#11518](https://github.com/mdn/browser-compat-data/pull/11518).

## Callback interfaces and functions

Don't add unexposed callbacks as features in `api`. If needed, represent callbacks as subfeatures of relevant methods or properties.

Callback [functions](https://webidl.spec.whatwg.org/#idl-callback-functions) and [interfaces](https://webidl.spec.whatwg.org/#idl-callback-interfaces) (denoted by `callback` and `callback inferface` in Web IDL) are used in specifications to define Web APIs. Where defined without the `[Exposed]` attribute, they aren't observable directly to web developers.

For example, [`addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) is specified as taking an `EventListener` callback. Since `EventListener` is specified as an unexposed `callback interface EventListener`, it would be represented as a subfeature of `api.EventTarget.addEventListener`.

This guideline is based on a discussion in [#3068](https://github.com/mdn/browser-compat-data/issues/3068) and was proposed in [#14302](https://github.com/mdn/browser-compat-data/pull/14302).

## Setting `deprecated`

Set `deprecated` to `true` to show that a feature has been authoritatively discouraged from use.

The `deprecated` status captures the many ways standards organizations (and, for non-standard features, vendors) mark features as disfavored. This includes features that are on the path to removal or features that are discouraged from use despite their retention for backwards compatibility.

Evidence for setting `deprecated` to `true` includes:

- _Obsolete_, _legacy_, _deprecated_, _end-of-life_, or similar terminology in a specification
- Removal of a feature from a specification
- Specification text that cautions developers against new use of the feature
- Formal discouragement statements from a relevant standards body (for example, meeting minutes that show a committee achieving consensus for removal from a specification, even if the removal has not yet taken place)
- For non-standard features, notice from implementing browsers (for example, a console deprecation warning) or vendor documentation

Do not set `deprecated` to `true` for features that are merely old or unpopular, no matter how many [_considered harmful_](https://en.wikipedia.org/wiki/Considered_harmful) blog posts they may have garnered. For example, although web developers may prefer `fetch` over `XMLHttpRequest`, `XMLHttpRequest` is not deprecated.

This guideline was proposed in [#15703](https://github.com/mdn/browser-compat-data/pull/15703). See [mdn/content#5549](https://github.com/mdn/content/discussions/5549) and [#10490](https://github.com/mdn/browser-compat-data/issues/10490) for further discussion on the use of "deprecated."
