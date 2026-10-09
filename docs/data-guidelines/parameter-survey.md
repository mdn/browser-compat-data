# Survey of parameter feature conventions

This is the survey requested in
[#29572](https://github.com/mdn/browser-compat-data/issues/29572): a record of how the
`api/` tree *actually* represents function and method parameters, measured against the
[parameters and parameter object features guideline](./README.md#parameters-and-parameter-object-features).

The numbers below were produced by a script walk over `api/` (1103 JSON files) which
collects every key ending in `_parameter` (plus `__compat`), classifies the key and its
`description`, and records where the key sits in the tree. The tidy tables are stored in
[`docs/data-guidelines/parameter-survey-data.json`](./parameter-survey-data.json) so they
can be re-derived and diffed later.

## What the data looks like today

* `197` `_parameter` subfeatures, spread across `55` JSON files and `97` distinct methods,
  constructors and static members.
* **Only two naming schemes are in use.** There are no `ordinal_parameter` features at
  all — the `ordinal` case from the guideline is unused in practice.
* **`184` of the `197` descriptions are the exact back-ticked form** `` `<x>` parameter ``
  or `` `<obj>.<prop>` parameter ``. The remaining `13` are prose, or empty.
* `170` of the `197` are leaf features. `27` have child features of their own.
* Only `21` carry an `mdn_url`; the other `176` do not, which is why the description text
  is the only user-visible label.

### Scheme 1 — plain parameter name (`<param>_parameter`)

`79` features, the smaller of the two.

```
api.Request.Request.options_parameter                       "options" parameter
api.ReportingObserver.ReportingObserver.options_parameter   "options" parameter
api.CanvasRenderingContext2D.setTransform.matrix_parameter  Accept matrix object as parameter
api.IDBObjectStore.getAll.object_parameter                 Object as parameter
```

This scheme is right for a parameter that is *not* a dictionary, or that represents the
dictionary as a whole (`options`). The whole-object form is the dominant one: `options`
appears as the parameter name `13` times.

### Scheme 2 — parameter object property (`<param>_<prop>_parameter`)

`118` features, and the most common scheme by a factor of 1.5. The description always
carries the dotted path:

```
api.PointerEvent.PointerEvent.options_altitudeAngle_parameter   "options.altitudeAngle" parameter
api.USB.requestDevice.options_exclusionFilters_parameter       "options.exclusionFilters" parameter
api.GamepadHapticActuator.playEffect.params_leftTrigger_parameter  "params.leftTrigger" parameter
```

### The in-between case the guideline does not cover

`27` parameters carry children, and here the tree diverges from the flattening rule. Two
patterns exist side by side:

1. **Flattened into the parent** — the parameter object is `options_parameter`, and its
   properties hang off it as further `_parameter` keys:

   ```
   api.EventTarget.addEventListener.options_parameter
       options_capture_parameter        "options.capture" parameter
       options_once_parameter           "options.once" parameter
       options_passive_parameter        "options.passive" parameter
       options_signal_parameter         "options.signal" parameter
   ```

   This is scheme 1 followed by scheme 2, and is the most common shape of the 27.

2. **Mixed naming** — `api.HTMLSelectElement.add.index_before_parameter` uses the scheme 2
   key but a description that reads `Index as `before` parameter`, which neither scheme
   defines.

### Deviations from the guideline

`39` of the `197` features do not match the guideline's own description rule. They fall
into four groups:

* **Two-level nesting using scheme-2 keys but a fully-dotted description** (`21`
  features): `api.RTCEncodedAudioFrame` and `api.RTCEncodedVideoFrame` use
  `options_metadata_<prop>_parameter` with a description of
  `` `options.metadata.<prop>` parameter ``. The key joins with `_`, the description
  joins with `.`, so a mechanical reader cannot tell which is the parameter object.
* **Property name missing from the key or mismatched in the description** (`9`
  features): `api.GPUDevice.createTexture.descriptor_usage_parameter` is described as
  `` `usage` descriptor ``, and `api.Performance.mark.markOptions_detail_devtools_parameter`
  as `` `markOptions.details.devtools` parameter `` — the description has an extra
  segment the key does not.
* **Prose instead of the label form** (`8` features): "Object as parameter",
  "Accept matrix object as parameter", "Form with `options` object supported…",
  "Whether the `unused` parameter is used".
* **Empty or wrong case** (`1` feature each): `api.ImageData.ImageData.settings_parameter`
  has no description at all, and `api.ShadowRoot.setHTMLUnsafe.options_runscripts_parameter`
  writes `` `options.runScripts` `` whereas the key says `runscripts`.

### The uncommon shapes

* `api.RTCEncodedVideoFrame` (`12`) and `api.RTCEncodedAudioFrame` (`9`) alone account for
  `21` of the `118` scheme-2 features and are the source of most deviations.
* The largest non-flattened users of scheme 2 are
  `api.ServiceWorkerRegistration.showNotification` (`7`), `api.Element.animate` (`7`)
  and `api.console.timeStamp_static` (`7`).
* `api.RTCPeerConnection.RTCPeerConnection.configuration_iceServers_parameter` is the only
  feature that mixes both patterns under one key: it has
  `url_parameter`, `urls_parameter`, `username_parameter`, `credential_parameter` and
  `credentialType_parameter` as children, while still being named for the *grandparent*
  object.

## Proposed conclusion for the guideline

The guideline's three rules are each motivated by real data, but the section is missing the
two things this survey actually shows:

1. **A rule for the nested case.** Today the same logical structure is written both ways:
   flattened (`addEventListener.options_parameter → options_capture_parameter`) and
   keyed to the grandparent (`configuration_iceServers_parameter → url_parameter`). The
   guideline should say that the parameter object name in the key is whatever appears in
   the description, i.e. `configuration_iceServers_parameter` should be described as
   `` `configuration.iceServers` parameter `` and its children as `` `iceServers.url` parameter ``
   rather than `url_parameter`.
2. **A rule on the flat vs. nested choice.** Where a dictionary is small and appears in one
   place, flattening is fine; where it is large (the `RTCPeerConnection` constructor) or
   shared across members, nesting it as an explicit parameter object feature is what the
   data already does. The guideline currently implies blanket flattening.

Adding these two rules would let the 39 deviations above be fixed mechanically, and let
new data avoid them.
