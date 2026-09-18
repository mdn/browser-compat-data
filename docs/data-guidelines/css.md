# Data guidelines for CSS features

This file contains guidelines that are specific to the CSS features (`css/`).

## Animatable and transitionable

Use the key name `is_animatable` to capture data describing when a feature was made `@keyframe` animatable and transitionable. If a browser supports the feature as exclusively `@keyframe` animatable or exclusively transitionable, then set `partial_implementation` to `true`.

Such features should have the `description` field set to "`@keyframe` animatable and transitionable".

The `description` also has an optional parenthetical suffix: `(x)`, where `x` is a particular condition under which the feature is animatable and/or transitionable. For example — "`@keyframe` animatable and transitionable (when setting `inset` properties)".

This guideline was proposed in [#30417](https://github.com/mdn/browser-compat-data/pull/30417/).
