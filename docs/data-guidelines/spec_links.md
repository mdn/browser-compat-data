# Data guidelines for the `spec_url` property

The browser-compat-data project (BCD) uses the `spec_url` property to map compatibility data to features described in specifications.

The following `spec_url` guidelines give advice on how to provide good links to specifications. They are based on a discussion in [#29582](https://github.com/mdn/browser-compat-data/pull/29582/).

## Benefits

Maintaining pointers to specifications from BCD features provides several benefits:

- Specifications can show compatibility data inline next to feature definitions.
- If a `spec_url` is provided, BCD itself or other data consumers, can treat the feature as standardized. In the absence of a `spec_url`, we could say that the feature is non-standard.
- By having validated deep links (fragment identifiers), BCD can more precisely identify the feature and we can be sure it really exists in the provided specification. Fragment ids are also helpful when trying to understand descriptions of BCD behavioral features.
- It enables statistics and coverage analysis. Which BCD features are standardized? Which standards bodies standardize? And more.
- It helps developers and implementers know where to give feedback on a feature's defined behavior.

## Schema definition and validation

The `spec_url` property is defined and validated by the BCD JSON schema: It may be either a single URL or an array of URLs, each pointing to a specific part of a specification where the feature is defined.

The `spec_url` property is required if `standard_track` is set to `true`. However, currently, there is an [exception list](https://github.com/mdn/browser-compat-data/blob/main/lint/common/standard-track-exceptions.txt) for this requirement. BCD maintainers are working through this backlog. It updates automatically when you add a URL to a feature that doesn't currently have a `spec_url` property.

Each URL must link to a specification published by a standards body or a formal proposal that may lead to such publication.
To determine whether a specification host is valid, BCD relies on data from the [w3c/browser-specs](https://github.com/w3c/browser-specs) project.

If a specification is listed in browser-specs and has a [standing](https://github.com/w3c/browser-specs#standing) of "good", the URL will be accepted in BCD's `spec_url` field.

If BCD's linter complains about the provided URL, you will need to check its state within browser-specs. Common scenarios include:

- The specification is not yet part of browser-specs. Check whether an issue already exists; if not, open one and ask whether the W3C would consider adding the specification.
- The specification no longer has a "good" standing. Check if there is a new version of the specification (at a different URL), or if the specification development has been discontinued (and the features in BCD should be considered "non-standard" from this point on).
- If the specification cannot be added to browser-specs, but there is a reason it should be in BCD, you can add it to BCD's [specification host exception list](https://github.com/mdn/browser-compat-data/blob/main/lint/common/spec-urls-exceptions.txt). Only do this as a last resort. The specifications hosted at https://github.com/WebAssembly and https://registry.khronos.org/webgl/extensions/ are part of the exception list by default.
- The specification URL doesn't contain a fragment identifier. You will have to add one. It looks like this: `https://tc39.es/proposal-promise-allSettled/#sec-promise.allsettled`.
- The specification URL's fragment identifier does not validate against [webref](https://github.com/w3c/webref) IDs. Try to provide a better fragment identifier. Or, only as a last resort, use text fragments (`#:~:text=`).

## Best practices

In addition to the validated rules above, the following best practices have emerged.

### Aim to provide just one URL

The `spec_url` property allows to take an array of multiple URLs, however, as a general guiding principle, provide just the single most meaningful URL. For example, don't add multiple (historical) versions of specifications.

If you find yourself in a situation where your BCD (behavioral) feature points to several URLs of a specification, this could actually be a strong hint that you should split up the feature into multiple BCD feature keys.

See below for cases where we actually recommend multiple URLs (events and specifications extending other specifications).

### Removed features

If a feature has been removed from a specification, this is a _de facto_ deprecation (see [Setting `deprecated`](./README.md#setting-deprecated)).
If possible, set the feature's `spec_url` to point to current specification text that acknowledges the removal (for example, a _Changes_ section).

### Events

For events, provide two URLs: one for the `.onevent` property definition, and one for the event itself.

```json
"spec_url": [
  "https://drafts.csswg.org/web-animations-1/#dom-animation-oncancel",
  "https://drafts.csswg.org/web-animations-1/#cancel-event"
],
```

### Specifications extending other specifications

When a specification extends the definition of another specification, it makes sense to list both as `spec_urls`. For example:

- ECMA 262 is extended by ECMA 402
  - https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.prototype.tolocaledatestring
  - https://tc39.es/ecma402/#sup-date.prototype.tolocaledatestring
- SVG and CSS both define a property
  - https://drafts.csswg.org/css-inline/#baseline-shift-property
  - https://w3c.github.io/svgwg/svg2-draft/text.html#BaselineShiftProperty
- API interfaces which have a core definition and and extended in other specifications.
- CSS properties which an initial definition in one level of a spec, and are completed in a subsequent diff spec.

### Maplikes, Setlikes, Iterables

When the interface has "entries", "forEach", "get", "has", "keys", "values", "@@iterator" methods and a "size" getter via "maplike", "setlike", or "iterable" IDL constructs, link to the interface containing the definition and not to the IDL standard.

```text
👍  "spec_url": "https://webaudio.github.io/web-audio-api/#audioparammap",

👍  "spec_url": "https://drafts.css-houdini.org/css-typed-om/#cssnumericarray",

👎  "spec_url": "https://webidl.spec.whatwg.org/#dfn-maplike",

👎  "spec_url": "https://webidl.spec.whatwg.org/#dfn-iterable",
```

### WebIDL flags

WebIDL flags can map to certain BCD feature keys:

- `[SecureContext]` uses `secure_context_required`
- `[Exposed=Worker]` (and similar) use `worker_support`

WebIDL flags belong to specific WebIDL features, like an interface or a method. The specifications offer no direct link to flag definitions, therefore the specification URL used for the feature itself should be used.

For example, if the `[SecureContext]` flag appears in front of an WebIDL interface definition, the `spec_url` for the `secure_context_required` feature is the same as the interface's `spec_url`.

```json
"secure_context_required": {
  "__compat": {
    "description": "Secure context required",
    "spec_url": "https://w3c.github.io/battery/#the-batterymanager-interface",
```

If the `[SecureContext]` flag appears in front of an WebIDL method definition, use the `spec_url` for the method.

```json
"secure_context_required": {
    "__compat": {
      "description": "Secure context required",
      "spec_url": "https://wicg.github.io/ua-client-hints/#dom-navigatorua-useragentdata",
```

### Avoid text fragment links

Specification URLs are validated against [webref](https://github.com/w3c/webref) IDs to make sure BCD only records features which are actually defined in the provided specification. Linking to text using `#:~:text=` fragment identifiers opts out of this validation. Use this opt-out rarely.
