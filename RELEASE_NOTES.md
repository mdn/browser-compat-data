# @mdn/browser-compat-data release notes

## [v8.1.1](https://github.com/mdn/browser-compat-data/releases/tag/v8.1.1)

September 4, 2026

### Additions

- `api.Selection.addRange.multiple_ranges` ([#30230](https://github.com/mdn/browser-compat-data/pull/30230))
- `javascript.statements.import.defer` ([#30425](https://github.com/mdn/browser-compat-data/pull/30425))

### Statistics

- 6 contributors have changed 7 files with 373 additions and 37 deletions in 7 commits ([`v8.1.0...v8.1.1`](https://github.com/mdn/browser-compat-data/compare/v8.1.0...v8.1.1))
- 20,512 total features
- 1,270 total contributors
- 5,737 total stargazers

## [v8.1.0](https://github.com/mdn/browser-compat-data/releases/tag/v8.1.0)

September 3, 2026

### Notable changes

This release includes _one notable change_.

#### 1. Add `index` to published browser release objects ([#30008](https://github.com/mdn/browser-compat-data/pull/30008))

Previously, reconstructing the release order of a browser meant relying on JavaScript object key enumeration order or parsing and comparing version strings yourself.

Now, every release object in the published `data.json` carries a 0-based `index` property, ordered ascending by version, which you can sort on directly:

```js
const releases = Object.entries(bcd.browsers.chrome.releases);
releases.sort(([, a], [, b]) => a.index - b.index);
// [["1", {…}], ["2", {…}], …, ["151", {…}]]
```

For details, see the [Build-time transformations section](https://github.com/mdn/browser-compat-data/blob/main/schemas/public.schema.md#build-time-transformations) of the published data JSON schema documentation.

### Statistics

- 3 contributors have changed 15 files with 127 additions and 54 deletions in 2 commits ([`v8.0.14...v8.1.0`](https://github.com/mdn/browser-compat-data/compare/v8.0.14...v8.1.0))
- 20,510 total features
- 1,270 total contributors
- 5,736 total stargazers

## [v8.0.14](https://github.com/mdn/browser-compat-data/releases/tag/v8.0.14)

September 3, 2026

### Removals

- `api.HTMLGeolocationElement.HTMLGeolocationElement` ([#30349](https://github.com/mdn/browser-compat-data/pull/30349))
- `api.HTMLOutputElement.HTMLOutputElement` ([#30349](https://github.com/mdn/browser-compat-data/pull/30349))

### Additions

- `api.BaseAudioContext.renderQuantumSize` ([#30300](https://github.com/mdn/browser-compat-data/pull/30300))
- `api.CharacterData.afterHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.CharacterData.afterHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.CharacterData.beforeHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.CharacterData.beforeHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.CharacterData.replaceWithHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.CharacterData.replaceWithHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.CharacterData.streamAfterHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.CharacterData.streamAfterHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.CharacterData.streamBeforeHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.CharacterData.streamBeforeHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.CharacterData.streamReplaceWithHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.CharacterData.streamReplaceWithHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.DocumentType.afterHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.DocumentType.afterHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.DocumentType.beforeHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.DocumentType.beforeHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.DocumentType.replaceWithHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.DocumentType.replaceWithHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.DocumentType.streamAfterHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.DocumentType.streamAfterHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.DocumentType.streamBeforeHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.DocumentType.streamBeforeHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.DocumentType.streamReplaceWithHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.DocumentType.streamReplaceWithHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.afterHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.afterHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.appendHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.appendHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.beforeHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.beforeHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.prependHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.prependHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.replaceHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.replaceHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.replaceWithHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.replaceWithHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.setHTMLUnsafe.options_runscripts_parameter` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.streamAfterHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.streamAfterHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.streamAppendHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.streamAppendHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.streamBeforeHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.streamBeforeHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.streamHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.streamHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.streamPrependHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.streamPrependHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.streamReplaceHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.streamReplaceHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.streamReplaceWithHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.Element.streamReplaceWithHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.HTMLCameraElement` ([#30316](https://github.com/mdn/browser-compat-data/pull/30316))
- `api.HTMLCameraElement.cancel_event` ([#30316](https://github.com/mdn/browser-compat-data/pull/30316))
- `api.HTMLCameraElement.error` ([#30316](https://github.com/mdn/browser-compat-data/pull/30316))
- `api.HTMLCameraElement.error_event` ([#30316](https://github.com/mdn/browser-compat-data/pull/30316))
- `api.HTMLCameraElement.setConstraints` ([#30316](https://github.com/mdn/browser-compat-data/pull/30316))
- `api.HTMLCameraElement.track` ([#30316](https://github.com/mdn/browser-compat-data/pull/30316))
- `api.HTMLCameraElement.track_event` ([#30316](https://github.com/mdn/browser-compat-data/pull/30316))
- `api.HTMLInstallElement` ([#30366](https://github.com/mdn/browser-compat-data/pull/30366))
- `api.HTMLInstallElement.initialPermissionStatus` ([#30366](https://github.com/mdn/browser-compat-data/pull/30366))
- `api.HTMLInstallElement.installresult_event` ([#30366](https://github.com/mdn/browser-compat-data/pull/30366))
- `api.HTMLInstallElement.invalidReason` ([#30366](https://github.com/mdn/browser-compat-data/pull/30366))
- `api.HTMLInstallElement.isValid` ([#30366](https://github.com/mdn/browser-compat-data/pull/30366))
- `api.HTMLInstallElement.manifest` ([#30366](https://github.com/mdn/browser-compat-data/pull/30366))
- `api.HTMLInstallElement.manifestId` ([#30366](https://github.com/mdn/browser-compat-data/pull/30366))
- `api.HTMLInstallElement.permissionStatus` ([#30366](https://github.com/mdn/browser-compat-data/pull/30366))
- `api.HTMLInstallElement.validationstatuschange_event` ([#30366](https://github.com/mdn/browser-compat-data/pull/30366))
- `api.HTMLMicrophoneElement` ([#30316](https://github.com/mdn/browser-compat-data/pull/30316))
- `api.HTMLMicrophoneElement.cancel_event` ([#30316](https://github.com/mdn/browser-compat-data/pull/30316))
- `api.HTMLMicrophoneElement.error` ([#30316](https://github.com/mdn/browser-compat-data/pull/30316))
- `api.HTMLMicrophoneElement.error_event` ([#30316](https://github.com/mdn/browser-compat-data/pull/30316))
- `api.HTMLMicrophoneElement.setConstraints` ([#30316](https://github.com/mdn/browser-compat-data/pull/30316))
- `api.HTMLMicrophoneElement.track` ([#30316](https://github.com/mdn/browser-compat-data/pull/30316))
- `api.HTMLMicrophoneElement.track_event` ([#30316](https://github.com/mdn/browser-compat-data/pull/30316))
- `api.HTMLUserMediaElement` ([#30326](https://github.com/mdn/browser-compat-data/pull/30326))
- `api.HTMLUserMediaElement.cancel_event` ([#30326](https://github.com/mdn/browser-compat-data/pull/30326))
- `api.HTMLUserMediaElement.error` ([#30326](https://github.com/mdn/browser-compat-data/pull/30326))
- `api.HTMLUserMediaElement.error_event` ([#30326](https://github.com/mdn/browser-compat-data/pull/30326))
- `api.HTMLUserMediaElement.setConstraints` ([#30326](https://github.com/mdn/browser-compat-data/pull/30326))
- `api.HTMLUserMediaElement.stream` ([#30326](https://github.com/mdn/browser-compat-data/pull/30326))
- `api.HTMLUserMediaElement.stream_event` ([#30326](https://github.com/mdn/browser-compat-data/pull/30326))
- `api.InstallResultEvent` ([#30366](https://github.com/mdn/browser-compat-data/pull/30366))
- `api.InstallResultEvent.InstallResultEvent` ([#30366](https://github.com/mdn/browser-compat-data/pull/30366))
- `api.InstallResultEvent.result` ([#30366](https://github.com/mdn/browser-compat-data/pull/30366))
- `api.InteractionContentfulPaint.toJSON` ([#30334](https://github.com/mdn/browser-compat-data/pull/30334))
- `api.MediaStreamTrack.stats` ([#30325](https://github.com/mdn/browser-compat-data/pull/30325))
- `api.MediaStreamTrackAudioStats` ([#30325](https://github.com/mdn/browser-compat-data/pull/30325))
- `api.MediaStreamTrackAudioStats.averageLatency` ([#30325](https://github.com/mdn/browser-compat-data/pull/30325))
- `api.MediaStreamTrackAudioStats.latency` ([#30325](https://github.com/mdn/browser-compat-data/pull/30325))
- `api.MediaStreamTrackAudioStats.maximumLatency` ([#30325](https://github.com/mdn/browser-compat-data/pull/30325))
- `api.MediaStreamTrackAudioStats.minimumLatency` ([#30325](https://github.com/mdn/browser-compat-data/pull/30325))
- `api.MediaStreamTrackAudioStats.resetLatency` ([#30325](https://github.com/mdn/browser-compat-data/pull/30325))
- `api.MediaStreamTrackAudioStats.toJSON` ([#30325](https://github.com/mdn/browser-compat-data/pull/30325))
- `api.MediaStreamTrackVideoStats` ([#30325](https://github.com/mdn/browser-compat-data/pull/30325))
- `api.MediaStreamTrackVideoStats.deliveredFrames` ([#30325](https://github.com/mdn/browser-compat-data/pull/30325))
- `api.MediaStreamTrackVideoStats.discardedFrames` ([#30325](https://github.com/mdn/browser-compat-data/pull/30325))
- `api.MediaStreamTrackVideoStats.toJSON` ([#30325](https://github.com/mdn/browser-compat-data/pull/30325))
- `api.MediaStreamTrackVideoStats.totalFrames` ([#30325](https://github.com/mdn/browser-compat-data/pull/30325))
- `api.Navigator.install` ([#30366](https://github.com/mdn/browser-compat-data/pull/30366))
- `api.PerformanceSoftNavigation.toJSON` ([#30334](https://github.com/mdn/browser-compat-data/pull/30334))
- `api.Permissions.permission_periodic-background-sync` ([#30368](https://github.com/mdn/browser-compat-data/pull/30368))
- `api.Permissions.permission_web-app-installation` ([#30399](https://github.com/mdn/browser-compat-data/pull/30399))
- `api.ShadowRoot.afterHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.afterHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.appendHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.appendHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.beforeHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.beforeHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.prependHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.prependHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.replaceWithHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.replaceWithHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.setHTMLUnsafe.options_runscripts_parameter` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.streamAfterHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.streamAfterHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.streamAppendHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.streamAppendHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.streamBeforeHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.streamBeforeHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.streamHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.streamHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.streamPrependHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.streamPrependHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.streamReplaceWithHTML` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.ShadowRoot.streamReplaceWithHTMLUnsafe` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.TrustedParserOptions` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.TrustedParserOptions.runScripts` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.TrustedParserOptions.sanitizer` ([#30328](https://github.com/mdn/browser-compat-data/pull/30328))
- `api.WebTransport.responseHeaders` ([#30347](https://github.com/mdn/browser-compat-data/pull/30347))
- `api.WebTransport.WebTransport.options_protocols_parameter` ([#30351](https://github.com/mdn/browser-compat-data/pull/30351))
- `browsers.edge.releases.155` ([#30352](https://github.com/mdn/browser-compat-data/pull/30352))
- `browsers.firefox_android.releases.158` ([#30378](https://github.com/mdn/browser-compat-data/pull/30378))
- `browsers.firefox.releases.158` ([#30378](https://github.com/mdn/browser-compat-data/pull/30378))
- `css.properties.scroll-axis-lock` ([#30300](https://github.com/mdn/browser-compat-data/pull/30300))
- `css.properties.scroll-axis-lock.auto` ([#30300](https://github.com/mdn/browser-compat-data/pull/30300))
- `css.properties.scroll-axis-lock.none` ([#30300](https://github.com/mdn/browser-compat-data/pull/30300))
- `css.types.progress.no-clamp` ([#30384](https://github.com/mdn/browser-compat-data/pull/30384))
- `html.elements.camera` ([#30316](https://github.com/mdn/browser-compat-data/pull/30316))
- `html.elements.install` ([#30366](https://github.com/mdn/browser-compat-data/pull/30366))
- `html.elements.install.manifest` ([#30366](https://github.com/mdn/browser-compat-data/pull/30366))
- `html.elements.install.manifestId` ([#30366](https://github.com/mdn/browser-compat-data/pull/30366))
- `html.elements.microphone` ([#30316](https://github.com/mdn/browser-compat-data/pull/30316))
- `html.elements.usermedia` ([#30326](https://github.com/mdn/browser-compat-data/pull/30326))
- `http.headers.Permissions-Policy.web-app-installation` ([#30399](https://github.com/mdn/browser-compat-data/pull/30399))
- `webdriver.bidi.browsingContext.contextCreated_event.emit_for_existing_contexts` ([#30394](https://github.com/mdn/browser-compat-data/pull/30394))
- `webdriver.bidi.script.message_event.source_parameter.userContext` ([#30394](https://github.com/mdn/browser-compat-data/pull/30394))
- `webdriver.bidi.script.realmCreated_event.type_parameter.audio-worklet` ([#30394](https://github.com/mdn/browser-compat-data/pull/30394))
- `webdriver.bidi.script.realmCreated_event.type_parameter.dedicated-worker` ([#30394](https://github.com/mdn/browser-compat-data/pull/30394))
- `webdriver.bidi.script.realmCreated_event.type_parameter.paint-worklet` ([#30394](https://github.com/mdn/browser-compat-data/pull/30394))
- `webdriver.bidi.script.realmCreated_event.type_parameter.service-worker` ([#30394](https://github.com/mdn/browser-compat-data/pull/30394))
- `webdriver.bidi.script.realmCreated_event.type_parameter.shared-worker` ([#30394](https://github.com/mdn/browser-compat-data/pull/30394))
- `webdriver.bidi.script.realmCreated_event.type_parameter.window` ([#30394](https://github.com/mdn/browser-compat-data/pull/30394))
- `webdriver.bidi.script.realmCreated_event.type_parameter.worker` ([#30394](https://github.com/mdn/browser-compat-data/pull/30394))
- `webdriver.bidi.script.realmCreated_event.type_parameter.worklet` ([#30394](https://github.com/mdn/browser-compat-data/pull/30394))
- `webextensions.manifest.theme.properties.backgrounds_area` ([#30363](https://github.com/mdn/browser-compat-data/pull/30363))

### Statistics

- 14 contributors have changed 114 files with 6,193 additions and 670 deletions in 41 commits ([`v8.0.13...v8.0.14`](https://github.com/mdn/browser-compat-data/compare/v8.0.13...v8.0.14))
- 20,510 total features
- 1,270 total contributors
- 5,736 total stargazers

## [v8.0.13](https://github.com/mdn/browser-compat-data/releases/tag/v8.0.13)

August 27, 2026

### Additions

- `api.HTMLBodyElement.orientationchange_event` ([#30189](https://github.com/mdn/browser-compat-data/pull/30189))
- `api.HTMLElement.containerTiming` ([#30336](https://github.com/mdn/browser-compat-data/pull/30336))
- `api.HTMLElement.containerTimingIgnore` ([#30336](https://github.com/mdn/browser-compat-data/pull/30336))
- `api.HTMLTemplateElement.htmlFor` ([#30292](https://github.com/mdn/browser-compat-data/pull/30292))
- `api.InteractionContentfulPaint` ([#30195](https://github.com/mdn/browser-compat-data/pull/30195))
- `api.InteractionContentfulPaint.interactionId` ([#30195](https://github.com/mdn/browser-compat-data/pull/30195))
- `api.InteractionContentfulPaint.largestContentfulPaint` ([#30195](https://github.com/mdn/browser-compat-data/pull/30195))
- `api.InteractionContentfulPaint.paintTime` ([#30195](https://github.com/mdn/browser-compat-data/pull/30195))
- `api.InteractionContentfulPaint.presentationTime` ([#30195](https://github.com/mdn/browser-compat-data/pull/30195))
- `api.MathMLAnchorElement` ([#30314](https://github.com/mdn/browser-compat-data/pull/30314))
- `api.MathMLAnchorElement.hash` ([#30314](https://github.com/mdn/browser-compat-data/pull/30314))
- `api.MathMLAnchorElement.host` ([#30314](https://github.com/mdn/browser-compat-data/pull/30314))
- `api.MathMLAnchorElement.hostname` ([#30314](https://github.com/mdn/browser-compat-data/pull/30314))
- `api.MathMLAnchorElement.href` ([#30314](https://github.com/mdn/browser-compat-data/pull/30314))
- `api.MathMLAnchorElement.hreflang` ([#30314](https://github.com/mdn/browser-compat-data/pull/30314))
- `api.MathMLAnchorElement.origin` ([#30314](https://github.com/mdn/browser-compat-data/pull/30314))
- `api.MathMLAnchorElement.password` ([#30314](https://github.com/mdn/browser-compat-data/pull/30314))
- `api.MathMLAnchorElement.pathname` ([#30314](https://github.com/mdn/browser-compat-data/pull/30314))
- `api.MathMLAnchorElement.port` ([#30314](https://github.com/mdn/browser-compat-data/pull/30314))
- `api.MathMLAnchorElement.protocol` ([#30314](https://github.com/mdn/browser-compat-data/pull/30314))
- `api.MathMLAnchorElement.search` ([#30314](https://github.com/mdn/browser-compat-data/pull/30314))
- `api.MathMLAnchorElement.target` ([#30314](https://github.com/mdn/browser-compat-data/pull/30314))
- `api.MathMLAnchorElement.type` ([#30314](https://github.com/mdn/browser-compat-data/pull/30314))
- `api.MathMLAnchorElement.username` ([#30314](https://github.com/mdn/browser-compat-data/pull/30314))
- `api.MediaStreamTrack.configurationchange_event` ([#30333](https://github.com/mdn/browser-compat-data/pull/30333))
- `api.PerformanceContainerTiming` ([#30336](https://github.com/mdn/browser-compat-data/pull/30336))
- `api.PerformanceContainerTiming.firstRenderTime` ([#30336](https://github.com/mdn/browser-compat-data/pull/30336))
- `api.PerformanceContainerTiming.identifier` ([#30336](https://github.com/mdn/browser-compat-data/pull/30336))
- `api.PerformanceContainerTiming.intersectionRect` ([#30336](https://github.com/mdn/browser-compat-data/pull/30336))
- `api.PerformanceContainerTiming.lastPaintedElement` ([#30336](https://github.com/mdn/browser-compat-data/pull/30336))
- `api.PerformanceContainerTiming.paintTime` ([#30336](https://github.com/mdn/browser-compat-data/pull/30336))
- `api.PerformanceContainerTiming.presentationTime` ([#30336](https://github.com/mdn/browser-compat-data/pull/30336))
- `api.PerformanceContainerTiming.rootElement` ([#30336](https://github.com/mdn/browser-compat-data/pull/30336))
- `api.PerformanceContainerTiming.size` ([#30336](https://github.com/mdn/browser-compat-data/pull/30336))
- `api.PerformanceSoftNavigation` ([#30195](https://github.com/mdn/browser-compat-data/pull/30195))
- `api.PerformanceSoftNavigation.getLargestInteractionContentfulPaint` ([#30195](https://github.com/mdn/browser-compat-data/pull/30195))
- `api.PerformanceSoftNavigation.interactionId` ([#30195](https://github.com/mdn/browser-compat-data/pull/30195))
- `api.PerformanceSoftNavigation.navigationType` ([#30195](https://github.com/mdn/browser-compat-data/pull/30195))
- `api.PerformanceSoftNavigation.paintTime` ([#30195](https://github.com/mdn/browser-compat-data/pull/30195))
- `api.PerformanceSoftNavigation.presentationTime` ([#30195](https://github.com/mdn/browser-compat-data/pull/30195))
- `api.ReportingObserver.ReportingObserver.options_parameter.types_property.connection-allowlist` ([#30345](https://github.com/mdn/browser-compat-data/pull/30345))
- `browsers.bun.releases.1.4.0` ([#30307](https://github.com/mdn/browser-compat-data/pull/30307))
- `browsers.chrome_android.releases.155` ([#30322](https://github.com/mdn/browser-compat-data/pull/30322))
- `browsers.chrome.releases.155` ([#30322](https://github.com/mdn/browser-compat-data/pull/30322))
- `browsers.opera_android.releases.101` ([#30341](https://github.com/mdn/browser-compat-data/pull/30341))
- `browsers.opera.releases.137` ([#30294](https://github.com/mdn/browser-compat-data/pull/30294))
- `browsers.webview_android.releases.155` ([#30322](https://github.com/mdn/browser-compat-data/pull/30322))
- `css.types.anchor-size.is_transitionable` ([#30339](https://github.com/mdn/browser-compat-data/pull/30339))
- `css.types.anchor.is_transitionable` ([#30339](https://github.com/mdn/browser-compat-data/pull/30339))
- `html.elements.template.for` ([#30292](https://github.com/mdn/browser-compat-data/pull/30292))
- `html.global_attributes.containertiming` ([#30336](https://github.com/mdn/browser-compat-data/pull/30336))
- `html.global_attributes.containertimingignore` ([#30336](https://github.com/mdn/browser-compat-data/pull/30336))
- `html.global_attributes.elementtiming` ([#30336](https://github.com/mdn/browser-compat-data/pull/30336))
- `http.headers.Connection-Allowlist` ([#30345](https://github.com/mdn/browser-compat-data/pull/30345))
- `http.headers.Connection-Allowlist-Report-Only` ([#30345](https://github.com/mdn/browser-compat-data/pull/30345))
- `javascript.builtins.Promise.allKeyed` ([#30265](https://github.com/mdn/browser-compat-data/pull/30265))
- `javascript.builtins.Promise.allSettledKeyed` ([#30265](https://github.com/mdn/browser-compat-data/pull/30265))
- `javascript.regular_expressions.buffer_boundary_assertion` ([#30295](https://github.com/mdn/browser-compat-data/pull/30295))
- `webassembly.definitions.import` ([#30318](https://github.com/mdn/browser-compat-data/pull/30318))
- `webassembly.definitions.import.compact_imports` ([#30318](https://github.com/mdn/browser-compat-data/pull/30318))
- `webassembly.instructions.add128` ([#30327](https://github.com/mdn/browser-compat-data/pull/30327))
- `webassembly.instructions.mul_wide_s` ([#30327](https://github.com/mdn/browser-compat-data/pull/30327))
- `webassembly.instructions.mul_wide_u` ([#30327](https://github.com/mdn/browser-compat-data/pull/30327))
- `webassembly.instructions.sub128` ([#30327](https://github.com/mdn/browser-compat-data/pull/30327))
- `webdriver.bidi.script.getRealms.type_parameter.worklet` ([#30293](https://github.com/mdn/browser-compat-data/pull/30293))

### Statistics

- 11 contributors have changed 75 files with 3,252 additions and 406 deletions in 38 commits ([`v8.0.12...v8.0.13`](https://github.com/mdn/browser-compat-data/compare/v8.0.12...v8.0.13))
- 20,359 total features
- 1,268 total contributors
- 5,729 total stargazers

## [v8.0.12](https://github.com/mdn/browser-compat-data/releases/tag/v8.0.12)

August 20, 2026

### Removals

- `api.Window.DOMContentLoaded_event` ([#30241](https://github.com/mdn/browser-compat-data/pull/30241))

### Additions

- `api.AudioSession.state` ([#30176](https://github.com/mdn/browser-compat-data/pull/30176))
- `api.AudioSession.statechange_event` ([#30176](https://github.com/mdn/browser-compat-data/pull/30176))
- `api.RTCError.errorDetail.sctp-failure` ([#30256](https://github.com/mdn/browser-compat-data/pull/30256))
- `api.RTCError.worker_support` ([#30256](https://github.com/mdn/browser-compat-data/pull/30256))
- `api.RTCErrorEvent.worker_support` ([#30256](https://github.com/mdn/browser-compat-data/pull/30256))
- `api.SVGAElement.hash` ([#30176](https://github.com/mdn/browser-compat-data/pull/30176))
- `api.SVGAElement.host` ([#30176](https://github.com/mdn/browser-compat-data/pull/30176))
- `api.SVGAElement.hostname` ([#30176](https://github.com/mdn/browser-compat-data/pull/30176))
- `api.SVGAElement.origin` ([#30176](https://github.com/mdn/browser-compat-data/pull/30176))
- `api.SVGAElement.password` ([#30176](https://github.com/mdn/browser-compat-data/pull/30176))
- `api.SVGAElement.pathname` ([#30176](https://github.com/mdn/browser-compat-data/pull/30176))
- `api.SVGAElement.port` ([#30176](https://github.com/mdn/browser-compat-data/pull/30176))
- `api.SVGAElement.protocol` ([#30176](https://github.com/mdn/browser-compat-data/pull/30176))
- `api.SVGAElement.search` ([#30176](https://github.com/mdn/browser-compat-data/pull/30176))
- `api.SVGAElement.username` ([#30176](https://github.com/mdn/browser-compat-data/pull/30176))
- `api.WebTransport.exportKeyingMaterial` ([#30176](https://github.com/mdn/browser-compat-data/pull/30176))
- `browsers.firefox_android.releases.157` ([#30258](https://github.com/mdn/browser-compat-data/pull/30258))
- `browsers.firefox.releases.157` ([#30258](https://github.com/mdn/browser-compat-data/pull/30258))
- `css.at-rules.supports.named-feature` ([#30266](https://github.com/mdn/browser-compat-data/pull/30266))
- `css.properties.text-fit.consistent` ([#30239](https://github.com/mdn/browser-compat-data/pull/30239))
- `css.properties.text-fit.per-line` ([#30239](https://github.com/mdn/browser-compat-data/pull/30239))
- `css.properties.text-fit.per-line-all` ([#30239](https://github.com/mdn/browser-compat-data/pull/30239))
- `css.properties.text-fit.percentage` ([#30239](https://github.com/mdn/browser-compat-data/pull/30239))
- `css.types.color.from_currentcolor` ([#30240](https://github.com/mdn/browser-compat-data/pull/30240))
- `http.headers.Permissions-Policy.clipboard-read` ([#30247](https://github.com/mdn/browser-compat-data/pull/30247))
- `http.headers.Permissions-Policy.clipboard-write` ([#30247](https://github.com/mdn/browser-compat-data/pull/30247))
- `javascript.statements.import.import_source.import_wasm_modules` ([#30136](https://github.com/mdn/browser-compat-data/pull/30136))

### Statistics

- 13 contributors have changed 78 files with 1,793 additions and 381 deletions in 44 commits ([`v8.0.11...v8.0.12`](https://github.com/mdn/browser-compat-data/compare/v8.0.11...v8.0.12))
- 20,300 total features
- 1,267 total contributors
- 5,723 total stargazers

## [v8.0.11](https://github.com/mdn/browser-compat-data/releases/tag/v8.0.11)

August 13, 2026

### Removals

- `css.properties.grid-template-columns.masonry` ([#30183](https://github.com/mdn/browser-compat-data/pull/30183))
- `css.properties.grid-template-rows.masonry` ([#30183](https://github.com/mdn/browser-compat-data/pull/30183))

### Additions

- `api.HTMLElement.toggle_event.details_elements.uses_toggleevent` ([#30207](https://github.com/mdn/browser-compat-data/pull/30207))
- `api.ProcessingInstruction.doc_html` ([#30213](https://github.com/mdn/browser-compat-data/pull/30213))
- `api.ProcessingInstruction.doc_xml` ([#30213](https://github.com/mdn/browser-compat-data/pull/30213))
- `api.VideoFrame.copyTo.format_property` ([#30217](https://github.com/mdn/browser-compat-data/pull/30217))
- `browsers.opera.releases.136` ([#30188](https://github.com/mdn/browser-compat-data/pull/30188))
- `css.properties.text-box-trim.inline_elements` ([#30221](https://github.com/mdn/browser-compat-data/pull/30221))
- `css.properties.text-box.inline_elements` ([#30221](https://github.com/mdn/browser-compat-data/pull/30221))
- `css.selectors.active.top-layer_ancestor_matching_boundary` ([#30216](https://github.com/mdn/browser-compat-data/pull/30216))
- `css.selectors.focus-within.top-layer_ancestor_matching_boundary` ([#30216](https://github.com/mdn/browser-compat-data/pull/30216))
- `css.selectors.hover.top-layer_ancestor_matching_boundary` ([#30216](https://github.com/mdn/browser-compat-data/pull/30216))
- `html.elements.hgroup.implicit_group_role` ([#30206](https://github.com/mdn/browser-compat-data/pull/30206))

### Statistics

- 14 contributors have changed 51 files with 624 additions and 243 deletions in 35 commits ([`v8.0.10...v8.0.11`](https://github.com/mdn/browser-compat-data/compare/v8.0.10...v8.0.11))
- 20,276 total features
- 1,267 total contributors
- 5,717 total stargazers

## [v8.0.10](https://github.com/mdn/browser-compat-data/releases/tag/v8.0.10)

August 6, 2026

### Additions

- `api.RTCPeerConnection.RTCPeerConnection.configuration_alwaysNegotiateDataChannels_parameter` ([#30175](https://github.com/mdn/browser-compat-data/pull/30175))
- `api.WGSLLanguageFeatures.extension_linear_indexing` ([#30172](https://github.com/mdn/browser-compat-data/pull/30172))
- `css.at-rules.page.size.landscape` ([#30075](https://github.com/mdn/browser-compat-data/pull/30075))
- `css.at-rules.page.size.portrait` ([#30075](https://github.com/mdn/browser-compat-data/pull/30075))
- `css.properties.block-ellipsis.no-ellipsis` ([#30174](https://github.com/mdn/browser-compat-data/pull/30174))
- `css.properties.line-clamp.string` ([#30166](https://github.com/mdn/browser-compat-data/pull/30166))
- `css.properties.white-space-trim` ([#30160](https://github.com/mdn/browser-compat-data/pull/30160))
- `css.properties.white-space-trim.discard-after` ([#30160](https://github.com/mdn/browser-compat-data/pull/30160))
- `css.properties.white-space-trim.discard-before` ([#30160](https://github.com/mdn/browser-compat-data/pull/30160))
- `css.properties.white-space-trim.discard-inner` ([#30160](https://github.com/mdn/browser-compat-data/pull/30160))
- `css.properties.white-space-trim.none` ([#30160](https://github.com/mdn/browser-compat-data/pull/30160))
- `css.properties.wrap-inside` ([#30160](https://github.com/mdn/browser-compat-data/pull/30160))
- `css.properties.wrap-inside.auto` ([#30160](https://github.com/mdn/browser-compat-data/pull/30160))
- `css.properties.wrap-inside.avoid` ([#30160](https://github.com/mdn/browser-compat-data/pull/30160))
- `css.types.basic-shape.polygon.round` ([#30162](https://github.com/mdn/browser-compat-data/pull/30162))

### Statistics

- 11 contributors have changed 49 files with 853 additions and 275 deletions in 24 commits ([`v8.0.9...v8.0.10`](https://github.com/mdn/browser-compat-data/compare/v8.0.9...v8.0.10))
- 20,268 total features
- 1,265 total contributors
- 5,713 total stargazers

## [v8.0.9](https://github.com/mdn/browser-compat-data/releases/tag/v8.0.9)

August 3, 2026

### Removals

- `api.SVGAnimateColorElement` ([#30123](https://github.com/mdn/browser-compat-data/pull/30123))

### Additions

- `api.Navigator.cpuPerformance` ([#30158](https://github.com/mdn/browser-compat-data/pull/30158))
- `api.RTCIceCandidatePair` ([#30116](https://github.com/mdn/browser-compat-data/pull/30116))
- `api.RTCIceCandidatePair.local` ([#30116](https://github.com/mdn/browser-compat-data/pull/30116))
- `api.RTCIceCandidatePair.remote` ([#30116](https://github.com/mdn/browser-compat-data/pull/30116))
- `api.RTCStatsReport.type_certificate.issuerCertificateId` ([#30130](https://github.com/mdn/browser-compat-data/pull/30130))
- `browsers.chrome_android.releases.154` ([#30137](https://github.com/mdn/browser-compat-data/pull/30137))
- `browsers.chrome.releases.154` ([#30137](https://github.com/mdn/browser-compat-data/pull/30137))
- `browsers.edge.releases.154` ([#30156](https://github.com/mdn/browser-compat-data/pull/30156))
- `browsers.safari_ios.releases.26.6` ([#30137](https://github.com/mdn/browser-compat-data/pull/30137))
- `browsers.safari.releases.26.6` ([#30137](https://github.com/mdn/browser-compat-data/pull/30137))
- `browsers.webview_android.releases.154` ([#30137](https://github.com/mdn/browser-compat-data/pull/30137))
- `browsers.webview_ios.releases.26.6` ([#30137](https://github.com/mdn/browser-compat-data/pull/30137))
- `css.types.param` ([#30088](https://github.com/mdn/browser-compat-data/pull/30088))
- `css.types.param.url` ([#30088](https://github.com/mdn/browser-compat-data/pull/30088))
- `css.types.param.url_fragments` ([#30088](https://github.com/mdn/browser-compat-data/pull/30088))
- `webextensions.manifest.sandbox` ([#30031](https://github.com/mdn/browser-compat-data/pull/30031))
- `webextensions.manifest.sandbox.content_security_policy` ([#30031](https://github.com/mdn/browser-compat-data/pull/30031))
- `webextensions.manifest.sandbox.pages` ([#30031](https://github.com/mdn/browser-compat-data/pull/30031))

### Statistics

- 7 contributors have changed 138 files with 733 additions and 416 deletions in 22 commits ([`v8.0.8...v8.0.9`](https://github.com/mdn/browser-compat-data/compare/v8.0.8...v8.0.9))
- 20,253 total features
- 1,260 total contributors
- 5,714 total stargazers

## [v8.0.8](https://github.com/mdn/browser-compat-data/releases/tag/v8.0.8)

July 24, 2026

### Removals

- `webextensions.manifest.offline_enabled` ([#30080](https://github.com/mdn/browser-compat-data/pull/30080))

### Additions

- `browsers.firefox_android.releases.156` ([#30103](https://github.com/mdn/browser-compat-data/pull/30103))
- `browsers.firefox.releases.156` ([#30103](https://github.com/mdn/browser-compat-data/pull/30103))
- `css.types.basic-shape.circle.closest-corner` ([#30084](https://github.com/mdn/browser-compat-data/pull/30084))
- `css.types.basic-shape.circle.farthest-corner` ([#30084](https://github.com/mdn/browser-compat-data/pull/30084))
- `css.types.basic-shape.ellipse.closest-corner` ([#30084](https://github.com/mdn/browser-compat-data/pull/30084))
- `css.types.basic-shape.ellipse.farthest-corner` ([#30084](https://github.com/mdn/browser-compat-data/pull/30084))
- `http.headers.Permissions-Policy.language-model` ([#30038](https://github.com/mdn/browser-compat-data/pull/30038))
- `manifests.webapp.localized_members` ([#30024](https://github.com/mdn/browser-compat-data/pull/30024))
- `webassembly.definitions.data` ([#30124](https://github.com/mdn/browser-compat-data/pull/30124))
- `webassembly.definitions.elem` ([#30124](https://github.com/mdn/browser-compat-data/pull/30124))
- `webassembly.definitions.func` ([#30062](https://github.com/mdn/browser-compat-data/pull/30062))
- `webassembly.definitions.table` ([#30062](https://github.com/mdn/browser-compat-data/pull/30062))
- `webassembly.definitions.tag` ([#30062](https://github.com/mdn/browser-compat-data/pull/30062))
- `webassembly.instructions.abs` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.abs.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.add` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.add_sat_s` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.add_sat_u` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.add.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.all_true` ([#30092](https://github.com/mdn/browser-compat-data/pull/30092))
- `webassembly.instructions.and` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.and.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.andnot` ([#30092](https://github.com/mdn/browser-compat-data/pull/30092))
- `webassembly.instructions.any_true` ([#30092](https://github.com/mdn/browser-compat-data/pull/30092))
- `webassembly.instructions.avgr_u` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.bitmask` ([#30092](https://github.com/mdn/browser-compat-data/pull/30092))
- `webassembly.instructions.bitselect` ([#30092](https://github.com/mdn/browser-compat-data/pull/30092))
- `webassembly.instructions.ceil` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.ceil.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.clz` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.const` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.const.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.convert` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.convert_i32x4_s` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.convert_i32x4_u` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.convert_low_i32x4_s` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.convert_low_i32x4_u` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.copysign` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.ctz` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.data_drop` ([#30124](https://github.com/mdn/browser-compat-data/pull/30124))
- `webassembly.instructions.demote` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.demote_f64x2_zero` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.div` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.div.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.dot_i16x8_s` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.elem_drop` ([#30124](https://github.com/mdn/browser-compat-data/pull/30124))
- `webassembly.instructions.eq` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.eq.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.eqz` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.extadd_pairwise_i16x8_s` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.extadd_pairwise_i16x8_u` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.extadd_pairwise_i8x16_s` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.extadd_pairwise_i8x16_u` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.extend` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.extend_high_i16x8_s` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.extend_high_i16x8_u` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.extend_high_i32x4_s` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.extend_high_i32x4_u` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.extend_high_i8x16_s` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.extend_high_i8x16_u` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.extend_low_i16x8_s` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.extend_low_i16x8_u` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.extend_low_i32x4_s` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.extend_low_i32x4_u` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.extend_low_i8x16_s` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.extend_low_i8x16_u` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.extend16_s` ([#30114](https://github.com/mdn/browser-compat-data/pull/30114))
- `webassembly.instructions.extend32_s` ([#30114](https://github.com/mdn/browser-compat-data/pull/30114))
- `webassembly.instructions.extend8_s` ([#30114](https://github.com/mdn/browser-compat-data/pull/30114))
- `webassembly.instructions.extmul_high_i16x8_s` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.extmul_high_i16x8_u` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.extmul_high_i32x4_s` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.extmul_high_i32x4_u` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.extmul_high_i8x16_s` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.extmul_high_i8x16_u` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.extmul_low_i16x8_s` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.extmul_low_i16x8_u` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.extmul_low_i32x4_s` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.extmul_low_i32x4_u` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.extmul_low_i8x16_s` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.extmul_low_i8x16_u` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.extract_lane` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.extract_lane_s` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.extract_lane_u` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.floor` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.floor.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.ge` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.ge_s` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.ge_s.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.ge_u` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.ge_u.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.ge.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.gt` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.gt_s` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.gt_s.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.gt_u` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.gt_u.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.gt.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.le` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.le_s` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.le_s.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.le_u` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.le_u.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.le.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.load` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.load16_lane` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.load16_splat` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.load16x4_s` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.load16x4_u` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.load32_lane` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.load32_splat` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.load32_zero` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.load32x2_s` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.load32x2_u` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.load64_lane` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.load64_splat` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.load64_zero` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.load8_lane` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.load8_splat` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.load8x8_s` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.load8x8_u` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.local` ([#30105](https://github.com/mdn/browser-compat-data/pull/30105))
- `webassembly.instructions.local_get` ([#30105](https://github.com/mdn/browser-compat-data/pull/30105))
- `webassembly.instructions.local_set` ([#30105](https://github.com/mdn/browser-compat-data/pull/30105))
- `webassembly.instructions.local_tee` ([#30105](https://github.com/mdn/browser-compat-data/pull/30105))
- `webassembly.instructions.lt` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.lt_s` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.lt_s.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.lt_u` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.lt_u.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.lt.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.max` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.max_s` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.max_u` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.max.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.memory_copy` ([#30072](https://github.com/mdn/browser-compat-data/pull/30072))
- `webassembly.instructions.memory_copy.multi_memory` ([#30072](https://github.com/mdn/browser-compat-data/pull/30072))
- `webassembly.instructions.memory_fill` ([#30072](https://github.com/mdn/browser-compat-data/pull/30072))
- `webassembly.instructions.memory_fill.multi_memory` ([#30072](https://github.com/mdn/browser-compat-data/pull/30072))
- `webassembly.instructions.memory_grow` ([#30072](https://github.com/mdn/browser-compat-data/pull/30072))
- `webassembly.instructions.memory_grow.multi_memory` ([#30072](https://github.com/mdn/browser-compat-data/pull/30072))
- `webassembly.instructions.memory_init` ([#30124](https://github.com/mdn/browser-compat-data/pull/30124))
- `webassembly.instructions.memory_init.multi_memory` ([#30124](https://github.com/mdn/browser-compat-data/pull/30124))
- `webassembly.instructions.memory_load` ([#30072](https://github.com/mdn/browser-compat-data/pull/30072))
- `webassembly.instructions.memory_load.multi_memory` ([#30072](https://github.com/mdn/browser-compat-data/pull/30072))
- `webassembly.instructions.memory_size` ([#30072](https://github.com/mdn/browser-compat-data/pull/30072))
- `webassembly.instructions.memory_size.multi_memory` ([#30072](https://github.com/mdn/browser-compat-data/pull/30072))
- `webassembly.instructions.memory_store` ([#30072](https://github.com/mdn/browser-compat-data/pull/30072))
- `webassembly.instructions.memory_store.multi_memory` ([#30072](https://github.com/mdn/browser-compat-data/pull/30072))
- `webassembly.instructions.min` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.min_s` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.min_u` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.min.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.mul` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.mul.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.narrow_i16x8_s` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.narrow_i16x8_u` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.narrow_i32x4_s` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.narrow_i32x4_u` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.ne` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.ne.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.nearest` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.nearest.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.neg` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.neg.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.not` ([#30092](https://github.com/mdn/browser-compat-data/pull/30092))
- `webassembly.instructions.or` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.or.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.pmax` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.pmin` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.popcnt` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.popcnt.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.promote_32` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.promote_low_f32x4` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.q15mulr_sat_s` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.reinterpret` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.rem` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.replace_lane` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.rotl` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.rotr` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.shl` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.shl.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.shr_s` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.shr_s.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.shr_u` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.shr_u.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.shuffle` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.splat` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.sqrt` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.sqrt.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.store` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.store16_lane` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.store32_lane` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.store64_lane` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.store8_lane` ([#30102](https://github.com/mdn/browser-compat-data/pull/30102))
- `webassembly.instructions.sub` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.sub_sat_s` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.sub_sat_u` ([#30091](https://github.com/mdn/browser-compat-data/pull/30091))
- `webassembly.instructions.sub.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.swizzle` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.table_copy` ([#30124](https://github.com/mdn/browser-compat-data/pull/30124))
- `webassembly.instructions.table_fill` ([#30105](https://github.com/mdn/browser-compat-data/pull/30105))
- `webassembly.instructions.table_get` ([#30105](https://github.com/mdn/browser-compat-data/pull/30105))
- `webassembly.instructions.table_grow` ([#30105](https://github.com/mdn/browser-compat-data/pull/30105))
- `webassembly.instructions.table_init` ([#30124](https://github.com/mdn/browser-compat-data/pull/30124))
- `webassembly.instructions.table_set` ([#30105](https://github.com/mdn/browser-compat-data/pull/30105))
- `webassembly.instructions.table_size` ([#30105](https://github.com/mdn/browser-compat-data/pull/30105))
- `webassembly.instructions.throw` ([#30071](https://github.com/mdn/browser-compat-data/pull/30071))
- `webassembly.instructions.throw_ref` ([#30071](https://github.com/mdn/browser-compat-data/pull/30071))
- `webassembly.instructions.trunc` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.trunc_f32_s` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.trunc_f32_u` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.trunc_f64_s` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.trunc_f64_u` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.trunc_sat_f32_s` ([#30110](https://github.com/mdn/browser-compat-data/pull/30110))
- `webassembly.instructions.trunc_sat_f32_u` ([#30110](https://github.com/mdn/browser-compat-data/pull/30110))
- `webassembly.instructions.trunc_sat_f32x4_s` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.trunc_sat_f32x4_u` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.trunc_sat_f64_s` ([#30110](https://github.com/mdn/browser-compat-data/pull/30110))
- `webassembly.instructions.trunc_sat_f64_u` ([#30110](https://github.com/mdn/browser-compat-data/pull/30110))
- `webassembly.instructions.trunc_sat_f64x2_s_zero` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.trunc_sat_f64x2_u_zero` ([#30099](https://github.com/mdn/browser-compat-data/pull/30099))
- `webassembly.instructions.trunc.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.try_table` ([#30071](https://github.com/mdn/browser-compat-data/pull/30071))
- `webassembly.instructions.try_table.catch` ([#30071](https://github.com/mdn/browser-compat-data/pull/30071))
- `webassembly.instructions.try_table.catch_all` ([#30071](https://github.com/mdn/browser-compat-data/pull/30071))
- `webassembly.instructions.try_table.catch_all_ref` ([#30071](https://github.com/mdn/browser-compat-data/pull/30071))
- `webassembly.instructions.try_table.catch_ref` ([#30071](https://github.com/mdn/browser-compat-data/pull/30071))
- `webassembly.instructions.wrap_i64` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.xor` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))
- `webassembly.instructions.xor.v128` ([#30073](https://github.com/mdn/browser-compat-data/pull/30073))

### Statistics

- 10 contributors have changed 242 files with 9,530 additions and 285 deletions in 35 commits ([`v8.0.7...v8.0.8`](https://github.com/mdn/browser-compat-data/compare/v8.0.7...v8.0.8))
- 20,243 total features
- 1,259 total contributors
- 5,709 total stargazers

## [v8.0.7](https://github.com/mdn/browser-compat-data/releases/tag/v8.0.7)

July 17, 2026

### Additions

- `api.PermissionsPolicy` ([#30043](https://github.com/mdn/browser-compat-data/pull/30043))
- `api.PermissionsPolicy.allowedFeatures` ([#30043](https://github.com/mdn/browser-compat-data/pull/30043))
- `api.PermissionsPolicy.allowsFeature` ([#30043](https://github.com/mdn/browser-compat-data/pull/30043))
- `api.PermissionsPolicy.features` ([#30043](https://github.com/mdn/browser-compat-data/pull/30043))
- `api.PermissionsPolicy.getAllowlistForFeature` ([#30043](https://github.com/mdn/browser-compat-data/pull/30043))
- `browsers.nodejs.releases.26.5.0` ([#30026](https://github.com/mdn/browser-compat-data/pull/30026))
- `css.properties.position-visibility.anchors-valid` ([#30048](https://github.com/mdn/browser-compat-data/pull/30048))
- `css.properties.position-visibility.anchors-visible` ([#30048](https://github.com/mdn/browser-compat-data/pull/30048))
- `css.properties.window-drag` ([#30043](https://github.com/mdn/browser-compat-data/pull/30043))
- `css.properties.window-drag.move` ([#30043](https://github.com/mdn/browser-compat-data/pull/30043))
- `css.properties.window-drag.none` ([#30043](https://github.com/mdn/browser-compat-data/pull/30043))
- `javascript.statements.import.import_source` ([#30034](https://github.com/mdn/browser-compat-data/pull/30034))
- `webassembly.api.SuspendError` ([#30057](https://github.com/mdn/browser-compat-data/pull/30057))
- `webassembly.api.SuspendError.SuspendError` ([#30057](https://github.com/mdn/browser-compat-data/pull/30057))
- `webassembly.instructions.block` ([#30065](https://github.com/mdn/browser-compat-data/pull/30065))
- `webassembly.instructions.br` ([#30065](https://github.com/mdn/browser-compat-data/pull/30065))
- `webassembly.instructions.br_if` ([#30065](https://github.com/mdn/browser-compat-data/pull/30065))
- `webassembly.instructions.br_table` ([#30065](https://github.com/mdn/browser-compat-data/pull/30065))
- `webassembly.instructions.call` ([#30065](https://github.com/mdn/browser-compat-data/pull/30065))
- `webassembly.instructions.drop` ([#30065](https://github.com/mdn/browser-compat-data/pull/30065))
- `webassembly.instructions.end` ([#30065](https://github.com/mdn/browser-compat-data/pull/30065))
- `webassembly.instructions.if_else` ([#30065](https://github.com/mdn/browser-compat-data/pull/30065))
- `webassembly.instructions.loop` ([#30065](https://github.com/mdn/browser-compat-data/pull/30065))
- `webassembly.instructions.nop` ([#30065](https://github.com/mdn/browser-compat-data/pull/30065))
- `webassembly.instructions.return` ([#30065](https://github.com/mdn/browser-compat-data/pull/30065))
- `webassembly.instructions.select` ([#30065](https://github.com/mdn/browser-compat-data/pull/30065))
- `webassembly.instructions.unreachable` ([#30065](https://github.com/mdn/browser-compat-data/pull/30065))
- `webassembly.types.exnref` ([#30058](https://github.com/mdn/browser-compat-data/pull/30058))
- `webassembly.types.externref` ([#30058](https://github.com/mdn/browser-compat-data/pull/30058))
- `webassembly.types.f32` ([#30058](https://github.com/mdn/browser-compat-data/pull/30058))
- `webassembly.types.f64` ([#30058](https://github.com/mdn/browser-compat-data/pull/30058))
- `webassembly.types.funcref` ([#30058](https://github.com/mdn/browser-compat-data/pull/30058))
- `webassembly.types.i32` ([#30058](https://github.com/mdn/browser-compat-data/pull/30058))
- `webassembly.types.i64` ([#30058](https://github.com/mdn/browser-compat-data/pull/30058))
- `webassembly.types.v128` ([#30058](https://github.com/mdn/browser-compat-data/pull/30058))
- `webdriver.bidi.browsingContext.downloadEnd_event.download_parameter` ([#30044](https://github.com/mdn/browser-compat-data/pull/30044))
- `webdriver.bidi.browsingContext.downloadWillBegin_event.download_parameter` ([#30044](https://github.com/mdn/browser-compat-data/pull/30044))

### Statistics

- 10 contributors have changed 110 files with 1,961 additions and 1,169 deletions in 33 commits ([`v8.0.6...v8.0.7`](https://github.com/mdn/browser-compat-data/compare/v8.0.6...v8.0.7))
- 20,015 total features
- 1,258 total contributors
- 5,700 total stargazers

## [v8.0.6](https://github.com/mdn/browser-compat-data/releases/tag/v8.0.6)

July 10, 2026

### Removals

- `css.properties.position-visibility.anchors-valid` ([#29979](https://github.com/mdn/browser-compat-data/pull/29979))
- `css.properties.position-visibility.anchors-visible` ([#29979](https://github.com/mdn/browser-compat-data/pull/29979))

### Additions

- `api.GPUComputePassEncoder.setImmediates` ([#29987](https://github.com/mdn/browser-compat-data/pull/29987))
- `api.GPURenderBundleEncoder.setImmediates` ([#29987](https://github.com/mdn/browser-compat-data/pull/29987))
- `api.GPURenderPassEncoder.setImmediates` ([#29987](https://github.com/mdn/browser-compat-data/pull/29987))
- `api.GPUSupportedLimits.maxImmediateSize` ([#29987](https://github.com/mdn/browser-compat-data/pull/29987))
- `api.MediaStreamTrackProcessor.discardedFrames` ([#29981](https://github.com/mdn/browser-compat-data/pull/29981))
- `api.MediaStreamTrackProcessor.totalFrames` ([#29981](https://github.com/mdn/browser-compat-data/pull/29981))
- `api.PerformanceEntry.navigationId` ([#29988](https://github.com/mdn/browser-compat-data/pull/29988))
- `api.ProcessingInstruction.getAttribute` ([#29987](https://github.com/mdn/browser-compat-data/pull/29987))
- `api.ProcessingInstruction.getAttributeNames` ([#29987](https://github.com/mdn/browser-compat-data/pull/29987))
- `api.ProcessingInstruction.hasAttribute` ([#29987](https://github.com/mdn/browser-compat-data/pull/29987))
- `api.ProcessingInstruction.hasAttributes` ([#29987](https://github.com/mdn/browser-compat-data/pull/29987))
- `api.ProcessingInstruction.removeAttribute` ([#29987](https://github.com/mdn/browser-compat-data/pull/29987))
- `api.ProcessingInstruction.setAttribute` ([#29987](https://github.com/mdn/browser-compat-data/pull/29987))
- `api.ProcessingInstruction.toggleAttribute` ([#29987](https://github.com/mdn/browser-compat-data/pull/29987))
- `api.WheelEvent.momentum` ([#29988](https://github.com/mdn/browser-compat-data/pull/29988))
- `css.properties.ruby-overhang.spaces` ([#29988](https://github.com/mdn/browser-compat-data/pull/29988))
- `css.properties.text-box-edge.alphabetic` ([#29996](https://github.com/mdn/browser-compat-data/pull/29996))
- `css.properties.text-box.alphabetic` ([#29996](https://github.com/mdn/browser-compat-data/pull/29996))
- `css.types.color.alpha` ([#29997](https://github.com/mdn/browser-compat-data/pull/29997))
- `javascript.builtins.Iterator.chunks` ([#29996](https://github.com/mdn/browser-compat-data/pull/29996))
- `javascript.builtins.Iterator.join` ([#29996](https://github.com/mdn/browser-compat-data/pull/29996))
- `javascript.builtins.Iterator.windows` ([#29996](https://github.com/mdn/browser-compat-data/pull/29996))

### Statistics

- 9 contributors have changed 131 files with 6,281 additions and 5,571 deletions in 31 commits ([`v8.0.5...v8.0.6`](https://github.com/mdn/browser-compat-data/compare/v8.0.5...v8.0.6))
- 19,979 total features
- 1,257 total contributors
- 5,698 total stargazers

## [v8.0.5](https://github.com/mdn/browser-compat-data/releases/tag/v8.0.5)

July 3, 2026

### Additions

- `api.Blob.textStream` ([#29905](https://github.com/mdn/browser-compat-data/pull/29905))
- `api.HTMLAreaElement.hreflang` ([#29883](https://github.com/mdn/browser-compat-data/pull/29883))
- `api.HTMLAreaElement.type` ([#29883](https://github.com/mdn/browser-compat-data/pull/29883))
- `api.HTMLElement.headingOffset` ([#29931](https://github.com/mdn/browser-compat-data/pull/29931))
- `api.HTMLElement.headingReset` ([#29931](https://github.com/mdn/browser-compat-data/pull/29931))
- `api.HTMLModelElement` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `api.HTMLModelElement.boundingBoxCenter` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `api.HTMLModelElement.boundingBoxExtents` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `api.HTMLModelElement.entityTransform` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `api.HTMLModelElement.environmentMap` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `api.HTMLModelElement.environmentMapReady` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `api.HTMLModelElement.ready` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `api.HTMLModelElement.stageMode` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `api.MediaStreamTrackHandle` ([#29904](https://github.com/mdn/browser-compat-data/pull/29904))
- `api.MediaStreamTrackHandle.MediaStreamTrackHandle` ([#29904](https://github.com/mdn/browser-compat-data/pull/29904))
- `api.PerformanceResourceTiming.workerFinalRouterSource` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `api.PerformanceResourceTiming.workerMatchedRouterSource` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `api.Request.textStream` ([#29905](https://github.com/mdn/browser-compat-data/pull/29905))
- `api.Response.textStream` ([#29905](https://github.com/mdn/browser-compat-data/pull/29905))
- `api.SpeechRecognition.unspokenPunctuation` ([#29905](https://github.com/mdn/browser-compat-data/pull/29905))
- `api.WebTransportDatagramDuplexStream.incomingMaxBufferedDatagrams` ([#29905](https://github.com/mdn/browser-compat-data/pull/29905))
- `api.WebTransportDatagramDuplexStream.outgoingMaxBufferedDatagrams` ([#29905](https://github.com/mdn/browser-compat-data/pull/29905))
- `api.Window.requestResize` ([#29911](https://github.com/mdn/browser-compat-data/pull/29911))
- `browsers.chrome_android.releases.153` ([#29946](https://github.com/mdn/browser-compat-data/pull/29946))
- `browsers.chrome.releases.153` ([#29946](https://github.com/mdn/browser-compat-data/pull/29946))
- `browsers.deno.releases.2.9` ([#29922](https://github.com/mdn/browser-compat-data/pull/29922))
- `browsers.edge.releases.153` ([#29973](https://github.com/mdn/browser-compat-data/pull/29973))
- `browsers.opera_android.releases.100` ([#29964](https://github.com/mdn/browser-compat-data/pull/29964))
- `browsers.opera.releases.135` ([#29946](https://github.com/mdn/browser-compat-data/pull/29946))
- `browsers.webview_android.releases.153` ([#29946](https://github.com/mdn/browser-compat-data/pull/29946))
- `css.properties.alignment-baseline.hanging` ([#29883](https://github.com/mdn/browser-compat-data/pull/29883))
- `css.properties.block-ellipsis` ([#29904](https://github.com/mdn/browser-compat-data/pull/29904))
- `css.properties.block-ellipsis.auto` ([#29904](https://github.com/mdn/browser-compat-data/pull/29904))
- `css.properties.continue` ([#29904](https://github.com/mdn/browser-compat-data/pull/29904))
- `css.properties.continue.auto` ([#29904](https://github.com/mdn/browser-compat-data/pull/29904))
- `css.properties.continue.discard` ([#29904](https://github.com/mdn/browser-compat-data/pull/29904))
- `css.properties.frame-sizing` ([#29911](https://github.com/mdn/browser-compat-data/pull/29911))
- `css.properties.frame-sizing.auto` ([#29911](https://github.com/mdn/browser-compat-data/pull/29911))
- `css.properties.frame-sizing.content-block-size` ([#29911](https://github.com/mdn/browser-compat-data/pull/29911))
- `css.properties.frame-sizing.content-height` ([#29911](https://github.com/mdn/browser-compat-data/pull/29911))
- `css.properties.frame-sizing.content-inline-size` ([#29911](https://github.com/mdn/browser-compat-data/pull/29911))
- `css.properties.frame-sizing.content-width` ([#29911](https://github.com/mdn/browser-compat-data/pull/29911))
- `css.properties.line-clamp.auto` ([#29904](https://github.com/mdn/browser-compat-data/pull/29904))
- `css.properties.line-clamp.no-ellipsis` ([#29905](https://github.com/mdn/browser-compat-data/pull/29905))
- `css.properties.link-parameters` ([#29909](https://github.com/mdn/browser-compat-data/pull/29909))
- `css.properties.link-parameters.none` ([#29909](https://github.com/mdn/browser-compat-data/pull/29909))
- `css.properties.max-lines` ([#29904](https://github.com/mdn/browser-compat-data/pull/29904))
- `css.properties.max-lines.none` ([#29904](https://github.com/mdn/browser-compat-data/pull/29904))
- `css.properties.path-length` ([#29906](https://github.com/mdn/browser-compat-data/pull/29906))
- `css.properties.path-length.none` ([#29906](https://github.com/mdn/browser-compat-data/pull/29906))
- `css.properties.position-visibility.anchor-valid` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `css.properties.position-visibility.anchor-visible` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `css.properties.vertical-align.alphabetic` ([#29883](https://github.com/mdn/browser-compat-data/pull/29883))
- `css.properties.vertical-align.central` ([#29883](https://github.com/mdn/browser-compat-data/pull/29883))
- `css.properties.vertical-align.hanging` ([#29883](https://github.com/mdn/browser-compat-data/pull/29883))
- `css.properties.vertical-align.ideographic` ([#29883](https://github.com/mdn/browser-compat-data/pull/29883))
- `css.properties.vertical-align.mathematical` ([#29883](https://github.com/mdn/browser-compat-data/pull/29883))
- `html.elements.area.hreflang` ([#29883](https://github.com/mdn/browser-compat-data/pull/29883))
- `html.elements.area.type` ([#29883](https://github.com/mdn/browser-compat-data/pull/29883))
- `html.elements.meta.name.responsive-embedded-sizing` ([#29911](https://github.com/mdn/browser-compat-data/pull/29911))
- `html.elements.model` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `html.elements.model.autoplay` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `html.elements.model.height` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `html.elements.model.loop` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `html.elements.model.src` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `html.elements.model.stagemode` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `html.elements.model.width` ([#29823](https://github.com/mdn/browser-compat-data/pull/29823))
- `html.global_attributes.headingoffset` ([#29931](https://github.com/mdn/browser-compat-data/pull/29931))
- `html.global_attributes.headingreset` ([#29931](https://github.com/mdn/browser-compat-data/pull/29931))
- `webdriver.bidi.browsingContext.startScreencast` ([#29917](https://github.com/mdn/browser-compat-data/pull/29917))
- `webdriver.bidi.browsingContext.startScreencast.context_parameter` ([#29917](https://github.com/mdn/browser-compat-data/pull/29917))
- `webdriver.bidi.browsingContext.startScreencast.mimeType_parameter` ([#29917](https://github.com/mdn/browser-compat-data/pull/29917))
- `webdriver.bidi.browsingContext.startScreencast.video_parameter` ([#29917](https://github.com/mdn/browser-compat-data/pull/29917))
- `webdriver.bidi.browsingContext.stopScreencast` ([#29917](https://github.com/mdn/browser-compat-data/pull/29917))
- `webdriver.bidi.browsingContext.stopScreencast.screencast_parameter` ([#29917](https://github.com/mdn/browser-compat-data/pull/29917))
- `webdriver.bidi.emulation.setTimezoneOverride.dedicated_and_shared_workers` ([#29913](https://github.com/mdn/browser-compat-data/pull/29913))
- `webextensions.api.tabs.connect.connectInfo.name` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.api.webRequest.onAuthRequired.details.documentLifecycle` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.api.webRequest.onAuthRequired.details.frameType` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.api.webRequest.onBeforeRedirect.details.documentLifecycle` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.api.webRequest.onBeforeRedirect.details.frameType` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.api.webRequest.onBeforeRequest.details.documentLifecycle` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.api.webRequest.onBeforeRequest.details.frameType` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.api.webRequest.onBeforeSendHeaders.details.documentLifecycle` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.api.webRequest.onBeforeSendHeaders.details.frameType` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.api.webRequest.onCompleted.details.documentLifecycle` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.api.webRequest.onCompleted.details.frameType` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.api.webRequest.onErrorOccurred.details.documentLifecycle` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.api.webRequest.onErrorOccurred.details.frameType` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.api.webRequest.onHeadersReceived.details.documentLifecycle` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.api.webRequest.onHeadersReceived.details.frameType` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.api.webRequest.onResponseStarted.details.documentLifecycle` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.api.webRequest.onResponseStarted.details.frameType` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.api.webRequest.onSendHeaders.details.documentLifecycle` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.api.webRequest.onSendHeaders.details.frameType` ([#28790](https://github.com/mdn/browser-compat-data/pull/28790))
- `webextensions.manifest.theme.properties.additional_backgrounds_size` ([#29910](https://github.com/mdn/browser-compat-data/pull/29910))

### Statistics

- 12 contributors have changed 283 files with 4,078 additions and 832 deletions in 50 commits ([`v8.0.4...v8.0.5`](https://github.com/mdn/browser-compat-data/compare/v8.0.4...v8.0.5))
- 19,959 total features
- 1,256 total contributors
- 5,702 total stargazers

## [v8.0.4](https://github.com/mdn/browser-compat-data/releases/tag/v8.0.4)

June 19, 2026

### Removals

- `api.MediaCapabilities.decodingInfo.configuration_keySystemConfiguration_parameter` ([#29739](https://github.com/mdn/browser-compat-data/pull/29739))

### Additions

- `api.Element.scroll.returns_promise` ([#29875](https://github.com/mdn/browser-compat-data/pull/29875))
- `api.Element.scrollBy.returns_promise` ([#29875](https://github.com/mdn/browser-compat-data/pull/29875))
- `api.Element.scrollIntoView.returns_promise` ([#29875](https://github.com/mdn/browser-compat-data/pull/29875))
- `api.Element.scrollTo.returns_promise` ([#29875](https://github.com/mdn/browser-compat-data/pull/29875))
- `api.MediaCapabilities.decodingInfo.configuration_parameter` ([#29739](https://github.com/mdn/browser-compat-data/pull/29739))
- `api.MediaCapabilities.decodingInfo.configuration_parameter.keySystemConfiguration` ([#29739](https://github.com/mdn/browser-compat-data/pull/29739))
- `api.MediaCapabilities.decodingInfo.configuration_parameter.type` ([#29739](https://github.com/mdn/browser-compat-data/pull/29739))
- `api.MediaCapabilities.decodingInfo.configuration_parameter.type.webrtc_option` ([#29739](https://github.com/mdn/browser-compat-data/pull/29739))
- `api.MediaCapabilities.encodingInfo.configuration_parameter` ([#29739](https://github.com/mdn/browser-compat-data/pull/29739))
- `api.MediaCapabilities.encodingInfo.configuration_parameter.type` ([#29739](https://github.com/mdn/browser-compat-data/pull/29739))
- `api.MediaCapabilities.encodingInfo.configuration_parameter.type.transmission_option` ([#29739](https://github.com/mdn/browser-compat-data/pull/29739))
- `api.MediaCapabilities.encodingInfo.configuration_parameter.type.webrtc_option` ([#29739](https://github.com/mdn/browser-compat-data/pull/29739))
- `api.MediaSession.setActionHandler.callback` ([#29868](https://github.com/mdn/browser-compat-data/pull/29868))
- `api.MediaSession.setActionHandler.callback.enterPictureInPictureReason` ([#29868](https://github.com/mdn/browser-compat-data/pull/29868))
- `api.MediaSession.setActionHandler.enterpictureinpicture_type` ([#29868](https://github.com/mdn/browser-compat-data/pull/29868))
- `api.WebSocket.local_network_access` ([#29864](https://github.com/mdn/browser-compat-data/pull/29864))
- `api.WebTransport.local_network_access` ([#29864](https://github.com/mdn/browser-compat-data/pull/29864))
- `api.Window.scroll.returns_promise` ([#29875](https://github.com/mdn/browser-compat-data/pull/29875))
- `api.Window.scrollBy.returns_promise` ([#29875](https://github.com/mdn/browser-compat-data/pull/29875))
- `api.Window.scrollTo.returns_promise` ([#29875](https://github.com/mdn/browser-compat-data/pull/29875))
- `api.WindowClient.navigate.local_network_access` ([#29864](https://github.com/mdn/browser-compat-data/pull/29864))
- `browsers.firefox_android.releases.155` ([#29863](https://github.com/mdn/browser-compat-data/pull/29863))
- `browsers.firefox.releases.155` ([#29863](https://github.com/mdn/browser-compat-data/pull/29863))
- `webassembly.api.promising_static` ([#29783](https://github.com/mdn/browser-compat-data/pull/29783))
- `webassembly.api.Suspending` ([#29783](https://github.com/mdn/browser-compat-data/pull/29783))
- `webassembly.api.Suspending.Suspending` ([#29783](https://github.com/mdn/browser-compat-data/pull/29783))
- `webdriver.bidi.browsingContext.domContentLoaded_event.userContext_parameter` ([#29882](https://github.com/mdn/browser-compat-data/pull/29882))
- `webdriver.bidi.browsingContext.downloadEnd_event.userContext_parameter` ([#29882](https://github.com/mdn/browser-compat-data/pull/29882))
- `webdriver.bidi.browsingContext.downloadWillBegin_event.userContext_parameter` ([#29882](https://github.com/mdn/browser-compat-data/pull/29882))
- `webdriver.bidi.browsingContext.fragmentNavigated_event.userContext_parameter` ([#29882](https://github.com/mdn/browser-compat-data/pull/29882))
- `webdriver.bidi.browsingContext.historyUpdated_event.userContext_parameter` ([#29882](https://github.com/mdn/browser-compat-data/pull/29882))
- `webdriver.bidi.browsingContext.load_event.userContext_parameter` ([#29882](https://github.com/mdn/browser-compat-data/pull/29882))
- `webdriver.bidi.browsingContext.navigationCommitted_event.userContext_parameter` ([#29882](https://github.com/mdn/browser-compat-data/pull/29882))
- `webdriver.bidi.browsingContext.navigationFailed_event.userContext_parameter` ([#29882](https://github.com/mdn/browser-compat-data/pull/29882))
- `webdriver.bidi.browsingContext.navigationStarted_event.userContext_parameter` ([#29882](https://github.com/mdn/browser-compat-data/pull/29882))
- `webdriver.bidi.browsingContext.userPromptClosed_event.userContext_parameter` ([#29882](https://github.com/mdn/browser-compat-data/pull/29882))
- `webdriver.bidi.browsingContext.userPromptOpened_event.userContext_parameter` ([#29882](https://github.com/mdn/browser-compat-data/pull/29882))
- `webdriver.bidi.input.fileDialogOpened_event.userContext_parameter` ([#29882](https://github.com/mdn/browser-compat-data/pull/29882))
- `webdriver.bidi.network.authRequired_event.userContext_parameter` ([#29882](https://github.com/mdn/browser-compat-data/pull/29882))
- `webdriver.bidi.network.beforeRequestSent_event.userContext_parameter` ([#29882](https://github.com/mdn/browser-compat-data/pull/29882))
- `webdriver.bidi.network.fetchError_event.userContext_parameter` ([#29882](https://github.com/mdn/browser-compat-data/pull/29882))
- `webdriver.bidi.network.responseCompleted_event.userContext_parameter` ([#29882](https://github.com/mdn/browser-compat-data/pull/29882))
- `webdriver.bidi.network.responseStarted_event.userContext_parameter` ([#29882](https://github.com/mdn/browser-compat-data/pull/29882))
- `webdriver.bidi.script.realmCreated_event.userContext_parameter` ([#29882](https://github.com/mdn/browser-compat-data/pull/29882))
- `webextensions.api.proxy.onRequest.documentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.proxy.onRequest.parentDocumentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.runtime.getContexts.documentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.runtime.getDocumentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.scripting.executeScript.InjectionResult.documentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.scripting.InjectionTarget.documentIds` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.tabs.connect.connectInfo.documentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.tabs.sendMessage.options.documentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.webRequest.onAuthRequired.details.documentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.webRequest.onAuthRequired.details.parentDocumentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.webRequest.onBeforeRedirect.details.documentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.webRequest.onBeforeRedirect.details.parentDocumentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.webRequest.onBeforeRequest.details.documentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.webRequest.onBeforeRequest.details.parentDocumentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.webRequest.onBeforeSendHeaders.details.documentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.webRequest.onBeforeSendHeaders.details.parentDocumentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.webRequest.onCompleted.details.documentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.webRequest.onCompleted.details.parentDocumentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.webRequest.onErrorOccurred.details.documentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.webRequest.onErrorOccurred.details.parentDocumentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.webRequest.onHeadersReceived.details.documentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.webRequest.onHeadersReceived.details.parentDocumentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.webRequest.onResponseStarted.details.documentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.webRequest.onResponseStarted.details.parentDocumentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.webRequest.onSendHeaders.details.documentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))
- `webextensions.api.webRequest.onSendHeaders.details.parentDocumentId` ([#29853](https://github.com/mdn/browser-compat-data/pull/29853))

### Statistics

- 11 contributors have changed 38 files with 2,172 additions and 182 deletions in 29 commits ([`v8.0.3...v8.0.4`](https://github.com/mdn/browser-compat-data/compare/v8.0.3...v8.0.4))
- 19,870 total features
- 1,255 total contributors
- 5,690 total stargazers

## [v8.0.3](https://github.com/mdn/browser-compat-data/releases/tag/v8.0.3)

June 12, 2026

### Removals

- `api.Gamepad.secure_context_required` ([#29808](https://github.com/mdn/browser-compat-data/pull/29808))
- `api.GamepadButton.secure_context_required` ([#29808](https://github.com/mdn/browser-compat-data/pull/29808))
- `api.GamepadEvent.secure_context_required` ([#29808](https://github.com/mdn/browser-compat-data/pull/29808))
- `api.GamepadHapticActuator.secure_context_required` ([#29808](https://github.com/mdn/browser-compat-data/pull/29808))
- `api.GamepadPose.secure_context_required` ([#29808](https://github.com/mdn/browser-compat-data/pull/29808))
- `api.HTMLMarqueeElement.bounce_event` ([#29808](https://github.com/mdn/browser-compat-data/pull/29808))
- `api.HTMLMarqueeElement.finish_event` ([#29808](https://github.com/mdn/browser-compat-data/pull/29808))
- `api.HTMLMarqueeElement.start_event` ([#29808](https://github.com/mdn/browser-compat-data/pull/29808))
- `api.Navigator.getGamepads.secure_context_required` ([#29808](https://github.com/mdn/browser-compat-data/pull/29808))
- `api.SVGAElement.text` ([#29808](https://github.com/mdn/browser-compat-data/pull/29808))
- `api.SVGRenderingIntent` ([#29808](https://github.com/mdn/browser-compat-data/pull/29808))

### Additions

- `browsers.opera_android.releases.99` ([#29839](https://github.com/mdn/browser-compat-data/pull/29839))
- `browsers.safari_ios.releases.27` ([#29827](https://github.com/mdn/browser-compat-data/pull/29827))
- `browsers.safari.releases.27` ([#29827](https://github.com/mdn/browser-compat-data/pull/29827))
- `browsers.webview_ios.releases.27` ([#29827](https://github.com/mdn/browser-compat-data/pull/29827))
- `webextensions.api.contextualIdentities.getSupportedColors` ([#29814](https://github.com/mdn/browser-compat-data/pull/29814))
- `webextensions.api.contextualIdentities.getSupportedIcons` ([#29814](https://github.com/mdn/browser-compat-data/pull/29814))
- `webextensions.api.publicSuffix` ([#29822](https://github.com/mdn/browser-compat-data/pull/29822))
- `webextensions.api.publicSuffix.DomainEncoding` ([#29822](https://github.com/mdn/browser-compat-data/pull/29822))
- `webextensions.api.publicSuffix.getDomain` ([#29822](https://github.com/mdn/browser-compat-data/pull/29822))
- `webextensions.api.publicSuffix.getKnownSuffix` ([#29822](https://github.com/mdn/browser-compat-data/pull/29822))
- `webextensions.api.publicSuffix.isKnownSuffix` ([#29822](https://github.com/mdn/browser-compat-data/pull/29822))
- `webextensions.manifest.optional_permissions.publicSuffix` ([#29822](https://github.com/mdn/browser-compat-data/pull/29822))

### Statistics

- 5 contributors have changed 43 files with 389 additions and 581 deletions in 23 commits ([`v8.0.2...v8.0.3`](https://github.com/mdn/browser-compat-data/compare/v8.0.2...v8.0.3))
- 19,803 total features
- 1,254 total contributors
- 5,684 total stargazers

## [v8.0.2](https://github.com/mdn/browser-compat-data/releases/tag/v8.0.2)

June 5, 2026

### Additions

- `api.Request.destination.text` ([#29745](https://github.com/mdn/browser-compat-data/pull/29745))
- `api.Request.isReloadNavigation` ([#29799](https://github.com/mdn/browser-compat-data/pull/29799))
- `api.SpeechRecognition.available_static.options_parameter` ([#29741](https://github.com/mdn/browser-compat-data/pull/29741))
- `api.SpeechRecognition.available_static.options_parameter.options_langs_parameter` ([#29741](https://github.com/mdn/browser-compat-data/pull/29741))
- `api.SpeechRecognition.available_static.options_parameter.options_processLocally_parameter` ([#29741](https://github.com/mdn/browser-compat-data/pull/29741))
- `api.SpeechRecognition.available_static.options_parameter.options_quality_parameter` ([#29741](https://github.com/mdn/browser-compat-data/pull/29741))
- `api.SpeechRecognition.install_static.options_parameter` ([#29741](https://github.com/mdn/browser-compat-data/pull/29741))
- `api.SpeechRecognition.install_static.options_parameter.options_langs_parameter` ([#29741](https://github.com/mdn/browser-compat-data/pull/29741))
- `api.SpeechRecognition.install_static.options_parameter.options_processLocally_parameter` ([#29741](https://github.com/mdn/browser-compat-data/pull/29741))
- `api.SpeechRecognition.install_static.options_parameter.options_quality_parameter` ([#29741](https://github.com/mdn/browser-compat-data/pull/29741))
- `api.SVGTextPathElement.side` ([#29778](https://github.com/mdn/browser-compat-data/pull/29778))
- `browsers.chrome_android.releases.152` ([#29787](https://github.com/mdn/browser-compat-data/pull/29787))
- `browsers.chrome.releases.152` ([#29787](https://github.com/mdn/browser-compat-data/pull/29787))
- `browsers.deno.releases.2.7.14` ([#29724](https://github.com/mdn/browser-compat-data/pull/29724))
- `browsers.deno.releases.2.7.2` ([#29724](https://github.com/mdn/browser-compat-data/pull/29724))
- `browsers.deno.releases.2.7.6` ([#29724](https://github.com/mdn/browser-compat-data/pull/29724))
- `browsers.deno.releases.2.7.8` ([#29724](https://github.com/mdn/browser-compat-data/pull/29724))
- `browsers.deno.releases.2.8` ([#29724](https://github.com/mdn/browser-compat-data/pull/29724))
- `browsers.edge.releases.152` ([#29803](https://github.com/mdn/browser-compat-data/pull/29803))
- `browsers.opera.releases.134` ([#29769](https://github.com/mdn/browser-compat-data/pull/29769))
- `browsers.webview_android.releases.152` ([#29787](https://github.com/mdn/browser-compat-data/pull/29787))
- `css.at-rules.supports.at-rule` ([#29734](https://github.com/mdn/browser-compat-data/pull/29734))
- `css.properties.background.border-area` ([#29799](https://github.com/mdn/browser-compat-data/pull/29799))
- `css.properties.column-rule-inset-cap-end.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.column-rule-inset-cap-start.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.column-rule-inset-cap.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.column-rule-inset-end.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.column-rule-inset-junction-end.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.column-rule-inset-junction-start.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.column-rule-inset-junction.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.column-rule-inset-start.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.column-rule-inset.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.container-name.name-only_queries` ([#29762](https://github.com/mdn/browser-compat-data/pull/29762))
- `css.properties.container-type.name-only_queries` ([#29762](https://github.com/mdn/browser-compat-data/pull/29762))
- `css.properties.container.name-only_queries` ([#29762](https://github.com/mdn/browser-compat-data/pull/29762))
- `css.properties.flex-flow.balance` ([#29799](https://github.com/mdn/browser-compat-data/pull/29799))
- `css.properties.flex-line-count` ([#29799](https://github.com/mdn/browser-compat-data/pull/29799))
- `css.properties.flex-wrap.balance` ([#29799](https://github.com/mdn/browser-compat-data/pull/29799))
- `css.properties.overscroll-behavior-block.chain` ([#29799](https://github.com/mdn/browser-compat-data/pull/29799))
- `css.properties.overscroll-behavior-inline.chain` ([#29799](https://github.com/mdn/browser-compat-data/pull/29799))
- `css.properties.overscroll-behavior-x.chain` ([#29799](https://github.com/mdn/browser-compat-data/pull/29799))
- `css.properties.overscroll-behavior-y.chain` ([#29799](https://github.com/mdn/browser-compat-data/pull/29799))
- `css.properties.overscroll-behavior.chain` ([#29799](https://github.com/mdn/browser-compat-data/pull/29799))
- `css.properties.row-rule-inset-cap-end.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.row-rule-inset-cap-start.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.row-rule-inset-cap.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.row-rule-inset-end.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.row-rule-inset-junction-end.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.row-rule-inset-junction-start.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.row-rule-inset-junction.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.row-rule-inset-start.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.row-rule-inset.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.rule-inset-cap.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.rule-inset-end.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.rule-inset-junction.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.rule-inset-start.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.rule-inset.overlap-join` ([#29795](https://github.com/mdn/browser-compat-data/pull/29795))
- `css.properties.text-fit` ([#29799](https://github.com/mdn/browser-compat-data/pull/29799))
- `css.properties.text-fit.grow` ([#29799](https://github.com/mdn/browser-compat-data/pull/29799))
- `css.properties.text-fit.none` ([#29799](https://github.com/mdn/browser-compat-data/pull/29799))
- `css.properties.text-fit.shrink` ([#29799](https://github.com/mdn/browser-compat-data/pull/29799))
- `javascript.builtins.Iterator.includes` ([#29746](https://github.com/mdn/browser-compat-data/pull/29746))
- `javascript.statements.import.import_attributes.type_text` ([#29745](https://github.com/mdn/browser-compat-data/pull/29745))
- `webdriver.bidi.emulation.setLocaleOverride.dedicated_and_shared_workers` ([#29786](https://github.com/mdn/browser-compat-data/pull/29786))

### Statistics

- 15 contributors have changed 120 files with 2,908 additions and 382 deletions in 36 commits ([`v8.0.1...v8.0.2`](https://github.com/mdn/browser-compat-data/compare/v8.0.1...v8.0.2))
- 19,806 total features
- 1,254 total contributors
- 5,681 total stargazers

## [v8.0.1](https://github.com/mdn/browser-compat-data/releases/tag/v8.0.1)

May 29, 2026

### Statistics

- 5 contributors have changed 20 files with 478 additions and 130 deletions in 16 commits ([`v8.0.0...v8.0.1`](https://github.com/mdn/browser-compat-data/compare/v8.0.0...v8.0.1))
- 19,752 total features
- 1,251 total contributors
- 5,679 total stargazers

## [v8.0.0](https://github.com/mdn/browser-compat-data/releases/tag/v8.0.0)

May 22, 2026

### Breaking changes

This release introduces **two breaking changes** in the TypeScript definitions. The shape of the published `data.json` has not changed.

**Summary**: The published TypeScript definitions (`types.d.ts`) now fully match the actual shape of the published `data.json`. Two existing types are now stricter.

#### 1. `source_file` is now required on `CompatStatement` ([#29041](https://github.com/mdn/browser-compat-data/pull/29041))

Previously, the `CompatStatement.source_file` property was optional in the TypeScript definitions, even though it is always present in published `data.json` releases (it is generated at build time).

Now, `source_file` is typed as required, matching the actual shape of the data.

**Impact**: You may need to remove checks for a missing `source_file` (e.g. `if (compat.source_file)`).

#### 2. `BrowserStatement.upstream` is narrowed to `UpstreamBrowserName` ([#29041](https://github.com/mdn/browser-compat-data/pull/29041))

Previously, the `BrowserStatement.upstream` property was typed as `BrowserName`, allowing any of the 17 known browser keys.

Now, `upstream` is typed as the new `UpstreamBrowserName`, a subset of `BrowserName` containing only the browsers that other browsers actually derive from: `"chrome" | "chrome_android" | "firefox" | "safari" | "safari_ios"`.

**Impact**: You may need to widen the type when passing `upstream` into functions expecting a full `BrowserName`, or switch on the narrower set.

### Statistics

- 2 contributors have changed 91 files with 1,681 additions and 784 deletions in 1 commit ([`v7.3.17...v8.0.0`](https://github.com/mdn/browser-compat-data/compare/v7.3.17...v8.0.0))
- 19,752 total features
- 1,250 total contributors
- 5,671 total stargazers

## Older Versions

- [v7.x](./release_notes/v7.md)
- [v6.x](./release_notes/v6.md)
- [v5.x](./release_notes/v5.md)
- [v4.x](./release_notes/v4.md)
- [v3.x](./release_notes/v3.md)
- [v2.x](./release_notes/v2.md)
- [v1.x](./release_notes/v1.md)
- [v0.x](./release_notes/v0.md)
