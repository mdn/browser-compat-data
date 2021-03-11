# Release notes

## [v3.2.0](https://github.com/mdn/browser-compat-data/releases/tag/v3.2.0)

March 11, 2021

### Notable changes

- [Support statement objects](https://github.com/mdn/browser-compat-data/blob/v3.2.0/schemas/compat-data-schema.md#the-support_statement-object) may no longer use `false` or `null` values for `version_removed`. Values for `version_removed` are now required to be real version numbers or `true` (removed in some unknown version). This change to the schema codifies a widely-followed practice within existing compatability data. ([#9015](https://github.com/mdn/browser-compat-data/pull/9015))

- The following features were renamed:

  - `api.SVGFECompositeElement.in` is now `api.SVGFECompositeElement.in1`, fixing a misidentified attribute (again). ([#9074](https://github.com/mdn/browser-compat-data/pull/9074), [#9343](https://github.com/mdn/browser-compat-data/pull/9343))
  - `api.SVGTests.hasextension` is now `api.SVGTests.hasExtension`, fixing incorrect capitalization. ([#9387](https://github.com/mdn/browser-compat-data/pull/9387))
  - `api.SVGViewElement.viewtarget` is now `api.SVGViewElement.viewTarget`, fixing incorrect capitalization. ([#9387](https://github.com/mdn/browser-compat-data/pull/9387))

- The following features were removed because they duplicated data under historic names:

  - `api.AuthenticationAssertion`, duplicating `api.AuthenticatorAssertionResponse` ([#9398](https://github.com/mdn/browser-compat-data/pull/9398))
  - `api.ConstrainLong`, duplicating `api.ConstrainULong` ([#9418](https://github.com/mdn/browser-compat-data/pull/9418))
  - `api.LongRange`, duplicating `api.ULongRange` ([#9418](https://github.com/mdn/browser-compat-data/pull/9418))
  - `api.ScopedCredential`, duplicating `api.PublicKeyCredential` ([#9398](https://github.com/mdn/browser-compat-data/pull/9398))
  - `api.ScopedCredentialInfo`, duplicating `api.AuthenticatorResponse` ([#9398](https://github.com/mdn/browser-compat-data/pull/9398))
  - `api.Window.OverconstrainedError`, duplicating `api.OverconstrainedError` ([#9401](https://github.com/mdn/browser-compat-data/pull/9401))

- The following no-longer supported features were removed as irrelevant:

  - `api.PasswordCredential.additionalData` ([#9400](https://github.com/mdn/browser-compat-data/pull/9400))
  - `api.PasswordCredential.idName` ([#9400](https://github.com/mdn/browser-compat-data/pull/9400))
  - `api.PasswordCredential.passwordName` ([#9400](https://github.com/mdn/browser-compat-data/pull/9400))

- The following never-implemented features were removed:

  - `api.PaymentManager.requestPermission` ([#9399](https://github.com/mdn/browser-compat-data/pull/9399))
  - `api.Response.useFinalURL` ([#9386](https://github.com/mdn/browser-compat-data/pull/9386))
  - `api.Window.layoutShift` ([#9388](https://github.com/mdn/browser-compat-data/pull/9388))

### Statistics

- 11 contributors have changed 163 files with 1,288 additions and 1,323 deletions in 27 commits ([`v3.1.3...v3.2.0`](https://github.com/mdn/browser-compat-data/compare/v3.1.3...v3.2.0))
- 13,031 total features
- 769 total contributors
- 3,266 total stargazers

## [v3.1.3](https://github.com/mdn/browser-compat-data/releases/tag/v3.1.3)

March 4, 2021

### Notable changes

- `api.SVGFECompositeElement.in` replaces `api.SVGFECompositeElement.in1`, fixing a misidentified attribute ([#9074](https://github.com/mdn/browser-compat-data/pull/9074)).

### Statistics

- 13 contributors have changed 87 files with 771 additions and 480 deletions in 28 commits ([`v3.1.2...v3.1.3`](https://github.com/mdn/browser-compat-data/compare/v3.1.2...v3.1.3))
- 13,028 total features
- 767 total contributors
- 3,253 total stargazers

## [v3.1.2](https://github.com/mdn/browser-compat-data/releases/tag/v3.1.2)

- The following withdrawn features have been removed as irrelevant:

  - `api.HTMLFormElement.requestAutocomplete` ([#9232](https://github.com/mdn/browser-compat-data/pull/9232))
  - `api.XMLHttpRequest.sendAsBinary` ([#9239](https://github.com/mdn/browser-compat-data/pull/9239))
  - `html.elements.script.type.version_parameter` ([#9206](https://github.com/mdn/browser-compat-data/pull/9206))

- The following never-supported WebExtensions features have been removed ([#6960](https://github.com/mdn/browser-compat-data/pull/6960)):

  - `webextensions.manifest.content_security_policy.isolated_world`
  - `webextensions.manifest.content_security_policy.sandbox`
  - `webextensions.match_patterns.scheme.ftps`

- The following never-supported MathML features have been removed ([#6958](https://github.com/mdn/browser-compat-data/pull/6958)):

  - `mathml.elements.math.overflow`
  - `mathml.elements.mglyph`
  - `mathml.elements.mlabeledtr`
  - `mathml.elements.mo.form`
  - `mathml.elements.mo.largeop`
  - `mathml.elements.mspace.linebreak`
  - `mathml.elements.mstyle.decimalpoint`
  - `mathml.elements.mstyle.infixbreakstyle`
  - `mathml.elements.mtable.alignmentscope`
  - `mathml.elements.mtable.columnwidth`
  - `mathml.elements.mtable.equalcolumns`
  - `mathml.elements.mtable.equalrows`
  - `mathml.elements.mtable.groupalign`
  - `mathml.elements.mtable.minlabelspacing`
  - `mathml.elements.mtable.side`
  - `mathml.elements.mtd.groupalign`
  - `mathml.elements.mtr.groupalign`

- The following constants have been removed, under the recently-adopted [_Constants_ guideline](https://github.com/mdn/browser-compat-data/blob/master/docs/data-guidelines.md#constants) ([#9195](https://github.com/mdn/browser-compat-data/pull/9195)):

  - `api.KeyboardEvent.DOM_KEY_LOCATION_LEFT`
  - `api.KeyboardEvent.DOM_KEY_LOCATION_NUMPAD`
  - `api.KeyboardEvent.DOM_KEY_LOCATION_RIGHT`
  - `api.KeyboardEvent.DOM_KEY_LOCATION_STANDARD`

**Statistics**

- 19 contributors have changed 122 files with 4,549 additions and 2,365 deletions in 43 commits ([`v3.1.1...v3.1.2`](https://github.com/mdn/browser-compat-data/compare/v3.1.1...v3.1.2))
- 13,024 total features
- 765 total contributors
- 3,248 total stargazers

## [v3.1.1](https://github.com/mdn/browser-compat-data/releases/tag/v3.1.1)

February 18, 2021

**Notable changes**

- `css.properties.grid-template-rows.masonry` feature was moved from its previously erroneous entry as `css.properties.masonry`. ([#9078](https://github.com/mdn/browser-compat-data/pull/9078))

- The following mixin features have been migrated to their exposed interfaces (or deduplicated, where the exposed interface data already existed):

  | Former mixin (old)                                           | Exposed interface (new)                                                                                             |
  | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
  | `api.DocumentFragment.methods`                               | (removed, duplicate)                                                                                                |
  | `api.DocumentFragment.properties`                            | (removed, duplicate)                                                                                                |
  | `api.DocumentOrShadowRoot.activeElement`                     | `api.Document.activeElement`<br>`api.ShadowRoot.activeElement`                                                      |
  | `api.DocumentOrShadowRoot.adoptedStyleSheets`                | `api.Document.adoptedStyleSheets`<br>`api.ShadowRoot.adoptedStyleSheets`                                            |
  | `api.DocumentOrShadowRoot.caretPositionFromPoint`            | `api.Document.caretPositionFromPoint`<br>`api.ShadowRoot.caretPositionFromPoint`                                    |
  | `api.DocumentOrShadowRoot.elementFromPoint`                  | `api.Document.elementFromPoint`<br>`api.ShadowRoot.elementFromPoint`                                                |
  | `api.DocumentOrShadowRoot.elementsFromPoint`                 | `api.Document.elementsFromPoint`<br>`api.ShadowRoot.elementsFromPoint`                                              |
  | `api.DocumentOrShadowRoot.fullscreenElement`                 | `api.Document.fullscreenElement`<br>`api.ShadowRoot.fullscreenElement`                                              |
  | `api.DocumentOrShadowRoot.getSelection`                      | `api.Document.getSelection`<br>`api.ShadowRoot.getSelection`                                                        |
  | `api.DocumentOrShadowRoot.pointerLockElement`                | `api.Document.pointerLockElement`<br>`api.ShadowRoot.pointerLockElement`                                            |
  | `api.DocumentOrShadowRoot.styleSheets`                       | `api.Document.styleSheets`<br>`api.ShadowRoot.styleSheets`                                                          |
  | `api.DocumentOrShadowRoot`                                   | (removed)                                                                                                           |
  | `api.ParentNode.append`                                      | `api.Document.append` <br> `api.DocumentFragment.append` <br> `api.Element.append`                                  |
  | `api.ParentNode.childElementCount.document_documentfragment` | (removed, duplicate)                                                                                                |
  | `api.ParentNode.childElementCount`                           | `api.Document.childElementCount` <br> `api.DocumentFragment.childElementCount` <br> `api.Element.childElementCount` |
  | `api.ParentNode.children.document_documentfragment`          | (removed, duplicate)                                                                                                |
  | `api.ParentNode.children.svgelement`                         | (removed, duplicate)                                                                                                |
  | `api.ParentNode.children`                                    | `api.Document.children` <br> `api.DocumentFragment.children` <br> `api.Element.children`                            |
  | `api.ParentNode.document_documentfragment`                   | (removed, duplicate)                                                                                                |
  | `api.ParentNode.firstElementChild.document_documentfragment` | (removed, duplicate)                                                                                                |
  | `api.ParentNode.firstElementChild`                           | `api.Document.firstElementChild` <br> `api.DocumentFragment.firstElementChild` <br> `api.Element.firstElementChild` |
  | `api.ParentNode.lastElementChild.document_documentfragment`  | (removed, duplicate)                                                                                                |
  | `api.ParentNode.lastElementChild`                            | `api.Document.lastElementChild` <br> `api.DocumentFragment.lastElementChild` <br> `api.Element.lastElementChild`    |
  | `api.ParentNode.prepend`                                     | `api.Document.prepend` <br> `api.DocumentFragment.prepend` <br> `api.Element.prepend`                               |
  | `api.ParentNode.querySelector`                               | (removed, duplicate)                                                                                                |
  | `api.ParentNode.querySelectorAll`                            | (removed, duplicate)                                                                                                |
  | `api.ParentNode.replaceChildren`                             | `api.Document.replaceChildren` <br> `api.DocumentFragment.replaceChildren` <br> `api.Element.replaceChildren`       |
  | `api.ParentNode`                                             | (removed)                                                                                                           |
  | `api.ShadowRoot.documentorshadowroot`                        | (removed, duplicate)                                                                                                |

  See [#9045](https://github.com/mdn/browser-compat-data/pull/9045) and [#9064](https://github.com/mdn/browser-compat-data/pull/9064) for details.

- The following never-supported features were removed as irrelevant:

  - `api.Window.clipboardchange_event` ([#6942](https://github.com/mdn/browser-compat-data/pull/6942))
  - `api.Window.getAttention` ([#6942](https://github.com/mdn/browser-compat-data/pull/6942))
  - `api.Window.getAttentionWithCycleCount` ([#6942](https://github.com/mdn/browser-compat-data/pull/6942))
  - `svg.elements.textPath.method` ([#6959](https://github.com/mdn/browser-compat-data/pull/6959))

- The subfeatures of `api.Element.getBoundingClientRect` (`height`, `width`, `x`, and `y`) were removed because they duplicated the subfeatures of `api.DOMRectReadOnly`. ([#9061](https://github.com/mdn/browser-compat-data/pull/9061))

**Statistics**

- 13 contributors have changed 77 files with 4,859 additions and 3,148 deletions in 57 commits ([`v3.1.0...v3.1.1`](https://github.com/mdn/browser-compat-data/compare/v3.1.0...v3.1.1))
- 12,975 total features
- 759 total contributors
- 3,240 total stargazers

## [v3.1.0](https://github.com/mdn/browser-compat-data/releases/tag/v3.1.0)

February 11, 2021

**Notable changes**

- We've adopted [a new data guideline for interface mixins](https://github.com/mdn/browser-compat-data/blob/master/docs/data-guidelines.md#mixins). From v3.1.0, new data for [interface mixins](https://heycam.github.io/webidl/#idl-interface-mixins) will be represented as subfeatures of their exposed interfaces, instead of fictitious mixin interfaces.

  For example, `HTMLHyperlinkElementUtils` attributes are now represented on `HTMLAnchorElement` and `HTMLAreaElement` directly.

  Existing interface mixins data will be replaced as part of our regular release process. The release notes will describe specific changes as they happen. ([#9016](https://github.com/mdn/browser-compat-data/pull/9016))

- The following mixin features have been migrated to their exposed interfaces ([#8933](https://github.com/mdn/browser-compat-data/pull/8933), [#9046](https://github.com/mdn/browser-compat-data/pull/9046), [#9048](https://github.com/mdn/browser-compat-data/pull/9048)):

  | Old                                      | New                                                                   |
  | ---------------------------------------- | --------------------------------------------------------------------- |
  | `api.CredentialUserData.iconURL`         | `api.FederatedCredential.iconURL`<br>`api.PasswordCredential.iconURL` |
  | `api.CredentialUserData.name`            | `api.FederatedCredential.name`<br>`api.PasswordCredential.name`       |
  | `api.HTMLHyperlinkElementUtils.href`     | `api.HTMLAnchorElement.href`<br>`api.HTMLAreaElement.href`            |
  | `api.HTMLHyperlinkElementUtils.origin`   | `api.HTMLAnchorElement.origin`<br>`api.HTMLAreaElement.origin`        |
  | `api.HTMLHyperlinkElementUtils.protocol` | `api.HTMLAnchorElement.protocol`<br>`api.HTMLAreaElement.protocol`    |
  | `api.HTMLHyperlinkElementUtils.username` | `api.HTMLAnchorElement.username`<br>`api.HTMLAreaElement.username`    |
  | `api.HTMLHyperlinkElementUtils.password` | `api.HTMLAnchorElement.password`<br>`api.HTMLAreaElement.password`    |
  | `api.HTMLHyperlinkElementUtils.host`     | `api.HTMLAnchorElement.host`<br>`api.HTMLAreaElement.host`            |
  | `api.HTMLHyperlinkElementUtils.hostname` | `api.HTMLAnchorElement.hostname`<br>`api.HTMLAreaElement.hostname`    |
  | `api.HTMLHyperlinkElementUtils.port`     | `api.HTMLAnchorElement.port`<br>`api.HTMLAreaElement.port`            |
  | `api.HTMLHyperlinkElementUtils.pathname` | `api.HTMLAnchorElement.pathname`<br>`api.HTMLAreaElement.pathname`    |
  | `api.HTMLHyperlinkElementUtils.search`   | `api.HTMLAnchorElement.search`<br>`api.HTMLAreaElement.search`        |
  | `api.HTMLHyperlinkElementUtils.hash`     | `api.HTMLAnchorElement.hash`<br>`api.HTMLAreaElement.hash`            |
  | `api.Slottable.assignedSlot`             | `api.Element.assignedSlot`<br>`api.Text.assignedSlot`                 |

- `api.Credential.name` was removed as irrelevant ([#9046](https://github.com/mdn/browser-compat-data/pull/9046)).

- `css.selectors.-webkit-autofill` has been renamed to `css.selectors.autofill` to reflect the standardized name ([#8877](https://github.com/mdn/browser-compat-data/pull/8877))

**Statistics**

- 10 contributors have changed 49 files with 1,534 additions and 644 deletions in 37 commits ([`v3.0.6...v3.1.0`](https://github.com/mdn/browser-compat-data/compare/v3.0.6...v3.1.0))
- 12,972 total features
- 758 total contributors
- 3,234 total stargazers

## [v3.0.6](https://github.com/mdn/browser-compat-data/releases/tag/v3.0.6)

February 4, 2021

**Notable changes**

- `api.WEBGL_color_buffer_float.RGB32F_EXT`, a constant, was removed following the [_Constants_ data guideline](https://github.com/mdn/browser-compat-data/blob/master/docs/data-guidelines.md#constants) ([#8934](https://github.com/mdn/browser-compat-data/pull/8934))

**Statistics**

- 17 contributors have changed 90 files with 939 additions and 446 deletions in 56 commits ([`v3.0.5...v3.0.6`](https://github.com/mdn/browser-compat-data/compare/v3.0.5...v3.0.6))
- 12,955 total features
- 757 total contributors
- 3,223 total stargazers

## [v3.0.5](https://github.com/mdn/browser-compat-data/releases/tag/v3.0.5)

January 28, 2021

**Notable changes**

- `html.elements.command`, never implemented, was removed as irrelevant ([#8825](https://github.com/mdn/browser-compat-data/issues/8825))
- `html.elements.element`, never implemented, was removed as irrelevant ([#8826](https://github.com/mdn/browser-compat-data/issues/8826))

**Statistics**

- 15 contributors have changed 82 files with 294 additions and 524 deletions in 20 commits ([`v3.0.4...v3.0.5`](https://github.com/mdn/browser-compat-data/compare/v3.0.4...v3.0.5))
- 12,951 total features
- 753 total contributors
- 3,211 total stargazers

## [v3.0.4](https://github.com/mdn/browser-compat-data/releases/tag/v3.0.4)

January 21, 2021

**Statistics**

- 17 contributors have changed 150 files with 1,521 additions and 310 deletions in 36 commits ([`v3.0.3...v3.0.4`](https://github.com/mdn/browser-compat-data/compare/v3.0.3...v3.0.4))
- 12,958 total features
- 749 total contributors
- 3,206 total stargazers

## [v3.0.3](https://github.com/mdn/browser-compat-data/releases/tag/v3.0.3)

January 14, 2021

**Notable changes**

- `api.CharacterData.ChildNode` has been removed as a duplicate of `api.ChildNode` ([#8052](https://github.com/mdn/browser-compat-data/issues/8052))
- `api.PaymentRequest.paymentAddress` has been renamed to `api.PaymentRequest.shippingAddress` to reflect it's specified name ([#7669](https://github.com/mdn/browser-compat-data/issues/7669))
- `api.WorkerGlobalScope.close` has been removed as a duplicate of `api.DedicatedWorkerGlobalScope.close` and `api.SharedWorkerGlobalScope.close`([#7363](https://github.com/mdn/browser-compat-data/issues/7363))
- `html.manifest.serviceworker`, never implemented, was removed as irrelevant ([#8069](https://github.com/mdn/browser-compat-data/issues/8069))

**Statistics**

- 16 contributors have changed 56 files with 1,807 additions and 756 deletions in 49 commits ([`v3.0.2...v3.0.3`](https://github.com/mdn/browser-compat-data/compare/v3.0.2...v3.0.3))
- 12,944 total features
- 747 total contributors
- 3,202 total stargazers

## [v3.0.2](https://github.com/mdn/browser-compat-data/releases/tag/v3.0.2)

January 7, 2021

**Notable changes**

- Removed `api.UIEvent.cancelBubble` as a duplicate of `api.Event.cancelBubble` ([#7350](https://github.com/mdn/browser-compat-data/issues/7350), [#7360](https://github.com/mdn/browser-compat-data/issues/7360))
- Removed `Navigator` mixin `worker_support` features `api.NavigatorConcurrentHardware.worker_support`, `api.NavigatorLanguage.worker_support`, and `api.NavigatorOnLine.worker_support`, as redundant to `api.Navigator` data ([#8277](https://github.com/mdn/browser-compat-data/issues/8277))
- Removed `api.CanvasRenderingContext2D.addHitRegion` (and its descendants), `api.CanvasRenderingContext2D.clearHitRegions`, and `api.CanvasRenderingContext2D.addHitRegion.control` as irrelevant ([#8442](https://github.com/mdn/browser-compat-data/issues/8442))
- Removed `api.HTMLElement.dropzone` and `html.global_attributes.dropzone` as irrelevant ([#8095](https://github.com/mdn/browser-compat-data/issues/8095))
- Removed `api.NDEFWriter` as irrelevant ([#8459](https://github.com/mdn/browser-compat-data/issues/8459))
- A new data guideline has been adopted: no new constants features will be accepted into BCD ([#8062](https://github.com/mdn/browser-compat-data/issues/8062))

**Statistics**

- 19 contributors have changed 459 files with 24,184 additions and 8,900 deletions in 530 commits ([`v3.0.1...v3.0.2`](https://github.com/mdn/browser-compat-data/compare/v3.0.1...v3.0.2))
- 12,922 total features
- 743 total contributors
- 3,197 total stargazers

## [v3.0.1](https://github.com/mdn/browser-compat-data/releases/tag/v3.0.1)

December 17, 2020

**Notable changes**

- The feature `api.HTMLInputElement.weight` was removed since it probably never existed and was replaced with `api.HTMLInputElement.width` which does ([#7671](https://github.com/mdn/browser-compat-data/issues/7671))

**Statistics**

- 12 contributors have changed 268 files with 18,717 additions and 4,315 deletions in 303 commits ([`v3.0.0...v3.0.1`](https://github.com/mdn/browser-compat-data/compare/v3.0.0...v3.0.1))
- 12,567 total features
- 738 total contributors
- 3,187 total stargazers

## [v3.0.0](https://github.com/mdn/browser-compat-data/releases/tag/v3.0.0)

December 10, 2020

Version 3.0.0 makes some potentially-breaking changes to improve the consistency and quality of the data. Highlights:

- UC and QQ browsers were removed.
- A public API, in addition to the schema, was formalized for better adherence to Semantic Versioning.
- Node.js's data was made more consistent with this project's other engines. Node.js data now starts at 0.10.0, as if it were Node.js's first major release, and Node.js version strings consistently use the full version value (for example, `0.12.0` instead of `0.12`).

Review the changes below for details.

**Notable changes**

- **(Breaking)** UC and QQ browsers were removed from the schema and support data, due to limited coverage and contribution activity. ([#7240](https://github.com/mdn/browser-compat-data/issues/7240))
- Node.js data with releases before `0.10.0` were increased to that version, as if this were the first major, stable release (though the true story is rather more complex). Special thanks to the [Node.js Release Working Group](https://github.com/nodejs/Release) for their insight into Node.js's history. ([#7562](https://github.com/mdn/browser-compat-data/issues/7562); [#6861](https://github.com/mdn/browser-compat-data/issues/6861))
- Node.js versions `0.10` and `0.12` were replaced by their full SemVer values, `0.10.0` and `0.12.0`, respectively. ([#7491](https://github.com/mdn/browser-compat-data/issues/7491), [#7492](https://github.com/mdn/browser-compat-data/issues/7492))
- Many high-level namespaces in the package were [documented](https://github.com/mdn/browser-compat-data#package-contents) and [a formal Semantic Versioning policy was introduced](https://github.com/mdn/browser-compat-data#semantic-versioning-policy). ([#7615](https://github.com/mdn/browser-compat-data/issues/7615))
- Data in `javascript` requires version number data; the `javascript` data no longer contains any `null` or `true` values. ([#7607](https://github.com/mdn/browser-compat-data/issues/7607))
- [_Addition of browsers_](https://github.com/mdn/browser-compat-data/blob/master/docs/data-guidelines.md#addition-of-browsers) and [_Removal of browsers_](https://github.com/mdn/browser-compat-data/blob/master/docs/data-guidelines.md#removal-of-browsers) data guidelines were adopted to document requirements to add or remove a browser or engine from package. ([#7244](https://github.com/mdn/browser-compat-data/issues/7244))
- The following features were removed as irrelevant:
  - `api.HTMLAnchorElement.media` ([#7538](https://github.com/mdn/browser-compat-data/issues/7538))
  - `api.HTMLAreaElement.hreflang` ([#7539](https://github.com/mdn/browser-compat-data/issues/7539))
  - `api.HTMLAreaElement.media` ([#7538](https://github.com/mdn/browser-compat-data/issues/7538))
  - `api.HTMLAreaElement.type` ([#7540](https://github.com/mdn/browser-compat-data/issues/7540))
  - `api.HTMLFrameSetElement.onlanguage` ([#7483](https://github.com/mdn/browser-compat-data/issues/7483))
  - `api.Node.baseURIObject` ([#7520](https://github.com/mdn/browser-compat-data/issues/7520))
  - `api.Node.nodePrincipal` ([#7521](https://github.com/mdn/browser-compat-data/issues/7521))
  - `api.Node.rootNode` ([#7524](https://github.com/mdn/browser-compat-data/issues/7524))
  - `api.OverconstrainedError.message` ([#7616](https://github.com/mdn/browser-compat-data/issues/7616))
  - `api.OverconstrainedError.name` ([#7616](https://github.com/mdn/browser-compat-data/issues/7616))
  - `css.at-rules.viewport.height` ([#7514](https://github.com/mdn/browser-compat-data/issues/7514))
  - `css.at-rules.viewport.max-height` ([#7514](https://github.com/mdn/browser-compat-data/issues/7514))
  - `css.at-rules.viewport.max-width` ([#7514](https://github.com/mdn/browser-compat-data/issues/7514))
  - `css.at-rules.viewport.max-zoom` ([#7514](https://github.com/mdn/browser-compat-data/issues/7514))
  - `css.at-rules.viewport.min-height` ([#7514](https://github.com/mdn/browser-compat-data/issues/7514))
  - `css.at-rules.viewport.min-width` ([#7514](https://github.com/mdn/browser-compat-data/issues/7514))
  - `css.at-rules.viewport.min-zoom` ([#7514](https://github.com/mdn/browser-compat-data/issues/7514))
  - `css.at-rules.viewport.orientation` ([#7514](https://github.com/mdn/browser-compat-data/issues/7514))
  - `css.at-rules.viewport.user-zoom` ([#7514](https://github.com/mdn/browser-compat-data/issues/7514))
  - `css.at-rules.viewport.viewport-fit` ([#7514](https://github.com/mdn/browser-compat-data/issues/7514))
  - `css.at-rules.viewport.width` ([#7514](https://github.com/mdn/browser-compat-data/issues/7514))
  - `css.at-rules.viewport.zoom` ([#7514](https://github.com/mdn/browser-compat-data/issues/7514))
- The following features were removed as duplicates of `api.Accelerometer.{x,y,z}` ([#7314](https://github.com/mdn/browser-compat-data/issues/7314)):
  - `api.LinearAccelerationSensor.x`
  - `api.LinearAccelerationSensor.y`
  - `api.LinearAccelerationSensor.z`
- The following features were renamed to correct capitalization or spelling:
  - `api.HTMLElement.formEncType` to `api.HTMLElement.formEnctype` ([#7471](https://github.com/mdn/browser-compat-data/issues/7471))
  - `api.HTMLImageElement.lowSrc` to `api.HTMLImageElement.lowsrc` ([#7472](https://github.com/mdn/browser-compat-data/issues/7472))
  - `api.HTMLMarqueeElement.bgcolor` to `api.HTMLMarqueeElement.bgColor` ([#7473](https://github.com/mdn/browser-compat-data/issues/7473))
  - `api.HTMLMarqueeElement.scrollamount` to `api.HTMLMarqueeElement.scrollAmount` ([#7474](https://github.com/mdn/browser-compat-data/issues/7474))
  - `api.HTMLMarqueeElement.scrolldelay` to `api.HTMLMarqueeElement.scrollDelay` ([#7475](https://github.com/mdn/browser-compat-data/issues/7475))
  - `api.HTMLMarqueeElement.truespeed` to `api.HTMLMarqueeElement.trueSpeed` ([#7508](https://github.com/mdn/browser-compat-data/issues/7508))
  - `javascript.operators.substraction_assignment` to `javascript.operators.subtraction_assignment` ([#7621](https://github.com/mdn/browser-compat-data/issues/7621))
- `api.NDEFReader.prototype.onerror` was renamed to `api.NDEFReader.prototype.onreadingerror` to reflect a specification change ([#7613](https://github.com/mdn/browser-compat-data/issues/7613))
- `css.properties.word-wrap` was removed as a duplicate of `css.properties.overflow-wrap`'s `alternative_name` data ([#7387](https://github.com/mdn/browser-compat-data/issues/7387))
- `css.selectors.-moz-ui-invalid` was renamed to `css.properties.user-invalid` to reflect the standard name ([#7431](https://github.com/mdn/browser-compat-data/issues/7431))

**Statistics**

- 30 contributors have changed 393 files with 6,481 additions and 5,881 deletions in 156 commits ([`v2.0.7...v3.0.0`](https://github.com/mdn/browser-compat-data/compare/v2.0.7...v3.0.0))
- 12,274 total features
- 734 total contributors
- 3,172 total stargazers

## [v2.0.7](https://github.com/mdn/browser-compat-data/releases/tag/v2.0.7)

November 19, 2020

**Notable changes**

- Internet Explorer version `"≤6"` is now an accepted value, to reflect testing limitations for older versions ([#7337](https://github.com/mdn/browser-compat-data/issues/7337))
- The following features were [removed as irrelevant](https://github.com/mdn/browser-compat-data/blob/master/docs/data-guidelines.md#removal-of-irrelevant-features):
  - `api.MediaQueryListListener` ([#7210](https://github.com/mdn/browser-compat-data/issues/7210))
  - `api.IDBVersionChangeRequest.setVersion` ([#6934](https://github.com/mdn/browser-compat-data/issues/6934))
  - `api.IDBVersionChangeRequest` ([#7411](https://github.com/mdn/browser-compat-data/issues/7411))
  - `api.SVGMeshElement` ([#6941](https://github.com/mdn/browser-compat-data/issues/6941))
  - `api.WebAuthentication` ([#6860](https://github.com/mdn/browser-compat-data/issues/6860))

**Statistics**

- 15 contributors have changed 175 files with 2,109 additions and 1,545 deletions in 41 commits ([`v2.0.6...v2.0.7`](https://github.com/mdn/browser-compat-data/compare/v2.0.6...v2.0.7))
- 12,246 total features
- 727 total contributors
- 3,130 total stargazers

## [v2.0.6](https://github.com/mdn/browser-compat-data/releases/tag/v2.0.6)

November 12, 2020

**Notable changes**

- iOS Safari version "≤3" is now an accepted value, to reflect testing limitations for older versions ([#7345](https://github.com/mdn/browser-compat-data/issues/7345))
- `api.MediaKeyStatusMap.iterator` was renamed to `api.MediaKeyStatusMap.@@iterator` ([#7315](https://github.com/mdn/browser-compat-data/issues/7315))
- The following features duplicating `api.HTMLElement.accessKey` were removed ([#7309](https://github.com/mdn/browser-compat-data/issues/7309)):
  - `api.HTMLAnchorElement.accessKey`
  - `api.HTMLAreaElement.accessKey`
  - `api.HTMLButtonElement.accessKey`
- The following features duplicating `api.HTMLElement.tabindex` were removed ([#7310](https://github.com/mdn/browser-compat-data/issues/7310)):
  - `api.HTMLAnchorElement.tabindex`
  - `api.HTMLAreaElement.tabIndex`
  - `api.HTMLButtonElement.tabIndex`
- The following never-supported features were removed as irrelevant:
  - `api.Node.outerText` ([#7316](https://github.com/mdn/browser-compat-data/issues/7316))
  - `api.HTMLButtonElement.menu` ([#6931](https://github.com/mdn/browser-compat-data/issues/6931))
  - `api.HTMLIFrameElement.setNfcFocus` ([#6931](https://github.com/mdn/browser-compat-data/issues/6931))
  - `api.HTMLIsIndexElement` ([#6931](https://github.com/mdn/browser-compat-data/issues/6931))
  - `api.HTMLIsIndexElement.form` ([#6931](https://github.com/mdn/browser-compat-data/issues/6931))
  - `api.HTMLIsIndexElement.prompt` ([#6931](https://github.com/mdn/browser-compat-data/issues/6931))
  - `api.HTMLMenuItemElement` ([#6931](https://github.com/mdn/browser-compat-data/issues/6931))
  - `api.HTMLMenuItemElement.command` ([#6931](https://github.com/mdn/browser-compat-data/issues/6931))
  - `api.HTMLTableElement.sortable` ([#6931](https://github.com/mdn/browser-compat-data/issues/6931))
  - `api.HTMLTableElement.stopSorting` ([#6931](https://github.com/mdn/browser-compat-data/issues/6931))
  - `api.HTMLTableElement.sortable` ([#6931](https://github.com/mdn/browser-compat-data/issues/6931))
  - `css.properties.azimuth` ([#6931](https://github.com/mdn/browser-compat-data/issues/6931))
  - `css.properties.break-after.region_context` ([#6961](https://github.com/mdn/browser-compat-data/issues/6961))
  - `css.properties.break-before.region_context` ([#6961](https://github.com/mdn/browser-compat-data/issues/6961))
  - `css.properties.break-inside.region_context` ([#6961](https://github.com/mdn/browser-compat-data/issues/6961))

**Statistics**

- 18 contributors have changed 113 files with 1,428 additions and 2,048 deletions in 52 commits ([`v2.0.5...v2.0.6`](https://github.com/mdn/browser-compat-data/compare/v2.0.5...v2.0.6))
- 12,247 total features
- 725 total contributors
- 3,115 total stargazers

## [v2.0.5](https://github.com/mdn/browser-compat-data/releases/tag/v2.0.5)

November 5, 2020

**Notable changes**

- Safari version `"≤4"` is now an accepted value, to reflect testing limitations for older versions ([#6915](https://github.com/mdn/browser-compat-data/issues/6915))
- The following features have been removed:
  - `api.Document.domConfig` because it has been removed from all browsers two or more years ago ([#6930](https://github.com/mdn/browser-compat-data/issues/6930))
  - `api.DOMConfiguration` and its descendants because it was never implemented ([#6930](https://github.com/mdn/browser-compat-data/issues/6930))
  - `api.DOMImplementationList` and its descendants because it was never implemented ([#6930](https://github.com/mdn/browser-compat-data/issues/6930))
  - `api.HTMLInputElement.mozGetFileNameArray` because it was never exposed to the Web ([#6982](https://github.com/mdn/browser-compat-data/issues/6982))
  - `api.HTMLInputElement.mozSetFileArray` because it was never exposed to the Web ([#6982](https://github.com/mdn/browser-compat-data/issues/6982))
  - `api.HTMLInputElement.mozSetFileNameArray` because it was never exposed to the Web ([#6982](https://github.com/mdn/browser-compat-data/issues/6982))

**Statistics**

- 18 contributors have changed 230 files with 7,273 additions and 5,019 deletions in 97 commits ([`v2.0.4...v2.0.5`](https://github.com/mdn/browser-compat-data/compare/v2.0.4...v2.0.5))
- 12,264 total features
- 722 total contributors
- 3,103 total stargazers

## [v2.0.4](https://github.com/mdn/browser-compat-data/releases/tag/v2.0.4)

October 29, 2020

**Notable changes**

- Data about how the aspect ratio is computed for some HTML elements has been moved from the `css.properties.aspect-ratio.internal-value` feature to `aspect_ratio_computed_from_attributes` subfeatures of the affected HTML elements ([#6918](https://github.com/mdn/browser-compat-data/issues/6918))
- The following features have been removed because they were never implemented:
  - `api.BudgetService.getBudget` ([#6924](https://github.com/mdn/browser-compat-data/issues/6924))
  - `api.BudgetService.getCost` ([#6924](https://github.com/mdn/browser-compat-data/issues/6924))
  - `api.BudgetState` ([#6924](https://github.com/mdn/browser-compat-data/issues/6924))
  - `api.DocumentOrShadowRoot.nodeFromPoint` ([#6929](https://github.com/mdn/browser-compat-data/issues/6929))
  - `api.DocumentOrShadowRoot.nodesFromPoint` ([#6929](https://github.com/mdn/browser-compat-data/issues/6929))
  - `api.Window.restore` ([#6987](https://github.com/mdn/browser-compat-data/issues/6987))

**Statistics**

- 22 contributors have changed 172 files with 4,225 additions and 2,772 deletions in 177 commits ([`v2.0.3...v2.0.4`](https://github.com/mdn/browser-compat-data/compare/v2.0.3...v2.0.4))
- 12,266 total features
- 721 total contributors
- 3,087 total stargazers

## [v1.1.2](https://github.com/mdn/browser-compat-data/releases/tag/v1.1.2)

October 29, 2020

**This is the final release under the name `mdn-browser-compat-data`.**
This package is now published as `@mdn/browser-compat-data`. For more information, read _[Upgrading from `mdn-browser-compat-data` 1.1 to `@mdn/browser-compat-data` 2.0.x](https://github.com/mdn/browser-compat-data/blob/v1.1.2/UPGRADE-2.0.x.md)_.

**Notable changes**

- Data about how the aspect ratio is computed for some HTML elements has been moved from the `css.properties.aspect-ratio.internal-value` feature to `aspect_ratio_computed_from_attributes` subfeatures of the affected HTML elements ([#6918](https://github.com/mdn/browser-compat-data/issues/6918))
- The following features have been removed because they were never implemented:
  - `api.BudgetService.getBudget` ([#6924](https://github.com/mdn/browser-compat-data/issues/6924))
  - `api.BudgetService.getCost` ([#6924](https://github.com/mdn/browser-compat-data/issues/6924))
  - `api.BudgetState` ([#6924](https://github.com/mdn/browser-compat-data/issues/6924))
  - `api.DocumentOrShadowRoot.nodeFromPoint` ([#6929](https://github.com/mdn/browser-compat-data/issues/6929))
  - `api.DocumentOrShadowRoot.nodesFromPoint` ([#6929](https://github.com/mdn/browser-compat-data/issues/6929))
  - `api.Window.restore` ([#6987](https://github.com/mdn/browser-compat-data/issues/6987))

**Statistics**

- 22 contributors have changed 169 files with 4,226 additions and 2,883 deletions in 174 commits ([`v1.1.1...v1.1.2`](https://github.com/mdn/browser-compat-data/compare/v1.1.1...v1.1.2))
- 12,266 total features
- 721 total contributors
- 3,087 total stargazers

## [v2.0.3](https://github.com/mdn/browser-compat-data/releases/tag/v2.0.3)

October 15, 2020

**Statistics**

- 14 contributors have changed 51 files with 1,623 additions and 1,053 deletions in 51 commits ([`v2.0.2...v2.0.3`](https://github.com/mdn/browser-compat-data/compare/v2.0.2...v2.0.3))
- 12,246 total features
- 710 total contributors
- 3,049 total stargazers

## [v1.1.1](https://github.com/mdn/browser-compat-data/releases/tag/v1.1.1)

October 15, 2020

**Deprecation notice**
This package is now published as `@mdn/browser-compat-data`. For more information, read _[Upgrading from `mdn-browser-compat-data` 1.1 to `@mdn/browser-compat-data` 2.0.x](https://github.com/mdn/browser-compat-data/blob/v1.1.1/UPGRADE-2.0.x.md)_.

**Statistics**

- 14 contributors have changed 52 files with 1,624 additions and 1,054 deletions in 49 commits ([`v1.1.0...v1.1.1`](https://github.com/mdn/browser-compat-data/compare/v1.1.0...v1.1.1))
- 12,246 total features
- 710 total contributors
- 3,049 total stargazers

## [v2.0.2](https://github.com/mdn/browser-compat-data/releases/tag/v2.0.2)

October 8, 2020

**Notable changes**

- Feature moves and removals:
  - `api.DOMTokenList.remove_whitespace_and_duplicates` has been split into `api.DOMTokenList.remove_duplicates` and `api.DOMTokenList.trim_whitespace` ([#6691](https://github.com/mdn/browser-compat-data/issues/6691))
  - `api.AudioContext.createConstantSource` was removed because it duplicated `api.BaseAudioContext.createConstantSource` ([#6799](https://github.com/mdn/browser-compat-data/issues/6799))
  - `api.Document.contains` was removed because it duplicated `api.Node.contains` ([#6850](https://github.com/mdn/browser-compat-data/issues/6850))

**Statistics**

- 10 contributors have changed 55 files with 1,734 additions and 1,495 deletions in 42 commits ([`v2.0.1...v2.0.2`](https://github.com/mdn/browser-compat-data/compare/v2.0.1...v2.0.2))
- 12,243 total features
- 706 total contributors
- 3,031 total stargazers

## [v1.1.0](https://github.com/mdn/browser-compat-data/releases/tag/v1.1.0)

October 8, 2020

**Notice**

This package is now published as `@mdn/browser-compat-data`. For more information, read _[Upgrading from `mdn-browser-compat-data` 1.1 to `@mdn/browser-compat-data` 2.0.x](https://github.com/mdn/browser-compat-data/blob/v1.1.0/UPGRADE-2.0.x.md)_.

**Notable changes**

- Deprecation: if you require this package (with the `mdn-` package name), then a warning will be emitted ([#6777](https://github.com/mdn/browser-compat-data/issues/6777))
- Deprecation: if you're running Node.js version 8, then a warning will be emitted ([#6777](https://github.com/mdn/browser-compat-data/issues/6777))
- Feature moves and removals:
  - `api.DOMTokenList.remove_whitespace_and_duplicates` has been split into `api.DOMTokenList.remove_duplicates` and `api.DOMTokenList.trim_whitespace` ([#6691](https://github.com/mdn/browser-compat-data/issues/6691))
  - `api.AudioContext.createConstantSource` was removed because it duplicated `api.BaseAudioContext.createConstantSource` ([#6799](https://github.com/mdn/browser-compat-data/issues/6799))
  - `api.Document.contains` was removed because it duplicated `api.Node.contains` ([#6850](https://github.com/mdn/browser-compat-data/issues/6850))

**Statistics**

- 10 contributors have changed 58 files with 1,795 additions and 1,495 deletions in 39 commits ([`v1.0.40...v1.1.0`](https://github.com/mdn/browser-compat-data/compare/v1.0.40...v1.1.0))
- 12,243 total features
- 706 total contributors
- 3,030 total stargazers

## [v2.0.1](https://github.com/mdn/browser-compat-data/releases/tag/v2.0.1)

October 1, 2020

**Statistics**

- 10 contributors have changed 20 files with 496 additions and 271 deletions in 13 commits ([`v2.0.0...v2.0.1`](https://github.com/mdn/browser-compat-data/compare/v2.0.0...v2.0.1))
- 12,242 total features
- 704 total contributors
- 3,016 total stargazers

## [v1.0.40](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.40)

October 1, 2020

**Notice**: In the future, this package will be published as `@mdn/browser-compat-data`. For more information, read [#6640](https://github.com/mdn/browser-compat-data/issues/6640).

**Statistics**

- 10 contributors have changed 20 files with 496 additions and 271 deletions in 11 commits ([`v1.0.39...v1.0.40`](https://github.com/mdn/browser-compat-data/compare/v1.0.39...v1.0.40))
- 12,242 total features
- 704 total contributors
- 3,016 total stargazers

## [v2.0.0](https://github.com/mdn/browser-compat-data/releases/tag/v2.0.0)

September 24, 2020

**Notable changes**

- **Breaking**: Initial release as `@mdn/browser-compat-data`.
- **Breaking**: Node.js 10 or later is now required.

**Statistics**

- 12,242 total features
- 701 total contributors
- 2,999 total stargazers

## [v1.0.39](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.39)

September 24, 2020

**Notice**: In the future, this package will be published as `@mdn/browser-compat-data`. To give feedback on this and other upcoming breaking changes, please read [#6640](https://github.com/mdn/browser-compat-data/issues/6640).

**Notable changes**

- `api.Element.name` was removed because it's actually implemented as part of several `HTML*Element.name` interfaces ([#6751](https://github.com/mdn/browser-compat-data/issues/6751) and [#6683](https://github.com/mdn/browser-compat-data/issues/6683))
- `api.Element.accessKey` was removed because there's no indication that the feature was implemented in any browser
  browser (in contrast to `api.HTMLElement.accessKey`) ([#6746](https://github.com/mdn/browser-compat-data/issues/6746))

**Statistics**

- 10 contributors have changed 76 files with 3,678 additions and 2,715 deletions in 19 commits ([`v1.0.38...v1.0.39`](https://github.com/mdn/browser-compat-data/compare/v1.0.38...v1.0.39))
- 12,242 total features
- 701 total contributors
- 2,999 total stargazers

## [v1.0.38](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.38)

September 17, 2020

**Notice**: In the future, this package will be published under a new, scoped name. To give feedback on this and other upcoming breaking changes, please read [#6640](https://github.com/mdn/browser-compat-data/issues/6640).

**Notable changes**

- `css.at-rules.media.light-level` was removed because it was never implemented in any browser and has been dropped from the Media Queries specification ([#6706](https://github.com/mdn/browser-compat-data/issues/6706))
- `api.CSSTransition.CSSTransition` was removed because it was never actually implemented in any browser ([#6707](https://github.com/mdn/browser-compat-data/issues/6707))

**Statistics**

- 12 contributors have changed 161 files with 1,348 additions and 1,146 deletions in 25 commits ([`v1.0.37...v1.0.38`](https://github.com/mdn/browser-compat-data/compare/v1.0.37...v1.0.38))
- 12,195 total features
- 699 total contributors
- 2,987 total stargazers

## [v2.0.0-1](https://github.com/mdn/browser-compat-data/releases/tag/v2.0.0-1)

September 17, 2020

This is a demonstration of releasing `@mdn/browser-compat-data`. This code is untested and unreviewed. See [#6713](https://github.com/mdn/browser-compat-data/issues/6713) for more information.

## [v1.0.37](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.37)

September 10, 2020

**Notice**: In the future, this package will be published under a new, scoped name. To give feedback on this and other upcoming breaking changes, please read [#6640](https://github.com/mdn/browser-compat-data/issues/6640).

**Notable changes**

- CSS property data for `-ms-grid-columns` and `-ms-grid-row` was restructured ([#6599](https://github.com/mdn/browser-compat-data/issues/6599))
  - `css.properties.-ms-grid-columns` was removed (its data is now reflected as `"alternative_name"` data in `css.properties.grid-template-columns`)
  - `css.properties.-ms-grid-rows` was removed (its data is now reflected as `"alternative_name"` data in `css.properties.grid-template-rows`)
- `api.Console.timestamp` is now `api.Console.timeStamp` to correct a typo ([#6650](https://github.com/mdn/browser-compat-data/issues/6650))
- `api.Gamepad.Gamepad` was removed because the constructor never existed ([#6664](https://github.com/mdn/browser-compat-data/issues/6664))

**Statistics**

- 10 contributors have changed 50 files with 965 additions and 720 deletions in 18 commits ([`v1.0.36...v1.0.37`](https://github.com/mdn/browser-compat-data/compare/v1.0.36...v1.0.37))
- 12,195 total features
- 696 total contributors
- 2,968 total stargazers

## [v1.0.36](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.36)

September 3, 2020

**News**

In the future, this package will be published under a new, scoped name. To give feedback on this and other upcoming breaking changes, please read [#6640](https://github.com/mdn/browser-compat-data/issues/6640).

**Notable changes**

- `svg.elements.discard.begin` and `svg.elements.discard.href` were removed as dubious ([#6600](https://github.com/mdn/browser-compat-data/issues/6600))

**Statistics**

- 27 contributors have changed 173 files with 1,712 additions and 13,220 deletions in 61 commits ([`v1.0.35...v1.0.36`](https://github.com/mdn/browser-compat-data/compare/v1.0.35...v1.0.36))
- 12,198 total features
- 695 total contributors
- 2,962 total stargazers

## [v1.0.35](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.35)

August 20, 2020

**Notable changes**

- `api.CSS.wmin` is now `api.CSS.vmin` to correct a typo ([#6507](https://github.com/mdn/browser-compat-data/issues/6507))
- `api.RTCStatsEvent` was removed because it never shipped in any browser ([#6516](https://github.com/mdn/browser-compat-data/issues/6516))
- `api.Response.trailer` was removed because it never shipped in any browser ([#6543](https://github.com/mdn/browser-compat-data/issues/6543))

**Statistics**

- 20 contributors have changed 34 files with 1,024 additions and 1,070 deletions in 39 commits ([`v1.0.34...v1.0.35`](https://github.com/mdn/browser-compat-data/compare/v1.0.34...v1.0.35))
- 12,190 total features
- 684 total contributors
- 2,914 total stargazers

## [v1.0.34](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.34)

August 6, 2020

**Notable changes**

- None

**Statistics**

- 10 contributors have changed 36 files with 884 additions and 156 deletions in 29 commits ([`v1.0.33...v1.0.34`](https://github.com/mdn/browser-compat-data/compare/v1.0.33...v1.0.34))
- 12191 total features
- 675 total contributors
- 2881 total stargazers

## [v1.0.33](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.33)

July 30, 2020

**Statistics**

- 12 contributors have changed 27 files with 720 additions and 103 deletions in 19 commits ([`v1.0.32...v1.0.33`](https://github.com/mdn/browser-compat-data/compare/v1.0.32...v1.0.33))
- 12178 total features
- 673 total contributors
- 2869 total stargazers

## [v1.0.32](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.32)

July 23, 2020

**Notable changes**

- Updated our data guideline for irrelevant features to allow data removal if "a feature is unsupported in all releases in the past five years.".
- Removed CSS data that meets the new criteria in https://github.com/mdn/browser-compat-data/pull/6418 and https://github.com/mdn/browser-compat-data/pull/6407.
- Data for `FinalizationRegistry.prototype.cleanupSome` has been removed in https://github.com/mdn/browser-compat-data/pull/6426 due to the method not being standardized and available yet.

**Statistics**

- 13 contributors have changed 38 files with 249 additions and 1984 deletions in 19 commits ([`v1.0.31...v1.0.32`](https://github.com/mdn/browser-compat-data/compare/v1.0.31...v1.0.32))
- 12167 total features
- 667 total contributors
- 2855 total stargazers

## [v1.0.31](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.31)

July 16, 2020

**Notable changes**

- none

**Statistics**

- 12 contributors have changed 13 files with 408 additions and 61 deletions in 15 commits ([`v1.0.30...v1.0.31`](https://github.com/mdn/browser-compat-data/compare/v1.0.30...v1.0.31))
- 12196 total features
- 664 total contributors
- 2835 total stargazers

## [v1.0.30](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.30)

July 9, 2020

**Notable changes**

- The data for `api.CSSMathNegate.values` is now at `api.CSSMathNegate.value` (typo fix in https://github.com/mdn/browser-compat-data/pull/6371)

**Statistics**

- 5 contributors have changed 13 files with 411 additions and 25 deletions in 11 commits ([`v1.0.29...v1.0.30`](https://github.com/mdn/browser-compat-data/compare/v1.0.29...v1.0.30))
- 12189 total features
- 663 total contributors
- 2825 total stargazers

## [v1.0.29](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.29)

July 2, 2020

**Notable changes**

- none

**Statistics**

- 18 contributors have changed 50 files with 833 additions and 311 deletions in 29 commits ([`v1.0.28...v1.0.29`](https://github.com/mdn/browser-compat-data/compare/v1.0.28...v1.0.29))
- 12181 total features
- 662 total contributors
- 2808 total stargazers

## [v1.0.28](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.28)

June 25, 2020

**Notable changes**

- none

**Statistics**

- 7 contributors have changed 11 files with 95 additions and 46 deletions in 9 commits ([`v1.0.27...v1.0.28`](https://github.com/mdn/browser-compat-data/compare/v1.0.27...v1.0.28))
- 12172 total features
- 654 total contributors
- 2784 total stargazers

## [v1.0.27](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.27)

June 22, 2020

**Notable changes**

- Safari 14 supports WebExtensions
- The following Streams API constructor data points have been removed ([#6314](https://github.com/mdn/browser-compat-data/issues/6314)):
  - `api.ReadableByteStreamController.ReadableByteStreamController`
  - `api.ReadableStreamBYOBRequest.ReadableStreamBYOBRequest`
  - `api.ReadableStreamDefaultController.ReadableStreamDefaultController`
  - `api.WritableStreamDefaultController.WritableStreamDefaultController`

**Statistics**

- 4 contributors have changed 112 files with 4455 additions and 364 deletions in 7 commits ([`v1.0.26...v1.0.27`](https://github.com/mdn/browser-compat-data/compare/v1.0.26...v1.0.27))
- 12172 total features
- 651 total contributors
- 2774 total stargazers

## [v1.0.26](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.26)

June 18, 2020

**Notable changes**

- none

**Statistics**

- 6 contributors have changed 25 files with 1501 additions and 398 deletions in 18 commits ([`v1.0.25...v1.0.26`](https://github.com/mdn/browser-compat-data/compare/v1.0.25...v1.0.26))
- 12170 total features
- 651 total contributors
- 2768 total stargazers

## [v1.0.25](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.25)

June 11, 2020

**Notable changes**

- The `javascript.builtin.Intl.Collator.caseFirst` data has been moved to `javascript.builtin.Intl.Collator.Collator.caseFirst` ([#6253](https://github.com/mdn/browser-compat-data/issues/6253))
- JS operator data has been moved to remove unnecessary group trees ([#6246](https://github.com/mdn/browser-compat-data/issues/6246), [#6270](https://github.com/mdn/browser-compat-data/issues/6270), [#6272](https://github.com/mdn/browser-compat-data/issues/6272), [#6276](https://github.com/mdn/browser-compat-data/issues/6276)).
  - These JS operator groups have been dissolved: comparison, bitwise, assignment, arithmetic.
  - Find the operators now directly under the operators tree, for example: `javascript.operators.bitwise.and` -> `javascript.operators.bitwise_and`

**Statistics**

- 17 contributors have changed 81 files with 4690 additions and 2291 deletions in 32 commits ([`v1.0.24...v1.0.25`](https://github.com/mdn/browser-compat-data/compare/v1.0.24...v1.0.25))
- 12166 total features
- 637 total contributors
- 2758 total stargazers

## [v1.0.24](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.24)

June 4, 2020

**Notable changes**

- The following data point has been removed:
  - `css.selectors.read-write.matches_editable_elements` ([#6244](https://github.com/mdn/browser-compat-data/issues/6244))
- The following data has been moved ([#6235](https://github.com/mdn/browser-compat-data/issues/6235)):
  - `javascript.operators.logical.and` -> `javascript.operators.logical_and`
  - `javascript.operators.logical.or` -> `javascript.operators.logical_or`
  - `javascript.operators.logical.not` -> `javascript.operators.logical_not`

**Statistics**

- 15 contributors have changed 45 files with 1304 additions and 498 deletions in 22 commits ([`v1.0.23...v1.0.24`](https://github.com/mdn/browser-compat-data/compare/v1.0.23...v1.0.24))
- 12129 total features
- 629 total contributors
- 2741 total stargazers

## [v1.0.23](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.23)

May 28, 2020

**Notable changes**

- The following [irrelevant features](https://github.com/mdn/browser-compat-data/blob/master/docs/data-guidelines.md#removal-of-irrelevant-features) have been removed:
  - `javascript.builtins.String.quote` ([#6207](https://github.com/mdn/browser-compat-data/issues/6207))
  - `javascript.builtins.String.replace.flags` ([#6206](https://github.com/mdn/browser-compat-data/issues/6206))
  - `api.LocalFileSystem` and `api.LocalFileSystemSync` ([#6163](https://github.com/mdn/browser-compat-data/issues/6163))

**Statistics**

- 11 contributors have changed 32 files with 1260 additions and 621 deletions in 21 commits ([`v1.0.22...v1.0.23`](https://github.com/mdn/browser-compat-data/compare/v1.0.22...v1.0.23))
- 12123 total features
- 628 total contributors
- 2726 total stargazers

## [v1.0.22](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.22)

May 21, 2020

**Notable changes**

- The following [irrelevant features](https://github.com/mdn/browser-compat-data/blob/master/docs/data-guidelines.md#removal-of-irrelevant-features) have been removed:
  - `javascript.builtins.Date.toLocaleFormat` ([#6183](https://github.com/mdn/browser-compat-data/issues/6183))
  - `javascript.builtins.String.match.flags` ([#6184](https://github.com/mdn/browser-compat-data/issues/6184))
  - `javascript.statements.try_catch.conditional_clauses` ([#6192](https://github.com/mdn/browser-compat-data/issues/6192))
- `javascript.statements.default.exports` has moved to `javascript.statements.exports.default` (see [#5869](https://github.com/mdn/browser-compat-data/issues/5869)).
- A new guideline for how [Permissions API permissions data](https://github.com/mdn/browser-compat-data/blob/master/docs/data-guidelines.md#permissions-api-permissions-permissionname_permission) is stored has been accepted and the descriptions have been fixed, see https://github.com/mdn/browser-compat-data/pull/6156.

**Statistics**

- 14 contributors have changed 47 files with 806 additions and 541 deletions in 38 commits ([`v1.0.21...v1.0.22`](https://github.com/mdn/browser-compat-data/compare/v1.0.21...v1.0.22))
- 12122 total features
- 627 total contributors
- 2714 total stargazers

## [v1.0.21](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.21)

May 14, 2020

**Notable changes**

- None

**Statistics**

- 16 contributors have changed 87 files with 1221 additions and 498 deletions in 26 commits ([`v1.0.20...v1.0.21`](https://github.com/mdn/browser-compat-data/compare/v1.0.20...v1.0.21))
- 12118 total features
- 623 total contributors
- 2702 total stargazers

## [v1.0.20](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.20)

May 7, 2020

**Notable changes**

- None

**Statistics**

- 11 contributors have changed 45 files with 1911 additions and 241 deletions in 35 commits ([`v1.0.19...v1.0.20`](https://github.com/mdn/browser-compat-data/compare/v1.0.19...v1.0.20))
- 12092 total features
- 621 total contributors
- 2690 total stargazers

## [v1.0.19](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.19)

April 30, 2020

**Notable changes**

- A new guideline for deleting irrelevant data is now in place. (https://github.com/mdn/browser-compat-data/pull/6018)

**Statistics**

- 12 contributors have changed 39 files with 1930 additions and 1264 deletions in 24 commits ([`v1.0.18...v1.0.19`](https://github.com/mdn/browser-compat-data/compare/v1.0.18...v1.0.19))
- 12068 total features
- 619 total contributors
- 2681 total stargazers

## [v1.0.18](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.18)

April 23, 2020

**Notable changes**

- None

**Statistics**

- 23 contributors have changed 31 files with 1346 additions and 488 deletions in 42 commits ([`v1.0.17...v1.0.18`](https://github.com/mdn/browser-compat-data/compare/v1.0.17...v1.0.18))
- 12053 total features
- 615 total contributors
- 2670 total stargazers

## [v1.0.17](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.17)

April 9, 2020

**Notable changes**

- None

**Statistics**

- 8 contributors have changed 45 files with 529 additions and 504 deletions in 29 commits ([`v1.0.16...v1.0.17`](https://github.com/mdn/browser-compat-data/compare/v1.0.16...v1.0.17))
- 12043 total features
- 601 total contributors
- 2642 total stargazers

## [v1.0.16](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.16)

April 2, 2020

**Notable changes**

- None

**Statistics**

- 16 contributors have changed 140 files with 3214 additions and 1517 deletions in 39 commits ([`v1.0.15...v1.0.16`](https://github.com/mdn/browser-compat-data/compare/v1.0.15...v1.0.16))
- 12040 total features
- 600 total contributors
- 2634 total stargazers

## [v1.0.15](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.15)

March 26, 2020

**Notable changes**

- None

**Statistics**

- 12 contributors have changed 55 files with 1332 additions and 323 deletions in 17 commits ([`v1.0.14...v1.0.15`](https://github.com/mdn/browser-compat-data/compare/v1.0.14...v1.0.15))
- 12007 total features
- 597 total contributors
- 2625 total stargazers

## [v1.0.14](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.14)

March 23, 2020

**Notable changes**

- Besides regular data updates, this release contains a fix for a bug introduced in the last release (1.0.13). Support was changed Node versions <10.0.0 and it is now restored support to Node versions ≥8.0.0. See [#5852](https://github.com/mdn/browser-compat-data/issues/5852) and [#5863](https://github.com/mdn/browser-compat-data/issues/5863).

**Statistics**

- 5 contributors have changed 37 files with 824 additions and 247 deletions in 8 commits ([`v1.0.13...v1.0.14`](https://github.com/mdn/browser-compat-data/compare/v1.0.13...v1.0.14))
- 12003 total features
- 597 total contributors
- 2619 total stargazers

## [v1.0.13](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.13)

March 19, 2020

**Warning**: This release contains a breaking change for Node versions <10.0.0. The next patch release restores support to Node versions ≥8.0.0 See [#5852](https://github.com/mdn/browser-compat-data/issues/5852) and [#5863](https://github.com/mdn/browser-compat-data/issues/5863).

**Notable changes**

- None

**Statistics**

- 16 contributors have changed 64 files with 2443 additions and 1399 deletions in 30 commits ([`v1.0.12...v1.0.13`](https://github.com/mdn/browser-compat-data/compare/v1.0.12...v1.0.13))
- 11991 total features
- 595 total contributors
- 2611 total stargazers

## [v1.0.12](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.12)

March 12, 2020

**Notable changes**

- None

**Statistics**

- 8 contributors have changed 20 files with 445 additions and 375 deletions in 13 commits ([`v1.0.11...v1.0.12`](https://github.com/mdn/browser-compat-data/compare/v1.0.11...v1.0.12))
- 11969 total features
- 591 total contributors
- 2597 total stargazers

## [v1.0.11](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.11)

March 5, 2020

**Notable changes**

- None

**Statistics**

- 8 contributors have changed 19 files with 1581 additions and 515 deletions in 16 commits ([`v1.0.10...v1.0.11`](https://github.com/mdn/browser-compat-data/compare/v1.0.10...v1.0.11))
- 11968 total features
- 590 total contributors
- 2583 total stargazers

## [v1.0.10](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.10)

February 27, 2020

**Notable changes**

- None

**Statistics**

- 11 contributors have changed 50 files with 724 additions and 319 deletions in 29 commits ([`v1.0.9...v1.0.10`](https://github.com/mdn/browser-compat-data/compare/v1.0.9...v1.0.10))
- 11953 total features
- 590 total contributors
- 2566 total stargazers

## [v1.0.9](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.9)

February 20, 2020

**Notable changes**

- Edge compat data has been updated throughout due to engine change (see https://github.com/mdn/browser-compat-data/issues/5214)

**Statistics**

- 11 contributors have changed 1264 files with 10265 additions and 7001 deletions in 34 commits ([`v1.0.8...v1.0.9`](https://github.com/mdn/browser-compat-data/compare/v1.0.8...v1.0.9))
- 11949 total features
- 586 total contributors
- 2546 total stargazers

## [v1.0.8](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.8)

February 13, 2020

**Notable changes**

- None

**Statistics**

- 12 contributors have changed 114 files with 7954 additions and 5973 deletions in 37 commits ([`v1.0.7...v1.0.8`](https://github.com/mdn/browser-compat-data/compare/v1.0.7...v1.0.8))
- 11935 total features
- 584 total contributors
- 2538 total stargazers

## [v1.0.7](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.7)

February 13, 2020

**Notable changes**

- None

**Statistics**

- 11 contributors have changed 327 files with 3039 additions and 2724 deletions in 65 commits ([`v1.0.6...v1.0.7`](https://github.com/mdn/browser-compat-data/compare/v1.0.6...v1.0.7))
- 11887 total features
- 581 total contributors
- 2529 total stargazers

## [v1.0.6](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.6)

January 23, 2020

**Notable changes**

- None

**Statistics**

- 13 contributors have changed 45 files with 1139 additions and 547 deletions in 30 commits ([`v1.0.5...v1.0.6`](https://github.com/mdn/browser-compat-data/compare/v1.0.5...v1.0.6))
- 11887 total features
- 576 total contributors
- 2505 total stargazers

## [v1.0.5](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.5)

January 16, 2020

**Notable changes**

- None

**Statistics**

- 12 contributors have changed 99 files with 1409 additions and 1941 deletions in 34 commits ([`v1.0.4...v1.0.5`](https://github.com/mdn/browser-compat-data/compare/v1.0.4...v1.0.5))
- 11876 total features
- 575 total contributors
- 2488 total stargazers

## [v1.0.4](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.4)

January 9, 2020

**Notable changes**

- None

**Statistics**

- 18 contributors have changed 240 files with 3938 additions and 1330 deletions in 96 commits ([`v1.0.3...v1.0.4`](https://github.com/mdn/browser-compat-data/compare/v1.0.3...v1.0.4))
- 11886 total features
- 572 total contributors
- 2480 total stargazers

## [v1.0.3](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.3)

December 19, 2019

**Notable changes**

- None

**Statistics**

- 10 contributors have changed 339 files with 3,745 additions and 758 deletions in 29 commits ([`v1.0.2...v1.0.3`](https://github.com/mdn/browser-compat-data/compare/v1.0.2...v1.0.3))
- 11,875 total features
- 567 total contributors
- 2,451 total stargazers

## [v1.0.2](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.2)

December 12, 2019

**Notable changes**

- None

**Statistics**

- 17 contributors have changed 742 files with 7115 additions and 3324 deletions in 41 commits ([`v1.0.1...v1.0.2`](https://github.com/mdn/browser-compat-data/compare/v1.0.1...v1.0.2))
- 11859 total features
- 565 total contributors
- 2434 total stargazers

## [v1.0.1](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.1)

December 4, 2019

**Notable changes**

- None

**Statistics**

- 19 contributors have changed 258 files with 2499 additions and 1656 deletions in 68 commits ([`v1.0.0...v1.0.1`](https://github.com/mdn/browser-compat-data/compare/v1.0.0...v1.0.1))
- 11849 total features
- 560 total contributors
- 2420 total stargazers

## [v1.0.0](https://github.com/mdn/browser-compat-data/releases/tag/v1.0.0)

November 21, 2019

The mdn-browser-compat-data 1.0.0 release is a non-breaking release! It is the 100th release of fresh compat data brought to you by the MDN team at Mozilla.

From now on: we're guaranteeing data structure stability and any changes to how the data is exposed will be communicated using minor and major version bumps. Compatibility data will still be continuously updated on a weekly basis and the patch version will be used if data-only updates happened. So, you can expect a 1.0.1 release next week.

**Statistics**

- 18 contributors have changed 306 files with 2117 additions and 1024 deletions in 42 commits ([`v0.0.99...v1.0.0`](https://github.com/mdn/browser-compat-data/compare/v0.0.99...v1.0.0))
- 11827 total features
- 556 total contributors
- 2381 total stargazers

## [v0.0.99](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.99)

November 14, 2019

### Notable changes

**Next week (on 21st November 2019), we will release version 1.0.0 (instead of 0.0.100). Please make sure your package.json semver query takes this into account! (see also npm semver calculator at https://semver.npmjs.com/)**

There are no breaking changes in 1.0.0. It is just that we should finally use semver correctly and call it a 1.0.0 :)

### Statistics

- 21 contributors have changed 258 files with 5801 additions and 2130 deletions in 66 commits ([`v0.0.98...v0.0.99`](https://github.com/mdn/browser-compat-data/compare/v0.0.98...v0.0.99))
- 11824 total features
- 549 total contributors
- 2357 total stargazers

## [v0.0.98](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.98)

October 24, 2019

**Notable changes**

- None

**Statistics**

- 12 contributors have changed 56 files with 1528 additions and 573 deletions in 27 commits ([`v0.0.97...v0.0.98`](https://github.com/mdn/browser-compat-data/compare/v0.0.97...v0.0.98))
- 11801 total features
- 543 total contributors
- 2312 total stargazers

## [v0.0.97](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.97)

October 17, 2019

**Notable changes**

- None

**Statistics**

- 18 contributors have changed 104 files with 737 additions and 451 deletions in 38 commits ([`v0.0.96...v0.0.97`](https://github.com/mdn/browser-compat-data/compare/v0.0.96...v0.0.97))
- 11789 total features
- 540 total contributors
- 2299 total stargazers

## [v0.0.96](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.96)

October 10, 2019

**Notable changes**

- None

**Statistics**

- 11 contributors have changed 76 files with 1267 additions and 552 deletions in 37 commits ([`v0.0.95...v0.0.96`](https://github.com/mdn/browser-compat-data/compare/v0.0.95...v0.0.96))
- 11777 total features
- 534 total contributors
- 2279 total stargazers

## [v0.0.95](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.95)

October 2, 2019

**Notable changes**

- None

**Statistics**

- 27 contributors have changed 79 files with 2562 additions and 878 deletions in 55 commits ([`v0.0.94...v0.0.95`](https://github.com/mdn/browser-compat-data/compare/v0.0.94...v0.0.95))
- 11768 total features
- 530 total contributors
- 2262 total stargazers

## [v0.0.94](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.94)

September 12, 2019

**Notable changes**

- MDN compat data now collaborates with caniuse https://hacks.mozilla.org/2019/09/caniuse-and-mdn-compat-data-collaboration/

**Statistics**

- 12 contributors have changed 119 files with 11912 additions and 663 deletions in 37 commits ([`v0.0.93...v0.0.94`](https://github.com/mdn/browser-compat-data/compare/v0.0.93...v0.0.94))
- 11734 total features
- 523 total contributors
- 2177 total stargazers

## [v0.0.93](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.93)

September 5, 2019

**Notable changes**

- None

**Statistics**

- 10 contributors have changed 257 files with 11539 additions and 8922 deletions in 45 commits ([`v0.0.92...v0.0.93`](https://github.com/mdn/browser-compat-data/compare/v0.0.92...v0.0.93))
- 11716 total features
- 519 total contributors
- 2128 total stargazers

## [v0.0.92](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.92)

August 29, 2019

**Notable changes**

- We now have 100% CSS data coverage for major browsers ([#3710](https://github.com/mdn/browser-compat-data/issues/3710))

**Statistics**

- 12 contributors have changed 665 files with 32134 additions and 28865 deletions in 48 commits ([`v0.0.91...v0.0.92`](https://github.com/mdn/browser-compat-data/compare/v0.0.91...v0.0.92))
- 11674 total features
- 518 total contributors
- 2114 total stargazers

## [v0.0.91](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.91)

August 22, 2019

**Notable changes**

- None

**Statistics**

- 20 contributors have changed 117 files with 1304 additions and 761 deletions in 53 commits ([`v0.0.90...v0.0.91`](https://github.com/mdn/browser-compat-data/compare/v0.0.90...v0.0.91))
- 11625 total features
- 514 total contributors
- 2101 total stargazers

## [v0.0.90](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.90)

August 15, 2019

**Notable changes**

- The data now includes a range version for webview_android ("≤37" is now a valid version) ([#4583](https://github.com/mdn/browser-compat-data/issues/4583))

**Statistics**

- 10 contributors have changed 178 files with 1039 additions and 623 deletions in 29 commits ([`v0.0.89...v0.0.90`](https://github.com/mdn/browser-compat-data/compare/v0.0.89...v0.0.90))
- 11618 total features
- 504 total contributors
- 2096 total stargazers

## [v0.0.89](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.89)

August 8, 2019

**Notable changes**

- None

**Statistics**

- 12 contributors have changed 24 files with 1266 additions and 295 deletions in 20 commits ([`v0.0.88...v0.0.89`](https://github.com/mdn/browser-compat-data/compare/v0.0.88...v0.0.89))
- 11615 total features
- 502 total contributors
- 2081 total stargazers

## [v0.0.88](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.88)

August 1, 2019

**Notable changes**

- None

**Statistics**

- 21 contributors have changed 58 files with 1144 additions and 291 deletions in 37 commits ([`v0.0.87...v0.0.88`](https://github.com/mdn/browser-compat-data/compare/v0.0.87...v0.0.88))
- 11597 total features
- 499 total contributors
- 2059 total stargazers

## [v0.0.87](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.87)

July 18, 2019

**Notable changes**

- None

**Statistics**

- 11 contributors have changed 75 files with 890 additions and 874 deletions in 25 commits ([`v0.0.86...v0.0.87`](https://github.com/mdn/browser-compat-data/compare/v0.0.86...v0.0.87))
- 11582 total features
- 492 total contributors
- 2028 total stargazers

## [v0.0.86](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.86)

July 11, 2019

**Notable changes**

- We've removed data for the discontinued Windows Mobile version of Edge. See [#3888](https://github.com/mdn/browser-compat-data/issues/3888) for details.

**Statistics**

- 20 contributors have changed 1472 files with 3801 additions and 25324 deletions in 76 commits ([`v0.0.85...v0.0.86`](https://github.com/mdn/browser-compat-data/compare/v0.0.85...v0.0.86))
- 11587 total features
- 490 total contributors
- 2018 total stargazers

## [v0.0.85](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.85)

June 27, 2019

**Notable changes**

- We've started the process of removing data for the discontinued Windows Mobile version of Edge. See [#3888](https://github.com/mdn/browser-compat-data/issues/3888) for details.

**Statistics**

- 11,571 total features
- 25 contributors have changed 196 files with 4,915 additions and 5,689 deletions in 64 commits ([`v0.0.84...v0.0.85`](https://github.com/mdn/browser-compat-data/compare/v0.0.84...v0.0.85))
- 481 total contributors
- 1,980 total stargazers

## [v0.0.84](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.84)

June 13, 2019

**Notable changes**

- None

**Statistics**

- 10 contributors have changed 493 files with 879 additions and 5364 deletions in 23 commits ([`v0.0.83...v0.0.84`](https://github.com/mdn/browser-compat-data/compare/v0.0.83...v0.0.84))
- 11543 total features
- 470 total contributors
- 1945 total stargazers

## [v0.0.83](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.83)

June 6, 2019

**Notable changes**

- None

**Statistics**

- 15 contributors have changed 63 files with 1380 additions and 231 deletions in 20 commits ([`v0.0.82...v0.0.83`](https://github.com/mdn/browser-compat-data/compare/v0.0.82...v0.0.83))
- 11530 total features
- 469 total contributors
- 1930 total stargazers

## [v0.0.82](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.82)

May 30, 2019

**Notable changes**

- None

**Statistics**

- 11 contributors have changed 44 files with 1686 additions and 162 deletions in 14 commits ([`v0.0.81...v0.0.82`](https://github.com/mdn/browser-compat-data/compare/v0.0.81...v0.0.82))
- 11513 total features
- 461 total contributors
- 1915 total stargazers

## [v0.0.81](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.81)

May 23, 2019

**Notable changes**

- None

**Statistics**

- 17 contributors have changed 122 files with 1216 additions and 603 deletions in 27 commits ([`v0.0.80...v0.0.81`](https://github.com/mdn/browser-compat-data/compare/v0.0.80...v0.0.81))
- 11479 total features
- 456 total contributors
- 1884 total stargazers

## [v0.0.80](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.80)

May 16, 2019

**Notable changes**

- None

**Statistics**

- 14 contributors have changed 97 files with 5670 additions and 2427 deletions in 43 commits ([`v0.0.79...v0.0.80`](https://github.com/mdn/browser-compat-data/compare/v0.0.79...v0.0.80))
- 11470 total features
- 452 total contributors
- 1865 total stargazers

## [v0.0.79](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.79)

May 9, 2019

**Notable changes**

- browser release exports now also contain engine information ([#3877](https://github.com/mdn/browser-compat-data/issues/3877))

**Statistics**

- 13 contributors have changed 220 files with 3469 additions and 1425 deletions in 56 commits ([`v0.0.78...v0.0.79`](https://github.com/mdn/browser-compat-data/compare/v0.0.78...v0.0.79))
- 11413 total features
- 449 total contributors
- 1839 total stargazers

## [v0.0.78](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.78)

May 2, 2019

**Notable changes**

- nodejs 6 was EOL'ed, so this package now requires nodejs 8. ([#4034](https://github.com/mdn/browser-compat-data/issues/4034))

**Statistics**

- 19 contributors have changed 247 files with 3565 additions and 1683 deletions in 62 commits ([`v0.0.77...v0.0.78`](https://github.com/mdn/browser-compat-data/compare/v0.0.77...v0.0.78))
- 11406 total features
- 444 total contributors
- 1805 total stargazers

## [v0.0.77](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.77)

April 25, 2019

**Notable changes**

- None

**Statistics**

- 16 contributors have changed 290 files with 3986 additions and 2220 deletions in 61 commits ([`v0.0.76...v0.0.77`](https://github.com/mdn/browser-compat-data/compare/v0.0.76...v0.0.77))
- 11380 total features
- 433 total contributors
- 1789 total stargazers

## [v0.0.76](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.76)

April 18, 2019

**Notable changes**

- Updated TypeScript definitions (https://github.com/mdn/browser-compat-data/pull/3739)

**Statistics**

- 15 contributors have changed 286 files with 4802 additions and 1763 deletions in 63 commits ([`v0.0.75...v0.0.76`](https://github.com/mdn/browser-compat-data/compare/v0.0.75...v0.0.76))
- 428 total contributors
- 1771 total stargazers
- 11348 total features

## [v0.0.75](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.75)

April 11, 2019

**Notable changes**

- A document describing the repo's governance has been added ([#3668](https://github.com/mdn/browser-compat-data/issues/3668))
- Opera Android data is now validated against actual release versions ([#1712](https://github.com/mdn/browser-compat-data/issues/1712))
- The flag of type `compile_flag` has been removed from the schema ([#3752](https://github.com/mdn/browser-compat-data/issues/3752))

**Statistics**

- 20 contributors have changed 818 files with 9663 additions and 5528 deletions in 47 commits ([`v0.0.74...v0.0.75`](https://github.com/mdn/browser-compat-data/compare/v0.0.74...v0.0.75))
- 11297 total features
- 424 total contributors
- 1755 total stargazers

## [v0.0.74](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.74)

April 4, 2019

**Notable changes**

- None

**Statistics**

- 14 contributors have changed 271 files with 4731 additions and 2474 deletions in 32 commits ([`v0.0.73...v0.0.74`](https://github.com/mdn/browser-compat-data/compare/v0.0.73...v0.0.74))
- 11251 total features
- 414 total contributors
- 1735 total stargazers

## [v0.0.73](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.73)

March 28, 2019

**Notable changes**

- [`matches` objects](https://github.com/mdn/browser-compat-data/blob/master/schemas/compat-data-schema.md#the-matches-object) have been added to the schema.(https://github.com/mdn/browser-compat-data/pull/3631)

**Statistics**

- 21 contributors have changed 187 files with 3649 additions and 2230 deletions in 55 commits ([`v0.0.72...v0.0.73`](https://github.com/mdn/browser-compat-data/compare/v0.0.72...v0.0.73))
- 11210 total features
- 409 total contributors
- 1718 total stargazers

## [v0.0.72](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.72)

March 21, 2019

**Notable changes**

- The year goal for the data quality of this data set has been agreed on and will be measured regularly. See https://github.com/mdn/browser-compat-data/issues/3555 for details.

**Statistics**

- 11196 total features
- 18 contributors have changed 39 files with 3718 additions and 627 deletions in 29 commits ([`v0.0.71...v0.0.72`](https://github.com/mdn/browser-compat-data/compare/v0.0.71...v0.0.72))
- 402 total contributors
- 1700 total stargazers

## [v0.0.71](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.71)

March 14, 2019

**Notable changes**

- `version_added` is now required to be different from `version_removed` ([#3546](https://github.com/mdn/browser-compat-data/issues/3546))

**Statistics**

- 11,141 total features
- 15 contributors have changed 103 files with 7,244 additions and 2,265 deletions in 35 commits ([`v0.0.70...v0.0.71`](https://github.com/mdn/browser-compat-data/compare/v0.0.70...v0.0.71))
- 398 total contributors
- 1,689 total stargazers

## [v0.0.70](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.70)

March 7, 2019

**Notable changes**

- Total number features for which we have compat data is now above 11,000. \o/
- If you're using this project in TypeScript, this PR might affect you: https://github.com/mdn/browser-compat-data/pull/3004

**Statistics**

- 13 contributors have changed 97 files with 5311 additions and 1172 deletions in 23 commits ([`v0.0.69...v0.0.70`](https://github.com/mdn/browser-compat-data/compare/v0.0.69...v0.0.70))
- 11043 total features
- 394 total contributors
- 1671 total stargazers

## [v0.0.69](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.69)

February 28, 2019

**Notable changes**

- None

**Statistics**

- 10975 total features
- 16 contributors have changed 102 files with 4135 additions and 1372 deletions in 42 commits ([`v0.0.68...v0.0.69`](https://github.com/mdn/browser-compat-data/compare/v0.0.68...v0.0.69))
- 390 total contributors
- 1653 total stargazers

## [v0.0.68](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.68)

February 21, 2019

**Notable changes**

- None

**Statistics**

- 10913 total features
- 18 contributors have changed 86 files with 7487 additions and 1247 deletions in 36 commits ([`v0.0.67...v0.0.68`](https://github.com/mdn/browser-compat-data/compare/v0.0.67...v0.0.68))
- 383 total contributors
- 1635 total stargazers

## [v0.0.67](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.67)

February 14, 2019

**Notable changes**

- Browser data schema now supports `pref_url` to document where flags are changed ([#3407](https://github.com/mdn/browser-compat-data/issues/3407))
- Desktop browsers are now required in `support` objects ([#3413](https://github.com/mdn/browser-compat-data/issues/3413), [#3419](https://github.com/mdn/browser-compat-data/issues/3419))
- Node 6 is now documented as the minimum Node version required for the package ([#3428](https://github.com/mdn/browser-compat-data/issues/3428))

**Statistics**

- 10,799 total features
- 16 contributors have changed 247 files with 5,045 additions and 2,359 deletions in 28 commits ([`v0.0.66...v0.0.67`](https://github.com/mdn/browser-compat-data/compare/v0.0.66...v0.0.67))
- 374 total contributors
- 1,617 total stargazers

## [v0.0.66](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.66)

February 7, 2019

**Notable changes**

- Browsers now need to be sorted alphabetically in the data (https://github.com/mdn/browser-compat-data/pull/1882)
- WebKit bug URLs are now consistent (https://github.com/mdn/browser-compat-data/pull/3371)
- The linter now ensures that version_added is earlier than version_removed (https://github.com/mdn/browser-compat-data/pull/3370)

**Statistics**

- 10779 total features
- 18 contributors have changed 138 files with 1624 additions and 1029 deletions in 34 commits ([`v0.0.65...v0.0.66`](https://github.com/mdn/browser-compat-data/compare/v0.0.65...v0.0.66))
- 369 total contributors
- 1601 total stargazers

## [v0.0.65](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.65)

January 31, 2019

**Notable changes**

- None

**Statistics**

- 10769 total features
- 15 contributors have changed 23 files with 889 additions and 364 deletions in 19 commits ([`v0.0.64...v0.0.65`](https://github.com/mdn/browser-compat-data/compare/v0.0.64...v0.0.65))
- 362 total contributors
- 1585 total stargazers

## [v0.0.64](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.64)

January 24, 2019

**Notable changes**

- None

**Statistics**

- 10763 total features
- 18 contributors have changed 106 files with 4490 additions and 1601 deletions in 49 commits ([`v0.0.62...v0.0.64`](https://github.com/mdn/browser-compat-data/compare/v0.0.62...v0.0.64))
- 357 total contributors
- 1572 total stargazers

## [v0.0.63](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.63)

January 17, 2019

**Notable changes**

- Generating these release notes has been partly automated ([#3199](https://github.com/mdn/browser-compat-data/issues/3199))

**Statistics**

- 10740 total features
- 9 contributors have changed 32 files with 2032 additions and 613 deletions in 21 commits ([`v0.0.62...v0.0.63`](https://github.com/mdn/browser-compat-data/compare/v0.0.62...v0.0.63))
- 353 total contributors
- 1536 total stargazers

## [v0.0.62](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.62)

January 10, 2019

**Notable changes**

- Descriptions in compat-data schema have been cleaned up https://github.com/mdn/browser-compat-data/pull/3100
- Line ending inconsistencies are fixed https://github.com/mdn/browser-compat-data/pull/3231
- ajv has been updated, and ajv-better-errors has been added resulting in having the linter print better error messages https://github.com/mdn/browser-compat-data/pull/2338
- Edge Mobile 16/17/18 has been removed https://github.com/mdn/browser-compat-data/pull/3117
- Add new field "spec_url" has been added and populated for JavaScript data https://github.com/mdn/browser-compat-data/pull/2983
- The schema has been made more consistent so a single note isn’t inside an array https://github.com/mdn/browser-compat-data/pull/3090
- A new linting rule has been added so that some browsers can't be used in specific categories anymore (e.g. no Samsung in WebExtensions data) https://github.com/mdn/browser-compat-data/pull/2487

**Statistics**

- 10720 total features
- 33 contributors have changed 288 files with 5655 additions and 3391 deletions in 61 commits ([`v0.0.61...v0.0.62`](https://github.com/mdn/browser-compat-data/compare/v0.0.61...v0.0.62))
- 352 total contributors
- 1527 total stargazers

## [v0.0.61](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.61)

December 20, 2018

**Notable changes**

- Added documentation for using Web API Confluence to update data ([#3167](https://github.com/mdn/browser-compat-data/issues/3167))

**Statistics**

- 10609 total features
- 10 contributors have changed 27 files with 3384 additions and 180 deletions in 21 commits ([`v0.0.60...v0.0.61`](https://github.com/mdn/browser-compat-data/compare/v0.0.60...v0.0.61))
- 337 total contributors
- 1493 total stargazers

## [v0.0.60](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.60)

December 13, 2018

**Notable changes**

- The publishing procedures have been updated ([#3158](https://github.com/mdn/browser-compat-data/issues/3158))
- A GitHub PR template has been added ([#3208](https://github.com/mdn/browser-compat-data/issues/3208))

**Statistics**

- 26 contributors have changed 62 files with 1977 additons and 353 deletions in 42 commits ([`v0.0.59...v0.0.60`](https://github.com/mdn/browser-compat-data/compare/v0.0.59...v0.0.60))
- 336 total contributors
- 1490 total stargazers
- 10627 total features

## [v0.0.59](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.59)

November 26, 2018

Notable changes:

- None

Statistics:

- 13 contributors have changed 50 files with 1,988 additions and 2,056 deletions in 34 commits [`v0.0.58...v0.0.59`](https://github.com/mdn/browser-compat-data/compare/v0.0.58...v0.0.59)
- 327 total contributors
- 1464 total stargazers

## [v0.0.50](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.50)

November 9, 2018

Notable changes:

- None

Statistics:

- 22 contributors changed 62 files with 2,110 additions and 448 deletions in 51 commits [`v0.0.49...v0.0.50`](https://github.com/mdn/browser-compat-data/compare/v0.0.49...v0.0.50)
- 273 total contributors
- 1263 total stargazers
- 10324 total features

## [v0.0.51](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.51)

November 9, 2018

Notable changes:

- None

Statistics:

- 17 contributors changed 63 files with 3,676 additions and 747 deletions in 47 commits [`v0.0.50...v0.0.51`](https://github.com/mdn/browser-compat-data/compare/v0.0.50...v0.0.51)
- 277 total contributors
- 1285 total stargazers
- 10378 total features

## [v0.0.52](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.52)

November 9, 2018

Notable changes:

- Add webview_android browser data ([#2690](https://github.com/mdn/browser-compat-data/issues/2690))

Statistics:

- 21 contributors changed 211 files with 6,604 additions and 1,276 deletions in 50 commits [`v0.0.51...v0.0.52`](https://github.com/mdn/browser-compat-data/compare/v0.0.51...v0.0.52)
- 283 total contributors
- 1317 total stargazers
- 10443 total features

## [v0.0.53](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.53)

November 9, 2018

Notable changes:

- Add json schema data to the .vscode/settings.json file ([#2905](https://github.com/mdn/browser-compat-data/issues/2905))
- Sort browsers for html/\* ([#2900](https://github.com/mdn/browser-compat-data/issues/2900))
- Sort browsers for javascript/\* ([#2898](https://github.com/mdn/browser-compat-data/issues/2898))
- Sort browsers for http/\* ([#2899](https://github.com/mdn/browser-compat-data/issues/2899))
- Sort browsers for svg/\* ([#2897](https://github.com/mdn/browser-compat-data/issues/2897))
- Sort browsers for webdriver/\* ([#2896](https://github.com/mdn/browser-compat-data/issues/2896))

Statistics:

- 19 contributors have changed 524 files with 11,065 additions and 7,262 deletions in 37 commits
  [`v0.0.52...v0.0.53`](https://github.com/mdn/browser-compat-data/compare/v0.0.52...v0.0.53)
- 291 total contributors
- 1330 total stargazers
- 10495 total features

## [v0.0.54](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.54)

November 9, 2018

Notable changes:

- Sort browsers in css/\* json files ([#2922](https://github.com/mdn/browser-compat-data/issues/2922))
- Add descriptions to schema properties ([#2923](https://github.com/mdn/browser-compat-data/issues/2923))

Statistics:

- 14 contributors changed 468 files with 5,777 additions and 3,377 deletions in 23 commits [`v0.0.53...v0.0.54`](https://github.com/mdn/browser-compat-data/compare/v0.0.53...v0.0.54)

## [v0.0.55](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.55)

November 9, 2018

Notable changes:

- None

Statistics:

- 21 contributors changed 52 files with 1,103 additions and 519 deletions in 39 commits [`v0.0.54...v0.0.55`](https://github.com/mdn/browser-compat-data/compare/v0.0.54...v0.0.55)

## [v0.0.56](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.56)

November 9, 2018

Notable changes:

- None

Statistics:

- 13 contributors changed 34 files with 1,015 additions and 104 deletions in 16 commits [`v0.0.55...v0.0.56`](https://github.com/mdn/browser-compat-data/compare/v0.0.55...v0.0.56)
- 310 total contributors
- 1383 total stargazers
- 10559 total features

## [v0.0.57](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.57)

November 9, 2018

Notable changes:

- Add a VS Code snippet config for creating new BCD files ([#2939](https://github.com/mdn/browser-compat-data/issues/2939))
- Make the lint output less verbose by adding ora ([#2528](https://github.com/mdn/browser-compat-data/issues/2528))

Statistics:

- 20 contributors have changed 37 files with 1,427 additions and 593 deletions in 25 commits
  [`v0.0.56...v0.0.57`](https://github.com/mdn/browser-compat-data/compare/v0.0.56...v0.0.57)

## [v0.0.58](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.58)

November 8, 2018

Notable changes:

- Use yargs to parse the arguments passed to the linter ([#2155](https://github.com/mdn/browser-compat-data/issues/2155))
- Sort browsers in api/\* json files ([#3049](https://github.com/mdn/browser-compat-data/issues/3049))

Statistics:

- 11 contributors have changed 616 files with 14,578 additions and 12,345 deletions in 17 commits
  [`v0.0.57...v0.0.58`](https://github.com/mdn/browser-compat-data/compare/v0.0.57...v0.0.58)
- 324 total contributors
- 1412 total stargazers

## [v0.0.45](https://github.com/mdn/browser-compat-data/releases/tag/v0.0.45)

November 8, 2018

Notable changes:

- Standardized bugzilla bug link format. ([#2511](https://github.com/mdn/browser-compat-data/issues/2511))

## [Releases before v0.0.45](https://github.com/mdn/browser-compat-data/tags?after=v0.0.45)

Releases before v0.0.45 were published without release notes. Review [the version history](https://github.com/mdn/browser-compat-data/tags?after=v0.0.45) instead.
