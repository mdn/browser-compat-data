# Data guidelines for the `spec_url` property

The browser-compat-data project (BCD) uses the `spec_url` property to map compatibility data to features described in specifications.

## Benefits

Maintaining pointers to specifications from BCD features provides several benefits:

- Specifications can show compatibility data inline next to feature definitions.
- If a `spec_url` is provided, BCD itself or other data consumers, can treat the feature as standardized. In the absence of a `spec_url`, we could say that the feature is non-standard.
- By using deep links (fragment identifiers), BCD can more precisely identify the feature. This can be helpful when trying to understand descriptions of BCD feature keys, for example.
- It enables statistics and coverage analysis. Which BCD features are standardized? Which standards bodies standardize? And more.

## Schema definition and validation

The `spec_url` property is defined and validated by the BCD JSON schema: It may be either a single URL or an array of URLs, each pointing to a specific part of a specification where the feature is defined.

The `spec_url` property is required if `standard_track` is set to `true`. However, currently, there is an [exception list](https://github.com/mdn/browser-compat-data/blob/main/lint/common/standard-track-exceptions.txt) for this requirement. BCD maintainers are working through this backlog. It updates automatically when you add a URL to a feature that doesn't currently have a `spec_url` property.

Each URL must link to a specification published by a standards body or a formal proposal that may lead to such publication.
To determine whether a specification host is valid, BCD relies on data from the [w3c/browser-specs](https://github.com/w3c/browser-specs) project.

If a specification is listed in browser-specs and has a [standing](https://github.com/w3c/browser-specs#standing) of "good", the URL will be accepted in BCD's `spec_url` field.

If BCD's linter complains about the provided URL, you will need to check its state within browser-specs. Common scenarios include:

- The specification is not yet part of browser-specs. Check whether an issue already exists; if not, open one one and ask whether the W3C would consider adding the specification.
- The specification no longer has a "good" standing. Check if there is a new version of the specification (at a different URL), or if the specification development has been discontinued (and the features in BCD should be considered "non-standard" from this point on). If the specification cannot be added to browser-specs, but there is a reason it should be in BCD, you can add it to BCD's [specification host exception list](https://github.com/mdn/browser-compat-data/blob/main/lint/linter/test-spec-urls.js). Only do this as a last resort.
- The specification URL doesn't contain a fragment identifier. You will have to add one. It looks like this: `https://tc39.es/proposal-promise-allSettled/#sec-promise.allsettled`.

## Best practices

In addition to the validated rules above, the following best practices have emerged:

### Events

For events, provide two URLs: one for the `.onevent` property definition, and one for the event itself.

```json
"spec_url": [
  "https://drafts.csswg.org/web-animations-1/#dom-animation-oncancel",
  "https://drafts.csswg.org/web-animations-1/#cancel-event"
],
```

### Maplikes, Setlikes, Iterables

When the interface has "entries", "forEach", "get", "has", "keys", "values", "@@iterator" methods and a "size" getter via "maplike", "setlike", or "iterable" IDL constructs, link to the interface containing the definition and not to the IDL standard.

```json
👍  "spec_url": "https://webaudio.github.io/web-audio-api/#audioparammap",

👍  "spec_url": "https://drafts.css-houdini.org/css-typed-om/#cssnumericarray",

👎  "spec_url": "https://webidl.spec.whatwg.org/#dfn-maplike",

👎  "spec_url": "https://webidl.spec.whatwg.org/#dfn-iterable",
```

### Worker support, secure_context_required

For BCD keys named `worker_support` and `secure_context_required`, link to the main interface specification, since these IDL flags appear alongside the interface definition (for example, `[SecureContext, Exposed=(Window,Worker)]`).
