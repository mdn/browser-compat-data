# @mdn/browser-compat-data release notes

## [v5.3.2](https://github.com/mdn/browser-compat-data/releases/tag/v5.3.2)

July 11, 2023

### Additions

- `browsers.deno.releases.1.35` ([#20295](https://github.com/mdn/browser-compat-data/pull/20295))

### Statistics

- 9 contributors have changed 21 files with 612 additions and 833 deletions in 15 commits ([`v5.3.1...v5.3.2`](https://github.com/mdn/browser-compat-data/compare/v5.3.1...v5.3.2))
- 14,817 total features
- 1,018 total contributors
- 4,532 total stargazers

## [v5.3.1](https://github.com/mdn/browser-compat-data/releases/tag/v5.3.1)

July 7, 2023

### Removals

- `api.Navigator.registerProtocolHandler.title_parameter_required` ([#20268](https://github.com/mdn/browser-compat-data/pull/20268))

### Additions

- `api.CredentialsContainer.get.otp_option` ([#20101](https://github.com/mdn/browser-compat-data/pull/20101))
- `api.CustomElementRegistry.getName` ([#20186](https://github.com/mdn/browser-compat-data/pull/20186))
- `api.GPU.requestAdapter.discrete_adapter_default_ac` ([#20281](https://github.com/mdn/browser-compat-data/pull/20281))
- `api.GPURenderBundleEncoder.setVertexBuffer.unset_vertex_buffer` ([#20281](https://github.com/mdn/browser-compat-data/pull/20281))
- `api.GPURenderPassEncoder.setVertexBuffer.unset_vertex_buffer` ([#20281](https://github.com/mdn/browser-compat-data/pull/20281))
- `browsers.chrome_android.releases.117` ([#20257](https://github.com/mdn/browser-compat-data/pull/20257))
- `browsers.chrome_android.releases.118` ([#20257](https://github.com/mdn/browser-compat-data/pull/20257))
- `browsers.chrome.releases.117` ([#20257](https://github.com/mdn/browser-compat-data/pull/20257))
- `browsers.chrome.releases.118` ([#20257](https://github.com/mdn/browser-compat-data/pull/20257))
- `browsers.edge.releases.116` ([#20257](https://github.com/mdn/browser-compat-data/pull/20257))
- `browsers.edge.releases.117` ([#20257](https://github.com/mdn/browser-compat-data/pull/20257))
- `browsers.edge.releases.118` ([#20257](https://github.com/mdn/browser-compat-data/pull/20257))
- `browsers.webview_android.releases.117` ([#20257](https://github.com/mdn/browser-compat-data/pull/20257))
- `browsers.webview_android.releases.118` ([#20257](https://github.com/mdn/browser-compat-data/pull/20257))
- `css.properties.animation-duration.auto` ([#20132](https://github.com/mdn/browser-compat-data/pull/20132))
- `html.global_attributes.autocomplete.one-time-code` ([#20101](https://github.com/mdn/browser-compat-data/pull/20101))
- `http.headers.Permissions-Policy.otp-credentials` ([#20101](https://github.com/mdn/browser-compat-data/pull/20101))
- `webextensions.api.declarativeNetRequest.RuleCondition.isUrlFilterCaseSensitive` ([#20130](https://github.com/mdn/browser-compat-data/pull/20130))
- `webextensions.manifest.optional_permissions.devtools` ([#20107](https://github.com/mdn/browser-compat-data/pull/20107))
- `webextensions.manifest.permissions.devtools` ([#20107](https://github.com/mdn/browser-compat-data/pull/20107))

### Statistics

- 16 contributors have changed 60 files with 4,570 additions and 594 deletions in 52 commits ([`v5.3.0...v5.3.1`](https://github.com/mdn/browser-compat-data/compare/v5.3.0...v5.3.1))
- 14,817 total features
- 1,017 total contributors
- 4,530 total stargazers

## [v5.3.0](https://github.com/mdn/browser-compat-data/releases/tag/v5.3.0)

June 27, 2023

### Notable changes

In this release, we have added a brand new category for WebAssembly features. This data is based on https://mdn-bcd-collector.gooborg.com/tests/webassembly, which uses https://github.com/GoogleChromeLabs/wasm-feature-detect to detect feature support.

### Removals

- `api.Request.Request.navigate_mode` ([#20193](https://github.com/mdn/browser-compat-data/pull/20193))

### Additions

- `http.headers.Sec-Purpose` ([#20169](https://github.com/mdn/browser-compat-data/pull/20169))
- `webassembly.BigInt-to-i64-integration` ([#20136](https://github.com/mdn/browser-compat-data/pull/20136))
- `webassembly.bulk-memory-operations` ([#20136](https://github.com/mdn/browser-compat-data/pull/20136))
- `webassembly.exception-handling` ([#20136](https://github.com/mdn/browser-compat-data/pull/20136))
- `webassembly.extended-constant-expressions` ([#20136](https://github.com/mdn/browser-compat-data/pull/20136))
- `webassembly.fixed-width-SIMD` ([#20136](https://github.com/mdn/browser-compat-data/pull/20136))
- `webassembly.multi-value` ([#20136](https://github.com/mdn/browser-compat-data/pull/20136))
- `webassembly.mutable-globals` ([#20136](https://github.com/mdn/browser-compat-data/pull/20136))
- `webassembly.non-trapping-float-to-int-conversions` ([#20136](https://github.com/mdn/browser-compat-data/pull/20136))
- `webassembly.reference-types` ([#20136](https://github.com/mdn/browser-compat-data/pull/20136))
- `webassembly.sign-extension-operations` ([#20136](https://github.com/mdn/browser-compat-data/pull/20136))
- `webassembly.tail-calls` ([#20136](https://github.com/mdn/browser-compat-data/pull/20136))
- `webassembly.threads-and-atomics` ([#20136](https://github.com/mdn/browser-compat-data/pull/20136))
- `webextensions.api.tabs.onUpdated.changeInfo.autoDiscardable` ([#20211](https://github.com/mdn/browser-compat-data/pull/20211))

### Statistics

- 6 contributors have changed 41 files with 597 additions and 86 deletions in 13 commits ([`v5.2.67...v5.3.0`](https://github.com/mdn/browser-compat-data/compare/v5.2.67...v5.3.0))
- 14,807 total features
- 1,012 total contributors
- 4,523 total stargazers

## [v5.2.67](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.67)

June 23, 2023

### Removals

- `api.USBPermissionResult` ([#20206](https://github.com/mdn/browser-compat-data/pull/20206))
- `api.USBPermissionResult.devices` ([#20206](https://github.com/mdn/browser-compat-data/pull/20206))
- `api.WebTransport.draining` ([#20167](https://github.com/mdn/browser-compat-data/pull/20167))

### Statistics

- 4 contributors have changed 23 files with 133 additions and 180 deletions in 23 commits ([`v5.2.66...v5.2.67`](https://github.com/mdn/browser-compat-data/compare/v5.2.66...v5.2.67))
- 14,794 total features
- 1,012 total contributors
- 4,519 total stargazers

## [v5.2.66](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.66)

June 20, 2023

### Removals

- `api.AnimationTimeline.getCurrentTime` ([#20158](https://github.com/mdn/browser-compat-data/pull/20158))
- `api.InstallEvent.activeWorker` ([#20138](https://github.com/mdn/browser-compat-data/pull/20138))
- `api.Plugin.version` ([#20168](https://github.com/mdn/browser-compat-data/pull/20168))
- `css.at-rules.page.page` ([#20165](https://github.com/mdn/browser-compat-data/pull/20165))
- `css.properties.line-height.-moz-block-height` ([#20143](https://github.com/mdn/browser-compat-data/pull/20143))
- `css.properties.overflow-clip-box` ([#20148](https://github.com/mdn/browser-compat-data/pull/20148))
- `css.properties.overflow-clip-box-block` ([#20148](https://github.com/mdn/browser-compat-data/pull/20148))
- `css.properties.overflow-clip-box-inline` ([#20148](https://github.com/mdn/browser-compat-data/pull/20148))
- `css.properties.overflow-clip-box.shorthand` ([#20148](https://github.com/mdn/browser-compat-data/pull/20148))
- `css.properties.scroll-snap-coordinate` ([#20146](https://github.com/mdn/browser-compat-data/pull/20146))
- `css.properties.scroll-snap-destination` ([#20146](https://github.com/mdn/browser-compat-data/pull/20146))
- `css.properties.scroll-snap-points-x` ([#20146](https://github.com/mdn/browser-compat-data/pull/20146))
- `css.properties.scroll-snap-points-y` ([#20146](https://github.com/mdn/browser-compat-data/pull/20146))
- `css.properties.scroll-snap-type-x` ([#20146](https://github.com/mdn/browser-compat-data/pull/20146))
- `css.properties.scroll-snap-type-y` ([#20146](https://github.com/mdn/browser-compat-data/pull/20146))
- `css.properties.text-underline-position.above_below` ([#20172](https://github.com/mdn/browser-compat-data/pull/20172))
- `css.properties.text-underline-position.auto-pos` ([#20173](https://github.com/mdn/browser-compat-data/pull/20173))
- `css.properties.width.fill` ([#20171](https://github.com/mdn/browser-compat-data/pull/20171))

### Additions

- `api.URLSearchParams.delete.value_parameter` ([#20110](https://github.com/mdn/browser-compat-data/pull/20110))
- `api.URLSearchParams.has.value_parameter` ([#20110](https://github.com/mdn/browser-compat-data/pull/20110))
- `browsers.chrome_android.releases.116` ([#20159](https://github.com/mdn/browser-compat-data/pull/20159))
- `browsers.chrome.releases.116` ([#20159](https://github.com/mdn/browser-compat-data/pull/20159))
- `browsers.nodejs.releases.20.2.0` ([#20163](https://github.com/mdn/browser-compat-data/pull/20163))
- `browsers.webview_android.releases.116` ([#20159](https://github.com/mdn/browser-compat-data/pull/20159))
- `css.properties.timeline-scope` ([#20158](https://github.com/mdn/browser-compat-data/pull/20158))

### Statistics

- 7 contributors have changed 40 files with 311 additions and 1,058 deletions in 29 commits ([`v5.2.65...v5.2.66`](https://github.com/mdn/browser-compat-data/compare/v5.2.65...v5.2.66))
- 14,797 total features
- 1,010 total contributors
- 4,519 total stargazers

## [v5.2.65](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.65)

June 16, 2023

### Additions

- `api.GPU.wgslLanguageFeatures` ([#20111](https://github.com/mdn/browser-compat-data/pull/20111))
- `api.VisibilityStateEntry` ([#20119](https://github.com/mdn/browser-compat-data/pull/20119))
- `api.WGSLLanguageFeatures` ([#20111](https://github.com/mdn/browser-compat-data/pull/20111))
- `api.WGSLLanguageFeatures.@@iterator` ([#20111](https://github.com/mdn/browser-compat-data/pull/20111))
- `api.WGSLLanguageFeatures.entries` ([#20111](https://github.com/mdn/browser-compat-data/pull/20111))
- `api.WGSLLanguageFeatures.forEach` ([#20111](https://github.com/mdn/browser-compat-data/pull/20111))
- `api.WGSLLanguageFeatures.has` ([#20111](https://github.com/mdn/browser-compat-data/pull/20111))
- `api.WGSLLanguageFeatures.keys` ([#20111](https://github.com/mdn/browser-compat-data/pull/20111))
- `api.WGSLLanguageFeatures.size` ([#20111](https://github.com/mdn/browser-compat-data/pull/20111))
- `api.WGSLLanguageFeatures.values` ([#20111](https://github.com/mdn/browser-compat-data/pull/20111))

### Statistics

- 5 contributors have changed 13 files with 792 additions and 236 deletions in 17 commits ([`v5.2.64...v5.2.65`](https://github.com/mdn/browser-compat-data/compare/v5.2.64...v5.2.65))
- 14,812 total features
- 1,010 total contributors
- 4,516 total stargazers

## [v5.2.64](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.64)

June 13, 2023

### Notable changes

Static methods are now suffixed with `_static`. See [#16613](https://github.com/mdn/browser-compat-data/issues/16613) for more details.

### Removals

- `api.AbortSignal.abort` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.AbortSignal.abort.reason_parameter` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.AbortSignal.timeout` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.AudioDecoder.isConfigSupported` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.AudioEncoder.isConfigSupported` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.BarcodeDetector.getSupportedFormats` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.BluetoothUUID.canonicalUUID` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.BluetoothUUID.getCharacteristic` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.BluetoothUUID.getDescriptor` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.BluetoothUUID.getService` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.Credential.isConditionalMediationAvailable` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CropTarget.fromElement` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.ch` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.cm` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.cqb` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.cqh` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.cqi` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.cqmax` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.cqmin` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.cqw` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.deg` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.dpcm` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.dpi` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.dppx` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.dvb` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.dvh` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.dvi` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.dvmax` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.dvmin` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.dvw` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.em` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.escape` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.ex` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.fr` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.grad` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.highlights` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.Hz` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.in` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.kHz` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.lvb` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.lvh` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.lvi` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.lvmax` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.lvmin` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.lvw` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.mm` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.ms` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.number` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.paintWorklet` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.pc` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.percent` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.pt` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.px` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.Q` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.rad` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.registerProperty` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.rem` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.s` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.supports` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.svb` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.svh` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.svi` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.svmax` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.svmin` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.svw` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.turn` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.vb` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.vh` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.vi` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.vmax` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.vmin` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.vw` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSSNumericValue.parse` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSSStyleValue.parse` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSSStyleValue.parseAll` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DeviceMotionEvent.requestPermission` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DeviceOrientationEvent.requestPermission` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMMatrix.fromFloat32Array` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMMatrix.fromFloat64Array` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMMatrix.fromMatrix` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMMatrixReadOnly.fromFloat32Array` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMMatrixReadOnly.fromFloat64Array` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMMatrixReadOnly.fromMatrix` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMPoint.fromPoint` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMPointReadOnly.fromPoint` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMQuad.fromQuad` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMQuad.fromRect` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMRect.fromRect` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMRectReadOnly.fromRect` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.HTMLScriptElement.supports` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.IDBKeyRange.bound` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.IDBKeyRange.lowerBound` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.IDBKeyRange.only` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.IDBKeyRange.upperBound` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.IdleDetector.requestPermission` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.ImageDecoder.isTypeSupported` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.MediaRecorder.isTypeSupported` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.MediaSource.canConstructInDedicatedWorker` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.MediaSource.isTypeSupported` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.Notification.maxActions` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.Notification.permission` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.Notification.requestPermission` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.PerformanceObserver.supportedEntryTypes` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.PublicKeyCredential.isConditionalMediationAvailable` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.PushManager.supportedContentEncodings` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.Response.error` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.Response.redirect` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.RTCPeerConnection.generateCertificate` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.RTCRtpReceiver.getCapabilities` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.RTCRtpSender.getCapabilities` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.Sanitizer.getDefaultConfiguration` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.URL.createObjectURL` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.URL.revokeObjectURL` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.VideoDecoder.isConfigSupported` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.VideoEncoder.isConfigSupported` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.XRWebGLLayer.getNativeFramebufferScaleFactor` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))

### Additions

- `api.AbortSignal.abort_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.AbortSignal.abort_static.reason_parameter` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.AbortSignal.timeout_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.AudioDecoder.isConfigSupported_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.AudioEncoder.isConfigSupported_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.BarcodeDetector.getSupportedFormats_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.BluetoothUUID.canonicalUUID_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.BluetoothUUID.getCharacteristic_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.BluetoothUUID.getDescriptor_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.BluetoothUUID.getService_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.Credential.isConditionalMediationAvailable_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CropTarget.fromElement_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.ch_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.cm_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.cqb_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.cqh_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.cqi_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.cqmax_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.cqmin_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.cqw_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.deg_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.dpcm_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.dpi_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.dppx_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.dvb_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.dvh_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.dvi_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.dvmax_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.dvmin_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.dvw_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.em_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.escape_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.ex_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.fr_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.grad_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.highlights_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.Hz_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.in_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.kHz_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.lvb_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.lvh_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.lvi_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.lvmax_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.lvmin_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.lvw_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.mm_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.ms_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.number_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.paintWorklet_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.pc_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.percent_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.pt_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.px_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.Q_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.rad_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.registerProperty_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.rem_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.s_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.supports_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.svb_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.svh_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.svi_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.svmax_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.svmin_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.svw_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.turn_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.vb_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.vh_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.vi_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.vmax_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.vmin_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSS.vw_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSSNumericValue.parse_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSSStyleValue.parse_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.CSSStyleValue.parseAll_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DeviceMotionEvent.requestPermission_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DeviceOrientationEvent.requestPermission_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMMatrix.fromFloat32Array_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMMatrix.fromFloat64Array_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMMatrix.fromMatrix_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMMatrixReadOnly.fromFloat32Array_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMMatrixReadOnly.fromFloat64Array_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMMatrixReadOnly.fromMatrix_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMPoint.fromPoint_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMPointReadOnly.fromPoint_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMQuad.fromQuad_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMQuad.fromRect_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMRect.fromRect_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.DOMRectReadOnly.fromRect_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.HTMLScriptElement.supports_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.IDBKeyRange.bound_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.IDBKeyRange.lowerBound_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.IDBKeyRange.only_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.IDBKeyRange.upperBound_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.IdleDetector.requestPermission_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.ImageDecoder.isTypeSupported_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.MediaRecorder.isTypeSupported_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.MediaSource.canConstructInDedicatedWorker_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.MediaSource.isTypeSupported_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.Notification.maxActions_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.Notification.permission_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.Notification.requestPermission_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.PerformanceObserver.supportedEntryTypes_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.PublicKeyCredential.isConditionalMediationAvailable_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.PushManager.supportedContentEncodings_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.Response.error_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.Response.json_static` ([#20083](https://github.com/mdn/browser-compat-data/pull/20083))
- `api.Response.redirect_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.RTCPeerConnection.generateCertificate_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.RTCRtpReceiver.getCapabilities_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.RTCRtpSender.getCapabilities_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.Sanitizer.getDefaultConfiguration_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.URL.canParse_static` ([#20093](https://github.com/mdn/browser-compat-data/pull/20093))
- `api.URL.createObjectURL_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.URL.revokeObjectURL_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.VideoDecoder.isConfigSupported_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.VideoEncoder.isConfigSupported_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `api.XRWebGLLayer.getNativeFramebufferScaleFactor_static` ([#20063](https://github.com/mdn/browser-compat-data/pull/20063))
- `browsers.safari_ios.releases.17` ([#20064](https://github.com/mdn/browser-compat-data/pull/20064))
- `browsers.safari.releases.17` ([#20064](https://github.com/mdn/browser-compat-data/pull/20064))
- `http.headers.Access-Control-Allow-Headers.authorization_not_covered_by_wildcard` ([#20092](https://github.com/mdn/browser-compat-data/pull/20092))
- `javascript.builtins.Intl.DurationFormat` ([#15033](https://github.com/mdn/browser-compat-data/pull/15033))
- `javascript.builtins.Intl.DurationFormat.DurationFormat` ([#15033](https://github.com/mdn/browser-compat-data/pull/15033))
- `javascript.builtins.Intl.DurationFormat.format` ([#15033](https://github.com/mdn/browser-compat-data/pull/15033))
- `javascript.builtins.Intl.DurationFormat.formatToParts` ([#15033](https://github.com/mdn/browser-compat-data/pull/15033))
- `javascript.builtins.Intl.DurationFormat.resolvedOptions` ([#15033](https://github.com/mdn/browser-compat-data/pull/15033))
- `javascript.builtins.Intl.DurationFormat.supportedLocalesOf` ([#15033](https://github.com/mdn/browser-compat-data/pull/15033))
- `javascript.builtins.RegExp.unicodeSets` ([#20091](https://github.com/mdn/browser-compat-data/pull/20091))

### Statistics

- 16 contributors have changed 89 files with 1,071 additions and 348 deletions in 26 commits ([`v5.2.63...v5.2.64`](https://github.com/mdn/browser-compat-data/compare/v5.2.63...v5.2.64))
- 14,802 total features
- 1,009 total contributors
- 4,511 total stargazers

## [v5.2.63](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.63)

June 9, 2023

### Removals

- `css.properties.text-decoration.blink` ([#20056](https://github.com/mdn/browser-compat-data/pull/20056))
- `html.global_attributes.contenteditable.caret` ([#20071](https://github.com/mdn/browser-compat-data/pull/20071))
- `html.global_attributes.contenteditable.events` ([#20071](https://github.com/mdn/browser-compat-data/pull/20071))
- `html.global_attributes.contenteditable.typing` ([#20071](https://github.com/mdn/browser-compat-data/pull/20071))

### Additions

- `html.manifest.shortcuts` ([#20059](https://github.com/mdn/browser-compat-data/pull/20059))

### Statistics

- 7 contributors have changed 39 files with 318 additions and 351 deletions in 28 commits ([`v5.2.62...v5.2.63`](https://github.com/mdn/browser-compat-data/compare/v5.2.62...v5.2.63))
- 14,792 total features
- 1,006 total contributors
- 4,512 total stargazers

## [v5.2.62](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.62)

June 6, 2023

### Removals

- `api.DeviceLightEvent` ([#20014](https://github.com/mdn/browser-compat-data/pull/20014))
- `api.DeviceLightEvent.value` ([#20014](https://github.com/mdn/browser-compat-data/pull/20014))
- `api.DeviceProximityEvent` ([#20014](https://github.com/mdn/browser-compat-data/pull/20014))
- `api.DeviceProximityEvent.max` ([#20014](https://github.com/mdn/browser-compat-data/pull/20014))
- `api.DeviceProximityEvent.min` ([#20014](https://github.com/mdn/browser-compat-data/pull/20014))
- `api.DeviceProximityEvent.value` ([#20014](https://github.com/mdn/browser-compat-data/pull/20014))
- `api.UserProximityEvent` ([#20014](https://github.com/mdn/browser-compat-data/pull/20014))
- `api.UserProximityEvent.near` ([#20014](https://github.com/mdn/browser-compat-data/pull/20014))
- `api.WebGL2RenderingContext.commit` ([#20011](https://github.com/mdn/browser-compat-data/pull/20011))
- `api.WebGLRenderingContext.commit` ([#20011](https://github.com/mdn/browser-compat-data/pull/20011))
- `api.Window.deviceproximity_event` ([#20014](https://github.com/mdn/browser-compat-data/pull/20014))
- `api.Window.userproximity_event` ([#20014](https://github.com/mdn/browser-compat-data/pull/20014))

### Additions

- `api.AnimationTimeline.getCurrentTime` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `api.Element.animate.options_rangeEnd_parameter` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `api.Element.animate.options_rangeStart_parameter` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `api.ScrollTimeline` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `api.ScrollTimeline.axis` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `api.ScrollTimeline.ScrollTimeline` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `api.ScrollTimeline.source` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `api.SVGFEImageElement.crossOrigin` ([#19999](https://github.com/mdn/browser-compat-data/pull/19999))
- `api.SVGImageElement.crossOrigin` ([#19999](https://github.com/mdn/browser-compat-data/pull/19999))
- `api.ViewTimeline` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `api.ViewTimeline.endOffset` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `api.ViewTimeline.startOffset` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `api.ViewTimeline.subject` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `api.ViewTimeline.ViewTimeline` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `browsers.deno.releases.1.34` ([#20015](https://github.com/mdn/browser-compat-data/pull/20015))
- `css.at-rules.keyframes.named_range_keyframes` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `css.properties.animation-range` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `css.properties.animation-range-end` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `css.properties.animation-range-start` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `css.properties.animation-timeline.view` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `css.properties.animation.animation-timeline` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `css.properties.view-timeline` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `css.properties.view-timeline-axis` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `css.properties.view-timeline-inset` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `css.properties.view-timeline-name` ([#19942](https://github.com/mdn/browser-compat-data/pull/19942))
- `css.types.line-style` ([#19573](https://github.com/mdn/browser-compat-data/pull/19573))
- `css.types.overflow` ([#19483](https://github.com/mdn/browser-compat-data/pull/19483))
- `css.types.overflow.clip` ([#19483](https://github.com/mdn/browser-compat-data/pull/19483))
- `css.types.overflow.overlay` ([#19483](https://github.com/mdn/browser-compat-data/pull/19483))
- `svg.elements.feImage.crossorigin` ([#19999](https://github.com/mdn/browser-compat-data/pull/19999))
- `svg.elements.image.crossorigin` ([#19999](https://github.com/mdn/browser-compat-data/pull/19999))
- `svg.elements.image.decoding` ([#20038](https://github.com/mdn/browser-compat-data/pull/20038))

### Statistics

- 9 contributors have changed 58 files with 1,348 additions and 916 deletions in 37 commits ([`v5.2.61...v5.2.62`](https://github.com/mdn/browser-compat-data/compare/v5.2.61...v5.2.62))
- 14,795 total features
- 1,005 total contributors
- 4,507 total stargazers

## [v5.2.61](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.61)

June 2, 2023

### Removals

- `api.WebTransport.createBidirectionalStream.options_sendOrder_parameter` ([#19983](https://github.com/mdn/browser-compat-data/pull/19983))
- `api.WebTransport.createUnidirectionalStream.options_sendOrder_parameter` ([#19983](https://github.com/mdn/browser-compat-data/pull/19983))

### Additions

- `api.WebTransport.byob_readers` ([#19983](https://github.com/mdn/browser-compat-data/pull/19983))
- `api.WebTransportDatagramDuplexStream.byob_readers` ([#19983](https://github.com/mdn/browser-compat-data/pull/19983))
- `css.properties.content.gradient` ([#19896](https://github.com/mdn/browser-compat-data/pull/19896))
- `css.properties.content.image-set` ([#19896](https://github.com/mdn/browser-compat-data/pull/19896))
- `javascript.builtins.Date.UTC.optional_monthIndex` ([#19972](https://github.com/mdn/browser-compat-data/pull/19972))

### Statistics

- 8 contributors have changed 14 files with 274 additions and 235 deletions in 10 commits ([`v5.2.60...v5.2.61`](https://github.com/mdn/browser-compat-data/compare/v5.2.60...v5.2.61))
- 14,776 total features
- 1,005 total contributors
- 4,502 total stargazers

## [v5.2.60](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.60)

May 30, 2023

### Removals

- `api.SVGAltGlyphDefElement` ([#19776](https://github.com/mdn/browser-compat-data/pull/19776))
- `api.SVGAltGlyphElement` ([#19776](https://github.com/mdn/browser-compat-data/pull/19776))
- `api.SVGAltGlyphElement.format` ([#19776](https://github.com/mdn/browser-compat-data/pull/19776))
- `api.SVGAltGlyphElement.glyphRef` ([#19776](https://github.com/mdn/browser-compat-data/pull/19776))
- `api.SVGAltGlyphElement.href` ([#19776](https://github.com/mdn/browser-compat-data/pull/19776))
- `api.SVGAltGlyphItemElement` ([#19776](https://github.com/mdn/browser-compat-data/pull/19776))
- `html.elements.area.media` ([#19948](https://github.com/mdn/browser-compat-data/pull/19948))
- `html.elements.bgsound` ([#19655](https://github.com/mdn/browser-compat-data/pull/19655))
- `html.elements.blink` ([#19658](https://github.com/mdn/browser-compat-data/pull/19658))
- `html.elements.keygen` ([#19696](https://github.com/mdn/browser-compat-data/pull/19696))
- `html.elements.spacer` ([#19739](https://github.com/mdn/browser-compat-data/pull/19739))
- `svg.elements.altGlyph` ([#19776](https://github.com/mdn/browser-compat-data/pull/19776))
- `svg.elements.altGlyph.dx` ([#19776](https://github.com/mdn/browser-compat-data/pull/19776))
- `svg.elements.altGlyph.dy` ([#19776](https://github.com/mdn/browser-compat-data/pull/19776))
- `svg.elements.altGlyph.format` ([#19776](https://github.com/mdn/browser-compat-data/pull/19776))
- `svg.elements.altGlyph.glyphRef` ([#19776](https://github.com/mdn/browser-compat-data/pull/19776))
- `svg.elements.altGlyph.rotate` ([#19776](https://github.com/mdn/browser-compat-data/pull/19776))
- `svg.elements.altGlyph.x` ([#19776](https://github.com/mdn/browser-compat-data/pull/19776))
- `svg.elements.altGlyph.xlink_href` ([#19776](https://github.com/mdn/browser-compat-data/pull/19776))
- `svg.elements.altGlyph.y` ([#19776](https://github.com/mdn/browser-compat-data/pull/19776))
- `svg.elements.altGlyphDef` ([#19776](https://github.com/mdn/browser-compat-data/pull/19776))
- `svg.elements.altGlyphItem` ([#19776](https://github.com/mdn/browser-compat-data/pull/19776))
- `webextensions.api.tabs.onUpdated.extraParameters` ([#19970](https://github.com/mdn/browser-compat-data/pull/19970))
- `webextensions.api.tabs.onUpdated.extraParameters.properties.isArticle` ([#19970](https://github.com/mdn/browser-compat-data/pull/19970))

### Additions

- `api.CSSStyleRule.cssRules` ([#19915](https://github.com/mdn/browser-compat-data/pull/19915))
- `api.CSSStyleRule.deleteRule` ([#19915](https://github.com/mdn/browser-compat-data/pull/19915))
- `api.CSSStyleRule.insertRule` ([#19915](https://github.com/mdn/browser-compat-data/pull/19915))
- `api.GPUSupportedFeatures.@@iterator` ([#19923](https://github.com/mdn/browser-compat-data/pull/19923))
- `api.GPUSupportedFeatures.entries` ([#19923](https://github.com/mdn/browser-compat-data/pull/19923))
- `api.GPUSupportedFeatures.forEach` ([#19923](https://github.com/mdn/browser-compat-data/pull/19923))
- `api.GPUSupportedFeatures.has` ([#19923](https://github.com/mdn/browser-compat-data/pull/19923))
- `api.GPUSupportedFeatures.keys` ([#19923](https://github.com/mdn/browser-compat-data/pull/19923))
- `api.GPUSupportedFeatures.size` ([#19923](https://github.com/mdn/browser-compat-data/pull/19923))
- `api.GPUSupportedFeatures.values` ([#19923](https://github.com/mdn/browser-compat-data/pull/19923))
- `api.RTCStatsReport.@@iterator` ([#19924](https://github.com/mdn/browser-compat-data/pull/19924))
- `api.ServiceWorker.ecmascript_modules` ([#19835](https://github.com/mdn/browser-compat-data/pull/19835))
- `api.SharedWorker.SharedWorker.ecmascript_modules` ([#19835](https://github.com/mdn/browser-compat-data/pull/19835))
- `api.WebTransport.reliability` ([#19926](https://github.com/mdn/browser-compat-data/pull/19926))
- `api.Worklet.ecmascript_modules` ([#19835](https://github.com/mdn/browser-compat-data/pull/19835))
- `browsers.edge.releases.115` ([#19963](https://github.com/mdn/browser-compat-data/pull/19963))
- `browsers.samsunginternet_android.releases.21.0` ([#19964](https://github.com/mdn/browser-compat-data/pull/19964))
- `css.selectors.lang.argument_list` ([#19957](https://github.com/mdn/browser-compat-data/pull/19957))
- `css.selectors.lang.wildcards` ([#19957](https://github.com/mdn/browser-compat-data/pull/19957))
- `javascript.statements.import.service_worker_support` ([#19835](https://github.com/mdn/browser-compat-data/pull/19835))
- `javascript.statements.import.worklet_support` ([#19835](https://github.com/mdn/browser-compat-data/pull/19835))
- `webextensions.api.commands.onChanged` ([#19944](https://github.com/mdn/browser-compat-data/pull/19944))
- `webextensions.api.tabs.onUpdated.filter` ([#19970](https://github.com/mdn/browser-compat-data/pull/19970))
- `webextensions.api.tabs.onUpdated.filter.properties.isArticle` ([#19970](https://github.com/mdn/browser-compat-data/pull/19970))

### Statistics

- 12 contributors have changed 191 files with 8,457 additions and 8,544 deletions in 76 commits ([`v5.2.59...v5.2.60`](https://github.com/mdn/browser-compat-data/compare/v5.2.59...v5.2.60))
- 14,773 total features
- 1,005 total contributors
- 4,498 total stargazers

## [v5.2.59](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.59)

May 19, 2023

### Removals

- `html.elements.applet` ([#19645](https://github.com/mdn/browser-compat-data/pull/19645))
- `html.elements.applet.align` ([#19645](https://github.com/mdn/browser-compat-data/pull/19645))
- `html.elements.applet.alt` ([#19645](https://github.com/mdn/browser-compat-data/pull/19645))
- `html.elements.applet.archive` ([#19645](https://github.com/mdn/browser-compat-data/pull/19645))
- `html.elements.applet.code` ([#19645](https://github.com/mdn/browser-compat-data/pull/19645))
- `html.elements.applet.codebase` ([#19645](https://github.com/mdn/browser-compat-data/pull/19645))
- `html.elements.applet.datafld` ([#19645](https://github.com/mdn/browser-compat-data/pull/19645))
- `html.elements.applet.datasrc` ([#19645](https://github.com/mdn/browser-compat-data/pull/19645))
- `html.elements.applet.height` ([#19645](https://github.com/mdn/browser-compat-data/pull/19645))
- `html.elements.applet.hspace` ([#19645](https://github.com/mdn/browser-compat-data/pull/19645))
- `html.elements.applet.mayscript` ([#19645](https://github.com/mdn/browser-compat-data/pull/19645))
- `html.elements.applet.name` ([#19645](https://github.com/mdn/browser-compat-data/pull/19645))
- `html.elements.applet.object` ([#19645](https://github.com/mdn/browser-compat-data/pull/19645))
- `html.elements.applet.src` ([#19645](https://github.com/mdn/browser-compat-data/pull/19645))
- `html.elements.applet.vspace` ([#19645](https://github.com/mdn/browser-compat-data/pull/19645))
- `html.elements.applet.width` ([#19645](https://github.com/mdn/browser-compat-data/pull/19645))
- `svg.elements.discard` ([#19782](https://github.com/mdn/browser-compat-data/pull/19782))

### Additions

- `browsers.chrome_android.releases.115` ([#19611](https://github.com/mdn/browser-compat-data/pull/19611))
- `browsers.chrome.releases.115` ([#19611](https://github.com/mdn/browser-compat-data/pull/19611))
- `browsers.safari_ios.releases.16.5` ([#19879](https://github.com/mdn/browser-compat-data/pull/19879))
- `browsers.safari.releases.16.5` ([#19879](https://github.com/mdn/browser-compat-data/pull/19879))
- `browsers.webview_android.releases.115` ([#19611](https://github.com/mdn/browser-compat-data/pull/19611))
- `css.at-rules.import.supports` ([#19863](https://github.com/mdn/browser-compat-data/pull/19863))
- `html.elements.link.blocking` ([#19880](https://github.com/mdn/browser-compat-data/pull/19880))
- `html.elements.script.blocking` ([#19880](https://github.com/mdn/browser-compat-data/pull/19880))
- `html.elements.search` ([#19357](https://github.com/mdn/browser-compat-data/pull/19357))
- `html.elements.style.blocking` ([#19880](https://github.com/mdn/browser-compat-data/pull/19880))

### Statistics

- 11 contributors have changed 657 files with 1,604 additions and 2,315 deletions in 26 commits ([`v5.2.58...v5.2.59`](https://github.com/mdn/browser-compat-data/compare/v5.2.58...v5.2.59))
- 14,775 total features
- 1,004 total contributors
- 4,489 total stargazers

## [v5.2.58](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.58)

May 16, 2023

### Removals

- `api.Element.error_event` ([#19875](https://github.com/mdn/browser-compat-data/pull/19875))
- `webextensions.api.userScripts.cookieStoreId` ([#19717](https://github.com/mdn/browser-compat-data/pull/19717))

### Additions

- `api.HTMLElement.error_event` ([#19875](https://github.com/mdn/browser-compat-data/pull/19875))
- `api.Permissions.permission_storage-access` ([#19614](https://github.com/mdn/browser-compat-data/pull/19614))
- `api.WebTransportReceiveStream` ([#19693](https://github.com/mdn/browser-compat-data/pull/19693))
- `api.WebTransportReceiveStream.getStats` ([#19693](https://github.com/mdn/browser-compat-data/pull/19693))
- `css.properties.shape-outside.path` ([#19225](https://github.com/mdn/browser-compat-data/pull/19225))
- `css.properties.text-wrap` ([#19798](https://github.com/mdn/browser-compat-data/pull/19798))
- `css.properties.white-space-collapse` ([#19798](https://github.com/mdn/browser-compat-data/pull/19798))
- `css.properties.white-space.shorthand_values` ([#19798](https://github.com/mdn/browser-compat-data/pull/19798))
- `http.headers.Permissions-Policy.storage-access` ([#19614](https://github.com/mdn/browser-compat-data/pull/19614))
- `webextensions.api.userScripts.register.cookieStoreId` ([#19717](https://github.com/mdn/browser-compat-data/pull/19717))

### Statistics

- 13 contributors have changed 191 files with 2,000 additions and 2,337 deletions in 187 commits ([`v5.2.57...v5.2.58`](https://github.com/mdn/browser-compat-data/compare/v5.2.57...v5.2.58))
- 14,787 total features
- 1,003 total contributors
- 4,486 total stargazers

## [v5.2.57](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.57)

May 9, 2023

### Statistics

- 3 contributors have changed 13 files with 202 additions and 460 deletions in 16 commits ([`v5.2.56...v5.2.57`](https://github.com/mdn/browser-compat-data/compare/v5.2.56...v5.2.57))
- 14,779 total features
- 1,002 total contributors
- 4,482 total stargazers

## [v5.2.56](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.56)

May 5, 2023

### Removals

- `api.WebTransport.WebTransport.serverCertificateHashes` ([#19605](https://github.com/mdn/browser-compat-data/pull/19605))

### Additions

- `api.CSSImportRule.supportsText` ([#19606](https://github.com/mdn/browser-compat-data/pull/19606))
- `api.fetch.init_priority_parameter` ([#19634](https://github.com/mdn/browser-compat-data/pull/19634))
- `api.Request.Request.init_priority_parameter` ([#19634](https://github.com/mdn/browser-compat-data/pull/19634))
- `api.WebTransport.congestionControl` ([#19605](https://github.com/mdn/browser-compat-data/pull/19605))
- `api.WebTransport.createBidirectionalStream.options_sendOrder_parameter` ([#19605](https://github.com/mdn/browser-compat-data/pull/19605))
- `api.WebTransport.createUnidirectionalStream.options_sendOrder_parameter` ([#19605](https://github.com/mdn/browser-compat-data/pull/19605))
- `api.WebTransport.draining` ([#19605](https://github.com/mdn/browser-compat-data/pull/19605))
- `api.WebTransport.getStats` ([#19605](https://github.com/mdn/browser-compat-data/pull/19605))
- `api.WebTransport.WebTransport.options_allowPooling_parameter` ([#19605](https://github.com/mdn/browser-compat-data/pull/19605))
- `api.WebTransport.WebTransport.options_congestionControl_parameter` ([#19605](https://github.com/mdn/browser-compat-data/pull/19605))
- `api.WebTransport.WebTransport.options_requireUnreliable_parameter` ([#19605](https://github.com/mdn/browser-compat-data/pull/19605))
- `api.WebTransport.WebTransport.options_serverCertificateHashes_parameter` ([#19605](https://github.com/mdn/browser-compat-data/pull/19605))
- `webextensions.api.action.getBadgeBackgroundColor.details_windowId_parameter` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.action.getBadgeText.details_windowId_parameter` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.action.getPopup.details_windowId_parameter` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.action.getTitle.details_windowId_parameter` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.action.isEnabled.details_windowId_parameter` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.action.onClicked.OnClickData` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.action.onClicked.tab` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.action.setBadgeBackgroundColor.details_windowId_parameter` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.action.setBadgeBackgroundColor.null` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.action.setBadgeBackgroundColor.string` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.action.setBadgeText.details_windowId_parameter` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.action.setBadgeText.null` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.action.setIcon.details_windowId_parameter` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.action.setIcon.imageData` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.action.setIcon.null` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.action.setPopup.details_windowId_parameter` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.action.setPopup.null` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.action.setTitle.details_windowId_parameter` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.action.setTitle.null` ([#19322](https://github.com/mdn/browser-compat-data/pull/19322))
- `webextensions.api.cookies.CookieStore.id` ([#19446](https://github.com/mdn/browser-compat-data/pull/19446))
- `webextensions.api.cookies.CookieStore.incognito` ([#19446](https://github.com/mdn/browser-compat-data/pull/19446))
- `webextensions.api.cookies.CookieStore.tabIds` ([#19446](https://github.com/mdn/browser-compat-data/pull/19446))

### Statistics

- 9 contributors have changed 58 files with 1,665 additions and 429 deletions in 23 commits ([`v5.2.55...v5.2.56`](https://github.com/mdn/browser-compat-data/compare/v5.2.55...v5.2.56))
- 14,779 total features
- 1,002 total contributors
- 4,479 total stargazers

## [v5.2.55](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.55)

May 2, 2023

### Removals

- `api.AudioListener.dopplerFactor` ([#19578](https://github.com/mdn/browser-compat-data/pull/19578))
- `api.AudioListener.speedOfSound` ([#19579](https://github.com/mdn/browser-compat-data/pull/19579))
- `api.PannerNode.setVelocity` ([#19580](https://github.com/mdn/browser-compat-data/pull/19580))
- `api.RTCStatsReport.type_inbound-rtp.qpSum` ([#19581](https://github.com/mdn/browser-compat-data/pull/19581))
- `api.RTCStatsReport.type_outbound-rtp.qpSum` ([#19581](https://github.com/mdn/browser-compat-data/pull/19581))

### Additions

- `browsers.deno.releases.1.33` ([#19593](https://github.com/mdn/browser-compat-data/pull/19593))
- `browsers.nodejs.releases.19.7.0` ([#19583](https://github.com/mdn/browser-compat-data/pull/19583))

### Statistics

- 6 contributors have changed 20 files with 86 additions and 236 deletions in 9 commits ([`v5.2.54...v5.2.55`](https://github.com/mdn/browser-compat-data/compare/v5.2.54...v5.2.55))
- 14,746 total features
- 1,001 total contributors
- 4,474 total stargazers

## [v5.2.54](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.54)

April 28, 2023

### Removals

- `api.RTCIceCandidatePairStats` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.availableIncomingBitrate` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.availableOutgoingBitrate` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.bytesReceived` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.bytesSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.currentRoundTripTime` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.lastPacketReceivedTimestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.lastPacketSentTimestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.localCandidateId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.nominated` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.priority` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.readable` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.remoteCandidateId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.requestsReceived` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.requestsSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.responsesReceived` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.responsesSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.state` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.totalRoundTripTime` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.transportId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidatePairStats.writable` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidateStats` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidateStats.address` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidateStats.candidateType` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidateStats.componentId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidateStats.deleted` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidateStats.port` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidateStats.priority` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidateStats.protocol` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidateStats.relayProtocol` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidateStats.transportId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCIceCandidateStats.url` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCRemoteOutboundRtpStreamStats` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCRemoteOutboundRtpStreamStats.localId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCRemoteOutboundRtpStreamStats.remoteTimestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCRtpStreamStats` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCRtpStreamStats.codecId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCRtpStreamStats.firCount` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCRtpStreamStats.isRemote` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCRtpStreamStats.kind` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCRtpStreamStats.mediaTrackId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCRtpStreamStats.mediaType` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCRtpStreamStats.nackCount` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCRtpStreamStats.pliCount` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCRtpStreamStats.qpSum` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCRtpStreamStats.remoteId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCRtpStreamStats.ssrc` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCRtpStreamStats.transportId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.@@iterator` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `css.properties.-moz-outline-radius` ([#19493](https://github.com/mdn/browser-compat-data/pull/19493))
- `css.properties.-moz-outline-radius-bottomleft` ([#19493](https://github.com/mdn/browser-compat-data/pull/19493))
- `css.properties.-moz-outline-radius-bottomright` ([#19493](https://github.com/mdn/browser-compat-data/pull/19493))
- `css.properties.-moz-outline-radius-topleft` ([#19493](https://github.com/mdn/browser-compat-data/pull/19493))
- `css.properties.-moz-outline-radius-topright` ([#19493](https://github.com/mdn/browser-compat-data/pull/19493))
- `javascript.regular_expressions.named_capture_groups` ([#19050](https://github.com/mdn/browser-compat-data/pull/19050))
- `javascript.regular_expressions.non_capture_group` ([#19050](https://github.com/mdn/browser-compat-data/pull/19050))
- `javascript.regular_expressions.property_escapes` ([#19050](https://github.com/mdn/browser-compat-data/pull/19050))

### Additions

- `api.HTMLButtonElement.popoverTargetAction` ([#19428](https://github.com/mdn/browser-compat-data/pull/19428))
- `api.HTMLButtonElement.popoverTargetElement` ([#19428](https://github.com/mdn/browser-compat-data/pull/19428))
- `api.HTMLInputElement.popoverTargetAction` ([#19428](https://github.com/mdn/browser-compat-data/pull/19428))
- `api.HTMLInputElement.popoverTargetElement` ([#19428](https://github.com/mdn/browser-compat-data/pull/19428))
- `api.RTCStatsReport.type_candidate-pair` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.availableOutgoingBitrate` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.bytesDiscardedOnSend` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.bytesReceived` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.bytesSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.consentRequestsSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.currentRoundTripTime` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.id` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.lastPacketReceivedTimestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.lastPacketSentTimestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.localCandidateId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.nominated` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.packetsDiscardedOnSend` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.packetsReceived` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.packetsSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.priority` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.remoteCandidateId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.requestsReceived` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.requestsSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.responsesReceived` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.responsesSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.state` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.timestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.totalRoundTripTime` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.transportId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_candidate-pair.type` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_certificate` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_certificate.base64Certificate` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_certificate.fingerprint` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_certificate.fingerprintAlgorithm` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_certificate.id` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_certificate.timestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_certificate.type` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_codec` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_codec.channels` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_codec.clockRate` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_codec.id` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_codec.mimeType` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_codec.payloadType` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_codec.sdpFmtpLine` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_codec.timestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_codec.transportId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_codec.type` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_data-channel` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_data-channel.bytesReceived` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_data-channel.bytesSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_data-channel.dataChannelIdentifier` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_data-channel.id` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_data-channel.label` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_data-channel.messagesReceived` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_data-channel.messagesSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_data-channel.protocol` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_data-channel.state` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_data-channel.timestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_data-channel.type` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.audioLevel` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.bytesReceived` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.codecId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.concealedSamples` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.concealmentEvents` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.fecPacketsDiscarded` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.fecPacketsReceived` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.headerBytesReceived` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.id` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.insertedSamplesForDeceleration` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.jitter` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.jitterBufferDelay` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.jitterBufferEmittedCount` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.jitterBufferMinimumDelay` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.jitterBufferTargetDelay` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.kind` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.lastPacketReceivedTimestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.mid` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.nackCount` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.packetsDiscarded` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.packetsLost` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.packetsReceived` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.playoutId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.qpSum` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.remoteId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.removedSamplesForAcceleration` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.silentConcealedSamples` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.ssrc` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.timestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.totalAudioEnergy` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.totalSamplesDuration` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.totalSamplesReceived` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.trackIdentifier` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.transportId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_inbound-rtp.type` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_local-candidate` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_local-candidate.address` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_local-candidate.candidateType` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_local-candidate.foundation` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_local-candidate.id` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_local-candidate.port` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_local-candidate.priority` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_local-candidate.protocol` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_local-candidate.timestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_local-candidate.transportId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_local-candidate.type` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_local-candidate.usernameFragment` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-playout` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-playout.id` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-playout.kind` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-playout.synthesizedSamplesDuration` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-playout.synthesizedSamplesEvents` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-playout.timestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-playout.totalPlayoutDelay` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-playout.totalSamplesCount` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-playout.totalSamplesDuration` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-playout.type` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-source` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-source.audioLevel` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-source.id` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-source.kind` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-source.timestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-source.totalAudioEnergy` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-source.totalSamplesDuration` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-source.trackIdentifier` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_media-source.type` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.active` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.bytesSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.codecId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.headerBytesSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.id` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.kind` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.mediaSourceId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.mid` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.nackCount` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.packetsSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.qpSum` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.remoteId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.retransmittedBytesSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.retransmittedPacketsSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.ssrc` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.targetBitrate` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.timestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.totalPacketSendDelay` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.transportId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_outbound-rtp.type` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_peer-connection` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_peer-connection.dataChannelsClosed` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_peer-connection.dataChannelsOpened` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_peer-connection.id` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_peer-connection.timestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_peer-connection.type` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-candidate` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-candidate.address` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-candidate.candidateType` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-candidate.foundation` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-candidate.id` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-candidate.port` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-candidate.priority` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-candidate.protocol` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-candidate.timestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-candidate.transportId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-candidate.type` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-candidate.usernameFragment` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-inbound-rtp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-inbound-rtp.codecId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-inbound-rtp.fractionLost` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-inbound-rtp.id` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-inbound-rtp.jitter` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-inbound-rtp.kind` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-inbound-rtp.localId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-inbound-rtp.packetsLost` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-inbound-rtp.packetsReceived` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-inbound-rtp.roundTripTime` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-inbound-rtp.roundTripTimeMeasurements` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-inbound-rtp.ssrc` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-inbound-rtp.timestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-inbound-rtp.totalRoundTripTime` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-inbound-rtp.transportId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-inbound-rtp.type` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-outbound-rtp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-outbound-rtp.bytesSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-outbound-rtp.codecId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-outbound-rtp.id` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-outbound-rtp.kind` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-outbound-rtp.localId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-outbound-rtp.packetsSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-outbound-rtp.remoteTimestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-outbound-rtp.reportsSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-outbound-rtp.roundTripTimeMeasurements` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-outbound-rtp.ssrc` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-outbound-rtp.timestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-outbound-rtp.totalRoundTripTime` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-outbound-rtp.transportId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_remote-outbound-rtp.type` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.bytesReceived` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.bytesSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.dtlsCipher` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.dtlsRole` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.dtlsState` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.iceLocalUsernameFragment` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.iceRole` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.iceState` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.id` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.localCertificateId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.packetsReceived` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.packetsSent` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.remoteCertificateId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.selectedCandidatePairChanges` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.selectedCandidatePairId` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.srtpCipher` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.timestamp` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.tlsVersion` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.RTCStatsReport.type_transport.type` ([#18910](https://github.com/mdn/browser-compat-data/pull/18910))
- `api.ToggleEvent` ([#19428](https://github.com/mdn/browser-compat-data/pull/19428))
- `api.ToggleEvent.newState` ([#19428](https://github.com/mdn/browser-compat-data/pull/19428))
- `api.ToggleEvent.oldState` ([#19428](https://github.com/mdn/browser-compat-data/pull/19428))
- `api.ToggleEvent.ToggleEvent` ([#19428](https://github.com/mdn/browser-compat-data/pull/19428))
- `api.URLSearchParams.size` ([#19437](https://github.com/mdn/browser-compat-data/pull/19437))
- `css.selectors.backdrop.popover` ([#19428](https://github.com/mdn/browser-compat-data/pull/19428))
- `css.types.ray.size-support` ([#19436](https://github.com/mdn/browser-compat-data/pull/19436))
- `html.global_attributes.autocomplete.webauthn` ([#19502](https://github.com/mdn/browser-compat-data/pull/19502))
- `html.global_attributes.popovertarget` ([#19428](https://github.com/mdn/browser-compat-data/pull/19428))
- `html.global_attributes.popovertargetaction` ([#19428](https://github.com/mdn/browser-compat-data/pull/19428))
- `javascript.regular_expressions.character_escape.unicode` ([#19050](https://github.com/mdn/browser-compat-data/pull/19050))
- `javascript.regular_expressions.literal_character` ([#19050](https://github.com/mdn/browser-compat-data/pull/19050))
- `javascript.regular_expressions.named_capturing_group` ([#19050](https://github.com/mdn/browser-compat-data/pull/19050))
- `javascript.regular_expressions.non_capturing_group` ([#19050](https://github.com/mdn/browser-compat-data/pull/19050))
- `javascript.regular_expressions.unicode_character_class_escape` ([#19050](https://github.com/mdn/browser-compat-data/pull/19050))
- `webextensions.manifest.optional_permissions.declarativeNetRequest` ([#19362](https://github.com/mdn/browser-compat-data/pull/19362))
- `webextensions.manifest.optional_permissions.declarativeNetRequestFeedback` ([#19362](https://github.com/mdn/browser-compat-data/pull/19362))
- `webextensions.manifest.optional_permissions.declarativeNetRequestWithHostAccess` ([#19362](https://github.com/mdn/browser-compat-data/pull/19362))

### Statistics

- 11 contributors have changed 89 files with 8,801 additions and 2,742 deletions in 82 commits ([`v5.2.53...v5.2.54`](https://github.com/mdn/browser-compat-data/compare/v5.2.53...v5.2.54))
- 14,751 total features
- 1,000 total contributors
- 4,469 total stargazers

## [v5.2.53](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.53)

April 25, 2023

### Removals

- `api.RTCIceTransport.RTCIceTransport` ([#19474](https://github.com/mdn/browser-compat-data/pull/19474))
- `html.elements.iframe.sandbox-allow-downloads` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox-allow-modals` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox-allow-popups` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox-allow-popups-to-escape-sandbox` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox-allow-presentation` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox-allow-same-origin` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox-allow-storage-access-by-user-activation` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox-allow-top-navigation-by-user-activation` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `javascript.builtins.Intl.Locale.calendars` ([#19451](https://github.com/mdn/browser-compat-data/pull/19451))
- `javascript.builtins.Intl.Locale.collations` ([#19451](https://github.com/mdn/browser-compat-data/pull/19451))
- `javascript.builtins.Intl.Locale.hourCycles` ([#19451](https://github.com/mdn/browser-compat-data/pull/19451))
- `javascript.builtins.Intl.Locale.numberingSystems` ([#19451](https://github.com/mdn/browser-compat-data/pull/19451))
- `javascript.builtins.Intl.Locale.textInfo` ([#19451](https://github.com/mdn/browser-compat-data/pull/19451))
- `javascript.builtins.Intl.Locale.timeZones` ([#19451](https://github.com/mdn/browser-compat-data/pull/19451))
- `javascript.builtins.Intl.Locale.weekInfo` ([#19451](https://github.com/mdn/browser-compat-data/pull/19451))

### Additions

- `browsers.deno.releases.1.29` ([#19470](https://github.com/mdn/browser-compat-data/pull/19470))
- `browsers.deno.releases.1.30` ([#19470](https://github.com/mdn/browser-compat-data/pull/19470))
- `browsers.deno.releases.1.31` ([#19470](https://github.com/mdn/browser-compat-data/pull/19470))
- `browsers.deno.releases.1.32` ([#19470](https://github.com/mdn/browser-compat-data/pull/19470))
- `html.elements.iframe.sandbox.allow-downloads` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox.allow-downloads-without-user-activation` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox.allow-forms` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox.allow-modals` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox.allow-orientation-lock` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox.allow-pointer-lock` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox.allow-popups` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox.allow-popups-to-escape-sandbox` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox.allow-presentation` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox.allow-same-origin` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox.allow-scripts` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox.allow-storage-access-by-user-activation` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox.allow-top-navigation` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox.allow-top-navigation-by-user-activation` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `html.elements.iframe.sandbox.allow-top-navigation-to-custom-protocols` ([#18862](https://github.com/mdn/browser-compat-data/pull/18862))
- `javascript.builtins.Intl.Locale.getCalendars` ([#19451](https://github.com/mdn/browser-compat-data/pull/19451))
- `javascript.builtins.Intl.Locale.getCollations` ([#19451](https://github.com/mdn/browser-compat-data/pull/19451))
- `javascript.builtins.Intl.Locale.getHourCycles` ([#19451](https://github.com/mdn/browser-compat-data/pull/19451))
- `javascript.builtins.Intl.Locale.getNumberingSystems` ([#19451](https://github.com/mdn/browser-compat-data/pull/19451))
- `javascript.builtins.Intl.Locale.getTextInfo` ([#19451](https://github.com/mdn/browser-compat-data/pull/19451))
- `javascript.builtins.Intl.Locale.getTimeZones` ([#19451](https://github.com/mdn/browser-compat-data/pull/19451))
- `javascript.builtins.Intl.Locale.getWeekInfo` ([#19451](https://github.com/mdn/browser-compat-data/pull/19451))
- `webextensions.manifest.browser_specific_settings.gecko` ([#19363](https://github.com/mdn/browser-compat-data/pull/19363))
- `webextensions.manifest.browser_specific_settings.gecko_android` ([#19363](https://github.com/mdn/browser-compat-data/pull/19363))
- `webextensions.manifest.browser_specific_settings.safari` ([#19363](https://github.com/mdn/browser-compat-data/pull/19363))

### Statistics

- 10 contributors have changed 25 files with 1,708 additions and 1,420 deletions in 31 commits ([`v5.2.52...v5.2.53`](https://github.com/mdn/browser-compat-data/compare/v5.2.52...v5.2.53))
- 14,574 total features
- 1,000 total contributors
- 4,469 total stargazers

## [v5.2.52](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.52)

April 21, 2023

### Additions

- `api.CredentialsContainer.create.publicKey_option` ([#19306](https://github.com/mdn/browser-compat-data/pull/19306))
- `api.CredentialsContainer.create.publicKey_option.extensions` ([#19306](https://github.com/mdn/browser-compat-data/pull/19306))
- `api.CredentialsContainer.create.publicKey_option.extensions.appidExclude` ([#19306](https://github.com/mdn/browser-compat-data/pull/19306))
- `api.CredentialsContainer.create.publicKey_option.extensions.credProps` ([#19306](https://github.com/mdn/browser-compat-data/pull/19306))
- `api.CredentialsContainer.create.publicKey_option.extensions.credProtect` ([#19306](https://github.com/mdn/browser-compat-data/pull/19306))
- `api.CredentialsContainer.create.publicKey_option.extensions.largeBlob` ([#19306](https://github.com/mdn/browser-compat-data/pull/19306))
- `api.CredentialsContainer.create.publicKey_option.extensions.minPinLength` ([#19306](https://github.com/mdn/browser-compat-data/pull/19306))
- `api.CredentialsContainer.create.publicKey_option.requireResidentKey` ([#19306](https://github.com/mdn/browser-compat-data/pull/19306))
- `api.CredentialsContainer.create.publicKey_option.residentKey` ([#19306](https://github.com/mdn/browser-compat-data/pull/19306))
- `api.CredentialsContainer.get.publicKey_option` ([#19306](https://github.com/mdn/browser-compat-data/pull/19306))
- `api.CredentialsContainer.get.publicKey_option.extensions` ([#19306](https://github.com/mdn/browser-compat-data/pull/19306))
- `api.CredentialsContainer.get.publicKey_option.extensions.appid` ([#19306](https://github.com/mdn/browser-compat-data/pull/19306))
- `api.CredentialsContainer.get.publicKey_option.extensions.largeBlob` ([#19306](https://github.com/mdn/browser-compat-data/pull/19306))
- `browsers.nodejs.releases.20.0.0` ([#19438](https://github.com/mdn/browser-compat-data/pull/19438))
- `css.selectors.nesting` ([#19270](https://github.com/mdn/browser-compat-data/pull/19270))
- `css.selectors.popover-open` ([#19358](https://github.com/mdn/browser-compat-data/pull/19358))
- `css.types.ray` ([#19421](https://github.com/mdn/browser-compat-data/pull/19421))
- `http.headers.Permissions-Policy.publickey-credentials-create` ([#19306](https://github.com/mdn/browser-compat-data/pull/19306))

### Statistics

- 10 contributors have changed 106 files with 1,741 additions and 462 deletions in 19 commits ([`v5.2.51...v5.2.52`](https://github.com/mdn/browser-compat-data/compare/v5.2.51...v5.2.52))
- 14,565 total features
- 997 total contributors
- 4,464 total stargazers

## [v5.2.51](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.51)

April 18, 2023

### Removals

- `api.HTMLVideoElement.autoPictureInPicture` ([#19408](https://github.com/mdn/browser-compat-data/pull/19408))
- `api.XRCompositionLayer.chromaticAberrationCorrection` ([#19406](https://github.com/mdn/browser-compat-data/pull/19406))

### Additions

- `api.Headers.getSetCookie` ([#19360](https://github.com/mdn/browser-compat-data/pull/19360))
- `browsers.edge.releases.114` ([#19388](https://github.com/mdn/browser-compat-data/pull/19388))
- `webextensions.api.storage.StorageArea.setAccessLevel` ([#19323](https://github.com/mdn/browser-compat-data/pull/19323))
- `webextensions.manifest.icons.svg_icons` ([#19361](https://github.com/mdn/browser-compat-data/pull/19361))

### Statistics

- 11 contributors have changed 120 files with 484 additions and 835 deletions in 43 commits ([`v5.2.50...v5.2.51`](https://github.com/mdn/browser-compat-data/compare/v5.2.50...v5.2.51))
- 14,548 total features
- 997 total contributors
- 4,463 total stargazers

## [v5.2.50](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.50)

April 11, 2023

### Removals

- `api.PermissionsPolicyViolationReportBody` ([#18559](https://github.com/mdn/browser-compat-data/pull/18559))
- `api.PermissionsPolicyViolationReportBody.columnNumber` ([#18559](https://github.com/mdn/browser-compat-data/pull/18559))
- `api.PermissionsPolicyViolationReportBody.disposition` ([#18559](https://github.com/mdn/browser-compat-data/pull/18559))
- `api.PermissionsPolicyViolationReportBody.featureId` ([#18559](https://github.com/mdn/browser-compat-data/pull/18559))
- `api.PermissionsPolicyViolationReportBody.lineNumber` ([#18559](https://github.com/mdn/browser-compat-data/pull/18559))
- `api.PermissionsPolicyViolationReportBody.message` ([#18559](https://github.com/mdn/browser-compat-data/pull/18559))
- `api.PermissionsPolicyViolationReportBody.sourceFile` ([#18559](https://github.com/mdn/browser-compat-data/pull/18559))
- `api.PermissionsPolicyViolationReportBody.toJSON` ([#18559](https://github.com/mdn/browser-compat-data/pull/18559))

### Additions

- `api.HTMLElement.beforetoggle_event` ([#19328](https://github.com/mdn/browser-compat-data/pull/19328))
- `api.HTMLElement.hidePopover` ([#19328](https://github.com/mdn/browser-compat-data/pull/19328))
- `api.HTMLElement.popover` ([#19328](https://github.com/mdn/browser-compat-data/pull/19328))
- `api.HTMLElement.showPopover` ([#19328](https://github.com/mdn/browser-compat-data/pull/19328))
- `api.HTMLElement.toggle_event` ([#19328](https://github.com/mdn/browser-compat-data/pull/19328))
- `api.HTMLElement.togglePopover` ([#19328](https://github.com/mdn/browser-compat-data/pull/19328))
- `html.global_attributes.popover` ([#19328](https://github.com/mdn/browser-compat-data/pull/19328))
- `javascript.builtins.AggregateError.errors` ([#19336](https://github.com/mdn/browser-compat-data/pull/19336))
- `javascript.builtins.Array.toReversed` ([#19338](https://github.com/mdn/browser-compat-data/pull/19338))
- `javascript.builtins.Array.toSorted` ([#19338](https://github.com/mdn/browser-compat-data/pull/19338))
- `javascript.builtins.Array.toSpliced` ([#19338](https://github.com/mdn/browser-compat-data/pull/19338))
- `javascript.builtins.Array.with` ([#19338](https://github.com/mdn/browser-compat-data/pull/19338))
- `javascript.builtins.Promise.@@species` ([#19340](https://github.com/mdn/browser-compat-data/pull/19340))
- `javascript.builtins.SharedArrayBuffer.@@species` ([#19340](https://github.com/mdn/browser-compat-data/pull/19340))
- `javascript.builtins.TypedArray.toReversed` ([#19338](https://github.com/mdn/browser-compat-data/pull/19338))
- `javascript.builtins.TypedArray.toSorted` ([#19338](https://github.com/mdn/browser-compat-data/pull/19338))
- `javascript.builtins.TypedArray.with` ([#19338](https://github.com/mdn/browser-compat-data/pull/19338))

### Statistics

- 8 contributors have changed 16 files with 1,161 additions and 401 deletions in 19 commits ([`v5.2.49...v5.2.50`](https://github.com/mdn/browser-compat-data/compare/v5.2.49...v5.2.50))
- 14,547 total features
- 995 total contributors
- 4,456 total stargazers

## [v5.2.49](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.49)

April 7, 2023

### Additions

- `api.GPUPipelineError` ([#19321](https://github.com/mdn/browser-compat-data/pull/19321))
- `api.GPUPipelineError.GPUPipelineError` ([#19321](https://github.com/mdn/browser-compat-data/pull/19321))
- `api.GPUPipelineError.reason` ([#19321](https://github.com/mdn/browser-compat-data/pull/19321))
- `browsers.chrome_android.releases.114` ([#19332](https://github.com/mdn/browser-compat-data/pull/19332))
- `browsers.chrome.releases.114` ([#19332](https://github.com/mdn/browser-compat-data/pull/19332))
- `browsers.webview_android.releases.114` ([#19332](https://github.com/mdn/browser-compat-data/pull/19332))
- `css.types.image.gradient.conic-gradient.hue_interpolation_method` ([#19244](https://github.com/mdn/browser-compat-data/pull/19244))
- `css.types.image.gradient.conic-gradient.interpolation_color_space` ([#19244](https://github.com/mdn/browser-compat-data/pull/19244))
- `css.types.image.gradient.linear-gradient.hue_interpolation_method` ([#19244](https://github.com/mdn/browser-compat-data/pull/19244))
- `css.types.image.gradient.linear-gradient.interpolation_color_space` ([#19244](https://github.com/mdn/browser-compat-data/pull/19244))
- `css.types.image.gradient.radial-gradient.hue_interpolation_method` ([#19244](https://github.com/mdn/browser-compat-data/pull/19244))
- `css.types.image.gradient.radial-gradient.interpolation_color_space` ([#19244](https://github.com/mdn/browser-compat-data/pull/19244))
- `css.types.image.gradient.repeating-conic-gradient.hue_interpolation_method` ([#19244](https://github.com/mdn/browser-compat-data/pull/19244))
- `css.types.image.gradient.repeating-conic-gradient.interpolation_color_space` ([#19244](https://github.com/mdn/browser-compat-data/pull/19244))
- `css.types.image.gradient.repeating-linear-gradient.hue_interpolation_method` ([#19244](https://github.com/mdn/browser-compat-data/pull/19244))
- `css.types.image.gradient.repeating-linear-gradient.interpolation_color_space` ([#19244](https://github.com/mdn/browser-compat-data/pull/19244))
- `css.types.image.gradient.repeating-radial-gradient.hue_interpolation_method` ([#19244](https://github.com/mdn/browser-compat-data/pull/19244))
- `css.types.image.gradient.repeating-radial-gradient.interpolation_color_space` ([#19244](https://github.com/mdn/browser-compat-data/pull/19244))
- `webextensions.api.scripting.executeScript.InjectionResult` ([#19247](https://github.com/mdn/browser-compat-data/pull/19247))
- `webextensions.api.scripting.executeScript.InjectionResult.error` ([#19247](https://github.com/mdn/browser-compat-data/pull/19247))
- `webextensions.api.scripting.executeScript.InjectionResult.frameId` ([#19247](https://github.com/mdn/browser-compat-data/pull/19247))
- `webextensions.api.scripting.executeScript.InjectionResult.result` ([#19247](https://github.com/mdn/browser-compat-data/pull/19247))

### Statistics

- 9 contributors have changed 17 files with 796 additions and 405 deletions in 16 commits ([`v5.2.48...v5.2.49`](https://github.com/mdn/browser-compat-data/compare/v5.2.48...v5.2.49))
- 14,538 total features
- 993 total contributors
- 4,453 total stargazers

## [v5.2.48](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.48)

April 4, 2023

### Removals

- `api.HTMLShadowElement` ([#19293](https://github.com/mdn/browser-compat-data/pull/19293))
- `api.HTMLShadowElement.getDistributedNodes` ([#19293](https://github.com/mdn/browser-compat-data/pull/19293))
- `api.ReadableStream.async_iterable` ([#19094](https://github.com/mdn/browser-compat-data/pull/19094))
- `html.elements.shadow` ([#19293](https://github.com/mdn/browser-compat-data/pull/19293))

### Additions

- `api.GPU` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPU.getPreferredCanvasFormat` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPU.requestAdapter` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUAdapter` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUAdapter.features` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUAdapter.isFallbackAdapter` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUAdapter.limits` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUAdapter.requestAdapterInfo` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUAdapter.requestDevice` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUAdapterInfo` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUAdapterInfo.architecture` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUAdapterInfo.description` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUAdapterInfo.device` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUAdapterInfo.vendor` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUBindGroup` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUBindGroup.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUBindGroupLayout` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUBindGroupLayout.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUBuffer` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUBuffer.destroy` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUBuffer.getMappedRange` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUBuffer.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUBuffer.mapAsync` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUBuffer.mapState` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUBuffer.size` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUBuffer.unmap` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUBuffer.usage` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCanvasContext` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCanvasContext.canvas` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCanvasContext.configure` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCanvasContext.getCurrentTexture` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCanvasContext.unconfigure` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCommandBuffer` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCommandBuffer.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCommandEncoder` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCommandEncoder.beginComputePass` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCommandEncoder.beginRenderPass` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCommandEncoder.clearBuffer` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCommandEncoder.copyBufferToBuffer` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCommandEncoder.copyBufferToTexture` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCommandEncoder.copyTextureToBuffer` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCommandEncoder.copyTextureToTexture` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCommandEncoder.finish` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCommandEncoder.insertDebugMarker` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCommandEncoder.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCommandEncoder.popDebugGroup` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCommandEncoder.pushDebugGroup` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCommandEncoder.resolveQuerySet` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCommandEncoder.writeTimestamp` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCompilationInfo` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCompilationInfo.messages` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCompilationMessage` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCompilationMessage.length` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCompilationMessage.lineNum` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCompilationMessage.linePos` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCompilationMessage.message` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCompilationMessage.offset` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUCompilationMessage.type` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUComputePassEncoder` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUComputePassEncoder.dispatchWorkgroups` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUComputePassEncoder.dispatchWorkgroupsIndirect` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUComputePassEncoder.end` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUComputePassEncoder.insertDebugMarker` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUComputePassEncoder.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUComputePassEncoder.popDebugGroup` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUComputePassEncoder.pushDebugGroup` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUComputePassEncoder.setBindGroup` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUComputePassEncoder.setPipeline` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUComputePassEncoder.writeTimestamp` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUComputePipeline` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUComputePipeline.getBindGroupLayout` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUComputePipeline.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.createBindGroup` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.createBindGroupLayout` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.createBuffer` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.createCommandEncoder` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.createComputePipeline` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.createComputePipelineAsync` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.createPipelineLayout` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.createQuerySet` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.createRenderBundleEncoder` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.createRenderPipeline` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.createRenderPipelineAsync` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.createSampler` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.createShaderModule` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.createTexture` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.destroy` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.features` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.importExternalTexture` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.limits` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.lost` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.popErrorScope` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.pushErrorScope` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.queue` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDevice.uncapturederror_event` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDeviceLostInfo` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDeviceLostInfo.message` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUDeviceLostInfo.reason` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUError` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUError.message` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUExternalTexture` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUExternalTexture.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUInternalError` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUInternalError.GPUInternalError` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUOutOfMemoryError` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUOutOfMemoryError.GPUOutOfMemoryError` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUPipelineLayout` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUPipelineLayout.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUQuerySet` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUQuerySet.count` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUQuerySet.destroy` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUQuerySet.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUQuerySet.type` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUQueue` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUQueue.copyExternalImageToTexture` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUQueue.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUQueue.onSubmittedWorkDone` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUQueue.submit` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUQueue.writeBuffer` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUQueue.writeTexture` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderBundle` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderBundle.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderBundleEncoder` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderBundleEncoder.draw` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderBundleEncoder.drawIndexed` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderBundleEncoder.drawIndexedIndirect` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderBundleEncoder.drawIndirect` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderBundleEncoder.finish` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderBundleEncoder.insertDebugMarker` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderBundleEncoder.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderBundleEncoder.popDebugGroup` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderBundleEncoder.pushDebugGroup` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderBundleEncoder.setBindGroup` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderBundleEncoder.setIndexBuffer` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderBundleEncoder.setPipeline` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderBundleEncoder.setVertexBuffer` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.beginOcclusionQuery` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.draw` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.drawIndexed` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.drawIndexedIndirect` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.drawIndirect` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.end` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.endOcclusionQuery` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.executeBundles` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.insertDebugMarker` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.popDebugGroup` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.pushDebugGroup` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.setBindGroup` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.setBlendConstant` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.setIndexBuffer` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.setPipeline` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.setScissorRect` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.setStencilReference` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.setVertexBuffer` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.setViewport` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPassEncoder.writeTimestamp` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPipeline` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPipeline.getBindGroupLayout` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPURenderPipeline.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSampler` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSampler.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUShaderModule` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUShaderModule.getCompilationInfo` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUShaderModule.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedFeatures` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxBindGroups` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxBindingsPerBindGroup` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxBufferSize` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxColorAttachmentBytesPerSample` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxColorAttachments` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxComputeInvocationsPerWorkgroup` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxComputeWorkgroupSizeX` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxComputeWorkgroupSizeY` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxComputeWorkgroupSizeZ` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxComputeWorkgroupsPerDimension` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxComputeWorkgroupStorageSize` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxDynamicStorageBuffersPerPipelineLayout` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxDynamicUniformBuffersPerPipelineLayout` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxInterStageShaderComponents` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxInterStageShaderVariables` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxSampledTexturesPerShaderStage` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxSamplersPerShaderStage` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxStorageBufferBindingSize` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxStorageBuffersPerShaderStage` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxStorageTexturesPerShaderStage` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxTextureArrayLayers` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxTextureDimension1D` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxTextureDimension2D` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxTextureDimension3D` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxUniformBufferBindingSize` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxUniformBuffersPerShaderStage` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxVertexAttributes` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxVertexBufferArrayStride` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.maxVertexBuffers` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.minStorageBufferOffsetAlignment` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUSupportedLimits.minUniformBufferOffsetAlignment` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUTexture` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUTexture.createView` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUTexture.depthOrArrayLayers` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUTexture.destroy` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUTexture.dimension` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUTexture.format` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUTexture.height` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUTexture.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUTexture.mipLevelCount` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUTexture.sampleCount` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUTexture.usage` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUTexture.width` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUTextureView` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUTextureView.label` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUUncapturedErrorEvent` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUUncapturedErrorEvent.error` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUUncapturedErrorEvent.GPUUncapturedErrorEvent` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUValidationError` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.GPUValidationError.GPUValidationError` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.HTMLCanvasElement.getContext.webgpu_context` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.Navigator.gpu` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `api.ReadableStream.@@asyncIterator` ([#19094](https://github.com/mdn/browser-compat-data/pull/19094))
- `api.ReadableStream.values` ([#19094](https://github.com/mdn/browser-compat-data/pull/19094))
- `api.WorkerNavigator.gpu` ([#18853](https://github.com/mdn/browser-compat-data/pull/18853))
- `css.properties.overflow-x.overlay` ([#19283](https://github.com/mdn/browser-compat-data/pull/19283))
- `css.properties.overflow-y.overlay` ([#19283](https://github.com/mdn/browser-compat-data/pull/19283))
- `javascript.builtins.Array.fromAsync` ([#19259](https://github.com/mdn/browser-compat-data/pull/19259))
- `javascript.builtins.FinalizationRegistry.symbol_as_target` ([#19274](https://github.com/mdn/browser-compat-data/pull/19274))
- `javascript.builtins.WeakMap.symbol_as_keys` ([#19274](https://github.com/mdn/browser-compat-data/pull/19274))
- `javascript.builtins.WeakRef.symbol_as_target` ([#19274](https://github.com/mdn/browser-compat-data/pull/19274))
- `javascript.builtins.WeakSet.symbol_as_keys` ([#19274](https://github.com/mdn/browser-compat-data/pull/19274))
- `webextensions.api.action` ([#19026](https://github.com/mdn/browser-compat-data/pull/19026))
- `webextensions.api.scripting` ([#19026](https://github.com/mdn/browser-compat-data/pull/19026))

### Statistics

- 12 contributors have changed 69 files with 8,866 additions and 294 deletions in 25 commits ([`v5.2.47...v5.2.48`](https://github.com/mdn/browser-compat-data/compare/v5.2.47...v5.2.48))
- 14,519 total features
- 993 total contributors
- 4,451 total stargazers

## [v5.2.47](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.47)

March 31, 2023

### Additions

- `css.at-rules.media.prefers-reduced-transparency` ([#19135](https://github.com/mdn/browser-compat-data/pull/19135))
- `javascript.builtins.String.isWellFormed` ([#19276](https://github.com/mdn/browser-compat-data/pull/19276))
- `javascript.builtins.String.toWellFormed` ([#19276](https://github.com/mdn/browser-compat-data/pull/19276))

### Statistics

- 9 contributors have changed 21 files with 226 additions and 209 deletions in 14 commits ([`v5.2.46...v5.2.47`](https://github.com/mdn/browser-compat-data/compare/v5.2.46...v5.2.47))
- 14,289 total features
- 991 total contributors
- 4,446 total stargazers

## [v5.2.46](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.46)

March 28, 2023

### Removals

- `api.Window.devicelight_event` ([#19237](https://github.com/mdn/browser-compat-data/pull/19237))

### Statistics

- 6 contributors have changed 27 files with 491 additions and 263 deletions in 27 commits ([`v5.2.45...v5.2.46`](https://github.com/mdn/browser-compat-data/compare/v5.2.45...v5.2.46))
- 14,286 total features
- 988 total contributors
- 4,444 total stargazers

## [v5.2.45](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.45)

March 24, 2023

### Statistics

- 4 contributors have changed 18 files with 75 additions and 49 deletions in 17 commits ([`v5.2.44...v5.2.45`](https://github.com/mdn/browser-compat-data/compare/v5.2.44...v5.2.45))
- 14,287 total features
- 988 total contributors
- 4,441 total stargazers

## [v5.2.44](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.44)

March 21, 2023

### Additions

- `api.Document.prerendering` ([#18744](https://github.com/mdn/browser-compat-data/pull/18744))
- `api.Document.prerenderingchange_event` ([#18744](https://github.com/mdn/browser-compat-data/pull/18744))
- `api.PerformanceNavigationTiming.activationStart` ([#18744](https://github.com/mdn/browser-compat-data/pull/18744))

### Statistics

- 6 contributors have changed 18 files with 1,018 additions and 531 deletions in 22 commits ([`v5.2.43...v5.2.44`](https://github.com/mdn/browser-compat-data/compare/v5.2.43...v5.2.44))
- 14,287 total features
- 988 total contributors
- 4,438 total stargazers

## [v5.2.43](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.43)

March 17, 2023

### Removals

- `api.HTMLContentElement` ([#19147](https://github.com/mdn/browser-compat-data/pull/19147))
- `api.HTMLContentElement.getDistributedNodes` ([#19147](https://github.com/mdn/browser-compat-data/pull/19147))
- `api.HTMLContentElement.select` ([#19147](https://github.com/mdn/browser-compat-data/pull/19147))
- `html.elements.content` ([#19147](https://github.com/mdn/browser-compat-data/pull/19147))

### Additions

- `api.DOMTokenList.toString` ([#19091](https://github.com/mdn/browser-compat-data/pull/19091))
- `api.MediaList.toString` ([#19093](https://github.com/mdn/browser-compat-data/pull/19093))
- `api.XMLHttpRequest.authorization_removed_cross_origin` ([#19092](https://github.com/mdn/browser-compat-data/pull/19092))
- `browsers.edge.releases.113` ([#19136](https://github.com/mdn/browser-compat-data/pull/19136))
- `browsers.opera_android.releases.74` ([#19122](https://github.com/mdn/browser-compat-data/pull/19122))
- `http.headers.Authorization.authorization_removed_cross_origin` ([#19092](https://github.com/mdn/browser-compat-data/pull/19092))

### Statistics

- 7 contributors have changed 83 files with 532 additions and 499 deletions in 30 commits ([`v5.2.42...v5.2.43`](https://github.com/mdn/browser-compat-data/compare/v5.2.42...v5.2.43))
- 14,284 total features
- 987 total contributors
- 4,435 total stargazers

## [v5.2.42](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.42)

March 14, 2023

### Additions

- `api.CSSContainerRule.containerName` ([#19089](https://github.com/mdn/browser-compat-data/pull/19089))
- `api.CSSContainerRule.containerQuery` ([#19089](https://github.com/mdn/browser-compat-data/pull/19089))
- `api.CSSFontFeatureValuesRule.annotation` ([#19090](https://github.com/mdn/browser-compat-data/pull/19090))
- `api.CSSFontFeatureValuesRule.characterVariant` ([#19090](https://github.com/mdn/browser-compat-data/pull/19090))
- `api.CSSFontFeatureValuesRule.ornaments` ([#19090](https://github.com/mdn/browser-compat-data/pull/19090))
- `api.CSSFontFeatureValuesRule.styleset` ([#19090](https://github.com/mdn/browser-compat-data/pull/19090))
- `api.CSSFontFeatureValuesRule.stylistic` ([#19090](https://github.com/mdn/browser-compat-data/pull/19090))
- `api.CSSFontFeatureValuesRule.swash` ([#19090](https://github.com/mdn/browser-compat-data/pull/19090))
- `api.FileSystemHandle.move` ([#19056](https://github.com/mdn/browser-compat-data/pull/19056))
- `api.FormData.FormData.submitter` ([#19106](https://github.com/mdn/browser-compat-data/pull/19106))
- `api.HTMLElement.virtualKeyboardPolicy` ([#18762](https://github.com/mdn/browser-compat-data/pull/18762))
- `api.XRSession.enabledFeatures` ([#19095](https://github.com/mdn/browser-compat-data/pull/19095))
- `html.global_attributes.virtualkeyboardpolicy` ([#18762](https://github.com/mdn/browser-compat-data/pull/18762))
- `html.manifest.file_handlers` ([#19096](https://github.com/mdn/browser-compat-data/pull/19096))
- `javascript.operators.import.worker_support` ([#19054](https://github.com/mdn/browser-compat-data/pull/19054))

### Statistics

- 9 contributors have changed 23 files with 1,042 additions and 208 deletions in 20 commits ([`v5.2.41...v5.2.42`](https://github.com/mdn/browser-compat-data/compare/v5.2.41...v5.2.42))
- 14,284 total features
- 987 total contributors
- 4,433 total stargazers

## [v5.2.41](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.41)

March 10, 2023

### Removals

- `api.HTMLMenuElement.label` ([#18981](https://github.com/mdn/browser-compat-data/pull/18981))
- `api.HTMLMenuElement.type` ([#18982](https://github.com/mdn/browser-compat-data/pull/18982))
- `api.SVGMatrix` ([#18768](https://github.com/mdn/browser-compat-data/pull/18768))
- `api.WebKitCSSMatrix` ([#18768](https://github.com/mdn/browser-compat-data/pull/18768))

### Additions

- `api.fetch.authorization_removed_cross_origin` ([#19064](https://github.com/mdn/browser-compat-data/pull/19064))
- `browsers.chrome_android.releases.113` ([#19070](https://github.com/mdn/browser-compat-data/pull/19070))
- `browsers.chrome.releases.113` ([#19070](https://github.com/mdn/browser-compat-data/pull/19070))
- `browsers.opera.releases.98` ([#19081](https://github.com/mdn/browser-compat-data/pull/19081))
- `browsers.webview_android.releases.113` ([#19070](https://github.com/mdn/browser-compat-data/pull/19070))
- `css.at-rules.page.page` ([#18922](https://github.com/mdn/browser-compat-data/pull/18922))

### Statistics

- 9 contributors have changed 27 files with 513 additions and 350 deletions in 26 commits ([`v5.2.40...v5.2.41`](https://github.com/mdn/browser-compat-data/compare/v5.2.40...v5.2.41))
- 14,269 total features
- 985 total contributors
- 4,428 total stargazers

## [v5.2.40](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.40)

March 7, 2023

### Additions

- `svg.attributes.presentation.fill.context-fill` ([#19022](https://github.com/mdn/browser-compat-data/pull/19022))
- `svg.attributes.presentation.stroke.context-stroke` ([#19022](https://github.com/mdn/browser-compat-data/pull/19022))
- `webextensions.api.menus.ContextType.action` ([#19005](https://github.com/mdn/browser-compat-data/pull/19005))
- `webextensions.manifest.background.type` ([#19055](https://github.com/mdn/browser-compat-data/pull/19055))

### Statistics

- 7 contributors have changed 14 files with 300 additions and 216 deletions in 22 commits ([`v5.2.39...v5.2.40`](https://github.com/mdn/browser-compat-data/compare/v5.2.39...v5.2.40))
- 14,271 total features
- 985 total contributors
- 4,428 total stargazers

## [v5.2.39](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.39)

February 28, 2023

### Removals

- `api.Element.show_event` ([#18979](https://github.com/mdn/browser-compat-data/pull/18979))
- `api.HTMLElement.contextMenu` ([#18980](https://github.com/mdn/browser-compat-data/pull/18980))
- `api.HTMLMenuItemElement` ([#18983](https://github.com/mdn/browser-compat-data/pull/18983))
- `api.HTMLMenuItemElement.checked` ([#18983](https://github.com/mdn/browser-compat-data/pull/18983))
- `api.HTMLMenuItemElement.default` ([#18983](https://github.com/mdn/browser-compat-data/pull/18983))
- `api.HTMLMenuItemElement.disabled` ([#18983](https://github.com/mdn/browser-compat-data/pull/18983))
- `api.HTMLMenuItemElement.icon` ([#18983](https://github.com/mdn/browser-compat-data/pull/18983))
- `api.HTMLMenuItemElement.label` ([#18983](https://github.com/mdn/browser-compat-data/pull/18983))
- `api.HTMLMenuItemElement.radiogroup` ([#18983](https://github.com/mdn/browser-compat-data/pull/18983))
- `api.HTMLMenuItemElement.type` ([#18983](https://github.com/mdn/browser-compat-data/pull/18983))
- `html.elements.menuitem` ([#18983](https://github.com/mdn/browser-compat-data/pull/18983))
- `html.elements.menuitem.checked` ([#18983](https://github.com/mdn/browser-compat-data/pull/18983))
- `html.elements.menuitem.command` ([#18983](https://github.com/mdn/browser-compat-data/pull/18983))
- `html.elements.menuitem.default` ([#18983](https://github.com/mdn/browser-compat-data/pull/18983))
- `html.elements.menuitem.disabled` ([#18983](https://github.com/mdn/browser-compat-data/pull/18983))
- `html.elements.menuitem.icon` ([#18983](https://github.com/mdn/browser-compat-data/pull/18983))
- `html.elements.menuitem.radiogroup` ([#18983](https://github.com/mdn/browser-compat-data/pull/18983))
- `html.elements.menuitem.type` ([#18983](https://github.com/mdn/browser-compat-data/pull/18983))

### Additions

- `webextensions.api.webRequest.SecurityInfo.usedDelegatedCredentials` ([#18956](https://github.com/mdn/browser-compat-data/pull/18956))
- `webextensions.api.webRequest.SecurityInfo.usedEch` ([#18956](https://github.com/mdn/browser-compat-data/pull/18956))
- `webextensions.api.webRequest.SecurityInfo.usedOcsp` ([#18956](https://github.com/mdn/browser-compat-data/pull/18956))
- `webextensions.api.webRequest.SecurityInfo.usedPrivateDns` ([#18956](https://github.com/mdn/browser-compat-data/pull/18956))

### Statistics

- 5 contributors have changed 16 files with 1,374 additions and 704 deletions in 12 commits ([`v5.2.38...v5.2.39`](https://github.com/mdn/browser-compat-data/compare/v5.2.38...v5.2.39))
- 14,267 total features
- 985 total contributors
- 4,421 total stargazers

## [v5.2.38](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.38)

February 23, 2023

### Removals

- `javascript.builtins.RegExp.lookbehind_assertion` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))
- `javascript.builtins.RegExp.named_capture_groups` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))
- `javascript.builtins.RegExp.property_escapes` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))

### Additions

- `api.Document.startViewTransition` ([#18916](https://github.com/mdn/browser-compat-data/pull/18916))
- `api.Element.auxclick_event.type_pointerevent` ([#18945](https://github.com/mdn/browser-compat-data/pull/18945))
- `api.Element.click_event.type_pointerevent` ([#18945](https://github.com/mdn/browser-compat-data/pull/18945))
- `api.Element.contextmenu_event.type_pointerevent` ([#18945](https://github.com/mdn/browser-compat-data/pull/18945))
- `api.ViewTransition` ([#18916](https://github.com/mdn/browser-compat-data/pull/18916))
- `api.ViewTransition.finished` ([#18916](https://github.com/mdn/browser-compat-data/pull/18916))
- `api.ViewTransition.ready` ([#18916](https://github.com/mdn/browser-compat-data/pull/18916))
- `api.ViewTransition.skipTransition` ([#18916](https://github.com/mdn/browser-compat-data/pull/18916))
- `api.ViewTransition.updateCallbackDone` ([#18916](https://github.com/mdn/browser-compat-data/pull/18916))
- `browsers.safari_ios.releases.16.4` ([#18973](https://github.com/mdn/browser-compat-data/pull/18973))
- `browsers.safari.releases.16.4` ([#18973](https://github.com/mdn/browser-compat-data/pull/18973))
- `browsers.samsunginternet_android.releases.20.0` ([#19001](https://github.com/mdn/browser-compat-data/pull/19001))
- `css.at-rules.container.style_queries_for_custom_properties` ([#18996](https://github.com/mdn/browser-compat-data/pull/18996))
- `css.properties.view-transition-name` ([#18916](https://github.com/mdn/browser-compat-data/pull/18916))
- `css.selectors.view-transition` ([#18916](https://github.com/mdn/browser-compat-data/pull/18916))
- `css.selectors.view-transition-group` ([#18916](https://github.com/mdn/browser-compat-data/pull/18916))
- `css.selectors.view-transition-image-pair` ([#18916](https://github.com/mdn/browser-compat-data/pull/18916))
- `css.selectors.view-transition-new` ([#18916](https://github.com/mdn/browser-compat-data/pull/18916))
- `css.selectors.view-transition-old` ([#18916](https://github.com/mdn/browser-compat-data/pull/18916))
- `javascript.builtins.Function.@@hasInstance` ([#18999](https://github.com/mdn/browser-compat-data/pull/18999))
- `javascript.regular_expressions.backreference` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))
- `javascript.regular_expressions.capturing_group` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))
- `javascript.regular_expressions.character_class` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))
- `javascript.regular_expressions.character_class_escape` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))
- `javascript.regular_expressions.character_escape` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))
- `javascript.regular_expressions.disjunction` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))
- `javascript.regular_expressions.input_boundary_assertion` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))
- `javascript.regular_expressions.lookahead_assertion` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))
- `javascript.regular_expressions.lookbehind_assertion` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))
- `javascript.regular_expressions.named_backreference` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))
- `javascript.regular_expressions.named_capture_groups` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))
- `javascript.regular_expressions.non_capture_group` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))
- `javascript.regular_expressions.property_escapes` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))
- `javascript.regular_expressions.quantifier` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))
- `javascript.regular_expressions.wildcard` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))
- `javascript.regular_expressions.word_boundary_assertion` ([#18966](https://github.com/mdn/browser-compat-data/pull/18966))
- `webextensions.api.webRequest.ResourceType.image` ([#18869](https://github.com/mdn/browser-compat-data/pull/18869))
- `webextensions.api.webRequest.ResourceType.main_frame` ([#18869](https://github.com/mdn/browser-compat-data/pull/18869))
- `webextensions.api.webRequest.ResourceType.object` ([#18869](https://github.com/mdn/browser-compat-data/pull/18869))
- `webextensions.api.webRequest.ResourceType.other` ([#18869](https://github.com/mdn/browser-compat-data/pull/18869))
- `webextensions.api.webRequest.ResourceType.script` ([#18869](https://github.com/mdn/browser-compat-data/pull/18869))
- `webextensions.api.webRequest.ResourceType.stylesheet` ([#18869](https://github.com/mdn/browser-compat-data/pull/18869))
- `webextensions.api.webRequest.ResourceType.sub_frame` ([#18869](https://github.com/mdn/browser-compat-data/pull/18869))
- `webextensions.api.webRequest.ResourceType.xmlhttprequest` ([#18869](https://github.com/mdn/browser-compat-data/pull/18869))

### Statistics

- 12 contributors have changed 112 files with 2,834 additions and 6,652 deletions in 22 commits ([`v5.2.37...v5.2.38`](https://github.com/mdn/browser-compat-data/compare/v5.2.37...v5.2.38))
- 14,281 total features
- 984 total contributors
- 4,420 total stargazers

## [v5.2.37](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.37)

February 21, 2023

### Removals

- `api.Request.priority` ([#18944](https://github.com/mdn/browser-compat-data/pull/18944))
- `api.RTCRtpSendParameters` ([#18935](https://github.com/mdn/browser-compat-data/pull/18935))
- `api.RTCRtpSendParameters.degradationPreference` ([#18935](https://github.com/mdn/browser-compat-data/pull/18935))
- `api.RTCRtpSendParameters.encodings` ([#18935](https://github.com/mdn/browser-compat-data/pull/18935))
- `api.RTCRtpSendParameters.transactionId` ([#18935](https://github.com/mdn/browser-compat-data/pull/18935))
- `css.properties.-moz-binding` ([#18946](https://github.com/mdn/browser-compat-data/pull/18946))
- `html.elements.iframe.fetchpriority` ([#18944](https://github.com/mdn/browser-compat-data/pull/18944))
- `html.elements.template.shadowroot` ([#18855](https://github.com/mdn/browser-compat-data/pull/18855))

### Additions

- `html.elements.template.shadowrootmode` ([#18855](https://github.com/mdn/browser-compat-data/pull/18855))

### Statistics

- 10 contributors have changed 24 files with 299 additions and 946 deletions in 23 commits ([`v5.2.36...v5.2.37`](https://github.com/mdn/browser-compat-data/compare/v5.2.36...v5.2.37))
- 14,243 total features
- 984 total contributors
- 4,417 total stargazers

## [v5.2.36](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.36)

February 17, 2023

### Removals

- `css.properties.hyphens.afrikaans` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.bosnian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.bulgarian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.catalan` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.croatian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.czech` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.danish` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.dutch` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.english` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.esperanto` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.estonian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.finish` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.french` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.galician` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.german_reformed_orthography` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.german_swiss_orthography` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.german_traditional_orthography` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.hungarian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.icelandic` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.interlingua` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.italian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.kurmanji` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.latin` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.lithuanian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.mongolian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.norwegian_nn` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.norwegian_no` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.polish` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.portuguese` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.portuguese_brazilian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.russian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.slovenian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.spanish` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.swedish` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.turkish` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.ukrainian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.upper_sorbian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.welsh` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `webextensions.api.scripting.unregisterContentScripts.persistAcrossSessions` ([#18879](https://github.com/mdn/browser-compat-data/pull/18879))
- `webextensions.api.webRequest.ResourceType.xbl` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))

### Additions

- `api.RTCRtpReceiver.getParameters.return_object_property_codecs` ([#18834](https://github.com/mdn/browser-compat-data/pull/18834))
- `api.RTCRtpReceiver.getParameters.return_object_property_headerExtensions` ([#18834](https://github.com/mdn/browser-compat-data/pull/18834))
- `api.RTCRtpReceiver.getParameters.return_object_property_rtcp` ([#18834](https://github.com/mdn/browser-compat-data/pull/18834))
- `api.RTCRtpSender.getParameters.return_object_property_codecs` ([#18834](https://github.com/mdn/browser-compat-data/pull/18834))
- `api.RTCRtpSender.getParameters.return_object_property_degradationPreference` ([#18834](https://github.com/mdn/browser-compat-data/pull/18834))
- `api.RTCRtpSender.getParameters.return_object_property_encodings` ([#18834](https://github.com/mdn/browser-compat-data/pull/18834))
- `api.RTCRtpSender.getParameters.return_object_property_headerExtensions` ([#18834](https://github.com/mdn/browser-compat-data/pull/18834))
- `api.RTCRtpSender.getParameters.return_object_property_rtcp` ([#18834](https://github.com/mdn/browser-compat-data/pull/18834))
- `api.RTCRtpSender.getParameters.return_object_property_transactionId` ([#18834](https://github.com/mdn/browser-compat-data/pull/18834))
- `api.RTCRtpSender.setParameters.parameters_codecs_parameter` ([#18834](https://github.com/mdn/browser-compat-data/pull/18834))
- `api.RTCRtpSender.setParameters.parameters_degradationPreference_parameter` ([#18834](https://github.com/mdn/browser-compat-data/pull/18834))
- `api.RTCRtpSender.setParameters.parameters_encodings_parameter` ([#18834](https://github.com/mdn/browser-compat-data/pull/18834))
- `api.RTCRtpSender.setParameters.parameters_headerExtensions_parameter` ([#18834](https://github.com/mdn/browser-compat-data/pull/18834))
- `api.RTCRtpSender.setParameters.parameters_rtcp_parameter` ([#18834](https://github.com/mdn/browser-compat-data/pull/18834))
- `api.RTCRtpSender.setParameters.parameters_transactionId_parameter` ([#18834](https://github.com/mdn/browser-compat-data/pull/18834))
- `browsers.chrome_android.releases.112` ([#18880](https://github.com/mdn/browser-compat-data/pull/18880))
- `browsers.webview_android.releases.112` ([#18880](https://github.com/mdn/browser-compat-data/pull/18880))
- `css.properties.hyphens.auto_value` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_afrikaans` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_bosnian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_bulgarian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_catalan` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_croatian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_czech` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_danish` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_dutch` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_english` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_esperanto` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_estonian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_finish` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_french` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_galician` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_german_reformed_orthography` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_german_swiss_orthography` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_german_traditional_orthography` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_hungarian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_icelandic` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_interlingua` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_italian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_kurmanji` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_latin` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_lithuanian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_mongolian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_norwegian_nn` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_norwegian_no` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_polish` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_portuguese` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_portuguese_brazilian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_russian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_slovenian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_spanish` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_swedish` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_turkish` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_ukrainian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_upper_sorbian` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `css.properties.hyphens.language_welsh` ([#18887](https://github.com/mdn/browser-compat-data/pull/18887))
- `javascript.builtins.ArrayBuffer.ArrayBuffer.maxByteLength_option` ([#18898](https://github.com/mdn/browser-compat-data/pull/18898))
- `javascript.builtins.ArrayBuffer.maxByteLength` ([#18898](https://github.com/mdn/browser-compat-data/pull/18898))
- `javascript.builtins.ArrayBuffer.resizable` ([#18898](https://github.com/mdn/browser-compat-data/pull/18898))
- `javascript.builtins.ArrayBuffer.resize` ([#18898](https://github.com/mdn/browser-compat-data/pull/18898))
- `javascript.builtins.SharedArrayBuffer.grow` ([#18898](https://github.com/mdn/browser-compat-data/pull/18898))
- `javascript.builtins.SharedArrayBuffer.growable` ([#18898](https://github.com/mdn/browser-compat-data/pull/18898))
- `javascript.builtins.SharedArrayBuffer.maxByteLength` ([#18898](https://github.com/mdn/browser-compat-data/pull/18898))
- `javascript.builtins.SharedArrayBuffer.SharedArrayBuffer.maxByteLength_option` ([#18898](https://github.com/mdn/browser-compat-data/pull/18898))
- `webextensions.api.declarativeNetRequest.DYNAMIC_RULESET_ID` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.getAvailableStaticRuleCount` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.getDynamicRules` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.getEnabledRulesets` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.getMatchedRules` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.GETMATCHEDRULES_QUOTA_INTERVAL` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.getSessionRules` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.GUARANTEED_MINIMUM_STATIC_RULES` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.isRegexSupported` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.MatchedRule` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.MatchedRule.extensionId` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.MAX_GETMATCHEDRULES_CALLS_PER_INTERVAL` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.MAX_NUMBER_OF_DYNAMIC_AND_SESSION_RULES` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.MAX_NUMBER_OF_ENABLED_STATIC_RULESETS` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.MAX_NUMBER_OF_REGEX_RULES` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.MAX_NUMBER_OF_STATIC_RULESETS` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.onRuleMatchedDebug` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.onRuleMatchedDebug.request` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.onRuleMatchedDebug.request.documentId` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.onRuleMatchedDebug.request.documentLifecycle` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.onRuleMatchedDebug.request.frameId` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.onRuleMatchedDebug.request.frameType` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.onRuleMatchedDebug.request.initiator` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.onRuleMatchedDebug.request.method` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.onRuleMatchedDebug.request.parentDocumentId` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.onRuleMatchedDebug.request.parentFrameId` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.onRuleMatchedDebug.request.requestId` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.onRuleMatchedDebug.request.tabId` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.onRuleMatchedDebug.request.type` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.onRuleMatchedDebug.request.url` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.Redirect` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.beacon` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.csp_report` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.font` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.image` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.imageset` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.main_frame` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.media` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.object` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.object_subrequest` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.other` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.ping` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.script` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.speculative` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.stylesheet` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.sub_frame` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.web_manifest` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.webbundle` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.websocket` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.webtransport` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.xml_dtd` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.xmlhttprequest` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.ResourceType.xslt` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.Rule` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.RuleAction` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.RuleAction.requestHeaders` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.RuleAction.requestHeaders.header` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.RuleAction.requestHeaders.operation` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.RuleAction.requestHeaders.value` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.RuleAction.responseHeaders` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.RuleAction.responseHeaders.header` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.RuleAction.responseHeaders.operation` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.RuleAction.responseHeaders.value` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.RuleCondition` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.RuleCondition.domains` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.RuleCondition.excludedDomains` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.RuleCondition.excludedInitiatorDomains` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.RuleCondition.excludedRequestDomains` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.RuleCondition.excludedRequestMethods` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.RuleCondition.requestDomains` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.RuleCondition.requestMethods` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.RuleCondition.tabIds` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.SESSION_RULESET_ID` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.setExtensionActionOptions` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.setExtensionActionOptions.options` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.setExtensionActionOptions.options.tabUpdate` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.testMatchOutcome` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.testMatchOutcome.options` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.testMatchOutcome.options.includeOtherExtensions` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.updateDynamicRules` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.updateEnabledRulesets` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.updateSessionRules` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.URLTransform` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.URLTransform.queryTransform` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.URLTransform.queryTransform.addOrReplaceParams` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.declarativeNetRequest.URLTransform.queryTransform.addOrReplaceParams.replaceOnly` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.api.scripting.ExecutionWorld` ([#18878](https://github.com/mdn/browser-compat-data/pull/18878))
- `webextensions.api.scripting.ExecutionWorld.ISOLATED` ([#18878](https://github.com/mdn/browser-compat-data/pull/18878))
- `webextensions.api.scripting.ExecutionWorld.MAIN` ([#18878](https://github.com/mdn/browser-compat-data/pull/18878))
- `webextensions.api.scripting.RegisteredContentScript.world` ([#18878](https://github.com/mdn/browser-compat-data/pull/18878))
- `webextensions.api.search.query` ([#18903](https://github.com/mdn/browser-compat-data/pull/18903))
- `webextensions.api.search.query.queryInfo` ([#18903](https://github.com/mdn/browser-compat-data/pull/18903))
- `webextensions.api.search.query.queryInfo.disposition` ([#18903](https://github.com/mdn/browser-compat-data/pull/18903))
- `webextensions.api.search.query.queryInfo.tabId` ([#18903](https://github.com/mdn/browser-compat-data/pull/18903))
- `webextensions.api.search.query.queryInfo.text` ([#18903](https://github.com/mdn/browser-compat-data/pull/18903))
- `webextensions.api.search.search.searchProperties` ([#18903](https://github.com/mdn/browser-compat-data/pull/18903))
- `webextensions.api.search.search.searchProperties.disposition` ([#18903](https://github.com/mdn/browser-compat-data/pull/18903))
- `webextensions.api.search.search.searchProperties.engine` ([#18903](https://github.com/mdn/browser-compat-data/pull/18903))
- `webextensions.api.search.search.searchProperties.query` ([#18903](https://github.com/mdn/browser-compat-data/pull/18903))
- `webextensions.api.search.search.searchProperties.tabId` ([#18903](https://github.com/mdn/browser-compat-data/pull/18903))
- `webextensions.manifest.declarative_net_request` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.manifest.declarative_net_request.rule_resources` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.manifest.declarative_net_request.rule_resources.enabled` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.manifest.declarative_net_request.rule_resources.id` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.manifest.declarative_net_request.rule_resources.path` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.manifest.permissions.declarativeNetRequest` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.manifest.permissions.declarativeNetRequestFeedback` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))
- `webextensions.manifest.permissions.declarativeNetRequestWithHostAccess` ([#18403](https://github.com/mdn/browser-compat-data/pull/18403))

### Statistics

- 12 contributors have changed 49 files with 3,854 additions and 583 deletions in 42 commits ([`v5.2.35...v5.2.36`](https://github.com/mdn/browser-compat-data/compare/v5.2.35...v5.2.36))
- 14,250 total features
- 984 total contributors
- 4,412 total stargazers

## [v5.2.35](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.35)

February 10, 2023

### Removals

- `api.ContentVisibilityAutoStateChangedEvent` ([#18848](https://github.com/mdn/browser-compat-data/pull/18848))
- `api.ContentVisibilityAutoStateChangedEvent.ContentVisibilityAutoStateChangedEvent` ([#18848](https://github.com/mdn/browser-compat-data/pull/18848))
- `api.ContentVisibilityAutoStateChangedEvent.skipped` ([#18848](https://github.com/mdn/browser-compat-data/pull/18848))
- `api.Element.contentvisibilityautostatechanged_event` ([#18848](https://github.com/mdn/browser-compat-data/pull/18848))

### Additions

- `api.ContentVisibilityAutoStateChangeEvent` ([#18848](https://github.com/mdn/browser-compat-data/pull/18848))
- `api.ContentVisibilityAutoStateChangeEvent.ContentVisibilityAutoStateChangeEvent` ([#18848](https://github.com/mdn/browser-compat-data/pull/18848))
- `api.ContentVisibilityAutoStateChangeEvent.skipped` ([#18848](https://github.com/mdn/browser-compat-data/pull/18848))
- `api.Element.contentvisibilityautostatechange_event` ([#18848](https://github.com/mdn/browser-compat-data/pull/18848))
- `api.ReadableStream.async_iterable` ([#18824](https://github.com/mdn/browser-compat-data/pull/18824))
- `browsers.chrome.releases.112` ([#18842](https://github.com/mdn/browser-compat-data/pull/18842))
- `browsers.edge.releases.112` ([#18870](https://github.com/mdn/browser-compat-data/pull/18870))
- `browsers.nodejs.releases.12.6.0` ([#18871](https://github.com/mdn/browser-compat-data/pull/18871))
- `browsers.opera.releases.97` ([#18817](https://github.com/mdn/browser-compat-data/pull/18817))
- `html.elements.form.rel` ([#18868](https://github.com/mdn/browser-compat-data/pull/18868))
- `javascript.operators.import_meta.resolve` ([#18737](https://github.com/mdn/browser-compat-data/pull/18737))

### Statistics

- 14 contributors have changed 35 files with 405 additions and 691 deletions in 30 commits ([`v5.2.34...v5.2.35`](https://github.com/mdn/browser-compat-data/compare/v5.2.34...v5.2.35))
- 14,119 total features
- 980 total contributors
- 4,406 total stargazers

## [v5.2.34](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.34)

February 3, 2023

### Additions

- `api.GestureEvent.altKey` ([#18761](https://github.com/mdn/browser-compat-data/pull/18761))
- `api.GestureEvent.clientX` ([#18761](https://github.com/mdn/browser-compat-data/pull/18761))
- `api.GestureEvent.clientY` ([#18761](https://github.com/mdn/browser-compat-data/pull/18761))
- `api.GestureEvent.ctrlKey` ([#18761](https://github.com/mdn/browser-compat-data/pull/18761))
- `api.GestureEvent.metaKey` ([#18761](https://github.com/mdn/browser-compat-data/pull/18761))
- `api.GestureEvent.screenX` ([#18761](https://github.com/mdn/browser-compat-data/pull/18761))
- `api.GestureEvent.screenY` ([#18761](https://github.com/mdn/browser-compat-data/pull/18761))
- `api.GestureEvent.shiftKey` ([#18761](https://github.com/mdn/browser-compat-data/pull/18761))
- `api.GestureEvent.target` ([#18761](https://github.com/mdn/browser-compat-data/pull/18761))
- `api.Navigator.getAutoplayPolicy` ([#18784](https://github.com/mdn/browser-compat-data/pull/18784))
- `api.SVGAltGlyphElement.href` ([#18766](https://github.com/mdn/browser-compat-data/pull/18766))
- `api.SVGGlyphRefElement.href` ([#18767](https://github.com/mdn/browser-compat-data/pull/18767))
- `api.Window.getDigitalGoodsService` ([#18769](https://github.com/mdn/browser-compat-data/pull/18769))
- `css.properties.baseline-source` ([#18803](https://github.com/mdn/browser-compat-data/pull/18803))

### Statistics

- 4 contributors have changed 8 files with 509 additions and 14 deletions in 9 commits ([`v5.2.33...v5.2.34`](https://github.com/mdn/browser-compat-data/compare/v5.2.33...v5.2.34))
- 14,116 total features
- 979 total contributors
- 4,395 total stargazers

## [v5.2.33](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.33)

January 31, 2023

### Removals

- `api.MediaSource.activeSourceBuffers.worker_support` ([#18795](https://github.com/mdn/browser-compat-data/pull/18795))
- `api.MediaSource.addSourceBuffer.worker_support` ([#18795](https://github.com/mdn/browser-compat-data/pull/18795))
- `api.MediaSource.clearLiveSeekableRange.worker_support` ([#18795](https://github.com/mdn/browser-compat-data/pull/18795))
- `api.MediaSource.duration.worker_support` ([#18795](https://github.com/mdn/browser-compat-data/pull/18795))
- `api.MediaSource.endOfStream.worker_support` ([#18795](https://github.com/mdn/browser-compat-data/pull/18795))
- `api.MediaSource.isTypeSupported.worker_support` ([#18795](https://github.com/mdn/browser-compat-data/pull/18795))
- `api.MediaSource.MediaSource.worker_support` ([#18795](https://github.com/mdn/browser-compat-data/pull/18795))
- `api.MediaSource.readyState.worker_support` ([#18795](https://github.com/mdn/browser-compat-data/pull/18795))
- `api.MediaSource.removeSourceBuffer.worker_support` ([#18795](https://github.com/mdn/browser-compat-data/pull/18795))
- `api.MediaSource.setLiveSeekableRange.worker_support` ([#18795](https://github.com/mdn/browser-compat-data/pull/18795))
- `api.MediaSource.sourceBuffers.worker_support` ([#18795](https://github.com/mdn/browser-compat-data/pull/18795))
- `api.MediaSource.sourceclose_event.worker_support` ([#18795](https://github.com/mdn/browser-compat-data/pull/18795))
- `api.MediaSource.sourceended_event.worker_support` ([#18795](https://github.com/mdn/browser-compat-data/pull/18795))
- `api.MediaSource.sourceopen_event.worker_support` ([#18795](https://github.com/mdn/browser-compat-data/pull/18795))
- `javascript.builtins.Temporal.Calendar.constructor` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))
- `javascript.builtins.Temporal.Duration.constructor` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))
- `javascript.builtins.Temporal.Instant.constructor` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))
- `javascript.builtins.Temporal.PlainDate.constructor` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))
- `javascript.builtins.Temporal.PlainDateTime.constructor` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))
- `javascript.builtins.Temporal.PlainMonthDay.constructor` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))
- `javascript.builtins.Temporal.PlainTime.constructor` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))
- `javascript.builtins.Temporal.PlainYearMonth.constructor` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))
- `javascript.builtins.Temporal.TimeZone.constructor` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))
- `javascript.builtins.Temporal.ZonedDateTime.constructor` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))

### Additions

- `api.Element.animate.options_timeline_parameter` ([#18776](https://github.com/mdn/browser-compat-data/pull/18776))
- `api.MathMLElement.autofocus` ([#18764](https://github.com/mdn/browser-compat-data/pull/18764))
- `api.MathMLElement.nonce` ([#18764](https://github.com/mdn/browser-compat-data/pull/18764))
- `api.MediaSource.worker_support` ([#18795](https://github.com/mdn/browser-compat-data/pull/18795))
- `api.MIDIOutputMap.@@iterator` ([#18763](https://github.com/mdn/browser-compat-data/pull/18763))
- `api.OffscreenCanvasRenderingContext2D.createConicGradient` ([#18748](https://github.com/mdn/browser-compat-data/pull/18748))
- `api.OffscreenCanvasRenderingContext2D.fontKerning` ([#18748](https://github.com/mdn/browser-compat-data/pull/18748))
- `api.OffscreenCanvasRenderingContext2D.fontStretch` ([#18748](https://github.com/mdn/browser-compat-data/pull/18748))
- `api.OffscreenCanvasRenderingContext2D.fontVariantCaps` ([#18748](https://github.com/mdn/browser-compat-data/pull/18748))
- `api.OffscreenCanvasRenderingContext2D.isContextLost` ([#18748](https://github.com/mdn/browser-compat-data/pull/18748))
- `api.OffscreenCanvasRenderingContext2D.letterSpacing` ([#18748](https://github.com/mdn/browser-compat-data/pull/18748))
- `api.OffscreenCanvasRenderingContext2D.reset` ([#18748](https://github.com/mdn/browser-compat-data/pull/18748))
- `api.OffscreenCanvasRenderingContext2D.roundRect` ([#18748](https://github.com/mdn/browser-compat-data/pull/18748))
- `api.OffscreenCanvasRenderingContext2D.textRendering` ([#18748](https://github.com/mdn/browser-compat-data/pull/18748))
- `api.OffscreenCanvasRenderingContext2D.wordSpacing` ([#18748](https://github.com/mdn/browser-compat-data/pull/18748))
- `api.PaymentRequestEvent.changeShippingAddress` ([#18765](https://github.com/mdn/browser-compat-data/pull/18765))
- `api.PaymentRequestEvent.changeShippingOption` ([#18765](https://github.com/mdn/browser-compat-data/pull/18765))
- `api.PaymentRequestEvent.paymentOptions` ([#18765](https://github.com/mdn/browser-compat-data/pull/18765))
- `api.PaymentRequestEvent.shippingOptions` ([#18765](https://github.com/mdn/browser-compat-data/pull/18765))
- `css.selectors.highlight` ([#18720](https://github.com/mdn/browser-compat-data/pull/18720))
- `javascript.builtins.Temporal.Calendar.Calendar` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))
- `javascript.builtins.Temporal.Duration.Duration` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))
- `javascript.builtins.Temporal.Instant.Instant` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))
- `javascript.builtins.Temporal.PlainDate.PlainDate` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))
- `javascript.builtins.Temporal.PlainDateTime.PlainDateTime` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))
- `javascript.builtins.Temporal.PlainMonthDay.PlainMonthDay` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))
- `javascript.builtins.Temporal.PlainTime.PlainTime` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))
- `javascript.builtins.Temporal.PlainYearMonth.PlainYearMonth` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))
- `javascript.builtins.Temporal.TimeZone.TimeZone` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))
- `javascript.builtins.Temporal.ZonedDateTime.ZonedDateTime` ([#18794](https://github.com/mdn/browser-compat-data/pull/18794))

### Statistics

- 9 contributors have changed 34 files with 1,423 additions and 818 deletions in 25 commits ([`v5.2.32...v5.2.33`](https://github.com/mdn/browser-compat-data/compare/v5.2.32...v5.2.33))
- 14,102 total features
- 979 total contributors
- 4,393 total stargazers

## [v5.2.32](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.32)

January 27, 2023

### Removals

- `http.headers.Content-Security-Policy.require-sri-for` ([#18740](https://github.com/mdn/browser-compat-data/pull/18740))

### Additions

- `api.CSS.svb` ([#18742](https://github.com/mdn/browser-compat-data/pull/18742))
- `api.CSS.svh` ([#18742](https://github.com/mdn/browser-compat-data/pull/18742))
- `api.CSS.svi` ([#18742](https://github.com/mdn/browser-compat-data/pull/18742))
- `api.CSS.svmax` ([#18742](https://github.com/mdn/browser-compat-data/pull/18742))
- `api.CSS.svmin` ([#18742](https://github.com/mdn/browser-compat-data/pull/18742))
- `api.CSS.svw` ([#18742](https://github.com/mdn/browser-compat-data/pull/18742))
- `api.CSSKeyframesRule.length` ([#18743](https://github.com/mdn/browser-compat-data/pull/18743))
- `api.MathMLElement.attributeStyleMap` ([#18747](https://github.com/mdn/browser-compat-data/pull/18747))
- `api.XRHand.@@iterator` ([#18749](https://github.com/mdn/browser-compat-data/pull/18749))
- `api.XRHand.entries` ([#18749](https://github.com/mdn/browser-compat-data/pull/18749))
- `api.XRHand.forEach` ([#18749](https://github.com/mdn/browser-compat-data/pull/18749))
- `api.XRHand.get` ([#18749](https://github.com/mdn/browser-compat-data/pull/18749))
- `api.XRHand.keys` ([#18749](https://github.com/mdn/browser-compat-data/pull/18749))
- `api.XRHand.size` ([#18749](https://github.com/mdn/browser-compat-data/pull/18749))
- `api.XRHand.values` ([#18749](https://github.com/mdn/browser-compat-data/pull/18749))
- `browsers.opera_android.releases.73` ([#18746](https://github.com/mdn/browser-compat-data/pull/18746))
- `browsers.safari_ios.releases.16.3` ([#18736](https://github.com/mdn/browser-compat-data/pull/18736))
- `browsers.safari.releases.16.3` ([#18736](https://github.com/mdn/browser-compat-data/pull/18736))

### Statistics

- 7 contributors have changed 23 files with 617 additions and 94 deletions in 14 commits ([`v5.2.31...v5.2.32`](https://github.com/mdn/browser-compat-data/compare/v5.2.31...v5.2.32))
- 14,096 total features
- 976 total contributors
- 4,390 total stargazers

## [v5.2.31](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.31)

January 24, 2023

### Removals

- `javascript.operators.logical_nullish_assignment` ([#18700](https://github.com/mdn/browser-compat-data/pull/18700))
- `webextensions.manifest.permissions.webRequestFilterResponse.serviceWorkerScript` ([#18701](https://github.com/mdn/browser-compat-data/pull/18701))

### Additions

- `api.CSS.dvb` ([#18678](https://github.com/mdn/browser-compat-data/pull/18678))
- `api.CSS.dvh` ([#18678](https://github.com/mdn/browser-compat-data/pull/18678))
- `api.CSS.dvi` ([#18678](https://github.com/mdn/browser-compat-data/pull/18678))
- `api.CSS.dvmax` ([#18678](https://github.com/mdn/browser-compat-data/pull/18678))
- `api.CSS.dvmin` ([#18678](https://github.com/mdn/browser-compat-data/pull/18678))
- `api.CSS.dvw` ([#18678](https://github.com/mdn/browser-compat-data/pull/18678))
- `api.CSS.lvb` ([#18678](https://github.com/mdn/browser-compat-data/pull/18678))
- `api.CSS.lvh` ([#18678](https://github.com/mdn/browser-compat-data/pull/18678))
- `api.CSS.lvi` ([#18678](https://github.com/mdn/browser-compat-data/pull/18678))
- `api.CSS.lvmax` ([#18678](https://github.com/mdn/browser-compat-data/pull/18678))
- `api.CSS.lvmin` ([#18678](https://github.com/mdn/browser-compat-data/pull/18678))
- `api.CSS.lvw` ([#18678](https://github.com/mdn/browser-compat-data/pull/18678))
- `javascript.operators.nullish_coalescing_assignment` ([#18700](https://github.com/mdn/browser-compat-data/pull/18700))
- `mathml.elements.mo.form` ([#18685](https://github.com/mdn/browser-compat-data/pull/18685))
- `mathml.elements.mo.largeop` ([#18685](https://github.com/mdn/browser-compat-data/pull/18685))
- `webextensions.api.find.find.options` ([#18688](https://github.com/mdn/browser-compat-data/pull/18688))
- `webextensions.api.find.find.options.caseSensitive` ([#18688](https://github.com/mdn/browser-compat-data/pull/18688))
- `webextensions.api.find.find.options.entireWord` ([#18688](https://github.com/mdn/browser-compat-data/pull/18688))
- `webextensions.api.find.find.options.includeRangeData` ([#18688](https://github.com/mdn/browser-compat-data/pull/18688))
- `webextensions.api.find.find.options.includeRectData` ([#18688](https://github.com/mdn/browser-compat-data/pull/18688))
- `webextensions.api.find.find.options.matchDiacritics` ([#18688](https://github.com/mdn/browser-compat-data/pull/18688))
- `webextensions.api.find.find.options.tabId` ([#18688](https://github.com/mdn/browser-compat-data/pull/18688))
- `webextensions.manifest.permissions.webRequestFilterResponse_serviceWorkerScript` ([#18701](https://github.com/mdn/browser-compat-data/pull/18701))

### Statistics

- 7 contributors have changed 35 files with 833 additions and 215 deletions in 23 commits ([`v5.2.30...v5.2.31`](https://github.com/mdn/browser-compat-data/compare/v5.2.30...v5.2.31))
- 14,082 total features
- 974 total contributors
- 4,383 total stargazers

## [v5.2.30](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.30)

January 20, 2023

### Removals

- `api.Document.registerElement` ([#18681](https://github.com/mdn/browser-compat-data/pull/18681))
- `webextensions.manifest.optional_permissions.webRequestFilterResponse.serviceWorkerScript` ([#18680](https://github.com/mdn/browser-compat-data/pull/18680))

### Additions

- `api.CookieStore.delete.partitioned_option` ([#18591](https://github.com/mdn/browser-compat-data/pull/18591))
- `api.CookieStore.get.partitioned_return_property` ([#18591](https://github.com/mdn/browser-compat-data/pull/18591))
- `api.CookieStore.getAll.partitioned_return_property` ([#18591](https://github.com/mdn/browser-compat-data/pull/18591))
- `api.CookieStore.set.partitioned_option` ([#18591](https://github.com/mdn/browser-compat-data/pull/18591))
- `api.CredentialsContainer.get.identity_option` ([#18628](https://github.com/mdn/browser-compat-data/pull/18628))
- `api.fetch.init_keepalive_parameter` ([#18332](https://github.com/mdn/browser-compat-data/pull/18332))
- `api.IdentityCredential` ([#18628](https://github.com/mdn/browser-compat-data/pull/18628))
- `api.IdentityCredential.token` ([#18628](https://github.com/mdn/browser-compat-data/pull/18628))
- `http.headers.Permissions-Policy.identity-credentials-get` ([#18628](https://github.com/mdn/browser-compat-data/pull/18628))
- `http.headers.Set-Cookie.Partitioned` ([#18591](https://github.com/mdn/browser-compat-data/pull/18591))
- `webextensions.manifest.optional_permissions.webRequestFilterResponse` ([#18665](https://github.com/mdn/browser-compat-data/pull/18665))
- `webextensions.manifest.optional_permissions.webRequestFilterResponse_serviceWorkerScript` ([#18680](https://github.com/mdn/browser-compat-data/pull/18680))
- `webextensions.manifest.optional_permissions.webRequestFilterResponse.serviceWorkerScript` ([#18665](https://github.com/mdn/browser-compat-data/pull/18665))
- `webextensions.manifest.permissions.webRequestFilterResponse` ([#18665](https://github.com/mdn/browser-compat-data/pull/18665))
- `webextensions.manifest.permissions.webRequestFilterResponse.serviceWorkerScript` ([#18665](https://github.com/mdn/browser-compat-data/pull/18665))

### Statistics

- 8 contributors have changed 14 files with 470 additions and 89 deletions in 12 commits ([`v5.2.29...v5.2.30`](https://github.com/mdn/browser-compat-data/compare/v5.2.29...v5.2.30))
- 14,061 total features
- 974 total contributors
- 4,373 total stargazers

## [v5.2.29](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.29)

January 17, 2023

### Removals

- `api.Bluetooth.referringDevice` ([#18646](https://github.com/mdn/browser-compat-data/pull/18646))

### Additions

- `html.manifest.serviceworker` ([#18492](https://github.com/mdn/browser-compat-data/pull/18492))
- `html.manifest.serviceworker.scope` ([#18492](https://github.com/mdn/browser-compat-data/pull/18492))
- `html.manifest.serviceworker.src` ([#18492](https://github.com/mdn/browser-compat-data/pull/18492))
- `html.manifest.serviceworker.use_cache` ([#18492](https://github.com/mdn/browser-compat-data/pull/18492))

### Statistics

- 5 contributors have changed 14 files with 377 additions and 674 deletions in 10 commits ([`v5.2.28...v5.2.29`](https://github.com/mdn/browser-compat-data/compare/v5.2.28...v5.2.29))
- 14,048 total features
- 973 total contributors
- 4,371 total stargazers

## [v5.2.28](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.28)

January 13, 2023

### Removals

- `api.CrashReportBody` ([#18541](https://github.com/mdn/browser-compat-data/pull/18541))
- `api.CrashReportBody.reason` ([#18541](https://github.com/mdn/browser-compat-data/pull/18541))
- `api.CrashReportBody.toJSON` ([#18541](https://github.com/mdn/browser-compat-data/pull/18541))
- `api.Element.ariaColIndexText` ([#18546](https://github.com/mdn/browser-compat-data/pull/18546))
- `api.Element.ariaRowIndexText` ([#18546](https://github.com/mdn/browser-compat-data/pull/18546))
- `api.ElementInternals.ariaColIndexText` ([#18546](https://github.com/mdn/browser-compat-data/pull/18546))
- `api.ElementInternals.ariaRowIndexText` ([#18546](https://github.com/mdn/browser-compat-data/pull/18546))
- `api.Permissions.accelerometer_permission` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.accessibility-events_permission` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.ambient-light-sensor_permission` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.background-sync_permission` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.camera_permission` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.clipboard-read_permission` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.clipboard-write_permission` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.geolocation_permission` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.gyroscope_permission` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.local-fonts_permission` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.magnetometer_permission` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.microphone_permission` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.midi_permission` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.notifications_permission` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.payment-handler_permission` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.persistent-storage_permission` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.push_permission` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.speaker-selection_permission` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))

### Additions

- `api.AudioContext.AudioContext.options_sinkId_parameter` ([#18516](https://github.com/mdn/browser-compat-data/pull/18516))
- `api.AudioContext.setSinkId` ([#18516](https://github.com/mdn/browser-compat-data/pull/18516))
- `api.AudioContext.sinkchange_event` ([#18516](https://github.com/mdn/browser-compat-data/pull/18516))
- `api.AudioContext.sinkId` ([#18516](https://github.com/mdn/browser-compat-data/pull/18516))
- `api.AudioSinkInfo` ([#18516](https://github.com/mdn/browser-compat-data/pull/18516))
- `api.AudioSinkInfo.type` ([#18516](https://github.com/mdn/browser-compat-data/pull/18516))
- `api.Permissions.permission_accelerometer` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.permission_accessibility-events` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.permission_ambient-light-sensor` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.permission_background-sync` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.permission_camera` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.permission_clipboard-read` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.permission_clipboard-write` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.permission_geolocation` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.permission_gyroscope` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.permission_local-fonts` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.permission_magnetometer` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.permission_microphone` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.permission_midi` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.permission_notifications` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.permission_payment-handler` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.permission_persistent-storage` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.permission_push` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `api.Permissions.permission_speaker-selection` ([#18561](https://github.com/mdn/browser-compat-data/pull/18561))
- `browsers.chrome_android.releases.111` ([#18619](https://github.com/mdn/browser-compat-data/pull/18619))
- `browsers.chrome.releases.111` ([#18619](https://github.com/mdn/browser-compat-data/pull/18619))
- `browsers.edge.releases.111` ([#18649](https://github.com/mdn/browser-compat-data/pull/18649))
- `browsers.webview_android.releases.111` ([#18619](https://github.com/mdn/browser-compat-data/pull/18619))

### Statistics

- 14 contributors have changed 86 files with 2,073 additions and 1,305 deletions in 44 commits ([`v5.2.27...v5.2.28`](https://github.com/mdn/browser-compat-data/compare/v5.2.27...v5.2.28))
- 14,045 total features
- 973 total contributors
- 4,361 total stargazers

## [v5.2.27](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.27)

January 10, 2023

### Removals

- `api.MediaStreamTrackAudioSourceNode.mediaStreamTrack` ([#18554](https://github.com/mdn/browser-compat-data/pull/18554))

### Statistics

- 6 contributors have changed 20 files with 107 additions and 100 deletions in 20 commits ([`v5.2.26...v5.2.27`](https://github.com/mdn/browser-compat-data/compare/v5.2.26...v5.2.27))
- 14,046 total features
- 970 total contributors
- 4,358 total stargazers

## [v5.2.26](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.26)

January 6, 2023

### Removals

- `api.DOMMatrixReadOnly.transform` ([#18542](https://github.com/mdn/browser-compat-data/pull/18542))

### Additions

- `api.FileSystemHandle.remove` ([#18537](https://github.com/mdn/browser-compat-data/pull/18537))
- `browsers.opera.releases.95` ([#18522](https://github.com/mdn/browser-compat-data/pull/18522))
- `browsers.opera.releases.96` ([#18522](https://github.com/mdn/browser-compat-data/pull/18522))
- `browsers.safari_ios.releases.16.2` ([#18526](https://github.com/mdn/browser-compat-data/pull/18526))
- `browsers.safari.releases.16.2` ([#18526](https://github.com/mdn/browser-compat-data/pull/18526))
- `css.types.color.system-color.mark_marktext_buttonborder` ([#18515](https://github.com/mdn/browser-compat-data/pull/18515))

### Statistics

- 6 contributors have changed 11 files with 150 additions and 86 deletions in 12 commits ([`v5.2.25...v5.2.26`](https://github.com/mdn/browser-compat-data/compare/v5.2.25...v5.2.26))
- 14,047 total features
- 968 total contributors
- 4,357 total stargazers

## [v5.2.25](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.25)

January 3, 2023

### Statistics

- 3 contributors have changed 15 files with 144 additions and 143 deletions in 7 commits ([`v5.2.24...v5.2.25`](https://github.com/mdn/browser-compat-data/compare/v5.2.24...v5.2.25))
- 14,046 total features
- 967 total contributors
- 4,356 total stargazers

## [v5.2.24](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.24)

December 31, 2022

### Removals

- `api.CSS.ic` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.CSS.lh` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.CSS.rlh` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.DataTransfer.mozClearDataAt` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.DataTransfer.mozGetDataAt` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.DataTransfer.mozItemCount` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.DataTransfer.mozSetDataAt` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.DataTransfer.mozTypesAt` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Document.execCommand.ClearAuthenticationCache` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Document.execCommandShowHelp` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Document.fileSize` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Document.mozSyntheticDocument` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Document.normalizeDocument` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Document.origin` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Document.queryCommandText` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Document.routeEvent` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.DocumentType.entities` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.DocumentType.internalSubset` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.DocumentType.notations` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.DOMMatrixReadOnly.scaleNonUniformSelf` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Element.createShadowRoot` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Element.msContentZoom_event` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.HTMLAudioElement.mozCurrentSampleOffset` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.HTMLAudioElement.mozSetup` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.HTMLAudioElement.mozWriteAudio` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.HTMLCanvasElement.mozFetchAsStream` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.HTMLIFrameElement.fetchPriority` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.HTMLKeygenElement` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.HTMLStyleElement.scoped` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.HTMLVideoElement.msIsStereo3D` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Location.password` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Location.username` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.MediaStreamTrack.remote` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Navigator.mozIsLocallyAvailable` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Node.hasAttributes` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Node.isSupported` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.RTCIceCandidatePairStats.consentRequestsSent` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.RTCIceCandidatePairStats.packetsReceived` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.RTCIceCandidatePairStats.packetsSent` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.RTCIceCredentialType` ([#18496](https://github.com/mdn/browser-compat-data/pull/18496))
- `api.RTCIceCredentialType.password` ([#18496](https://github.com/mdn/browser-compat-data/pull/18496))
- `api.RTCIceCredentialType.token` ([#18496](https://github.com/mdn/browser-compat-data/pull/18496))
- `api.RTCIceTransport.addRemoteCandidate` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.RTCIceTransport.component` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.RTCIceTransport.start` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.RTCIceTransport.stop` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.RTCIdentityProviderGlobalScope` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.RTCIdentityProviderGlobalScope.rtcIdentityProvider` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.RTCIdentityProviderRegistrar` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.RTCIdentityProviderRegistrar.register` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.RTCPeerConnection.getStreamById` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.RTCRtpEncodingParameters.codecPayloadType` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.RTCRtpEncodingParameters.ptime` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.RTCRtpSendParameters.priority` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.SharedWorkerGlobalScope.applicationCache` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.SharedWorkerGlobalScope.applicationCache.secure_context_required` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.SourceBuffer.appendStream` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.SVGElement.offsetHeight` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.SVGElement.offsetLeft` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.SVGElement.offsetParent` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.SVGElement.offsetTop` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.SVGElement.offsetWidth` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.SVGImageElement.crossOrigin` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.SVGSVGElement.contentScriptType` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.SVGSVGElement.contentStyleType` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.SVGSVGElement.pixelUnitToMillimeterX` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.SVGSVGElement.pixelUnitToMillimeterY` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.SVGSVGElement.screenPixelToMillimeterX` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.SVGSVGElement.screenPixelToMillimeterY` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.SVGViewElement.viewTarget` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.TransitionEvent.initTransitionEvent` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.URL.createObjectURL.MediaStream_support` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.VRPose.timestamp` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.WebGLObject` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.WebGLTimerQueryEXT` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Window.openDialog` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Window.vrdisplayblur_event` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Window.vrdisplayfocus_event` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Window.vrdisplaypointerrestricted_event` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.Window.vrdisplaypointerunrestricted_event` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.XMLDocument.async` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.XMLDocument.load` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.XRPermissionStatus` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))
- `api.XRPermissionStatus.granted` ([#18258](https://github.com/mdn/browser-compat-data/pull/18258))

### Statistics

- 8 contributors have changed 48 files with 2,445 additions and 5,147 deletions in 16 commits ([`v5.2.23...v5.2.24`](https://github.com/mdn/browser-compat-data/compare/v5.2.23...v5.2.24))
- 14,046 total features
- 967 total contributors
- 4,354 total stargazers

## [v5.2.23](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.23)

December 21, 2022

### Removals

- `html.manifest.shortcuts` ([#18427](https://github.com/mdn/browser-compat-data/pull/18427))

### Additions

- `api.CaptureController` ([#18264](https://github.com/mdn/browser-compat-data/pull/18264))
- `api.CaptureController.CaptureController` ([#18264](https://github.com/mdn/browser-compat-data/pull/18264))
- `api.CaptureController.setFocusBehavior` ([#18264](https://github.com/mdn/browser-compat-data/pull/18264))
- `api.Document.scrollend_event` ([#18407](https://github.com/mdn/browser-compat-data/pull/18407))
- `api.Element.scrollend_event` ([#18407](https://github.com/mdn/browser-compat-data/pull/18407))
- `api.LaunchParams.targetURL` ([#18427](https://github.com/mdn/browser-compat-data/pull/18427))
- `api.MediaDevices.getDisplayMedia.controller_option` ([#18264](https://github.com/mdn/browser-compat-data/pull/18264))
- `api.MediaDevices.getDisplayMedia.preferCurrentTab_option` ([#18264](https://github.com/mdn/browser-compat-data/pull/18264))
- `api.MediaDevices.getDisplayMedia.selfBrowserSurface_option` ([#18264](https://github.com/mdn/browser-compat-data/pull/18264))
- `api.MediaDevices.getDisplayMedia.surfaceSwitching_option` ([#18264](https://github.com/mdn/browser-compat-data/pull/18264))
- `api.MediaDevices.getDisplayMedia.systemAudio_option` ([#18264](https://github.com/mdn/browser-compat-data/pull/18264))
- `api.MediaSession.setActionHandler.hangup_type` ([#18413](https://github.com/mdn/browser-compat-data/pull/18413))
- `api.MediaSession.setActionHandler.nextslide_type` ([#18413](https://github.com/mdn/browser-compat-data/pull/18413))
- `api.MediaSession.setActionHandler.nexttrack_type` ([#18413](https://github.com/mdn/browser-compat-data/pull/18413))
- `api.MediaSession.setActionHandler.pause_type` ([#18413](https://github.com/mdn/browser-compat-data/pull/18413))
- `api.MediaSession.setActionHandler.play_type` ([#18413](https://github.com/mdn/browser-compat-data/pull/18413))
- `api.MediaSession.setActionHandler.previousslide_type` ([#18413](https://github.com/mdn/browser-compat-data/pull/18413))
- `api.MediaSession.setActionHandler.previoustrack_type` ([#18413](https://github.com/mdn/browser-compat-data/pull/18413))
- `api.MediaSession.setActionHandler.seekbackward_type` ([#18413](https://github.com/mdn/browser-compat-data/pull/18413))
- `api.MediaSession.setActionHandler.seekforward_type` ([#18413](https://github.com/mdn/browser-compat-data/pull/18413))
- `api.MediaSession.setActionHandler.seekto_type` ([#18413](https://github.com/mdn/browser-compat-data/pull/18413))
- `api.MediaSession.setActionHandler.skipad_type` ([#18413](https://github.com/mdn/browser-compat-data/pull/18413))
- `api.MediaSession.setActionHandler.stop_type` ([#18413](https://github.com/mdn/browser-compat-data/pull/18413))
- `api.MediaSession.setActionHandler.togglecamera_type` ([#18413](https://github.com/mdn/browser-compat-data/pull/18413))
- `api.MediaSession.setActionHandler.togglemicrophone_type` ([#18413](https://github.com/mdn/browser-compat-data/pull/18413))
- `api.MediaTrackConstraints.suppressLocalAudioPlayback` ([#18264](https://github.com/mdn/browser-compat-data/pull/18264))
- `api.MediaTrackSettings.suppressLocalAudioPlayback` ([#18264](https://github.com/mdn/browser-compat-data/pull/18264))
- `api.MediaTrackSupportedConstraints.suppressLocalAudioPlayback` ([#18264](https://github.com/mdn/browser-compat-data/pull/18264))
- `api.Permissions.local-fonts_permission` ([#18419](https://github.com/mdn/browser-compat-data/pull/18419))
- `api.WebTransport.createUnidirectionalStream.byob_readers` ([#18209](https://github.com/mdn/browser-compat-data/pull/18209))
- `api.WebTransport.WebTransport.serverCertificateHashes` ([#18209](https://github.com/mdn/browser-compat-data/pull/18209))
- `api.Window.credentialless` ([#18455](https://github.com/mdn/browser-compat-data/pull/18455))
- `css.at-rules.font-face.src.drop_invalid_item` ([#18454](https://github.com/mdn/browser-compat-data/pull/18454))
- `css.at-rules.import.layer` ([#18461](https://github.com/mdn/browser-compat-data/pull/18461))
- `html.elements.a.text_fragments` ([#18411](https://github.com/mdn/browser-compat-data/pull/18411))
- `html.elements.iframe.credentialless` ([#18455](https://github.com/mdn/browser-compat-data/pull/18455))
- `html.manifest.launch_handler` ([#18427](https://github.com/mdn/browser-compat-data/pull/18427))
- `html.manifest.launch_handler.client_mode` ([#18427](https://github.com/mdn/browser-compat-data/pull/18427))
- `http.headers.Permissions-Policy.local-fonts` ([#18419](https://github.com/mdn/browser-compat-data/pull/18419))
- `http.headers.Sec-CH-Save-Data` ([#18243](https://github.com/mdn/browser-compat-data/pull/18243))

### Statistics

- 12 contributors have changed 45 files with 2,216 additions and 283 deletions in 34 commits ([`v5.2.22...v5.2.23`](https://github.com/mdn/browser-compat-data/compare/v5.2.22...v5.2.23))
- 14,130 total features
- 966 total contributors
- 4,344 total stargazers

## [v5.2.22](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.22)

December 14, 2022

### Additions

- `api.URLPattern.URLPattern.ignoreCase_option` ([#18388](https://github.com/mdn/browser-compat-data/pull/18388))
- `http.headers.Critical-CH` ([#18389](https://github.com/mdn/browser-compat-data/pull/18389))
- `http.headers.Permissions-Policy.display-capture` ([#18257](https://github.com/mdn/browser-compat-data/pull/18257))

### Statistics

- 5 contributors have changed 9 files with 282 additions and 634 deletions in 19 commits ([`v5.2.21...v5.2.22`](https://github.com/mdn/browser-compat-data/compare/v5.2.21...v5.2.22))
- 14,091 total features
- 964 total contributors
- 4,337 total stargazers

## [v5.2.21](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.21)

December 9, 2022

### Additions

- `api.PerformanceResourceTiming.responseStatus` ([#18328](https://github.com/mdn/browser-compat-data/pull/18328))
- `browsers.deno.releases.1.28` ([#18341](https://github.com/mdn/browser-compat-data/pull/18341))
- `browsers.edge.releases.110` ([#18373](https://github.com/mdn/browser-compat-data/pull/18373))
- `css.properties.font-variant-emoji` ([#18381](https://github.com/mdn/browser-compat-data/pull/18381))
- `css.properties.font-variant.font-variant-emoji` ([#18381](https://github.com/mdn/browser-compat-data/pull/18381))
- `javascript.builtins.AsyncFunction.AsyncFunction` ([#18383](https://github.com/mdn/browser-compat-data/pull/18383))
- `javascript.builtins.AsyncGeneratorFunction.AsyncGeneratorFunction` ([#18383](https://github.com/mdn/browser-compat-data/pull/18383))
- `javascript.builtins.GeneratorFunction.GeneratorFunction` ([#18383](https://github.com/mdn/browser-compat-data/pull/18383))
- `webextensions.api.omnibox.onDeleteSuggestion` ([#18372](https://github.com/mdn/browser-compat-data/pull/18372))
- `webextensions.api.omnibox.SuggestResult.content` ([#18372](https://github.com/mdn/browser-compat-data/pull/18372))
- `webextensions.api.omnibox.SuggestResult.deletable` ([#18372](https://github.com/mdn/browser-compat-data/pull/18372))
- `webextensions.api.omnibox.SuggestResult.description` ([#18372](https://github.com/mdn/browser-compat-data/pull/18372))
- `webextensions.api.webRequest.SecurityInfo.certificates` ([#18371](https://github.com/mdn/browser-compat-data/pull/18371))
- `webextensions.api.webRequest.SecurityInfo.certificateTransparencyStatus` ([#18371](https://github.com/mdn/browser-compat-data/pull/18371))
- `webextensions.api.webRequest.SecurityInfo.cipherSuite` ([#18371](https://github.com/mdn/browser-compat-data/pull/18371))
- `webextensions.api.webRequest.SecurityInfo.errorMessage` ([#18371](https://github.com/mdn/browser-compat-data/pull/18371))
- `webextensions.api.webRequest.SecurityInfo.hsts` ([#18371](https://github.com/mdn/browser-compat-data/pull/18371))
- `webextensions.api.webRequest.SecurityInfo.isDomainMismatch` ([#18371](https://github.com/mdn/browser-compat-data/pull/18371))
- `webextensions.api.webRequest.SecurityInfo.isExtendedValidation` ([#18371](https://github.com/mdn/browser-compat-data/pull/18371))
- `webextensions.api.webRequest.SecurityInfo.isNotValidAtThisTime` ([#18371](https://github.com/mdn/browser-compat-data/pull/18371))
- `webextensions.api.webRequest.SecurityInfo.isUntrusted` ([#18371](https://github.com/mdn/browser-compat-data/pull/18371))
- `webextensions.api.webRequest.SecurityInfo.keaGroupName` ([#18371](https://github.com/mdn/browser-compat-data/pull/18371))
- `webextensions.api.webRequest.SecurityInfo.protocolVersion` ([#18371](https://github.com/mdn/browser-compat-data/pull/18371))
- `webextensions.api.webRequest.SecurityInfo.secretKeyLength` ([#18371](https://github.com/mdn/browser-compat-data/pull/18371))
- `webextensions.api.webRequest.SecurityInfo.signatureSchemeName` ([#18371](https://github.com/mdn/browser-compat-data/pull/18371))
- `webextensions.api.webRequest.SecurityInfo.state` ([#18371](https://github.com/mdn/browser-compat-data/pull/18371))
- `webextensions.api.webRequest.SecurityInfo.weaknessReasons` ([#18371](https://github.com/mdn/browser-compat-data/pull/18371))

### Statistics

- 11 contributors have changed 97 files with 1,183 additions and 519 deletions in 36 commits ([`v5.2.20...v5.2.21`](https://github.com/mdn/browser-compat-data/compare/v5.2.20...v5.2.21))
- 14,088 total features
- 964 total contributors
- 4,330 total stargazers

## [v5.2.20](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.20)

November 29, 2022

### Additions

- `api.Element.checkVisibility` ([#18270](https://github.com/mdn/browser-compat-data/pull/18270))
- `api.FileSystemDirectoryHandle.@@asyncIterator` ([#18271](https://github.com/mdn/browser-compat-data/pull/18271))
- `api.FontFaceSet.@@iterator` ([#18273](https://github.com/mdn/browser-compat-data/pull/18273))
- `api.HTMLLinkElement.blocking` ([#18275](https://github.com/mdn/browser-compat-data/pull/18275))
- `api.HTMLScriptElement.blocking` ([#18276](https://github.com/mdn/browser-compat-data/pull/18276))
- `api.HTMLStyleElement.blocking` ([#18277](https://github.com/mdn/browser-compat-data/pull/18277))
- `api.MIDIInputMap.@@iterator` ([#18278](https://github.com/mdn/browser-compat-data/pull/18278))
- `api.NDEFReader.makeReadOnly` ([#18279](https://github.com/mdn/browser-compat-data/pull/18279))
- `api.NodeList.@@iterator` ([#18280](https://github.com/mdn/browser-compat-data/pull/18280))
- `api.PublicKeyCredential.isConditionalMediationAvailable` ([#18282](https://github.com/mdn/browser-compat-data/pull/18282))
- `api.PushSubscriptionChangeEvent.PushSubscriptionChangeEvent` ([#18283](https://github.com/mdn/browser-compat-data/pull/18283))
- `api.RTCRtpReceiver.transform` ([#18284](https://github.com/mdn/browser-compat-data/pull/18284))

### Statistics

- 2 contributors have changed 76 files with 1,814 additions and 396 deletions in 31 commits ([`v5.2.19...v5.2.20`](https://github.com/mdn/browser-compat-data/compare/v5.2.19...v5.2.20))
- 14,063 total features
- 964 total contributors
- 4,318 total stargazers

## [v5.2.19](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.19)

November 25, 2022

### Removals

- `api.Request.Request.readablestream_request_body` ([#18155](https://github.com/mdn/browser-compat-data/pull/18155))

### Additions

- `api.Credential.isConditionalMediationAvailable` ([#18156](https://github.com/mdn/browser-compat-data/pull/18156))
- `api.CSS.cqb` ([#18162](https://github.com/mdn/browser-compat-data/pull/18162))
- `api.CSS.cqh` ([#18162](https://github.com/mdn/browser-compat-data/pull/18162))
- `api.CSS.cqi` ([#18162](https://github.com/mdn/browser-compat-data/pull/18162))
- `api.CSS.cqmax` ([#18162](https://github.com/mdn/browser-compat-data/pull/18162))
- `api.CSS.cqmin` ([#18162](https://github.com/mdn/browser-compat-data/pull/18162))
- `api.CSS.cqw` ([#18162](https://github.com/mdn/browser-compat-data/pull/18162))
- `api.CSS.highlights` ([#18162](https://github.com/mdn/browser-compat-data/pull/18162))
- `api.DedicatedWorkerGlobalScope.rtctransform_event` ([#18167](https://github.com/mdn/browser-compat-data/pull/18167))
- `api.Highlight` ([#18293](https://github.com/mdn/browser-compat-data/pull/18293))
- `api.Highlight.@@iterator` ([#18293](https://github.com/mdn/browser-compat-data/pull/18293))
- `api.Highlight.add` ([#18293](https://github.com/mdn/browser-compat-data/pull/18293))
- `api.Highlight.clear` ([#18293](https://github.com/mdn/browser-compat-data/pull/18293))
- `api.Highlight.delete` ([#18293](https://github.com/mdn/browser-compat-data/pull/18293))
- `api.Highlight.entries` ([#18293](https://github.com/mdn/browser-compat-data/pull/18293))
- `api.Highlight.forEach` ([#18293](https://github.com/mdn/browser-compat-data/pull/18293))
- `api.Highlight.has` ([#18293](https://github.com/mdn/browser-compat-data/pull/18293))
- `api.Highlight.Highlight` ([#18293](https://github.com/mdn/browser-compat-data/pull/18293))
- `api.Highlight.keys` ([#18293](https://github.com/mdn/browser-compat-data/pull/18293))
- `api.Highlight.priority` ([#18293](https://github.com/mdn/browser-compat-data/pull/18293))
- `api.Highlight.size` ([#18293](https://github.com/mdn/browser-compat-data/pull/18293))
- `api.Highlight.type` ([#18293](https://github.com/mdn/browser-compat-data/pull/18293))
- `api.Highlight.values` ([#18293](https://github.com/mdn/browser-compat-data/pull/18293))
- `api.HighlightRegistry` ([#18294](https://github.com/mdn/browser-compat-data/pull/18294))
- `api.HighlightRegistry.@@iterator` ([#18294](https://github.com/mdn/browser-compat-data/pull/18294))
- `api.HighlightRegistry.clear` ([#18294](https://github.com/mdn/browser-compat-data/pull/18294))
- `api.HighlightRegistry.delete` ([#18294](https://github.com/mdn/browser-compat-data/pull/18294))
- `api.HighlightRegistry.entries` ([#18294](https://github.com/mdn/browser-compat-data/pull/18294))
- `api.HighlightRegistry.forEach` ([#18294](https://github.com/mdn/browser-compat-data/pull/18294))
- `api.HighlightRegistry.get` ([#18294](https://github.com/mdn/browser-compat-data/pull/18294))
- `api.HighlightRegistry.has` ([#18294](https://github.com/mdn/browser-compat-data/pull/18294))
- `api.HighlightRegistry.keys` ([#18294](https://github.com/mdn/browser-compat-data/pull/18294))
- `api.HighlightRegistry.set` ([#18294](https://github.com/mdn/browser-compat-data/pull/18294))
- `api.HighlightRegistry.size` ([#18294](https://github.com/mdn/browser-compat-data/pull/18294))
- `api.HighlightRegistry.values` ([#18294](https://github.com/mdn/browser-compat-data/pull/18294))
- `api.Request.Request.request_body_readablestream` ([#18155](https://github.com/mdn/browser-compat-data/pull/18155))
- `api.RTCRtpScriptTransform` ([#18295](https://github.com/mdn/browser-compat-data/pull/18295))
- `api.RTCRtpScriptTransform.RTCRtpScriptTransform` ([#18295](https://github.com/mdn/browser-compat-data/pull/18295))
- `api.RTCRtpScriptTransformer` ([#18296](https://github.com/mdn/browser-compat-data/pull/18296))
- `api.RTCRtpScriptTransformer.generateKeyFrame` ([#18296](https://github.com/mdn/browser-compat-data/pull/18296))
- `api.RTCRtpScriptTransformer.options` ([#18296](https://github.com/mdn/browser-compat-data/pull/18296))
- `api.RTCRtpScriptTransformer.readable` ([#18296](https://github.com/mdn/browser-compat-data/pull/18296))
- `api.RTCRtpScriptTransformer.sendKeyFrameRequest` ([#18296](https://github.com/mdn/browser-compat-data/pull/18296))
- `api.RTCRtpScriptTransformer.writable` ([#18296](https://github.com/mdn/browser-compat-data/pull/18296))
- `api.RTCTransformEvent` ([#18297](https://github.com/mdn/browser-compat-data/pull/18297))
- `api.RTCTransformEvent.transformer` ([#18297](https://github.com/mdn/browser-compat-data/pull/18297))
- `api.Sanitizer.getDefaultConfiguration` ([#18285](https://github.com/mdn/browser-compat-data/pull/18285))
- `api.Screen.change_event` ([#18286](https://github.com/mdn/browser-compat-data/pull/18286))
- `api.WindowClient.ancestorOrigins` ([#18289](https://github.com/mdn/browser-compat-data/pull/18289))
- `api.XRAnchorSet.@@iterator` ([#18290](https://github.com/mdn/browser-compat-data/pull/18290))
- `api.XRCamera` ([#18298](https://github.com/mdn/browser-compat-data/pull/18298))
- `api.XRCamera.height` ([#18298](https://github.com/mdn/browser-compat-data/pull/18298))
- `api.XRCamera.width` ([#18298](https://github.com/mdn/browser-compat-data/pull/18298))
- `api.XRView.camera` ([#18291](https://github.com/mdn/browser-compat-data/pull/18291))
- `api.XRWebGLBinding.getCameraImage` ([#18292](https://github.com/mdn/browser-compat-data/pull/18292))
- `html.elements.source.height` ([#18081](https://github.com/mdn/browser-compat-data/pull/18081))
- `html.elements.source.width` ([#18081](https://github.com/mdn/browser-compat-data/pull/18081))

### Statistics

- 7 contributors have changed 84 files with 2,954 additions and 1,038 deletions in 33 commits ([`v5.2.18...v5.2.19`](https://github.com/mdn/browser-compat-data/compare/v5.2.18...v5.2.19))
- 14,051 total features
- 964 total contributors
- 4,310 total stargazers

## [v5.2.18](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.18)

November 22, 2022

### Removals

- `api.MediaSource.worker_support` ([#18225](https://github.com/mdn/browser-compat-data/pull/18225))
- `api.SourceBuffer.textTracks.worker_support` ([#18225](https://github.com/mdn/browser-compat-data/pull/18225))
- `api.SourceBuffer.worker_support` ([#18225](https://github.com/mdn/browser-compat-data/pull/18225))
- `api.SourceBufferList.worker_support` ([#18225](https://github.com/mdn/browser-compat-data/pull/18225))
- `api.VideoPlaybackQuality.corruptedVideoFrames.worker_support` ([#18225](https://github.com/mdn/browser-compat-data/pull/18225))
- `api.VideoPlaybackQuality.creationTime.worker_support` ([#18225](https://github.com/mdn/browser-compat-data/pull/18225))
- `api.VideoPlaybackQuality.droppedVideoFrames.worker_support` ([#18225](https://github.com/mdn/browser-compat-data/pull/18225))
- `api.VideoPlaybackQuality.totalFrameDelay.worker_support` ([#18225](https://github.com/mdn/browser-compat-data/pull/18225))
- `api.VideoPlaybackQuality.totalVideoFrames.worker_support` ([#18225](https://github.com/mdn/browser-compat-data/pull/18225))
- `api.VideoPlaybackQuality.worker_support` ([#18225](https://github.com/mdn/browser-compat-data/pull/18225))

### Additions

- `api.MediaSource.MediaSource.worker_support` ([#18225](https://github.com/mdn/browser-compat-data/pull/18225))
- `browsers.samsunginternet_android.releases.16.2` ([#18249](https://github.com/mdn/browser-compat-data/pull/18249))
- `browsers.samsunginternet_android.releases.18.1` ([#18249](https://github.com/mdn/browser-compat-data/pull/18249))
- `browsers.samsunginternet_android.releases.19.0` ([#18249](https://github.com/mdn/browser-compat-data/pull/18249))
- `browsers.samsunginternet_android.releases.19.1` ([#18249](https://github.com/mdn/browser-compat-data/pull/18249))
- `css.types.length.container_query_length_units` ([#18227](https://github.com/mdn/browser-compat-data/pull/18227))
- `html.elements.script.type.importmap` ([#18214](https://github.com/mdn/browser-compat-data/pull/18214))
- `http.headers.Feature-Policy.idle-detection` ([#18196](https://github.com/mdn/browser-compat-data/pull/18196))
- `http.headers.Link` ([#18126](https://github.com/mdn/browser-compat-data/pull/18126))
- `http.headers.Permissions-Policy` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.accelerometer` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.ambient-light-sensor` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.autoplay` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.battery` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.camera` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.document-domain` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.encrypted-media` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.execution-while-not-rendered` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.execution-while-out-of-viewport` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.fullscreen` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.gamepad` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.geolocation` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.gyroscope` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.hid` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.idle-detection` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.magnetometer` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.microphone` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.midi` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.payment` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.picture-in-picture` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.publickey-credentials-get` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.screen-wake-lock` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.serial` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.speaker-selection` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.usb` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.web-share` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.wildcards` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `http.headers.Permissions-Policy.xr-spatial-tracking` ([#18250](https://github.com/mdn/browser-compat-data/pull/18250))
- `javascript.grammar.trailing_commas.trailing_commas_in_dynamic_import` ([#17366](https://github.com/mdn/browser-compat-data/pull/17366))
- `javascript.operators.import.options_parameter` ([#17366](https://github.com/mdn/browser-compat-data/pull/17366))
- `javascript.statements.import.import_assertions` ([#17366](https://github.com/mdn/browser-compat-data/pull/17366))
- `javascript.statements.import.import_assertions.type_json` ([#17366](https://github.com/mdn/browser-compat-data/pull/17366))

### Statistics

- 13 contributors have changed 29 files with 2,131 additions and 576 deletions in 23 commits ([`v5.2.17...v5.2.18`](https://github.com/mdn/browser-compat-data/compare/v5.2.17...v5.2.18))
- 13,995 total features
- 962 total contributors
- 4,310 total stargazers

## [v5.2.17](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.17)

November 18, 2022

### Removals

- `api.Performance.measure.returns_undefined` ([#18216](https://github.com/mdn/browser-compat-data/pull/18216))

### Additions

- `api.Performance.mark.markOptions_parameter` ([#18229](https://github.com/mdn/browser-compat-data/pull/18229))
- `api.Performance.mark.returns_performancemark` ([#18229](https://github.com/mdn/browser-compat-data/pull/18229))
- `api.Performance.measure.measureOptions_parameter` ([#18228](https://github.com/mdn/browser-compat-data/pull/18228))
- `api.Performance.measure.returns_performancemeasure` ([#18216](https://github.com/mdn/browser-compat-data/pull/18216))
- `api.PerformanceObserver.PerformanceObserver.droppedEntriesCount` ([#18217](https://github.com/mdn/browser-compat-data/pull/18217))
- `html.manifest.id` ([#18197](https://github.com/mdn/browser-compat-data/pull/18197))
- `http.headers.Sec-CH-Prefers-Color-Scheme` ([#18203](https://github.com/mdn/browser-compat-data/pull/18203))
- `http.headers.Sec-CH-Prefers-Reduced-Motion` ([#18203](https://github.com/mdn/browser-compat-data/pull/18203))

### Statistics

- 11 contributors have changed 12 files with 321 additions and 55 deletions in 13 commits ([`v5.2.16...v5.2.17`](https://github.com/mdn/browser-compat-data/compare/v5.2.16...v5.2.17))
- 13,967 total features
- 958 total contributors
- 4,303 total stargazers

## [v5.2.16](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.16)

November 15, 2022

### Statistics

- 3 contributors have changed 29 files with 766 additions and 1,057 deletions in 5 commits ([`v5.2.15...v5.2.16`](https://github.com/mdn/browser-compat-data/compare/v5.2.15...v5.2.16))
- 13,960 total features
- 956 total contributors
- 4,294 total stargazers

## [v5.2.15](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.15)

November 11, 2022

### Additions

- `api.ContentVisibilityAutoStateChangedEvent` ([#18176](https://github.com/mdn/browser-compat-data/pull/18176))
- `api.ContentVisibilityAutoStateChangedEvent.ContentVisibilityAutoStateChangedEvent` ([#18176](https://github.com/mdn/browser-compat-data/pull/18176))
- `api.ContentVisibilityAutoStateChangedEvent.skipped` ([#18176](https://github.com/mdn/browser-compat-data/pull/18176))
- `api.Element.contentvisibilityautostatechanged_event` ([#18176](https://github.com/mdn/browser-compat-data/pull/18176))
- `api.MediaSource.activeSourceBuffers.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.MediaSource.addSourceBuffer.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.MediaSource.canConstructInDedicatedWorker` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.MediaSource.clearLiveSeekableRange.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.MediaSource.duration.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.MediaSource.endOfStream.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.MediaSource.handle` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.MediaSource.isTypeSupported.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.MediaSource.readyState.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.MediaSource.removeSourceBuffer.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.MediaSource.setLiveSeekableRange.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.MediaSource.sourceBuffers.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.MediaSource.sourceclose_event.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.MediaSource.sourceended_event.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.MediaSource.sourceopen_event.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.MediaSource.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.MediaSourceHandle` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.abort_event.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.abort.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.appendBuffer.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.appendWindowEnd.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.appendWindowStart.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.audioTracks.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.buffered.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.changeType.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.error_event.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.mode.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.remove.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.textTracks.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.timestampOffset.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.update_event.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.updateend_event.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.updatestart_event.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.updating.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.videoTracks.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBuffer.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBufferList.addsourcebuffer_event.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBufferList.length.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBufferList.removesourcebuffer_event.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.SourceBufferList.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.VideoPlaybackQuality.corruptedVideoFrames.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.VideoPlaybackQuality.creationTime.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.VideoPlaybackQuality.droppedVideoFrames.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.VideoPlaybackQuality.totalFrameDelay.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.VideoPlaybackQuality.totalVideoFrames.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))
- `api.VideoPlaybackQuality.worker_support` ([#18189](https://github.com/mdn/browser-compat-data/pull/18189))

### Statistics

- 5 contributors have changed 20 files with 1,703 additions and 117 deletions in 6 commits ([`v5.2.14...v5.2.15`](https://github.com/mdn/browser-compat-data/compare/v5.2.14...v5.2.15))
- 13,960 total features
- 955 total contributors
- 4,295 total stargazers

## [v5.2.14](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.14)

November 8, 2022

### Additions

- `browsers.opera.releases.94` ([#18165](https://github.com/mdn/browser-compat-data/pull/18165))
- `css.properties.hyphenate-limit-chars` ([#18149](https://github.com/mdn/browser-compat-data/pull/18149))

### Statistics

- 6 contributors have changed 12 files with 352 additions and 308 deletions in 11 commits ([`v5.2.13...v5.2.14`](https://github.com/mdn/browser-compat-data/compare/v5.2.13...v5.2.14))
- 13,910 total features
- 955 total contributors
- 4,293 total stargazers

## [v5.2.13](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.13)

November 4, 2022

### Additions

- `api.NavigateEvent.canIntercept` ([#18105](https://github.com/mdn/browser-compat-data/pull/18105))
- `browsers.edge.releases.109` ([#18123](https://github.com/mdn/browser-compat-data/pull/18123))
- `browsers.safari_ios.releases.16.1` ([#18131](https://github.com/mdn/browser-compat-data/pull/18131))
- `browsers.safari.releases.16.1` ([#18131](https://github.com/mdn/browser-compat-data/pull/18131))
- `css.properties.display.math` ([#18145](https://github.com/mdn/browser-compat-data/pull/18145))
- `css.properties.text-transform.math-auto` ([#18146](https://github.com/mdn/browser-compat-data/pull/18146))
- `svg.attributes.conditional_processing.requiredExtensions.mathml` ([#18144](https://github.com/mdn/browser-compat-data/pull/18144))

### Statistics

- 8 contributors have changed 34 files with 672 additions and 543 deletions in 21 commits ([`v5.2.12...v5.2.13`](https://github.com/mdn/browser-compat-data/compare/v5.2.12...v5.2.13))
- 13,909 total features
- 954 total contributors
- 4,285 total stargazers

## [v5.2.12](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.12)

November 1, 2022

### Removals

- `css.at-rules.viewport` ([#17860](https://github.com/mdn/browser-compat-data/pull/17860))

### Additions

- `css.properties.object-view-box` ([#17895](https://github.com/mdn/browser-compat-data/pull/17895))
- `http.headers.Content-Security-Policy.script-src.wasm-unsafe-eval` ([#17947](https://github.com/mdn/browser-compat-data/pull/17947))

### Statistics

- 12 contributors have changed 13 files with 197 additions and 127 deletions in 12 commits ([`v5.2.11...v5.2.12`](https://github.com/mdn/browser-compat-data/compare/v5.2.11...v5.2.12))
- 13,905 total features
- 954 total contributors
- 4,275 total stargazers

## [v5.2.11](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.11)

October 28, 2022

### Additions

- `api.FileSystemFileHandle.createSyncAccessHandle` ([#18067](https://github.com/mdn/browser-compat-data/pull/18067))
- `api.FileSystemSyncAccessHandle` ([#18067](https://github.com/mdn/browser-compat-data/pull/18067))
- `api.FileSystemSyncAccessHandle.close` ([#18067](https://github.com/mdn/browser-compat-data/pull/18067))
- `api.FileSystemSyncAccessHandle.close.sync_version` ([#18067](https://github.com/mdn/browser-compat-data/pull/18067))
- `api.FileSystemSyncAccessHandle.flush` ([#18067](https://github.com/mdn/browser-compat-data/pull/18067))
- `api.FileSystemSyncAccessHandle.flush.sync_version` ([#18067](https://github.com/mdn/browser-compat-data/pull/18067))
- `api.FileSystemSyncAccessHandle.getSize` ([#18067](https://github.com/mdn/browser-compat-data/pull/18067))
- `api.FileSystemSyncAccessHandle.getSize.sync_version` ([#18067](https://github.com/mdn/browser-compat-data/pull/18067))
- `api.FileSystemSyncAccessHandle.read` ([#18067](https://github.com/mdn/browser-compat-data/pull/18067))
- `api.FileSystemSyncAccessHandle.truncate` ([#18067](https://github.com/mdn/browser-compat-data/pull/18067))
- `api.FileSystemSyncAccessHandle.truncate.sync_version` ([#18067](https://github.com/mdn/browser-compat-data/pull/18067))
- `api.FileSystemSyncAccessHandle.write` ([#18067](https://github.com/mdn/browser-compat-data/pull/18067))
- `api.InkPresenter` ([#18092](https://github.com/mdn/browser-compat-data/pull/18092))
- `api.InkPresenter.expectedImprovement` ([#18092](https://github.com/mdn/browser-compat-data/pull/18092))
- `api.InkPresenter.presentationArea` ([#18092](https://github.com/mdn/browser-compat-data/pull/18092))
- `api.InkPresenter.updateInkTrailStartPoint` ([#18092](https://github.com/mdn/browser-compat-data/pull/18092))
- `api.PerformanceResourceTiming.renderBlockingStatus` ([#18046](https://github.com/mdn/browser-compat-data/pull/18046))
- `css.properties.animation-timeline.scroll` ([#18064](https://github.com/mdn/browser-compat-data/pull/18064))

### Statistics

- 12 contributors have changed 18 files with 799 additions and 60 deletions in 15 commits ([`v5.2.10...v5.2.11`](https://github.com/mdn/browser-compat-data/compare/v5.2.10...v5.2.11))
- 13,904 total features
- 950 total contributors
- 4,271 total stargazers

## [v5.2.10](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.10)

October 25, 2022

### Additions

- `browsers.nodejs.releases.19.0.0` ([#18076](https://github.com/mdn/browser-compat-data/pull/18076))
- `browsers.opera_android.releases.72` ([#18059](https://github.com/mdn/browser-compat-data/pull/18059))

### Statistics

- 6 contributors have changed 37 files with 568 additions and 356 deletions in 15 commits ([`v5.2.9...v5.2.10`](https://github.com/mdn/browser-compat-data/compare/v5.2.9...v5.2.10))
- 13,886 total features
- 949 total contributors
- 4,268 total stargazers

## [v5.2.9](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.9)

October 21, 2022

### Additions

- `browsers.deno.releases.1.25` ([#18052](https://github.com/mdn/browser-compat-data/pull/18052))
- `browsers.deno.releases.1.26` ([#18052](https://github.com/mdn/browser-compat-data/pull/18052))
- `browsers.deno.releases.1.27` ([#18052](https://github.com/mdn/browser-compat-data/pull/18052))

### Statistics

- 5 contributors have changed 21 files with 107 additions and 72 deletions in 22 commits ([`v5.2.8...v5.2.9`](https://github.com/mdn/browser-compat-data/compare/v5.2.8...v5.2.9))
- 13,886 total features
- 948 total contributors
- 4,265 total stargazers

## [v5.2.8](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.8)

October 18, 2022

### Additions

- `css.at-rules.supports.font-format` ([#18034](https://github.com/mdn/browser-compat-data/pull/18034))
- `css.at-rules.supports.font-tech` ([#18034](https://github.com/mdn/browser-compat-data/pull/18034))
- `webextensions.api.tabs.ZoomSettings.defaultZoomFactor` ([#17966](https://github.com/mdn/browser-compat-data/pull/17966))
- `webextensions.api.tabs.ZoomSettings.mode` ([#17966](https://github.com/mdn/browser-compat-data/pull/17966))
- `webextensions.api.tabs.ZoomSettings.scope` ([#17966](https://github.com/mdn/browser-compat-data/pull/17966))

### Statistics

- 6 contributors have changed 16 files with 358 additions and 197 deletions in 19 commits ([`v5.2.7...v5.2.8`](https://github.com/mdn/browser-compat-data/compare/v5.2.7...v5.2.8))
- 13,886 total features
- 947 total contributors
- 4,262 total stargazers

## [v5.2.7](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.7)

October 14, 2022

### Notable changes

Starting with this release, BCD will now be released on Tuesdays and Fridays.

### Removals

- `api.Element.openOrClosedShadowRoot` ([#17707](https://github.com/mdn/browser-compat-data/pull/17707))
- `api.XRWebGLSubImage.textureHeight` ([#17985](https://github.com/mdn/browser-compat-data/pull/17985))
- `api.XRWebGLSubImage.textureWidth` ([#17985](https://github.com/mdn/browser-compat-data/pull/17985))

### Additions

- `api.Element.beforematch_event` ([#17981](https://github.com/mdn/browser-compat-data/pull/17981))
- `api.XRWebGLSubImage.colorTextureHeight` ([#17985](https://github.com/mdn/browser-compat-data/pull/17985))
- `api.XRWebGLSubImage.colorTextureWidth` ([#17985](https://github.com/mdn/browser-compat-data/pull/17985))
- `css.properties.scroll-timeline` ([#17952](https://github.com/mdn/browser-compat-data/pull/17952))
- `css.properties.scroll-timeline-axis` ([#17952](https://github.com/mdn/browser-compat-data/pull/17952))
- `css.properties.scroll-timeline-name` ([#17952](https://github.com/mdn/browser-compat-data/pull/17952))
- `webextensions.api.dom.openOrClosedShadowRoot` ([#17707](https://github.com/mdn/browser-compat-data/pull/17707))

### Statistics

- 6 contributors have changed 25 files with 449 additions and 298 deletions in 23 commits ([`v5.2.6...v5.2.7`](https://github.com/mdn/browser-compat-data/compare/v5.2.6...v5.2.7))
- 13,881 total features
- 945 total contributors
- 4,259 total stargazers

## [v5.2.6](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.6)

October 11, 2022

### Additions

- `mathml.attribute_values.named_space` ([#17934](https://github.com/mdn/browser-compat-data/pull/17934))
- `mathml.attribute_values.nonzero_unitless_values` ([#17934](https://github.com/mdn/browser-compat-data/pull/17934))
- `mathml.elements.mfrac.linethickness.named_spaces` ([#17934](https://github.com/mdn/browser-compat-data/pull/17934))
- `mathml.elements.mfrac.linethickness.nonzero_unitless_values` ([#17934](https://github.com/mdn/browser-compat-data/pull/17934))
- `mathml.elements.mmultiscripts.subscriptshift` ([#17962](https://github.com/mdn/browser-compat-data/pull/17962))
- `mathml.elements.mmultiscripts.superscriptshift` ([#17962](https://github.com/mdn/browser-compat-data/pull/17962))
- `mathml.elements.mo.named_spaces` ([#17934](https://github.com/mdn/browser-compat-data/pull/17934))
- `mathml.elements.mo.nonzero_unitless_values` ([#17934](https://github.com/mdn/browser-compat-data/pull/17934))
- `mathml.elements.mpadded.depth` ([#17953](https://github.com/mdn/browser-compat-data/pull/17953))
- `mathml.elements.mpadded.named_spaces` ([#17953](https://github.com/mdn/browser-compat-data/pull/17953))
- `mathml.elements.mpadded.nonzero_unitless_values` ([#17953](https://github.com/mdn/browser-compat-data/pull/17953))
- `mathml.elements.mpadded.pseudo_units` ([#17953](https://github.com/mdn/browser-compat-data/pull/17953))
- `mathml.elements.mpadded.relative_values` ([#17953](https://github.com/mdn/browser-compat-data/pull/17953))
- `mathml.elements.mpadded.scale_factor` ([#17953](https://github.com/mdn/browser-compat-data/pull/17953))
- `mathml.elements.mspace.named_spaces` ([#17934](https://github.com/mdn/browser-compat-data/pull/17934))
- `mathml.elements.msub.subscriptshift` ([#17962](https://github.com/mdn/browser-compat-data/pull/17962))
- `mathml.elements.msubsup.subscriptshift` ([#17962](https://github.com/mdn/browser-compat-data/pull/17962))
- `mathml.elements.msubsup.superscriptshift` ([#17962](https://github.com/mdn/browser-compat-data/pull/17962))
- `mathml.elements.msup.superscriptshift` ([#17962](https://github.com/mdn/browser-compat-data/pull/17962))
- `mathml.elements.mtable.width.named_spaces` ([#17934](https://github.com/mdn/browser-compat-data/pull/17934))
- `mathml.elements.mtable.width.nonzero_unitless_values` ([#17934](https://github.com/mdn/browser-compat-data/pull/17934))
- `mathml.global_attributes.mathsize.named_spaces` ([#17934](https://github.com/mdn/browser-compat-data/pull/17934))
- `mathml.global_attributes.mathsize.nonzero_unitless_values` ([#17934](https://github.com/mdn/browser-compat-data/pull/17934))

### Statistics

- 4 contributors have changed 17 files with 1,032 additions and 331 deletions in 13 commits ([`v5.2.5...v5.2.6`](https://github.com/mdn/browser-compat-data/compare/v5.2.5...v5.2.6))
- 13,877 total features
- 945 total contributors
- 4,251 total stargazers

## [v5.2.5](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.5)

October 4, 2022

### Removals

- `css.types.color.color_keywords` ([#17924](https://github.com/mdn/browser-compat-data/pull/17924))
- `css.types.color.color_keywords.rebeccapurple` ([#17924](https://github.com/mdn/browser-compat-data/pull/17924))
- `http.headers.Content-Security-Policy.navigate-to` ([#17902](https://github.com/mdn/browser-compat-data/pull/17902))

### Additions

- `api.Navigator.userActivation` ([#17887](https://github.com/mdn/browser-compat-data/pull/17887))
- `api.OffscreenCanvasRenderingContext2D.commit` ([#17880](https://github.com/mdn/browser-compat-data/pull/17880))
- `api.UserActivation` ([#17887](https://github.com/mdn/browser-compat-data/pull/17887))
- `api.UserActivation.hasBeenActive` ([#17887](https://github.com/mdn/browser-compat-data/pull/17887))
- `api.UserActivation.isActive` ([#17887](https://github.com/mdn/browser-compat-data/pull/17887))
- `browsers.edge.releases.108` ([#17935](https://github.com/mdn/browser-compat-data/pull/17935))
- `css.properties.contain-intrinsic-block-size` ([#17890](https://github.com/mdn/browser-compat-data/pull/17890))
- `css.properties.contain-intrinsic-height` ([#17890](https://github.com/mdn/browser-compat-data/pull/17890))
- `css.properties.contain-intrinsic-inline-size` ([#17890](https://github.com/mdn/browser-compat-data/pull/17890))
- `css.properties.contain-intrinsic-width` ([#17890](https://github.com/mdn/browser-compat-data/pull/17890))
- `css.types.color.named-color` ([#17924](https://github.com/mdn/browser-compat-data/pull/17924))
- `css.types.color.named-color.rebeccapurple` ([#17924](https://github.com/mdn/browser-compat-data/pull/17924))
- `css.types.color.system-color` ([#17924](https://github.com/mdn/browser-compat-data/pull/17924))
- `mathml.elements.menclose.notation.actuarial` ([#17912](https://github.com/mdn/browser-compat-data/pull/17912))
- `mathml.elements.menclose.notation.bottom` ([#17912](https://github.com/mdn/browser-compat-data/pull/17912))
- `mathml.elements.menclose.notation.box` ([#17912](https://github.com/mdn/browser-compat-data/pull/17912))
- `mathml.elements.menclose.notation.circle` ([#17912](https://github.com/mdn/browser-compat-data/pull/17912))
- `mathml.elements.menclose.notation.downdiagonalstrike` ([#17912](https://github.com/mdn/browser-compat-data/pull/17912))
- `mathml.elements.menclose.notation.horizontalstrike` ([#17912](https://github.com/mdn/browser-compat-data/pull/17912))
- `mathml.elements.menclose.notation.left` ([#17912](https://github.com/mdn/browser-compat-data/pull/17912))
- `mathml.elements.menclose.notation.longdiv` ([#17912](https://github.com/mdn/browser-compat-data/pull/17912))
- `mathml.elements.menclose.notation.right` ([#17912](https://github.com/mdn/browser-compat-data/pull/17912))
- `mathml.elements.menclose.notation.roundedbox` ([#17912](https://github.com/mdn/browser-compat-data/pull/17912))
- `mathml.elements.menclose.notation.top` ([#17912](https://github.com/mdn/browser-compat-data/pull/17912))
- `mathml.elements.menclose.notation.updiagonalstrike` ([#17912](https://github.com/mdn/browser-compat-data/pull/17912))
- `mathml.elements.menclose.notation.verticalstrike` ([#17912](https://github.com/mdn/browser-compat-data/pull/17912))
- `mathml.elements.mfrac.linethickness.thin_medium_thick` ([#17920](https://github.com/mdn/browser-compat-data/pull/17920))
- `mathml.elements.ms.lquote_rquote_attributes` ([#17928](https://github.com/mdn/browser-compat-data/pull/17928))
- `mathml.elements.semantics.advanced_visible_child_selection` ([#17927](https://github.com/mdn/browser-compat-data/pull/17927))
- `mathml.global_attributes.mathsize.small_normal_big` ([#17921](https://github.com/mdn/browser-compat-data/pull/17921))

### Statistics

- 12 contributors have changed 45 files with 1,478 additions and 886 deletions in 25 commits ([`v5.2.4...v5.2.5`](https://github.com/mdn/browser-compat-data/compare/v5.2.4...v5.2.5))
- 13,854 total features
- 945 total contributors
- 4,244 total stargazers

## [v5.2.4](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.4)

September 27, 2022

### Additions

- `api.AudioDecoder.dequeue_event` ([#17832](https://github.com/mdn/browser-compat-data/pull/17832))
- `api.AudioEncoder.dequeue_event` ([#17832](https://github.com/mdn/browser-compat-data/pull/17832))
- `api.VideoDecoder.dequeue_event` ([#17832](https://github.com/mdn/browser-compat-data/pull/17832))
- `api.VideoEncoder.dequeue_event` ([#17832](https://github.com/mdn/browser-compat-data/pull/17832))
- `css.types.abs` ([#10552](https://github.com/mdn/browser-compat-data/pull/10552))
- `css.types.hypot` ([#17871](https://github.com/mdn/browser-compat-data/pull/17871))
- `css.types.mod` ([#17873](https://github.com/mdn/browser-compat-data/pull/17873))
- `css.types.pow` ([#17869](https://github.com/mdn/browser-compat-data/pull/17869))
- `css.types.rem` ([#17872](https://github.com/mdn/browser-compat-data/pull/17872))
- `css.types.round` ([#17874](https://github.com/mdn/browser-compat-data/pull/17874))
- `css.types.sign` ([#10570](https://github.com/mdn/browser-compat-data/pull/10570))
- `css.types.sqrt` ([#17870](https://github.com/mdn/browser-compat-data/pull/17870))

### Statistics

- 9 contributors have changed 47 files with 767 additions and 358 deletions in 30 commits ([`v5.2.3...v5.2.4`](https://github.com/mdn/browser-compat-data/compare/v5.2.3...v5.2.4))
- 13,828 total features
- 945 total contributors
- 4,240 total stargazers

## [v5.2.3](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.3)

September 20, 2022

### Removals

- `css.at-rules.scroll-timeline` ([#17212](https://github.com/mdn/browser-compat-data/pull/17212))
- `css.at-rules.scroll-timeline.orientation` ([#17212](https://github.com/mdn/browser-compat-data/pull/17212))
- `css.at-rules.scroll-timeline.scroll-offsets` ([#17212](https://github.com/mdn/browser-compat-data/pull/17212))
- `css.at-rules.scroll-timeline.source` ([#17212](https://github.com/mdn/browser-compat-data/pull/17212))
- `javascript.builtins.Date.toSource` ([#17838](https://github.com/mdn/browser-compat-data/pull/17838))

### Additions

- `api.CSSContainerRule` ([#17778](https://github.com/mdn/browser-compat-data/pull/17778))
- `api.Document.pointerlockchange_event` ([#17816](https://github.com/mdn/browser-compat-data/pull/17816))
- `api.Document.pointerlockerror_event` ([#17816](https://github.com/mdn/browser-compat-data/pull/17816))
- `browsers.opera_android.releases.71` ([#17836](https://github.com/mdn/browser-compat-data/pull/17836))
- `browsers.opera.releases.93` ([#17803](https://github.com/mdn/browser-compat-data/pull/17803))
- `css.at-rules.font-face.src.tech_keyword` ([#17815](https://github.com/mdn/browser-compat-data/pull/17815))
- `css.at-rules.media.prefers-color-scheme.respects-inherited-scheme` ([#17846](https://github.com/mdn/browser-compat-data/pull/17846))
- `css.properties.container` ([#17789](https://github.com/mdn/browser-compat-data/pull/17789))
- `css.properties.container-name` ([#17789](https://github.com/mdn/browser-compat-data/pull/17789))
- `css.properties.container-type` ([#17789](https://github.com/mdn/browser-compat-data/pull/17789))
- `css.types.calc-constant` ([#17828](https://github.com/mdn/browser-compat-data/pull/17828))
- `css.types.calc-constant.e` ([#17828](https://github.com/mdn/browser-compat-data/pull/17828))
- `css.types.calc-constant.infinity` ([#17828](https://github.com/mdn/browser-compat-data/pull/17828))
- `css.types.calc-constant.NaN` ([#17828](https://github.com/mdn/browser-compat-data/pull/17828))
- `css.types.calc-constant.pi` ([#17828](https://github.com/mdn/browser-compat-data/pull/17828))
- `webextensions.api.storage.StorageArea.get.empty_key` ([#17826](https://github.com/mdn/browser-compat-data/pull/17826))
- `webextensions.api.storage.StorageArea.remove.empty_key` ([#17826](https://github.com/mdn/browser-compat-data/pull/17826))

### Statistics

- 14 contributors have changed 137 files with 2,293 additions and 1,251 deletions in 51 commits ([`v5.2.2...v5.2.3`](https://github.com/mdn/browser-compat-data/compare/v5.2.2...v5.2.3))
- 13,816 total features
- 944 total contributors
- 4,239 total stargazers

## [v5.2.2](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.2)

September 13, 2022

### Removals

- `api.CanvasRenderingContext2D.drawWindow` ([#17706](https://github.com/mdn/browser-compat-data/pull/17706))
- `api.RTCIceCredentialType.oauth` ([#17748](https://github.com/mdn/browser-compat-data/pull/17748))
- `mathml.elements.mfrac.bevelled` ([#17735](https://github.com/mdn/browser-compat-data/pull/17735))

### Additions

- `api.Element.ariaColIndexText` ([#17642](https://github.com/mdn/browser-compat-data/pull/17642))
- `api.Element.ariaRowIndexText` ([#17642](https://github.com/mdn/browser-compat-data/pull/17642))
- `api.ElementInternals.ariaColIndexText` ([#17642](https://github.com/mdn/browser-compat-data/pull/17642))
- `api.ElementInternals.ariaRowIndexText` ([#17642](https://github.com/mdn/browser-compat-data/pull/17642))
- `api.FontData` ([#17679](https://github.com/mdn/browser-compat-data/pull/17679))
- `api.FontData.blob` ([#17679](https://github.com/mdn/browser-compat-data/pull/17679))
- `api.FontData.family` ([#17679](https://github.com/mdn/browser-compat-data/pull/17679))
- `api.FontData.fullName` ([#17679](https://github.com/mdn/browser-compat-data/pull/17679))
- `api.FontData.postscriptName` ([#17679](https://github.com/mdn/browser-compat-data/pull/17679))
- `api.FontData.style` ([#17679](https://github.com/mdn/browser-compat-data/pull/17679))
- `api.LaunchParams` ([#17682](https://github.com/mdn/browser-compat-data/pull/17682))
- `api.LaunchParams.files` ([#17682](https://github.com/mdn/browser-compat-data/pull/17682))
- `api.LaunchQueue` ([#17682](https://github.com/mdn/browser-compat-data/pull/17682))
- `api.LaunchQueue.setConsumer` ([#17682](https://github.com/mdn/browser-compat-data/pull/17682))
- `api.Navigator.globalPrivacyControl` ([#17722](https://github.com/mdn/browser-compat-data/pull/17722))
- `api.ScreenDetails` ([#17685](https://github.com/mdn/browser-compat-data/pull/17685))
- `api.ScreenDetails.currentScreen` ([#17685](https://github.com/mdn/browser-compat-data/pull/17685))
- `api.ScreenDetails.currentscreenchange_event` ([#17685](https://github.com/mdn/browser-compat-data/pull/17685))
- `api.ScreenDetails.screens` ([#17685](https://github.com/mdn/browser-compat-data/pull/17685))
- `api.ScreenDetails.screenschange_event` ([#17685](https://github.com/mdn/browser-compat-data/pull/17685))
- `api.WebGL2RenderingContext.drawingBufferColorSpace` ([#17675](https://github.com/mdn/browser-compat-data/pull/17675))
- `api.WebGL2RenderingContext.unpackColorSpace` ([#17675](https://github.com/mdn/browser-compat-data/pull/17675))
- `api.WebGLRenderingContext.drawingBufferColorSpace` ([#17675](https://github.com/mdn/browser-compat-data/pull/17675))
- `api.WebGLRenderingContext.unpackColorSpace` ([#17675](https://github.com/mdn/browser-compat-data/pull/17675))
- `api.Window.getScreenDetails` ([#17685](https://github.com/mdn/browser-compat-data/pull/17685))
- `api.Window.launchQueue` ([#17682](https://github.com/mdn/browser-compat-data/pull/17682))
- `api.Window.queryLocalFonts` ([#17679](https://github.com/mdn/browser-compat-data/pull/17679))
- `http.headers.Sec-GPC` ([#17722](https://github.com/mdn/browser-compat-data/pull/17722))
- `mathml.elements.mstyle.background` ([#17741](https://github.com/mdn/browser-compat-data/pull/17741))
- `mathml.elements.mstyle.color` ([#17741](https://github.com/mdn/browser-compat-data/pull/17741))
- `mathml.elements.mstyle.fontsize` ([#17741](https://github.com/mdn/browser-compat-data/pull/17741))
- `mathml.elements.mstyle.fontstyle` ([#17741](https://github.com/mdn/browser-compat-data/pull/17741))
- `mathml.elements.mstyle.fontweight` ([#17741](https://github.com/mdn/browser-compat-data/pull/17741))
- `webextensions.api.privacy.network.globalPrivacyControl` ([#17722](https://github.com/mdn/browser-compat-data/pull/17722))

### Statistics

- 16 contributors have changed 662 files with 2,899 additions and 2,490 deletions in 58 commits ([`v5.2.1...v5.2.2`](https://github.com/mdn/browser-compat-data/compare/v5.2.1...v5.2.2))
- 13,806 total features
- 944 total contributors
- 4,223 total stargazers

## [v5.2.1](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.1)

September 6, 2022

### Removals

- `api.BlobBuilder` ([#17644](https://github.com/mdn/browser-compat-data/pull/17644))
- `api.Document.createEntityReference` ([#17616](https://github.com/mdn/browser-compat-data/pull/17616))
- `api.Document.height` ([#17616](https://github.com/mdn/browser-compat-data/pull/17616))
- `api.Document.visibilityState.prerender` ([#17673](https://github.com/mdn/browser-compat-data/pull/17673))
- `api.Document.width` ([#17616](https://github.com/mdn/browser-compat-data/pull/17616))
- `css.properties.font-family.system_ui` ([#17476](https://github.com/mdn/browser-compat-data/pull/17476))
- `mathml.elements.math.mode` ([#17624](https://github.com/mdn/browser-compat-data/pull/17624))
- `mathml.elements.mover.align` ([#17620](https://github.com/mdn/browser-compat-data/pull/17620))
- `mathml.elements.msub.subscriptshift` ([#17617](https://github.com/mdn/browser-compat-data/pull/17617))
- `mathml.elements.msubsup.subscriptshift` ([#17617](https://github.com/mdn/browser-compat-data/pull/17617))
- `mathml.elements.msubsup.superscriptshift` ([#17617](https://github.com/mdn/browser-compat-data/pull/17617))
- `mathml.elements.msup.superscriptshift` ([#17617](https://github.com/mdn/browser-compat-data/pull/17617))
- `mathml.elements.munder.align` ([#17620](https://github.com/mdn/browser-compat-data/pull/17620))
- `mathml.elements.munderover.align` ([#17620](https://github.com/mdn/browser-compat-data/pull/17620))

### Additions

- `api.BrowserCaptureMediaStreamTrack` ([#17677](https://github.com/mdn/browser-compat-data/pull/17677))
- `api.BrowserCaptureMediaStreamTrack.clone` ([#17677](https://github.com/mdn/browser-compat-data/pull/17677))
- `api.BrowserCaptureMediaStreamTrack.cropTo` ([#17677](https://github.com/mdn/browser-compat-data/pull/17677))
- `api.CropTarget` ([#17678](https://github.com/mdn/browser-compat-data/pull/17678))
- `api.CropTarget.fromElement` ([#17678](https://github.com/mdn/browser-compat-data/pull/17678))
- `api.HTMLAnchorElement.attributionSourceId` ([#17650](https://github.com/mdn/browser-compat-data/pull/17650))
- `api.HTMLFormElement.rel` ([#17655](https://github.com/mdn/browser-compat-data/pull/17655))
- `api.HTMLFormElement.relList` ([#17655](https://github.com/mdn/browser-compat-data/pull/17655))
- `api.KeyboardLayoutMap.@@iterator` ([#17657](https://github.com/mdn/browser-compat-data/pull/17657))
- `api.MediaDevices.setCaptureHandleConfig` ([#17658](https://github.com/mdn/browser-compat-data/pull/17658))
- `api.MediaStreamTrack.capturehandlechange_event` ([#17659](https://github.com/mdn/browser-compat-data/pull/17659))
- `api.MediaStreamTrack.getCaptureHandle` ([#17660](https://github.com/mdn/browser-compat-data/pull/17660))
- `api.OES_draw_buffers_indexed` ([#17683](https://github.com/mdn/browser-compat-data/pull/17683))
- `api.OES_draw_buffers_indexed.blendEquationiOES` ([#17683](https://github.com/mdn/browser-compat-data/pull/17683))
- `api.OES_draw_buffers_indexed.blendEquationSeparateiOES` ([#17683](https://github.com/mdn/browser-compat-data/pull/17683))
- `api.OES_draw_buffers_indexed.blendFunciOES` ([#17683](https://github.com/mdn/browser-compat-data/pull/17683))
- `api.OES_draw_buffers_indexed.blendFuncSeparateiOES` ([#17683](https://github.com/mdn/browser-compat-data/pull/17683))
- `api.OES_draw_buffers_indexed.colorMaskiOES` ([#17683](https://github.com/mdn/browser-compat-data/pull/17683))
- `api.OES_draw_buffers_indexed.disableiOES` ([#17683](https://github.com/mdn/browser-compat-data/pull/17683))
- `api.OES_draw_buffers_indexed.enableiOES` ([#17683](https://github.com/mdn/browser-compat-data/pull/17683))
- `api.OffscreenCanvas.contextlost_event` ([#17665](https://github.com/mdn/browser-compat-data/pull/17665))
- `api.OffscreenCanvas.contextrestored_event` ([#17665](https://github.com/mdn/browser-compat-data/pull/17665))
- `api.Path2D.roundRect` ([#17666](https://github.com/mdn/browser-compat-data/pull/17666))
- `api.PerformanceEventTiming.interactionId` ([#17667](https://github.com/mdn/browser-compat-data/pull/17667))
- `api.PublicKeyCredential.authenticatorAttachment` ([#17668](https://github.com/mdn/browser-compat-data/pull/17668))
- `api.RTCRtpSender.transform` ([#17669](https://github.com/mdn/browser-compat-data/pull/17669))
- `api.RTCStatsReport.@@iterator` ([#17670](https://github.com/mdn/browser-compat-data/pull/17670))
- `api.Screen.isExtended` ([#17671](https://github.com/mdn/browser-compat-data/pull/17671))
- `api.ScreenDetailed` ([#17684](https://github.com/mdn/browser-compat-data/pull/17684))
- `api.ScreenDetailed.availLeft` ([#17684](https://github.com/mdn/browser-compat-data/pull/17684))
- `api.ScreenDetailed.availTop` ([#17684](https://github.com/mdn/browser-compat-data/pull/17684))
- `api.ScreenDetailed.devicePixelRatio` ([#17684](https://github.com/mdn/browser-compat-data/pull/17684))
- `api.ScreenDetailed.isInternal` ([#17684](https://github.com/mdn/browser-compat-data/pull/17684))
- `api.ScreenDetailed.isPrimary` ([#17684](https://github.com/mdn/browser-compat-data/pull/17684))
- `api.ScreenDetailed.label` ([#17684](https://github.com/mdn/browser-compat-data/pull/17684))
- `api.ScreenDetailed.left` ([#17684](https://github.com/mdn/browser-compat-data/pull/17684))
- `api.ScreenDetailed.top` ([#17684](https://github.com/mdn/browser-compat-data/pull/17684))
- `api.WebGL2RenderingContext.lineWidth` ([#17676](https://github.com/mdn/browser-compat-data/pull/17676))
- `api.WebTransport` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransport.close` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransport.closed` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransport.createBidirectionalStream` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransport.createUnidirectionalStream` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransport.datagrams` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransport.incomingBidirectionalStreams` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransport.incomingUnidirectionalStreams` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransport.ready` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransport.WebTransport` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransportBidirectionalStream` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransportBidirectionalStream.readable` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransportBidirectionalStream.writable` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransportDatagramDuplexStream` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransportDatagramDuplexStream.incomingHighWaterMark` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransportDatagramDuplexStream.incomingMaxAge` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransportDatagramDuplexStream.maxDatagramSize` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransportDatagramDuplexStream.outgoingHighWaterMark` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransportDatagramDuplexStream.outgoingMaxAge` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransportDatagramDuplexStream.readable` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransportDatagramDuplexStream.writable` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransportError` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransportError.source` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransportError.streamErrorCode` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `api.WebTransportError.WebTransportError` ([#17686](https://github.com/mdn/browser-compat-data/pull/17686))
- `browsers.edge.releases.107` ([#17646](https://github.com/mdn/browser-compat-data/pull/17646))
- `browsers.firefox_android.releases.109` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox_android.releases.110` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox_android.releases.111` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox_android.releases.112` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox_android.releases.113` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox_android.releases.114` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox_android.releases.115` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox_android.releases.116` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox_android.releases.117` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox_android.releases.118` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox_android.releases.119` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox_android.releases.120` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox_android.releases.121` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox.releases.109` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox.releases.110` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox.releases.111` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox.releases.112` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox.releases.113` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox.releases.114` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox.releases.115` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox.releases.116` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox.releases.117` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox.releases.118` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox.releases.119` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox.releases.120` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `browsers.firefox.releases.121` ([#17648](https://github.com/mdn/browser-compat-data/pull/17648))
- `css.at-rules.container` ([#17619](https://github.com/mdn/browser-compat-data/pull/17619))
- `css.at-rules.font-face.OpenType_CBDT_CBLC` ([#17645](https://github.com/mdn/browser-compat-data/pull/17645))
- `css.at-rules.font-face.OpenType_COLRv0` ([#17645](https://github.com/mdn/browser-compat-data/pull/17645))
- `css.at-rules.font-face.OpenType_COLRv1` ([#17645](https://github.com/mdn/browser-compat-data/pull/17645))
- `css.at-rules.font-face.OpenType_SBIX` ([#17645](https://github.com/mdn/browser-compat-data/pull/17645))
- `css.at-rules.font-face.OpenType_SVG` ([#17645](https://github.com/mdn/browser-compat-data/pull/17645))
- `css.properties.font-family.math` ([#17662](https://github.com/mdn/browser-compat-data/pull/17662))
- `css.properties.font-family.system-ui` ([#17476](https://github.com/mdn/browser-compat-data/pull/17476))
- `css.properties.font-palette` ([#17623](https://github.com/mdn/browser-compat-data/pull/17623))
- `css.properties.font-size.math` ([#17664](https://github.com/mdn/browser-compat-data/pull/17664))
- `css.properties.math-shift` ([#17692](https://github.com/mdn/browser-compat-data/pull/17692))

### Statistics

- 16 contributors have changed 126 files with 3,631 additions and 1,333 deletions in 69 commits ([`v5.2.0...v5.2.1`](https://github.com/mdn/browser-compat-data/compare/v5.2.0...v5.2.1))
- 13,775 total features
- 942 total contributors
- 4,213 total stargazers

## [v5.2.0](https://github.com/mdn/browser-compat-data/releases/tag/v5.2.0)

August 30, 2022

### Notable changes

#### `__meta.timestamp`

Per request, we have added a new `timestamp` property to the top-level `__meta` object. This will include the date and time that the release was built.

#### Internet Explorer data is now in "legacy mode"

The [death of Internet Explorer](http://death-to-ie11.com/) had finally arrived about two months ago (whoo!), and as such we have frozen the BCD for IE. We will no longer be maintaining the data for IE and will remove the data entirely from BCD in a year or two. We strongly recommend that all developers writing IE-compatible websites drop support and focus on modern browsers, such as Chrome, Firefox and Safari.

### Removals

- `api.NavigationEvent` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigationEvent.canTransition` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigationEvent.destination` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigationEvent.downloadRequest` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigationEvent.formData` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigationEvent.hashChange` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigationEvent.info` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigationEvent.NavigationEvent` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigationEvent.navigationType` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigationEvent.restoreScroll` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigationEvent.signal` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigationEvent.transitionWhile` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigationEvent.userInitiated` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.Request.Request.reponse_body_readablestream` ([#17581](https://github.com/mdn/browser-compat-data/pull/17581))
- `css.properties.hyphens.portuguese_brazillian` ([#17581](https://github.com/mdn/browser-compat-data/pull/17581))
- `css.types.image.paint.additional_paramters` ([#17581](https://github.com/mdn/browser-compat-data/pull/17581))
- `javascript.builtins.WeakMap.clear` ([#17579](https://github.com/mdn/browser-compat-data/pull/17579))
- `mathml.elements.mstyle.dir` ([#17043](https://github.com/mdn/browser-compat-data/pull/17043))
- `mathml.elements.mstyle.displaystyle` ([#17043](https://github.com/mdn/browser-compat-data/pull/17043))
- `mathml.elements.mstyle.scriptlevel` ([#17043](https://github.com/mdn/browser-compat-data/pull/17043))

### Additions

- `api.CSSFontPaletteValuesRule` ([#17489](https://github.com/mdn/browser-compat-data/pull/17489))
- `api.CSSFontPaletteValuesRule.basePalette` ([#17489](https://github.com/mdn/browser-compat-data/pull/17489))
- `api.CSSFontPaletteValuesRule.fontFamily` ([#17489](https://github.com/mdn/browser-compat-data/pull/17489))
- `api.CSSFontPaletteValuesRule.name` ([#17489](https://github.com/mdn/browser-compat-data/pull/17489))
- `api.CSSFontPaletteValuesRule.overrideColors` ([#17489](https://github.com/mdn/browser-compat-data/pull/17489))
- `api.CustomElementRegistry.define.disabledFeatures_static_property` ([#17577](https://github.com/mdn/browser-compat-data/pull/17577))
- `api.FontFaceSetLoadEvent.worker_support` ([#17563](https://github.com/mdn/browser-compat-data/pull/17563))
- `api.HTMLCanvasElement.contextlost_event` ([#17602](https://github.com/mdn/browser-compat-data/pull/17602))
- `api.HTMLCanvasElement.contextrestored_event` ([#17602](https://github.com/mdn/browser-compat-data/pull/17602))
- `api.NavigateEvent` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigateEvent.canTransition` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigateEvent.destination` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigateEvent.downloadRequest` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigateEvent.formData` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigateEvent.hashChange` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigateEvent.info` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigateEvent.intercept` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigateEvent.NavigateEvent` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigateEvent.navigationType` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigateEvent.restoreScroll` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigateEvent.scroll` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigateEvent.signal` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigateEvent.transitionWhile` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.NavigateEvent.userInitiated` ([#17561](https://github.com/mdn/browser-compat-data/pull/17561))
- `api.Request.Request.response_body_readablestream` ([#17581](https://github.com/mdn/browser-compat-data/pull/17581))
- `api.WorkerGlobalScope.fonts` ([#17563](https://github.com/mdn/browser-compat-data/pull/17563))
- `api.XRCompositionLayer` ([#17555](https://github.com/mdn/browser-compat-data/pull/17555))
- `api.XRCompositionLayer.blendTextureSourceAlpha` ([#17555](https://github.com/mdn/browser-compat-data/pull/17555))
- `api.XRCompositionLayer.chromaticAberrationCorrection` ([#17555](https://github.com/mdn/browser-compat-data/pull/17555))
- `api.XRCompositionLayer.destroy` ([#17555](https://github.com/mdn/browser-compat-data/pull/17555))
- `api.XRCompositionLayer.layout` ([#17555](https://github.com/mdn/browser-compat-data/pull/17555))
- `api.XRCompositionLayer.mipLevels` ([#17555](https://github.com/mdn/browser-compat-data/pull/17555))
- `api.XRCompositionLayer.needsRedraw` ([#17555](https://github.com/mdn/browser-compat-data/pull/17555))
- `api.XRCubeLayer` ([#17564](https://github.com/mdn/browser-compat-data/pull/17564))
- `api.XRCubeLayer.orientation` ([#17564](https://github.com/mdn/browser-compat-data/pull/17564))
- `api.XRCubeLayer.redraw_event` ([#17564](https://github.com/mdn/browser-compat-data/pull/17564))
- `api.XRCubeLayer.space` ([#17564](https://github.com/mdn/browser-compat-data/pull/17564))
- `api.XRCylinderLayer` ([#17558](https://github.com/mdn/browser-compat-data/pull/17558))
- `api.XRCylinderLayer.aspectRatio` ([#17558](https://github.com/mdn/browser-compat-data/pull/17558))
- `api.XRCylinderLayer.centralAngle` ([#17558](https://github.com/mdn/browser-compat-data/pull/17558))
- `api.XRCylinderLayer.radius` ([#17558](https://github.com/mdn/browser-compat-data/pull/17558))
- `api.XRCylinderLayer.redraw_event` ([#17558](https://github.com/mdn/browser-compat-data/pull/17558))
- `api.XRCylinderLayer.space` ([#17558](https://github.com/mdn/browser-compat-data/pull/17558))
- `api.XRCylinderLayer.transform` ([#17558](https://github.com/mdn/browser-compat-data/pull/17558))
- `api.XREquirectLayer` ([#17559](https://github.com/mdn/browser-compat-data/pull/17559))
- `api.XREquirectLayer.centralHorizontalAngle` ([#17559](https://github.com/mdn/browser-compat-data/pull/17559))
- `api.XREquirectLayer.lowerVerticalAngle` ([#17559](https://github.com/mdn/browser-compat-data/pull/17559))
- `api.XREquirectLayer.radius` ([#17559](https://github.com/mdn/browser-compat-data/pull/17559))
- `api.XREquirectLayer.redraw_event` ([#17559](https://github.com/mdn/browser-compat-data/pull/17559))
- `api.XREquirectLayer.space` ([#17559](https://github.com/mdn/browser-compat-data/pull/17559))
- `api.XREquirectLayer.transform` ([#17559](https://github.com/mdn/browser-compat-data/pull/17559))
- `api.XREquirectLayer.upperVerticalAngle` ([#17559](https://github.com/mdn/browser-compat-data/pull/17559))
- `api.XRFrame.fillJointRadii` ([#17551](https://github.com/mdn/browser-compat-data/pull/17551))
- `api.XRFrame.fillPoses` ([#17551](https://github.com/mdn/browser-compat-data/pull/17551))
- `api.XRFrame.getJointPose` ([#17551](https://github.com/mdn/browser-compat-data/pull/17551))
- `api.XRHand` ([#17551](https://github.com/mdn/browser-compat-data/pull/17551))
- `api.XRInputSource.hand` ([#17551](https://github.com/mdn/browser-compat-data/pull/17551))
- `api.XRJointPose` ([#17551](https://github.com/mdn/browser-compat-data/pull/17551))
- `api.XRJointPose.radius` ([#17551](https://github.com/mdn/browser-compat-data/pull/17551))
- `api.XRJointSpace` ([#17551](https://github.com/mdn/browser-compat-data/pull/17551))
- `api.XRJointSpace.jointName` ([#17551](https://github.com/mdn/browser-compat-data/pull/17551))
- `api.XRLayerEvent` ([#17571](https://github.com/mdn/browser-compat-data/pull/17571))
- `api.XRLayerEvent.layer` ([#17571](https://github.com/mdn/browser-compat-data/pull/17571))
- `api.XRLayerEvent.XRLayerEvent` ([#17571](https://github.com/mdn/browser-compat-data/pull/17571))
- `api.XRMediaBinding` ([#17570](https://github.com/mdn/browser-compat-data/pull/17570))
- `api.XRMediaBinding.createCylinderLayer` ([#17570](https://github.com/mdn/browser-compat-data/pull/17570))
- `api.XRMediaBinding.createEquirectLayer` ([#17570](https://github.com/mdn/browser-compat-data/pull/17570))
- `api.XRMediaBinding.createQuadLayer` ([#17570](https://github.com/mdn/browser-compat-data/pull/17570))
- `api.XRMediaBinding.XRMediaBinding` ([#17570](https://github.com/mdn/browser-compat-data/pull/17570))
- `api.XRPose.angularVelocity` ([#17528](https://github.com/mdn/browser-compat-data/pull/17528))
- `api.XRPose.linearVelocity` ([#17528](https://github.com/mdn/browser-compat-data/pull/17528))
- `api.XRProjectionLayer` ([#17556](https://github.com/mdn/browser-compat-data/pull/17556))
- `api.XRProjectionLayer.fixedFoveation` ([#17556](https://github.com/mdn/browser-compat-data/pull/17556))
- `api.XRProjectionLayer.ignoreDepthValues` ([#17556](https://github.com/mdn/browser-compat-data/pull/17556))
- `api.XRProjectionLayer.textureArrayLength` ([#17556](https://github.com/mdn/browser-compat-data/pull/17556))
- `api.XRProjectionLayer.textureHeight` ([#17556](https://github.com/mdn/browser-compat-data/pull/17556))
- `api.XRProjectionLayer.textureWidth` ([#17556](https://github.com/mdn/browser-compat-data/pull/17556))
- `api.XRQuadLayer` ([#17557](https://github.com/mdn/browser-compat-data/pull/17557))
- `api.XRQuadLayer.height` ([#17557](https://github.com/mdn/browser-compat-data/pull/17557))
- `api.XRQuadLayer.redraw_event` ([#17557](https://github.com/mdn/browser-compat-data/pull/17557))
- `api.XRQuadLayer.space` ([#17557](https://github.com/mdn/browser-compat-data/pull/17557))
- `api.XRQuadLayer.transform` ([#17557](https://github.com/mdn/browser-compat-data/pull/17557))
- `api.XRQuadLayer.width` ([#17557](https://github.com/mdn/browser-compat-data/pull/17557))
- `api.XRRenderState.layers` ([#17572](https://github.com/mdn/browser-compat-data/pull/17572))
- `api.XRSubImage` ([#17565](https://github.com/mdn/browser-compat-data/pull/17565))
- `api.XRSubImage.viewport` ([#17565](https://github.com/mdn/browser-compat-data/pull/17565))
- `api.XRWebGLBinding.createCubeLayer` ([#17567](https://github.com/mdn/browser-compat-data/pull/17567))
- `api.XRWebGLBinding.createCylinderLayer` ([#17567](https://github.com/mdn/browser-compat-data/pull/17567))
- `api.XRWebGLBinding.createEquirectLayer` ([#17567](https://github.com/mdn/browser-compat-data/pull/17567))
- `api.XRWebGLBinding.createProjectionLayer` ([#17567](https://github.com/mdn/browser-compat-data/pull/17567))
- `api.XRWebGLBinding.createQuadLayer` ([#17567](https://github.com/mdn/browser-compat-data/pull/17567))
- `api.XRWebGLBinding.getSubImage` ([#17567](https://github.com/mdn/browser-compat-data/pull/17567))
- `api.XRWebGLBinding.getViewSubImage` ([#17567](https://github.com/mdn/browser-compat-data/pull/17567))
- `api.XRWebGLBinding.nativeProjectionScaleFactor` ([#17567](https://github.com/mdn/browser-compat-data/pull/17567))
- `api.XRWebGLLayer.fixedFoveation` ([#17552](https://github.com/mdn/browser-compat-data/pull/17552))
- `api.XRWebGLSubImage` ([#17566](https://github.com/mdn/browser-compat-data/pull/17566))
- `api.XRWebGLSubImage.colorTexture` ([#17566](https://github.com/mdn/browser-compat-data/pull/17566))
- `api.XRWebGLSubImage.depthStencilTexture` ([#17566](https://github.com/mdn/browser-compat-data/pull/17566))
- `api.XRWebGLSubImage.imageIndex` ([#17566](https://github.com/mdn/browser-compat-data/pull/17566))
- `api.XRWebGLSubImage.textureHeight` ([#17566](https://github.com/mdn/browser-compat-data/pull/17566))
- `api.XRWebGLSubImage.textureWidth` ([#17566](https://github.com/mdn/browser-compat-data/pull/17566))
- `css.at-rules.font-palette-values` ([#17489](https://github.com/mdn/browser-compat-data/pull/17489))
- `css.at-rules.font-palette-values.base-palette` ([#17489](https://github.com/mdn/browser-compat-data/pull/17489))
- `css.at-rules.font-palette-values.font-family` ([#17489](https://github.com/mdn/browser-compat-data/pull/17489))
- `css.at-rules.font-palette-values.override-colors` ([#17489](https://github.com/mdn/browser-compat-data/pull/17489))
- `css.properties.hyphens.portuguese_brazilian` ([#17581](https://github.com/mdn/browser-compat-data/pull/17581))
- `css.types.easing-function.linear-function` ([#17527](https://github.com/mdn/browser-compat-data/pull/17527))
- `css.types.image.paint.additional_parameters` ([#17581](https://github.com/mdn/browser-compat-data/pull/17581))
- `javascript.builtins.Intl.DateTimeFormat.DateTimeFormat.IntlLegacyConstructedSymbol` ([#17410](https://github.com/mdn/browser-compat-data/pull/17410))
- `javascript.builtins.Intl.NumberFormat.NumberFormat.IntlLegacyConstructedSymbol` ([#17410](https://github.com/mdn/browser-compat-data/pull/17410))
- `mathml.elements.maction.actiontype.restyle` ([#17064](https://github.com/mdn/browser-compat-data/pull/17064))
- `mathml.elements.maction.actiontype.statusline` ([#17064](https://github.com/mdn/browser-compat-data/pull/17064))
- `mathml.elements.maction.actiontype.toggle` ([#17064](https://github.com/mdn/browser-compat-data/pull/17064))
- `mathml.elements.maction.selection` ([#17064](https://github.com/mdn/browser-compat-data/pull/17064))
- `mathml.elements.menclose.notation.madruwb` ([#17062](https://github.com/mdn/browser-compat-data/pull/17062))
- `mathml.elements.menclose.notation.phasorangle` ([#17062](https://github.com/mdn/browser-compat-data/pull/17062))
- `mathml.elements.menclose.notation.updiagonalarrow` ([#17062](https://github.com/mdn/browser-compat-data/pull/17062))
- `webextensions.manifest.background.service_worker` ([#17532](https://github.com/mdn/browser-compat-data/pull/17532))

### Statistics

- 17 contributors have changed 168 files with 5,022 additions and 1,109 deletions in 82 commits ([`v5.1.10...v5.2.0`](https://github.com/mdn/browser-compat-data/compare/v5.1.10...v5.2.0))
- 13,715 total features
- 940 total contributors
- 4,207 total stargazers

## [v5.1.10](https://github.com/mdn/browser-compat-data/releases/tag/v5.1.10)

August 23, 2022

### Removals

- `api.CanvasRenderingContext2D.drawWidgetAsOnScreen` ([#17465](https://github.com/mdn/browser-compat-data/pull/17465))
- `api.PresentationRequest.startWithDevice` ([#17468](https://github.com/mdn/browser-compat-data/pull/17468))

### Additions

- `api.AudioParamMap.@@iterator` ([#17482](https://github.com/mdn/browser-compat-data/pull/17482))
- `api.CanvasFilter` ([#17485](https://github.com/mdn/browser-compat-data/pull/17485))
- `api.CanvasFilter.CanvasFilter` ([#17485](https://github.com/mdn/browser-compat-data/pull/17485))
- `api.CanvasRenderingContext2D.fontKerning` ([#17486](https://github.com/mdn/browser-compat-data/pull/17486))
- `api.CanvasRenderingContext2D.fontStretch` ([#17486](https://github.com/mdn/browser-compat-data/pull/17486))
- `api.CanvasRenderingContext2D.fontVariantCaps` ([#17486](https://github.com/mdn/browser-compat-data/pull/17486))
- `api.CanvasRenderingContext2D.isContextLost` ([#17486](https://github.com/mdn/browser-compat-data/pull/17486))
- `api.CanvasRenderingContext2D.letterSpacing` ([#17486](https://github.com/mdn/browser-compat-data/pull/17486))
- `api.CanvasRenderingContext2D.reset` ([#17486](https://github.com/mdn/browser-compat-data/pull/17486))
- `api.CanvasRenderingContext2D.roundRect` ([#17486](https://github.com/mdn/browser-compat-data/pull/17486))
- `api.CanvasRenderingContext2D.textRendering` ([#17486](https://github.com/mdn/browser-compat-data/pull/17486))
- `api.CanvasRenderingContext2D.wordSpacing` ([#17486](https://github.com/mdn/browser-compat-data/pull/17486))
- `api.CSSImportRule.layerName` ([#17490](https://github.com/mdn/browser-compat-data/pull/17490))
- `api.CSSLayerBlockRule` ([#17491](https://github.com/mdn/browser-compat-data/pull/17491))
- `api.CSSLayerBlockRule.name` ([#17491](https://github.com/mdn/browser-compat-data/pull/17491))
- `api.CSSLayerStatementRule` ([#17492](https://github.com/mdn/browser-compat-data/pull/17492))
- `api.CSSLayerStatementRule.nameList` ([#17492](https://github.com/mdn/browser-compat-data/pull/17492))
- `api.CSSMathClamp` ([#17493](https://github.com/mdn/browser-compat-data/pull/17493))
- `api.CSSMathClamp.CSSMathClamp` ([#17493](https://github.com/mdn/browser-compat-data/pull/17493))
- `api.CSSMathClamp.lower` ([#17493](https://github.com/mdn/browser-compat-data/pull/17493))
- `api.CSSMathClamp.upper` ([#17493](https://github.com/mdn/browser-compat-data/pull/17493))
- `api.CSSMathClamp.value` ([#17493](https://github.com/mdn/browser-compat-data/pull/17493))
- `api.Element.beforexrselect_event` ([#17462](https://github.com/mdn/browser-compat-data/pull/17462))
- `api.ElementInternals.ariaInvalid` ([#17498](https://github.com/mdn/browser-compat-data/pull/17498))
- `api.ElementInternals.role` ([#17498](https://github.com/mdn/browser-compat-data/pull/17498))
- `api.EventCounts.@@iterator` ([#17499](https://github.com/mdn/browser-compat-data/pull/17499))
- `api.HTMLCanvasElement.getContext.2d_context.options_colorSpace_parameter` ([#17474](https://github.com/mdn/browser-compat-data/pull/17474))
- `api.HTMLCanvasElement.getContext.2d_context.options_willReadFrequently_parameter` ([#17473](https://github.com/mdn/browser-compat-data/pull/17473))
- `browsers.nodejs.releases.16.17.0` ([#17418](https://github.com/mdn/browser-compat-data/pull/17418))
- `browsers.oculus.releases.23.0` ([#17457](https://github.com/mdn/browser-compat-data/pull/17457))
- `browsers.opera.releases.92` ([#17475](https://github.com/mdn/browser-compat-data/pull/17475))
- `css.properties.animation-composition` ([#17518](https://github.com/mdn/browser-compat-data/pull/17518))
- `css.properties.break-after.paged_context.avoid-page` ([#17318](https://github.com/mdn/browser-compat-data/pull/17318))
- `css.properties.contain.inline-size` ([#17469](https://github.com/mdn/browser-compat-data/pull/17469))
- `css.properties.contain.style` ([#17469](https://github.com/mdn/browser-compat-data/pull/17469))

### Statistics

- 20 contributors have changed 277 files with 3,985 additions and 7,224 deletions in 62 commits ([`v5.1.9...v5.1.10`](https://github.com/mdn/browser-compat-data/compare/v5.1.9...v5.1.10))
- 13,617 total features
- 938 total contributors
- 4,194 total stargazers

## [v5.1.9](https://github.com/mdn/browser-compat-data/releases/tag/v5.1.9)

August 16, 2022

### Removals

- `api.Element.MSGestureChange_event` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.Element.MSGestureEnd_event` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.Element.MSGestureHold_event` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.Element.MSGestureStart_event` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.Element.MSGestureTap_event` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.Element.MSInertiaStart_event` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.Element.MSManipulationStateChanged_event` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.MSGestureEvent` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.MSGestureEvent.expansion` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.MSGestureEvent.gestureObject` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.MSGestureEvent.initGestureEvent` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.MSGestureEvent.MSGestureEvent` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.MSGestureEvent.rotation` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.MSGestureEvent.scale` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.MSGestureEvent.translationX` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.MSGestureEvent.translationY` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.MSGestureEvent.velocityAngular` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.MSGestureEvent.velocityExpansion` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.MSGestureEvent.velocityX` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `api.MSGestureEvent.velocityY` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `css.properties.-ms-grid-column` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `css.properties.-ms-grid-column-align` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `css.properties.-ms-grid-column-span` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `css.properties.-ms-grid-row` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `css.properties.-ms-grid-row-align` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `css.properties.-ms-grid-row-span` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))
- `css.properties.-ms-scrollbar-track-color` ([#17120](https://github.com/mdn/browser-compat-data/pull/17120))

### Additions

- `api.IDBFactory.open.options_parameter` ([#17358](https://github.com/mdn/browser-compat-data/pull/17358))
- `browsers.chrome_android.releases.108` ([#17373](https://github.com/mdn/browser-compat-data/pull/17373))
- `browsers.chrome_android.releases.109` ([#17373](https://github.com/mdn/browser-compat-data/pull/17373))
- `browsers.chrome_android.releases.110` ([#17373](https://github.com/mdn/browser-compat-data/pull/17373))
- `browsers.chrome.releases.108` ([#17373](https://github.com/mdn/browser-compat-data/pull/17373))
- `browsers.chrome.releases.109` ([#17373](https://github.com/mdn/browser-compat-data/pull/17373))
- `browsers.chrome.releases.110` ([#17373](https://github.com/mdn/browser-compat-data/pull/17373))
- `browsers.firefox_android.releases.106` ([#17372](https://github.com/mdn/browser-compat-data/pull/17372))
- `browsers.firefox_android.releases.107` ([#17372](https://github.com/mdn/browser-compat-data/pull/17372))
- `browsers.firefox_android.releases.108` ([#17372](https://github.com/mdn/browser-compat-data/pull/17372))
- `browsers.firefox.releases.106` ([#17372](https://github.com/mdn/browser-compat-data/pull/17372))
- `browsers.firefox.releases.107` ([#17372](https://github.com/mdn/browser-compat-data/pull/17372))
- `browsers.firefox.releases.108` ([#17372](https://github.com/mdn/browser-compat-data/pull/17372))
- `browsers.nodejs.releases.16.14.0` ([#17367](https://github.com/mdn/browser-compat-data/pull/17367))
- `browsers.samsunginternet_android.releases.18.0` ([#17374](https://github.com/mdn/browser-compat-data/pull/17374))
- `browsers.webview_android.releases.108` ([#17373](https://github.com/mdn/browser-compat-data/pull/17373))
- `browsers.webview_android.releases.109` ([#17373](https://github.com/mdn/browser-compat-data/pull/17373))
- `browsers.webview_android.releases.110` ([#17373](https://github.com/mdn/browser-compat-data/pull/17373))
- `css.types.image.paint.additional_paramters` ([#17314](https://github.com/mdn/browser-compat-data/pull/17314))
- `webextensions.api.scripting.RegisteredContentScript.persistAcrossSessions` ([#17266](https://github.com/mdn/browser-compat-data/pull/17266))

### Statistics

- 8 contributors have changed 104 files with 1,356 additions and 2,071 deletions in 56 commits ([`v5.1.8...v5.1.9`](https://github.com/mdn/browser-compat-data/compare/v5.1.8...v5.1.9))
- 13,587 total features
- 934 total contributors
- 4,184 total stargazers

## [v5.1.8](https://github.com/mdn/browser-compat-data/releases/tag/v5.1.8)

August 9, 2022

### Removals

- `api.MediaQueryList.EventListener_objects` ([#17248](https://github.com/mdn/browser-compat-data/pull/17248))
- `html.elements.audio.buffered` ([#17264](https://github.com/mdn/browser-compat-data/pull/17264))
- `html.elements.audio.mozcurrentsampleoffset` ([#17264](https://github.com/mdn/browser-compat-data/pull/17264))
- `html.elements.audio.played` ([#17264](https://github.com/mdn/browser-compat-data/pull/17264))
- `html.elements.audio.volume` ([#17264](https://github.com/mdn/browser-compat-data/pull/17264))
- `html.elements.video.played` ([#17264](https://github.com/mdn/browser-compat-data/pull/17264))
- `mathml.elements.maction.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.maction.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.maction.mathbackground` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.maction.mathcolor` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.math.dir` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.math.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.math.mathbackground` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.math.mathcolor` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.menclose.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.menclose.mathbackground` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.menclose.mathcolor` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.merror.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.merror.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.merror.mathbackground` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.merror.mathcolor` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mfenced.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mfenced.mathbackground` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mfenced.mathcolor` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mfrac.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mfrac.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mfrac.mathbackground` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mfrac.mathcolor` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mi.dir` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mi.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mi.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mi.mathsize` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mi.mathvariant` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mmultiscripts.dir` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mmultiscripts.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mmultiscripts.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mmultiscripts.mathcolor` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mmultiscripts.mathsize` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mn.dir` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mn.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mn.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mn.mathsize` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mn.mathvariant` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mo.dir` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mo.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mo.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mo.mathsize` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mo.mathvariant` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mover.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mover.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mover.mathbackground` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mover.mathcolor` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mpadded.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mpadded.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mpadded.mathbackground` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mpadded.mathcolor` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mphantom.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mphantom.mathbackground` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mroot.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mroot.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mroot.mathbackground` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mroot.mathcolor` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mrow.dir` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mrow.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mrow.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mrow.mathbackground` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mrow.mathcolor` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.ms.dir` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.ms.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.ms.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.ms.mathsize` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.ms.mathvariant` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mspace.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.msqrt.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.msqrt.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.msqrt.mathbackground` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.msqrt.mathcolor` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.msub.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.msub.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.msub.mathbackground` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.msub.mathcolor` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.msubsup.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.msubsup.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.msubsup.mathbackground` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.msubsup.mathcolor` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.msup.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.msup.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.msup.mathbackground` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.msup.mathcolor` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mtable.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mtable.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mtable.mathbackground` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mtable.mathcolor` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mtd.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mtd.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mtext.dir` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mtext.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mtext.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mtext.mathsize` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mtext.mathvariant` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mtr.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.mtr.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.munder.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.munder.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.munder.mathbackground` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.munder.mathcolor` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.munderover.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.munderover.href` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.munderover.mathbackground` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.munderover.mathcolor` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))
- `mathml.elements.semantics.displaystyle` ([#17057](https://github.com/mdn/browser-compat-data/pull/17057))

### Additions

- `api.HTMLElement.focus.options_focusVisible_parameter` ([#17278](https://github.com/mdn/browser-compat-data/pull/17278))
- `api.WebGL2RenderingContext.bufferSubData.SharedArrayBuffer_as_param` ([#17222](https://github.com/mdn/browser-compat-data/pull/17222))
- `api.WebGLRenderingContext.vertexAttrib1fv.SharedArrayBuffer_as_param` ([#17222](https://github.com/mdn/browser-compat-data/pull/17222))
- `api.WebGLRenderingContext.vertexAttrib2fv.SharedArrayBuffer_as_param` ([#17222](https://github.com/mdn/browser-compat-data/pull/17222))
- `api.WebGLRenderingContext.vertexAttrib3fv.SharedArrayBuffer_as_param` ([#17222](https://github.com/mdn/browser-compat-data/pull/17222))
- `api.WebGLRenderingContext.vertexAttrib4fv.SharedArrayBuffer_as_param` ([#17222](https://github.com/mdn/browser-compat-data/pull/17222))
- `browsers.chrome_android.releases.107` ([#17243](https://github.com/mdn/browser-compat-data/pull/17243))
- `browsers.chrome.releases.107` ([#17243](https://github.com/mdn/browser-compat-data/pull/17243))
- `browsers.edge.releases.106` ([#17267](https://github.com/mdn/browser-compat-data/pull/17267))
- `browsers.webview_android.releases.107` ([#17243](https://github.com/mdn/browser-compat-data/pull/17243))
- `css.types.acos` ([#17218](https://github.com/mdn/browser-compat-data/pull/17218))
- `css.types.asin` ([#17207](https://github.com/mdn/browser-compat-data/pull/17207))
- `css.types.atan` ([#17220](https://github.com/mdn/browser-compat-data/pull/17220))
- `css.types.atan2` ([#17221](https://github.com/mdn/browser-compat-data/pull/17221))
- `css.types.cos` ([#17205](https://github.com/mdn/browser-compat-data/pull/17205))
- `css.types.exp` ([#17256](https://github.com/mdn/browser-compat-data/pull/17256))
- `css.types.log` ([#17255](https://github.com/mdn/browser-compat-data/pull/17255))
- `css.types.tan` ([#17206](https://github.com/mdn/browser-compat-data/pull/17206))

### Statistics

- 11 contributors have changed 166 files with 2,856 additions and 4,999 deletions in 48 commits ([`v5.1.7...v5.1.8`](https://github.com/mdn/browser-compat-data/compare/v5.1.7...v5.1.8))
- 13,611 total features
- 892 total contributors
- 4,172 total stargazers

## [v5.1.7](https://github.com/mdn/browser-compat-data/releases/tag/v5.1.7)

August 2, 2022

### Removals

- `api.GestureEvent.GestureEvent` ([#17215](https://github.com/mdn/browser-compat-data/pull/17215))
- `api.MediaStream.stop` ([#17172](https://github.com/mdn/browser-compat-data/pull/17172))
- `api.ProgressEvent.initProgressEvent` ([#17171](https://github.com/mdn/browser-compat-data/pull/17171))
- `api.RTCDataChannel.stream` ([#17175](https://github.com/mdn/browser-compat-data/pull/17175))
- `api.WebGL2RenderingContext.bufferSubData.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.bindBuffer.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.bindFramebuffer.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.bindTexture.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.blendEquation.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.blendEquationSeparate.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.bufferData.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.bufferSubData.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.checkFramebufferStatus.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.compressedTexImage2D.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.compressedTexSubImage2D.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.compressedTexSubImage2D.WebGL2.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.framebufferRenderbuffer.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.framebufferTexture2D.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.generateMipmap.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.getBufferParameter.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.getFramebufferAttachmentParameter.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.getProgramParameter.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.getRenderbufferParameter.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.getTexParameter.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.getUniform.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.getVertexAttrib.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.isEnabled.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.pixelStorei.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.readPixels.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.readPixels.WebGL2.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.renderbufferStorage.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.texImage2D.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.texImage2D.WebGL2.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.texParameterf.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.texParameteri.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.texSubImage2D.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.texSubImage2D.WebGL2.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.uniformMatrix2fv.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.uniformMatrix2fv.WebGL2.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.uniformMatrix3fv.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.uniformMatrix3fv.WebGL2.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.uniformMatrix4fv.WebGL2` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.uniformMatrix4fv.WebGL2.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.vertexAttrib1fv.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.vertexAttrib2fv.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.vertexAttrib3fv.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGLRenderingContext.vertexAttrib4fv.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `html.manifest.dir` ([#16908](https://github.com/mdn/browser-compat-data/pull/16908))
- `html.manifest.iarc_rating_id` ([#16908](https://github.com/mdn/browser-compat-data/pull/16908))
- `html.manifest.lang` ([#16908](https://github.com/mdn/browser-compat-data/pull/16908))

### Additions

- `api.FetchEvent.respondWith.networkerror_on_same-origin_cors` ([#17091](https://github.com/mdn/browser-compat-data/pull/17091))
- `api.SVGStyleElement.disabled` ([#17164](https://github.com/mdn/browser-compat-data/pull/17164))
- `api.WebGL2RenderingContext.activeTexture` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.attachShader` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.bindAttribLocation` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.bindBuffer` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.bindFramebuffer` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.bindRenderbuffer` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.bindTexture` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.blendColor` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.blendEquation` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.blendEquationSeparate` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.blendFunc` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.blendFuncSeparate` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.blendFuncSeparate.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.bufferData` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.canvas` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.canvas.OffscreenCanvas` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.checkFramebufferStatus` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.clear` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.clearColor` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.clearDepth` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.clearStencil` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.colorMask` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.commit` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.compileShader` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.compressedTexImage2D` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.compressedTexImage2D.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.compressedTexSubImage2D` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.compressedTexSubImage2D.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.copyTexImage2D` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.copyTexSubImage2D` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.createBuffer` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.createFramebuffer` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.createProgram` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.createRenderbuffer` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.createShader` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.createTexture` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.cullFace` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.deleteBuffer` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.deleteFramebuffer` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.deleteProgram` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.deleteRenderbuffer` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.deleteShader` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.deleteTexture` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.depthFunc` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.depthMask` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.depthRange` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.detachShader` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.disable` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.disableVertexAttribArray` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.drawArrays` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.drawElements` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.drawingBufferHeight` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.drawingBufferWidth` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.enable` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.enableVertexAttribArray` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.finish` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.flush` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.framebufferRenderbuffer` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.framebufferTexture2D` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.frontFace` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.generateMipmap` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getActiveAttrib` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getActiveUniform` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getAttachedShaders` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getAttribLocation` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getBufferParameter` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getContextAttributes` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getError` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getExtension` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getFramebufferAttachmentParameter` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getParameter` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getProgramInfoLog` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getProgramParameter` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getRenderbufferParameter` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getShaderInfoLog` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getShaderParameter` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getShaderPrecisionFormat` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getShaderSource` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getSupportedExtensions` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getTexParameter` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getUniform` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getUniformLocation` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getVertexAttrib` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.getVertexAttribOffset` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.hint` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.isBuffer` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.isContextLost` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.isEnabled` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.isFramebuffer` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.isProgram` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.isRenderbuffer` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.isShader` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.isTexture` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.linkProgram` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.makeXRCompatible` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.pixelStorei` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.polygonOffset` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.readPixels` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.readPixels.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.renderbufferStorage` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.sampleCoverage` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.scissor` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.shaderSource` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.stencilFunc` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.stencilFuncSeparate` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.stencilMask` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.stencilMaskSeparate` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.stencilOp` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.stencilOpSeparate` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.texImage2D` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.texParameterf` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.texParameteri` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.texSubImage2D` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.uniform1fv` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.uniform1iv` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.uniform2fv` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.uniform2iv` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.uniform3fv` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.uniform3iv` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.uniform4fv` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.uniform4iv` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.useProgram` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.validateProgram` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.vertexAttrib1f` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.vertexAttrib1fv` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.vertexAttrib1fv.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.vertexAttrib2f` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.vertexAttrib2fv` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.vertexAttrib2fv.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.vertexAttrib3f` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.vertexAttrib3fv` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.vertexAttrib3fv.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.vertexAttrib4f` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.vertexAttrib4fv` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.vertexAttrib4fv.SharedArrayBuffer_as_param` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.vertexAttribPointer` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `api.WebGL2RenderingContext.viewport` ([#17201](https://github.com/mdn/browser-compat-data/pull/17201))
- `browsers.firefox_android.releases.105` ([#17135](https://github.com/mdn/browser-compat-data/pull/17135))
- `browsers.firefox.releases.105` ([#17135](https://github.com/mdn/browser-compat-data/pull/17135))
- `browsers.safari_ios.releases.15.6` ([#17153](https://github.com/mdn/browser-compat-data/pull/17153))
- `browsers.safari.releases.15.6` ([#17152](https://github.com/mdn/browser-compat-data/pull/17152))
- `css.properties.counter-reset.reset_does_not_affect_siblings` ([#15666](https://github.com/mdn/browser-compat-data/pull/15666))
- `css.selectors.buffering` ([#17136](https://github.com/mdn/browser-compat-data/pull/17136))
- `css.selectors.modal` ([#17144](https://github.com/mdn/browser-compat-data/pull/17144))
- `css.selectors.muted` ([#17136](https://github.com/mdn/browser-compat-data/pull/17136))
- `css.selectors.paused` ([#17136](https://github.com/mdn/browser-compat-data/pull/17136))
- `css.selectors.picture-in-picture` ([#17144](https://github.com/mdn/browser-compat-data/pull/17144))
- `css.selectors.playing` ([#17136](https://github.com/mdn/browser-compat-data/pull/17136))
- `css.selectors.seeking` ([#17136](https://github.com/mdn/browser-compat-data/pull/17136))
- `css.selectors.stalled` ([#17136](https://github.com/mdn/browser-compat-data/pull/17136))
- `css.selectors.volume-locked` ([#17136](https://github.com/mdn/browser-compat-data/pull/17136))
- `css.types.sin` ([#17170](https://github.com/mdn/browser-compat-data/pull/17170))

### Statistics

- 15 contributors have changed 218 files with 17,297 additions and 13,642 deletions in 82 commits ([`v5.1.6...v5.1.7`](https://github.com/mdn/browser-compat-data/compare/v5.1.6...v5.1.7))
- 13,708 total features
- 891 total contributors
- 4,160 total stargazers

## [v5.1.6](https://github.com/mdn/browser-compat-data/releases/tag/v5.1.6)

July 26, 2022

### Removals

- `api.CryptoKey.secure_context_required` ([#16983](https://github.com/mdn/browser-compat-data/pull/16983))
- `api.Document.copy_event` ([#16825](https://github.com/mdn/browser-compat-data/pull/16825))
- `api.Document.cut_event` ([#16825](https://github.com/mdn/browser-compat-data/pull/16825))
- `api.Document.paste_event` ([#16825](https://github.com/mdn/browser-compat-data/pull/16825))
- `api.FetchEvent.respondWith.networkerror_on_same-origin_cors` ([#17088](https://github.com/mdn/browser-compat-data/pull/17088))
- `api.GlobalEventHandlers` ([#17124](https://github.com/mdn/browser-compat-data/pull/17124))
- `api.GlobalEventHandlers.onerror` ([#16610](https://github.com/mdn/browser-compat-data/pull/16610))
- `api.GlobalEventHandlers.onload` ([#16659](https://github.com/mdn/browser-compat-data/pull/16659))
- `api.GlobalEventHandlers.onloadeddata` ([#16925](https://github.com/mdn/browser-compat-data/pull/16925))
- `api.GlobalEventHandlers.onloadedmetadata` ([#16925](https://github.com/mdn/browser-compat-data/pull/16925))
- `api.GlobalEventHandlers.onloadstart` ([#16925](https://github.com/mdn/browser-compat-data/pull/16925))
- `api.HTMLElement.copy_event` ([#16825](https://github.com/mdn/browser-compat-data/pull/16825))
- `api.HTMLElement.cut_event` ([#16825](https://github.com/mdn/browser-compat-data/pull/16825))
- `api.HTMLElement.paste_event` ([#16825](https://github.com/mdn/browser-compat-data/pull/16825))
- `api.Window.copy_event` ([#16825](https://github.com/mdn/browser-compat-data/pull/16825))
- `api.Window.cut_event` ([#16825](https://github.com/mdn/browser-compat-data/pull/16825))
- `api.Window.paste_event` ([#16825](https://github.com/mdn/browser-compat-data/pull/16825))
- `html.elements.input.attributes.accept` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.align` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.alt` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.capture` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.checked` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.dirname` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.disabled` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.form` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.formaction` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.formenctype` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.formmethod` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.formnovalidate` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.formtarget` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.list` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.max` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.maxlength` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.min` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.minlength` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.multiple` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.name` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.pattern` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.placeholder` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.readonly` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.src` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.step` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.attributes.usemap` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `mathml.elements.displaystyle` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))

### Additions

- `api.FetchEvent.respondWith.networkerror_on_same-origin_cors` ([#17006](https://github.com/mdn/browser-compat-data/pull/17006))
- `api.ReadableStreamBYOBReader.releaseLock.reject_pending_read_request` ([#16919](https://github.com/mdn/browser-compat-data/pull/16919))
- `api.ReadableStreamDefaultReader.releaseLock.reject_pending_read_request` ([#16919](https://github.com/mdn/browser-compat-data/pull/16919))
- `browsers.deno.releases.1.24` ([#17055](https://github.com/mdn/browser-compat-data/pull/17055))
- `css.properties.align-content` ([#17130](https://github.com/mdn/browser-compat-data/pull/17130))
- `css.properties.align-items` ([#17130](https://github.com/mdn/browser-compat-data/pull/17130))
- `css.properties.align-self` ([#17130](https://github.com/mdn/browser-compat-data/pull/17130))
- `css.properties.break-after` ([#17130](https://github.com/mdn/browser-compat-data/pull/17130))
- `css.properties.break-before` ([#17130](https://github.com/mdn/browser-compat-data/pull/17130))
- `css.properties.break-inside` ([#17130](https://github.com/mdn/browser-compat-data/pull/17130))
- `css.properties.column-gap` ([#17130](https://github.com/mdn/browser-compat-data/pull/17130))
- `css.properties.gap` ([#17130](https://github.com/mdn/browser-compat-data/pull/17130))
- `css.properties.justify-content` ([#17130](https://github.com/mdn/browser-compat-data/pull/17130))
- `css.properties.justify-items` ([#17130](https://github.com/mdn/browser-compat-data/pull/17130))
- `css.properties.justify-self` ([#17130](https://github.com/mdn/browser-compat-data/pull/17130))
- `css.properties.math-depth` ([#17071](https://github.com/mdn/browser-compat-data/pull/17071))
- `css.properties.row-gap` ([#17130](https://github.com/mdn/browser-compat-data/pull/17130))
- `html.elements.input.accept` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.alt` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.capture` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.checked` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.dirname` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.disabled` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.form` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.formaction` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.formenctype` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.formmethod` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.formnovalidate` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.formtarget` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.list` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.max` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.maxlength` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.min` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.minlength` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.multiple` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.name` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.pattern` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.placeholder` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.readonly` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.src` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `html.elements.input.step` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))
- `javascript.builtins.Intl.NumberFormat.format.number_parameter-string_decimal` ([#16923](https://github.com/mdn/browser-compat-data/pull/16923))
- `javascript.builtins.Intl.NumberFormat.NumberFormat.options_useGrouping_parameter.string_values` ([#16923](https://github.com/mdn/browser-compat-data/pull/16923))
- `javascript.builtins.Intl.NumberFormat.resolvedOptions.result_useGrouping_property` ([#16923](https://github.com/mdn/browser-compat-data/pull/16923))
- `mathml.elements.semantics.displaystyle` ([#17132](https://github.com/mdn/browser-compat-data/pull/17132))

### Statistics

- 14 contributors have changed 223 files with 2,848 additions and 3,189 deletions in 56 commits ([`v5.1.5...v5.1.6`](https://github.com/mdn/browser-compat-data/compare/v5.1.5...v5.1.6))
- 13,608 total features
- 889 total contributors
- 4,151 total stargazers

## [v5.1.5](https://github.com/mdn/browser-compat-data/releases/tag/v5.1.5)

July 19, 2022

### Removals

- `api.CustomElementRegistry.builtin` ([#17002](https://github.com/mdn/browser-compat-data/pull/17002))
- `api.Document.animationcancel_event` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.Document.animationend_event` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.Document.animationiteration_event` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.Document.animationstart_event` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.Document.drag_event` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.Document.dragend_event` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.Document.dragenter_event` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.Document.dragexit_event` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.Document.dragleave_event` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.Document.dragover_event` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.Document.dragstart_event` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.Document.drop_event` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.Document.gotpointercapture_event` ([#16650](https://github.com/mdn/browser-compat-data/pull/16650))
- `api.Document.transitioncancel_event` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.Document.transitionend_event` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.Document.transitionrun_event` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.Document.transitionstart_event` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.GlobalEventHandlers.onanimationcancel` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.GlobalEventHandlers.onanimationend` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.GlobalEventHandlers.onanimationiteration` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.GlobalEventHandlers.onanimationstart` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.GlobalEventHandlers.ondrag` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.GlobalEventHandlers.ondragend` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.GlobalEventHandlers.ondragenter` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.GlobalEventHandlers.ondragexit` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.GlobalEventHandlers.ondragleave` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.GlobalEventHandlers.ondragover` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.GlobalEventHandlers.ondragstart` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.GlobalEventHandlers.ondrop` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.GlobalEventHandlers.ongotpointercapture` ([#16650](https://github.com/mdn/browser-compat-data/pull/16650))
- `api.GlobalEventHandlers.oninvalid` ([#16657](https://github.com/mdn/browser-compat-data/pull/16657))
- `api.GlobalEventHandlers.onloadend` ([#16969](https://github.com/mdn/browser-compat-data/pull/16969))
- `api.GlobalEventHandlers.onlostpointercapture` ([#16650](https://github.com/mdn/browser-compat-data/pull/16650))
- `api.GlobalEventHandlers.onscroll` ([#16727](https://github.com/mdn/browser-compat-data/pull/16727))
- `api.GlobalEventHandlers.onsecuritypolicyviolation` ([#16728](https://github.com/mdn/browser-compat-data/pull/16728))
- `api.GlobalEventHandlers.onslotchange` ([#16733](https://github.com/mdn/browser-compat-data/pull/16733))
- `api.GlobalEventHandlers.ontransitioncancel` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.GlobalEventHandlers.ontransitionend` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.GlobalEventHandlers.ontransitionrun` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.GlobalEventHandlers.ontransitionstart` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.HTMLBaseFontElement` ([#16973](https://github.com/mdn/browser-compat-data/pull/16973))
- `api.HTMLBaseFontElement.color` ([#16973](https://github.com/mdn/browser-compat-data/pull/16973))
- `api.HTMLBaseFontElement.face` ([#16973](https://github.com/mdn/browser-compat-data/pull/16973))
- `api.HTMLBaseFontElement.size` ([#16973](https://github.com/mdn/browser-compat-data/pull/16973))
- `api.HTMLElement.animationcancel_event` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.HTMLElement.animationend_event` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.HTMLElement.animationiteration_event` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.HTMLElement.animationstart_event` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.HTMLElement.gotpointercapture_event` ([#16650](https://github.com/mdn/browser-compat-data/pull/16650))
- `api.HTMLElement.lostpointercapture_event` ([#16650](https://github.com/mdn/browser-compat-data/pull/16650))
- `api.HTMLElement.transitioncancel_event` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.HTMLElement.transitionend_event` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.HTMLElement.transitionrun_event` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.HTMLElement.transitionstart_event` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.PaymentAddress.languageCode` ([#16985](https://github.com/mdn/browser-compat-data/pull/16985))
- `api.ShadowRoot.slotchange_event` ([#16733](https://github.com/mdn/browser-compat-data/pull/16733))
- `api.Window.animationcancel_event` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.Window.animationend_event` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.Window.animationiteration_event` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.Window.animationstart_event` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.Window.transitioncancel_event` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.Window.transitionend_event` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.Window.transitionrun_event` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.Window.transitionstart_event` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `html.elements.basefont` ([#16973](https://github.com/mdn/browser-compat-data/pull/16973))
- `html.elements.embed.aspect_ratio_computed_from_attributes` ([#16913](https://github.com/mdn/browser-compat-data/pull/16913))
- `html.elements.iframe.aspect_ratio_computed_from_attributes` ([#16913](https://github.com/mdn/browser-compat-data/pull/16913))
- `html.elements.menu.type.type_menu` ([#16981](https://github.com/mdn/browser-compat-data/pull/16981))
- `html.elements.object.aspect_ratio_computed_from_attributes` ([#16913](https://github.com/mdn/browser-compat-data/pull/16913))
- `http.headers.csp.Content-Security-Policy` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.base-uri` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.block-all-mixed-content` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.child-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.connect-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.default-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.font-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.form-action` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.frame-ancestors` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.frame-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.img-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.manifest-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.media-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.meta-element-support` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.navigate-to` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.object-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.plugin-types` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.prefetch-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.referrer` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.report-sample` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.report-to` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.report-uri` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.require-sri-for` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.require-trusted-types-for` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.sandbox` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.script-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.script-src-attr` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.script-src-elem` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.script-src.external_scripts` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.strict-dynamic` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.style-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.style-src-attr` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.style-src-elem` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.trusted-types` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.unsafe-hashes` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.upgrade-insecure-requests` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.worker_support` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.csp.Content-Security-Policy.worker-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Public-Key-Pins` ([#16964](https://github.com/mdn/browser-compat-data/pull/16964))
- `http.headers.Public-Key-Pins-Report-Only` ([#16964](https://github.com/mdn/browser-compat-data/pull/16964))
- `http.headers.Public-Key-Pins.report-uri` ([#16964](https://github.com/mdn/browser-compat-data/pull/16964))

### Additions

- `api.CustomElementRegistry.builtin_element_support` ([#17002](https://github.com/mdn/browser-compat-data/pull/17002))
- `api.Document.securitypolicyviolation_event` ([#16728](https://github.com/mdn/browser-compat-data/pull/16728))
- `api.Element.animationcancel_event` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.Element.animationend_event` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.Element.animationiteration_event` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.Element.animationstart_event` ([#16531](https://github.com/mdn/browser-compat-data/pull/16531))
- `api.Element.gotpointercapture_event` ([#16650](https://github.com/mdn/browser-compat-data/pull/16650))
- `api.Element.lostpointercapture_event` ([#16650](https://github.com/mdn/browser-compat-data/pull/16650))
- `api.Element.transitioncancel_event` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.Element.transitionend_event` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.Element.transitionrun_event` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.Element.transitionstart_event` ([#16758](https://github.com/mdn/browser-compat-data/pull/16758))
- `api.HTMLElement.drag_event` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.HTMLElement.dragend_event` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.HTMLElement.dragenter_event` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.HTMLElement.dragexit_event` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.HTMLElement.dragleave_event` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.HTMLElement.dragover_event` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.HTMLElement.dragstart_event` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.HTMLElement.drop_event` ([#16556](https://github.com/mdn/browser-compat-data/pull/16556))
- `api.WorkerGlobalScope.securitypolicyviolation_event` ([#16728](https://github.com/mdn/browser-compat-data/pull/16728))
- `html.elements.menu.type_menu` ([#16981](https://github.com/mdn/browser-compat-data/pull/16981))
- `http.headers.Content-Security-Policy` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.base-uri` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.block-all-mixed-content` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.child-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.connect-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.default-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.font-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.form-action` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.frame-ancestors` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.frame-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.img-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.manifest-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.media-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.meta-element-support` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.navigate-to` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.object-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.plugin-types` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.prefetch-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.referrer` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.report-sample` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.report-to` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.report-uri` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.require-sri-for` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.require-trusted-types-for` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.sandbox` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.script-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.script-src-attr` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.script-src-elem` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.script-src.external_scripts` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.strict-dynamic` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.style-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.style-src-attr` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.style-src-elem` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.trusted-types` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.unsafe-hashes` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.upgrade-insecure-requests` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.worker_support` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `http.headers.Content-Security-Policy.worker-src` ([#16980](https://github.com/mdn/browser-compat-data/pull/16980))
- `javascript.builtins.AggregateError.serializable_object` ([#17008](https://github.com/mdn/browser-compat-data/pull/17008))
- `javascript.operators.spread` ([#16979](https://github.com/mdn/browser-compat-data/pull/16979))
- `mathml.global_attributes.dir` ([#16995](https://github.com/mdn/browser-compat-data/pull/16995))
- `mathml.global_attributes.displaystyle` ([#16995](https://github.com/mdn/browser-compat-data/pull/16995))
- `mathml.global_attributes.href` ([#16995](https://github.com/mdn/browser-compat-data/pull/16995))
- `mathml.global_attributes.mathbackground` ([#16995](https://github.com/mdn/browser-compat-data/pull/16995))
- `mathml.global_attributes.mathcolor` ([#16995](https://github.com/mdn/browser-compat-data/pull/16995))
- `mathml.global_attributes.mathsize` ([#16995](https://github.com/mdn/browser-compat-data/pull/16995))
- `mathml.global_attributes.mathvariant` ([#16995](https://github.com/mdn/browser-compat-data/pull/16995))
- `mathml.global_attributes.scriptlevel` ([#16995](https://github.com/mdn/browser-compat-data/pull/16995))

### Statistics

- 12 contributors have changed 354 files with 5,994 additions and 11,075 deletions in 74 commits ([`v5.1.4...v5.1.5`](https://github.com/mdn/browser-compat-data/compare/v5.1.4...v5.1.5))
- 13,608 total features
- 886 total contributors
- 4,144 total stargazers

## [v5.1.4](https://github.com/mdn/browser-compat-data/releases/tag/v5.1.4)

July 13, 2022

### Notable changes

#### GlobalEventHandlers

We are working to remove GlobalEventHandlers from browser-compat-data to deobfuscate event support. Most of the event handlers have been removed from GlobalEventHandlers, and the mixin will be removed entirely soon.

#### Oculus Browser

Support data for Oculus Browser has now been added by mirroring compatibility from Chrome Android.

### Removals

- `api.caches` ([#16900](https://github.com/mdn/browser-compat-data/pull/16900))
- `api.caches.worker_support` ([#16900](https://github.com/mdn/browser-compat-data/pull/16900))
- `api.CloseEvent.initCloseEvent` ([#16926](https://github.com/mdn/browser-compat-data/pull/16926))
- `api.Document.keydown_event` ([#16658](https://github.com/mdn/browser-compat-data/pull/16658))
- `api.Document.keypress_event` ([#16658](https://github.com/mdn/browser-compat-data/pull/16658))
- `api.Document.keyup_event` ([#16658](https://github.com/mdn/browser-compat-data/pull/16658))
- `api.Document.pointercancel_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Document.pointerdown_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Document.pointerenter_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Document.pointerleave_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Document.pointerlockchange_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Document.pointerlockerror_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Document.pointermove_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Document.pointerout_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Document.pointerover_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Document.pointerrawupdate_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Document.pointerup_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Document.selectstart_event` ([#16359](https://github.com/mdn/browser-compat-data/pull/16359))
- `api.Document.touchcancel_event` ([#16759](https://github.com/mdn/browser-compat-data/pull/16759))
- `api.Document.touchend_event` ([#16759](https://github.com/mdn/browser-compat-data/pull/16759))
- `api.Document.touchmove_event` ([#16759](https://github.com/mdn/browser-compat-data/pull/16759))
- `api.Document.touchstart_event` ([#16759](https://github.com/mdn/browser-compat-data/pull/16759))
- `api.Document.wheel_event` ([#16762](https://github.com/mdn/browser-compat-data/pull/16762))
- `api.Element.select_event` ([#16731](https://github.com/mdn/browser-compat-data/pull/16731))
- `api.fetch.referrerpolicy` ([#16841](https://github.com/mdn/browser-compat-data/pull/16841))
- `api.fetch.signal` ([#16841](https://github.com/mdn/browser-compat-data/pull/16841))
- `api.GlobalEventHandlers.onauxclick` ([#16529](https://github.com/mdn/browser-compat-data/pull/16529))
- `api.GlobalEventHandlers.oncancel` ([#16847](https://github.com/mdn/browser-compat-data/pull/16847))
- `api.GlobalEventHandlers.onchange` ([#16544](https://github.com/mdn/browser-compat-data/pull/16544))
- `api.GlobalEventHandlers.onclick` ([#16529](https://github.com/mdn/browser-compat-data/pull/16529))
- `api.GlobalEventHandlers.onclose` ([#16545](https://github.com/mdn/browser-compat-data/pull/16545))
- `api.GlobalEventHandlers.oncontextmenu` ([#16546](https://github.com/mdn/browser-compat-data/pull/16546))
- `api.GlobalEventHandlers.ondblclick` ([#16529](https://github.com/mdn/browser-compat-data/pull/16529))
- `api.GlobalEventHandlers.onemptied` ([#16559](https://github.com/mdn/browser-compat-data/pull/16559))
- `api.GlobalEventHandlers.onended` ([#16609](https://github.com/mdn/browser-compat-data/pull/16609))
- `api.GlobalEventHandlers.onformdata` ([#16611](https://github.com/mdn/browser-compat-data/pull/16611))
- `api.GlobalEventHandlers.oninput` ([#16651](https://github.com/mdn/browser-compat-data/pull/16651))
- `api.GlobalEventHandlers.onkeydown` ([#16658](https://github.com/mdn/browser-compat-data/pull/16658))
- `api.GlobalEventHandlers.onkeypress` ([#16658](https://github.com/mdn/browser-compat-data/pull/16658))
- `api.GlobalEventHandlers.onkeyup` ([#16658](https://github.com/mdn/browser-compat-data/pull/16658))
- `api.GlobalEventHandlers.onmousedown` ([#16671](https://github.com/mdn/browser-compat-data/pull/16671))
- `api.GlobalEventHandlers.onmouseenter` ([#16671](https://github.com/mdn/browser-compat-data/pull/16671))
- `api.GlobalEventHandlers.onmouseleave` ([#16671](https://github.com/mdn/browser-compat-data/pull/16671))
- `api.GlobalEventHandlers.onmousemove` ([#16671](https://github.com/mdn/browser-compat-data/pull/16671))
- `api.GlobalEventHandlers.onmouseout` ([#16671](https://github.com/mdn/browser-compat-data/pull/16671))
- `api.GlobalEventHandlers.onmouseover` ([#16671](https://github.com/mdn/browser-compat-data/pull/16671))
- `api.GlobalEventHandlers.onmouseup` ([#16671](https://github.com/mdn/browser-compat-data/pull/16671))
- `api.GlobalEventHandlers.onmousewheel` ([#16671](https://github.com/mdn/browser-compat-data/pull/16671))
- `api.GlobalEventHandlers.onpointercancel` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.GlobalEventHandlers.onpointerdown` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.GlobalEventHandlers.onpointerenter` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.GlobalEventHandlers.onpointerleave` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.GlobalEventHandlers.onpointermove` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.GlobalEventHandlers.onpointerout` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.GlobalEventHandlers.onpointerover` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.GlobalEventHandlers.onpointerrawupdate` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.GlobalEventHandlers.onpointerup` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.GlobalEventHandlers.onreset` ([#16722](https://github.com/mdn/browser-compat-data/pull/16722))
- `api.GlobalEventHandlers.onresize` ([#16723](https://github.com/mdn/browser-compat-data/pull/16723))
- `api.GlobalEventHandlers.onselect` ([#16731](https://github.com/mdn/browser-compat-data/pull/16731))
- `api.GlobalEventHandlers.onselectionchange` ([#16359](https://github.com/mdn/browser-compat-data/pull/16359))
- `api.GlobalEventHandlers.onselectstart` ([#16359](https://github.com/mdn/browser-compat-data/pull/16359))
- `api.GlobalEventHandlers.onshow` ([#16732](https://github.com/mdn/browser-compat-data/pull/16732))
- `api.GlobalEventHandlers.onsubmit` ([#16735](https://github.com/mdn/browser-compat-data/pull/16735))
- `api.GlobalEventHandlers.ontouchcancel` ([#16759](https://github.com/mdn/browser-compat-data/pull/16759))
- `api.GlobalEventHandlers.ontouchend` ([#16759](https://github.com/mdn/browser-compat-data/pull/16759))
- `api.GlobalEventHandlers.ontouchmove` ([#16759](https://github.com/mdn/browser-compat-data/pull/16759))
- `api.GlobalEventHandlers.ontouchstart` ([#16759](https://github.com/mdn/browser-compat-data/pull/16759))
- `api.GlobalEventHandlers.onwheel` ([#16762](https://github.com/mdn/browser-compat-data/pull/16762))
- `api.HTMLElement.pointercancel_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.HTMLElement.pointerdown_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.HTMLElement.pointerenter_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.HTMLElement.pointerleave_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.HTMLElement.pointermove_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.HTMLElement.pointerout_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.HTMLElement.pointerover_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.HTMLElement.pointerrawupdate_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.HTMLElement.pointerup_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `javascript.builtins.Array.toSource` ([#16856](https://github.com/mdn/browser-compat-data/pull/16856))
- `javascript.builtins.Boolean.toSource` ([#16856](https://github.com/mdn/browser-compat-data/pull/16856))
- `javascript.builtins.Function.toSource` ([#16856](https://github.com/mdn/browser-compat-data/pull/16856))
- `javascript.builtins.Number.toSource` ([#16856](https://github.com/mdn/browser-compat-data/pull/16856))
- `javascript.builtins.Object.toSource` ([#16856](https://github.com/mdn/browser-compat-data/pull/16856))
- `javascript.builtins.RegExp.toSource` ([#16856](https://github.com/mdn/browser-compat-data/pull/16856))
- `javascript.builtins.String.toSource` ([#16856](https://github.com/mdn/browser-compat-data/pull/16856))
- `javascript.builtins.uneval` ([#16856](https://github.com/mdn/browser-compat-data/pull/16856))

### Additions

- `api.CompressionStream.CompressionStream.deflate` ([#16791](https://github.com/mdn/browser-compat-data/pull/16791))
- `api.CompressionStream.CompressionStream.deflate-raw` ([#16791](https://github.com/mdn/browser-compat-data/pull/16791))
- `api.CompressionStream.CompressionStream.gzip` ([#16791](https://github.com/mdn/browser-compat-data/pull/16791))
- `api.DecompressionStream.DecompressionStream.deflate` ([#16791](https://github.com/mdn/browser-compat-data/pull/16791))
- `api.DecompressionStream.DecompressionStream.deflate-raw` ([#16791](https://github.com/mdn/browser-compat-data/pull/16791))
- `api.DecompressionStream.DecompressionStream.gzip` ([#16791](https://github.com/mdn/browser-compat-data/pull/16791))
- `api.Element.pointercancel_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Element.pointerdown_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Element.pointerenter_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Element.pointerleave_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Element.pointermove_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Element.pointerout_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Element.pointerover_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Element.pointerrawupdate_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.Element.pointerup_event` ([#16674](https://github.com/mdn/browser-compat-data/pull/16674))
- `api.fetch.init_referrerPolicy_parameter` ([#16841](https://github.com/mdn/browser-compat-data/pull/16841))
- `api.fetch.init_signal_parameter` ([#16841](https://github.com/mdn/browser-compat-data/pull/16841))
- `api.HTMLElement.change_event` ([#16544](https://github.com/mdn/browser-compat-data/pull/16544))
- `api.HTMLInputElement.cancel_event` ([#16847](https://github.com/mdn/browser-compat-data/pull/16847))
- `api.HTMLInputElement.select_event` ([#16731](https://github.com/mdn/browser-compat-data/pull/16731))
- `api.HTMLTextAreaElement.select_event` ([#16731](https://github.com/mdn/browser-compat-data/pull/16731))
- `api.HTMLVideoElement.resize_event` ([#16827](https://github.com/mdn/browser-compat-data/pull/16827))
- `api.Node.selectstart_event` ([#16359](https://github.com/mdn/browser-compat-data/pull/16359))
- `browsers.opera_android.releases.70` ([#16915](https://github.com/mdn/browser-compat-data/pull/16915))
- `browsers.opera.releases.91` ([#16912](https://github.com/mdn/browser-compat-data/pull/16912))
- `browsers.firefox_android.releases.104` ([#16822](https://github.com/mdn/browser-compat-data/pull/16822))
- `browsers.firefox.releases.104` ([#16822](https://github.com/mdn/browser-compat-data/pull/16822))
- `browsers.oculus.releases.16.3` ([#16858](https://github.com/mdn/browser-compat-data/pull/16858))
- `browsers.oculus.releases.16.4` ([#16858](https://github.com/mdn/browser-compat-data/pull/16858))
- `browsers.oculus.releases.16.5` ([#16858](https://github.com/mdn/browser-compat-data/pull/16858))
- `browsers.oculus.releases.16.6` ([#16858](https://github.com/mdn/browser-compat-data/pull/16858))
- `browsers.oculus.releases.17.0` ([#16858](https://github.com/mdn/browser-compat-data/pull/16858))
- `browsers.oculus.releases.18.0` ([#16858](https://github.com/mdn/browser-compat-data/pull/16858))
- `browsers.oculus.releases.19.0` ([#16858](https://github.com/mdn/browser-compat-data/pull/16858))
- `browsers.oculus.releases.20.0` ([#16858](https://github.com/mdn/browser-compat-data/pull/16858))
- `browsers.oculus.releases.21.0` ([#16858](https://github.com/mdn/browser-compat-data/pull/16858))
- `browsers.oculus.releases.22.0` ([#16858](https://github.com/mdn/browser-compat-data/pull/16858))
- `javascript.builtins.Intl.NumberFormat.NumberFormat.options_roundingIncrement_parameter` ([#16840](https://github.com/mdn/browser-compat-data/pull/16840))
- `javascript.builtins.Intl.NumberFormat.NumberFormat.options_roundingMode_parameter` ([#16840](https://github.com/mdn/browser-compat-data/pull/16840))
- `javascript.builtins.Intl.NumberFormat.NumberFormat.options_roundingPriority_parameter` ([#16840](https://github.com/mdn/browser-compat-data/pull/16840))
- `javascript.builtins.Intl.NumberFormat.NumberFormat.options_trailingZeroDisplay_parameter` ([#16840](https://github.com/mdn/browser-compat-data/pull/16840))
- `javascript.builtins.Intl.NumberFormat.NumberFormat.options_useGrouping_parameter` ([#16840](https://github.com/mdn/browser-compat-data/pull/16840))
- `webextensions.api.browserSettings.tlsVersionRestrictionConfig` ([#16836](https://github.com/mdn/browser-compat-data/pull/16836))

### Statistics

- 17 contributors have changed 2,280 files with 15,113 additions and 9,108 deletions in 110 commits ([`v5.1.3...v5.1.4`](https://github.com/mdn/browser-compat-data/compare/v5.1.3...v5.1.4))
- 13,649 total features
- 884 total contributors
- 4,131 total stargazers

## [v5.1.3](https://github.com/mdn/browser-compat-data/releases/tag/v5.1.3)

June 27, 2022

### Removals

- `api.GlobalEventHandlers.onblur` ([#16530](https://github.com/mdn/browser-compat-data/pull/16530))
- `api.GlobalEventHandlers.onfocus` ([#16530](https://github.com/mdn/browser-compat-data/pull/16530))
- `api.GlobalEventHandlers.onpause` ([#16673](https://github.com/mdn/browser-compat-data/pull/16673))
- `api.GlobalEventHandlers.onplay` ([#16673](https://github.com/mdn/browser-compat-data/pull/16673))
- `api.GlobalEventHandlers.onplaying` ([#16673](https://github.com/mdn/browser-compat-data/pull/16673))
- `api.GlobalEventHandlers.onprogress` ([#16718](https://github.com/mdn/browser-compat-data/pull/16718))
- `api.GlobalEventHandlers.onratechange` ([#16721](https://github.com/mdn/browser-compat-data/pull/16721))
- `api.GlobalEventHandlers.onseeked` ([#16730](https://github.com/mdn/browser-compat-data/pull/16730))
- `api.GlobalEventHandlers.onseeking` ([#16730](https://github.com/mdn/browser-compat-data/pull/16730))
- `api.GlobalEventHandlers.onstalled` ([#16734](https://github.com/mdn/browser-compat-data/pull/16734))
- `api.GlobalEventHandlers.onsuspend` ([#16736](https://github.com/mdn/browser-compat-data/pull/16736))
- `api.GlobalEventHandlers.ontimeupdate` ([#16737](https://github.com/mdn/browser-compat-data/pull/16737))
- `api.GlobalEventHandlers.onvolumechange` ([#16760](https://github.com/mdn/browser-compat-data/pull/16760))
- `api.GlobalEventHandlers.onwaiting` ([#16761](https://github.com/mdn/browser-compat-data/pull/16761))
- `javascript.builtins.null` ([#16764](https://github.com/mdn/browser-compat-data/pull/16764))
- `javascript.statements.import_meta` ([#16766](https://github.com/mdn/browser-compat-data/pull/16766))

### Additions

- `api.SharedWorkerGlobalScope.applicationCache.secure_context_required` ([#16753](https://github.com/mdn/browser-compat-data/pull/16753))
- `browsers.chrome_android.releases.106` ([#16765](https://github.com/mdn/browser-compat-data/pull/16765))
- `browsers.chrome.releases.106` ([#16765](https://github.com/mdn/browser-compat-data/pull/16765))
- `browsers.deno.releases.1.23` ([#16799](https://github.com/mdn/browser-compat-data/pull/16799))
- `browsers.edge.releases.105` ([#16775](https://github.com/mdn/browser-compat-data/pull/16775))
- `browsers.webview_android.releases.106` ([#16765](https://github.com/mdn/browser-compat-data/pull/16765))
- `javascript.operators.import_meta` ([#16766](https://github.com/mdn/browser-compat-data/pull/16766))
- `javascript.operators.null` ([#16764](https://github.com/mdn/browser-compat-data/pull/16764))

### Statistics

- 11 contributors have changed 27 files with 263 additions and 866 deletions in 27 commits ([`v5.1.2...v5.1.3`](https://github.com/mdn/browser-compat-data/compare/v5.1.2...v5.1.3))
- 13,704 total features
- 880 total contributors
- 4,113 total stargazers

## [v5.1.2](https://github.com/mdn/browser-compat-data/releases/tag/v5.1.2)

June 21, 2022

### Removals

- `api.GlobalEventHandlers.oncanplay` ([#16541](https://github.com/mdn/browser-compat-data/pull/16541))
- `api.GlobalEventHandlers.oncanplaythrough` ([#16541](https://github.com/mdn/browser-compat-data/pull/16541))
- `api.GlobalEventHandlers.ondurationchange` ([#16558](https://github.com/mdn/browser-compat-data/pull/16558))
- `api.RTCIceCandidatePairStats.circuitBreakerTriggerCount` ([#16748](https://github.com/mdn/browser-compat-data/pull/16748))
- `api.RTCIceCandidatePairStats.consentExpiredTimestamp` ([#16748](https://github.com/mdn/browser-compat-data/pull/16748))
- `api.RTCIceCandidatePairStats.firstRequestTimeStamp` ([#16748](https://github.com/mdn/browser-compat-data/pull/16748))
- `api.RTCIceCandidatePairStats.lastRequestTimestamp` ([#16748](https://github.com/mdn/browser-compat-data/pull/16748))
- `api.RTCIceCandidatePairStats.lastResponseTimestamp` ([#16748](https://github.com/mdn/browser-compat-data/pull/16748))
- `api.RTCIceCandidatePairStats.retransmissionsReceived` ([#16748](https://github.com/mdn/browser-compat-data/pull/16748))
- `api.RTCIceCandidatePairStats.retransmissionsSent` ([#16748](https://github.com/mdn/browser-compat-data/pull/16748))
- `api.RTCRtpStreamStats.sliCount` ([#16748](https://github.com/mdn/browser-compat-data/pull/16748))
- `javascript.statements.import.dynamic_import` ([#16720](https://github.com/mdn/browser-compat-data/pull/16720))
- `svg.attributes.presentation.color-rendering` ([#16743](https://github.com/mdn/browser-compat-data/pull/16743))

### Additions

- `css.properties.break-after.multicol_context.avoid` ([#16628](https://github.com/mdn/browser-compat-data/pull/16628))
- `css.properties.break-before.multicol_context.avoid` ([#16628](https://github.com/mdn/browser-compat-data/pull/16628))
- `javascript.operators.import` ([#16720](https://github.com/mdn/browser-compat-data/pull/16720))
- `webextensions.api.history.onTitleChanged.id` ([#16715](https://github.com/mdn/browser-compat-data/pull/16715))

### Statistics

- 9 contributors have changed 393 files with 1,644 additions and 4,634 deletions in 33 commits ([`v5.1.1...v5.1.2`](https://github.com/mdn/browser-compat-data/compare/v5.1.1...v5.1.2))
- 13,717 total features
- 879 total contributors
- 4,105 total stargazers

## [v5.1.1](https://github.com/mdn/browser-compat-data/releases/tag/v5.1.1)

June 17, 2022

### Notable changes

The TypeScript default export is cast to `any` and then to `CompatData` to mitigate an issue with the type definitions `Identifier` interface, where it attempts to assign the `__compat` property as an `Identifier` type, even though it should be a `CompatStatement` type.

### Statistics

- 4 contributors have changed 2,347 files with 75,765 additions and 237,875 deletions in 19 commits ([`v5.1.0...v5.1.1`](https://github.com/mdn/browser-compat-data/compare/v5.1.0...v5.1.1))
- 13,726 total features
- 877 total contributors
- 4,095 total stargazers

## [v5.1.0](https://github.com/mdn/browser-compat-data/releases/tag/v5.1.0)

June 14, 2022

### Notable changes

A new `source_file` property has been added to `__compat` statements. This property indicates which file in the [browser-compat-data](https://github.com/mdn/browser-compat-data) repository the feature comes from, which can be useful for linking potential contributors to the correct file to suggest changes.

### Removals

- `api.VRDisplay.hardwareUnitId` ([#16557](https://github.com/mdn/browser-compat-data/pull/16557))
- `api.VREyeParameters.recommendedFieldOfView` ([#16557](https://github.com/mdn/browser-compat-data/pull/16557))
- `api.VREyeParameters.renderRect` ([#16557](https://github.com/mdn/browser-compat-data/pull/16557))
- `api.VRFieldOfView.VRFieldOfView` ([#16557](https://github.com/mdn/browser-compat-data/pull/16557))
- `api.VRPose.hasOrientation` ([#16557](https://github.com/mdn/browser-compat-data/pull/16557))
- `api.VRPose.hasPosition` ([#16557](https://github.com/mdn/browser-compat-data/pull/16557))
- `javascript.builtins.Array.groupBy` ([#16647](https://github.com/mdn/browser-compat-data/pull/16647))
- `javascript.builtins.Array.groupByToMap` ([#16647](https://github.com/mdn/browser-compat-data/pull/16647))

### Additions

- `css.types.color.oklab` ([#16526](https://github.com/mdn/browser-compat-data/pull/16526))
- `css.types.color.oklch` ([#16526](https://github.com/mdn/browser-compat-data/pull/16526))
- `http.status.103` ([#16335](https://github.com/mdn/browser-compat-data/pull/16335))
- `javascript.builtins.Array.group` ([#16647](https://github.com/mdn/browser-compat-data/pull/16647))
- `javascript.builtins.Array.groupToMap` ([#16647](https://github.com/mdn/browser-compat-data/pull/16647))
- `webextensions.api.privacy.websites.cookieConfig.behavior` ([#16642](https://github.com/mdn/browser-compat-data/pull/16642))
- `webextensions.api.privacy.websites.cookieConfig.nonPersistentCookies` ([#16642](https://github.com/mdn/browser-compat-data/pull/16642))
- `webextensions.api.tabs.create.createProperties.muted` ([#16655](https://github.com/mdn/browser-compat-data/pull/16655))

### Statistics

- 14 contributors have changed 187 files with 4,079 additions and 1,944 deletions in 41 commits ([`v5.0.3...v5.1.0`](https://github.com/mdn/browser-compat-data/compare/v5.0.3...v5.1.0))
- 13,726 total features
- 877 total contributors
- 4,096 total stargazers

## [v5.0.3](https://github.com/mdn/browser-compat-data/releases/tag/v5.0.3)

June 9, 2022

### Notable changes

- This release fixes some bugs in the TypeScript definitions that prevented TypeScript users from properly obtaining compatibility data using `bcd[key]` syntax.
- The RTCConfiguration dictionary has been removed and merged into `RTCPeerConnection`.
- Browser release additions and removals are now included in release notes.

### Removals

- `api.RTCConfiguration` ([#12830](https://github.com/mdn/browser-compat-data/pull/12830))
- `api.RTCConfiguration.bundlePolicy` ([#12830](https://github.com/mdn/browser-compat-data/pull/12830))
- `api.RTCConfiguration.certificates` ([#12830](https://github.com/mdn/browser-compat-data/pull/12830))
- `api.RTCConfiguration.iceCandidatePoolSize` ([#12830](https://github.com/mdn/browser-compat-data/pull/12830))
- `api.RTCConfiguration.iceServers` ([#12830](https://github.com/mdn/browser-compat-data/pull/12830))
- `api.RTCConfiguration.iceTransportPolicy` ([#12830](https://github.com/mdn/browser-compat-data/pull/12830))
- `api.RTCConfiguration.peerIdentity` ([#12830](https://github.com/mdn/browser-compat-data/pull/12830))
- `api.RTCConfiguration.rtcpMuxPolicy` ([#12830](https://github.com/mdn/browser-compat-data/pull/12830))
- `browsers.oculus.releases.17.0` ([#16357](https://github.com/mdn/browser-compat-data/pull/16357))

### Additions

- `api.RTCPeerConnection.RTCPeerConnection.configuration_bundlePolicy_parameter` ([#12830](https://github.com/mdn/browser-compat-data/pull/12830))
- `api.RTCPeerConnection.RTCPeerConnection.configuration_certificates_parameter` ([#12830](https://github.com/mdn/browser-compat-data/pull/12830))
- `api.RTCPeerConnection.RTCPeerConnection.configuration_iceCandidatePoolSize_parameter` ([#12830](https://github.com/mdn/browser-compat-data/pull/12830))
- `api.RTCPeerConnection.RTCPeerConnection.configuration_iceServers_parameter` ([#12830](https://github.com/mdn/browser-compat-data/pull/12830))
- `api.RTCPeerConnection.RTCPeerConnection.configuration_iceTransportPolicy_parameter` ([#12830](https://github.com/mdn/browser-compat-data/pull/12830))
- `api.RTCPeerConnection.RTCPeerConnection.configuration_peerIdentity_parameter` ([#12830](https://github.com/mdn/browser-compat-data/pull/12830))
- `api.RTCPeerConnection.RTCPeerConnection.configuration_rtcpMuxPolicy_parameter` ([#12830](https://github.com/mdn/browser-compat-data/pull/12830))
- `browsers.deno.releases.1.22` ([#16549](https://github.com/mdn/browser-compat-data/pull/16549))
- `browsers.oculus.releases.16.2` ([#16357](https://github.com/mdn/browser-compat-data/pull/16357))
- `browsers.opera.releases.89` ([#16550](https://github.com/mdn/browser-compat-data/pull/16550))
- `browsers.opera_android.releases.69` ([#16554](https://github.com/mdn/browser-compat-data/pull/16554))
- `browsers.safari.releases.16` ([#16586](https://github.com/mdn/browser-compat-data/pull/16586))
- `browsers.safari_ios.releases.16` ([#16586](https://github.com/mdn/browser-compat-data/pull/16586))

### Statistics

- 6 contributors have changed 72 files with 929 additions and 716 deletions in 28 commits ([`v5.0.2...v5.0.3`](https://github.com/mdn/browser-compat-data/compare/v5.0.2...v5.0.3))
- 13,726 total features
- 873 total contributors
- 4,076 total stargazers

## [v5.0.2](https://github.com/mdn/browser-compat-data/releases/tag/v5.0.2)

June 7, 2022

### Notable changes

#### TypeScript types

This release includes a fundamental change to the TypeScript definitions. To ensure that TypeScript users will always be able to utilize new schema additions, the TypeScript types are now automatically generated from the schema file used for internal validation. The following changes have been made to the TypeScript types:

- Renamed:
  - BrowserNames -> BrowserName
  - BrowserEngines -> BrowserEngine
  - BrowserTypes -> BrowserType
- Added:
  - BrowserStatus
  - CompatStatement.spec_url
  - FlagStatement

As a side effect of the auto-generation of TypeScript types, changes to the TypeScript will involve changes to the schema, which is covered by the [project's semantic versioning policy](https://github.com/mdn/browser-compat-data#semantic-versioning-policy). Going forward, TypeScript definitions will also be explicitly covered by the semantic versioning policy. New types will only be introduced in minor releases, and breaking changes to existing types will only be introduced in major releases. Expect descriptions and patches to fix existing types to be included in patch releases.

### Removals

- `api.GlobalEventHandlers.onabort` ([#16514](https://github.com/mdn/browser-compat-data/pull/16514))
- `css.properties.text-align.justify-all` ([#6952](https://github.com/mdn/browser-compat-data/pull/6952))
- `css.properties.text-align.string` ([#6952](https://github.com/mdn/browser-compat-data/pull/6952))
- `css.properties.text-overflow.fade_function` ([#6952](https://github.com/mdn/browser-compat-data/pull/6952))
- `css.properties.text-overflow.fade_value` ([#6952](https://github.com/mdn/browser-compat-data/pull/6952))

### Additions

- `api.ReadableStream.transferable` ([#16525](https://github.com/mdn/browser-compat-data/pull/16525))
- `api.TransformStream.transferable` ([#16525](https://github.com/mdn/browser-compat-data/pull/16525))
- `api.WritableStream.transferable` ([#16525](https://github.com/mdn/browser-compat-data/pull/16525))
- `css.at-rules.media.update` ([#16472](https://github.com/mdn/browser-compat-data/pull/16472))
- `html.elements.input.attributes.accept` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.align` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.alt` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.capture` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.checked` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.dirname` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.disabled` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.form` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.formaction` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.formenctype` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.formmethod` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.formnovalidate` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.formtarget` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.list` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.max` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.maxlength` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.min` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.minlength` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.multiple` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.name` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.pattern` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.placeholder` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.readonly` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.src` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.step` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `html.elements.input.attributes.usemap` ([#16493](https://github.com/mdn/browser-compat-data/pull/16493))
- `webextensions.api.storage.session` ([#16450](https://github.com/mdn/browser-compat-data/pull/16450))
- `webextensions.api.storage.StorageArea.onChanged` ([#16450](https://github.com/mdn/browser-compat-data/pull/16450))

### Statistics

- 14 contributors have changed 456 files with 4,606 additions and 3,037 deletions in 54 commits ([`v5.0.1...v5.0.2`](https://github.com/mdn/browser-compat-data/compare/v5.0.1...v5.0.2))
- 13,727 total features
- 873 total contributors
- 4,071 total stargazers

## [v5.0.1](https://github.com/mdn/browser-compat-data/releases/tag/v5.0.1)

May 31, 2022

### Notable changes

This release a quick fix to correct the TypeScript declarations and imports.

### Statistics

- 4 contributors have changed 64 files with 412 additions and 11 deletions in 4 commits ([`v5.0.0...v5.0.1`](https://github.com/mdn/browser-compat-data/compare/v5.0.0...v5.0.1))
- 13,700 total features
- 872 total contributors
- 4,055 total stargazers

## [v5.0.0](https://github.com/mdn/browser-compat-data/releases/tag/v5.0.0)

May 31, 2022

### Notable changes

This release of browser-compat-data contains many new changes, including the following:

#### ESM Imports

This package may now be directly imported through ESM! On NodeJS v16.15+, Deno and in browsers, the data may now be imported via the following code:

```js
import bcd from '@mdn/browser-compat-data' assert { type: 'json' };
```

For older NodeJS versions, a separate import has been included called `forLegacyNode` (note this may be removed in a future update). Imports via CommonJS (`require()`) are still available, and there are no plans to deprecate it for the forseeable future.

```js
import bcd from '@mdn/browser-compat-data/forLegacyNode';
// ...or...
const bcd = require('@mdn/browser-compat-data');
```

For more details, please visit the ["Installation and Import" readme section](https://github.com/mdn/browser-compat-data#installation-and-import).

This change was made in [#16232](https://github.com/mdn/browser-compat-data/pull/16232).

#### TypeScript

We are in the process of migrating our internal scripts to TypeScript, and in doing so, have focused on improving the experience for TypeScript consumers of the package. Now, TypeScript types may be imported directly from the main import.

```ts
import bcd, {
  Identifier,
  BrowserNames,
  Browsers,
} from '@mdn/browser-compat-data';
```

This change was made in [#16406](https://github.com/mdn/browser-compat-data/pull/16406).

#### Removal of `matches`

In some features, we included a `matches` object which contained matching keywords or regex. However, since its addition, the data has been poorly maintained and was only added to five features. We have decided to remove this data due to its poor maintenance.

This change was proposed in [#8945](https://github.com/mdn/browser-compat-data/issues/8945) and made in [#15781](https://github.com/mdn/browser-compat-data/pull/15781).

#### Addition of `__meta`

A top-level `__meta` object has been added to the data, which contains metadata regarding the installed package. This object contains a `version` property, which is set to a string indicating the current version of the package. This allows Deno, browser and software in other languages to obtain the version number of the current BCD data.

This change was made in [#14129](https://github.com/mdn/browser-compat-data/pull/14129).

#### Build-time mirroring and upstream browsers

We have implemented the ability to mirror data from upstream browsers during package builds, which allows contributors to maintain compatibility data easier. While this is something to make contributions and maintenance easier, this will offer better updates to derivative browsers such as Microsoft Edge and Samsung Internet whose release cycles vary from their upstream browsers.

As an added benefit, the browser data now includes an `upstream` property that indicates the upstream browser (ex. Safari iOS' upstream is `safari`, and Microsoft Edge's upstream is `chrome`).

This change was made in [#16393](https://github.com/mdn/browser-compat-data/pull/16393) and [#16401](https://github.com/mdn/browser-compat-data/pull/16401).

#### `impl_url`

Support statements may now include an `impl_url` property, which includes a link to a bug tracking the implementation of the feature, or a link to a commit for when the feature was implemented in a browser. This property is intended to replace certain notes, i.e. "See bug XXX."

This change was made in [#16415](https://github.com/mdn/browser-compat-data/pull/16415).

### Removals

- `api.Window.mozPaintCount` ([#16443](https://github.com/mdn/browser-compat-data/pull/16443))

### Additions

- `api.scheduler` ([#16409](https://github.com/mdn/browser-compat-data/pull/16409))
- `css.types.length.viewport_percentage_units_dynamic` ([#16449](https://github.com/mdn/browser-compat-data/pull/16449))
- `css.types.length.viewport_percentage_units_large` ([#16449](https://github.com/mdn/browser-compat-data/pull/16449))
- `css.types.length.viewport_percentage_units_small` ([#16449](https://github.com/mdn/browser-compat-data/pull/16449))
- `webextensions.manifest.theme.properties.color_scheme` ([#16390](https://github.com/mdn/browser-compat-data/pull/16390))
- `webextensions.manifest.theme.properties.content_color_scheme` ([#16390](https://github.com/mdn/browser-compat-data/pull/16390))

### Statistics

- 18 contributors have changed 240 files with 8,047 additions and 4,537 deletions in 116 commits ([`v4.2.1...v5.0.0`](https://github.com/mdn/browser-compat-data/compare/v4.2.1...v5.0.0))
- 13,700 total features
- 872 total contributors
- 4,056 total stargazers

## Older Versions

- [v4.x](./release_notes/v4.md)
- [v3.x](./release_notes/v3.md)
- [v2.x](./release_notes/v2.md)
- [v1.x](./release_notes/v1.md)
- [v0.x](./release_notes/v0.md)
