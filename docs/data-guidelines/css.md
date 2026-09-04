# Data guidelines for CSS features

This file contains guidelines that are specific to the CSS features (`css/`).

## Animatable and transitionable

Use the key name `is_animatable` to capture data describing when a feature was made `@keyframe` animatable (but not transitionable), or `@keyframe` animatable _and_ transitionable. The `description` field should be set to "`@keyframe` animatable" when the data point describes when a feature was made `@keyframe` animatable, or "`@keyframe` animatable and transitionable" when the data point describes when a feature was made `@keyframe` animatable and transitionable.

Use the key name `is_transitionable` to capture data describing when a feature was made transitionable (but not `@keyframe` animatable). The `description` field should be set to "Transitionable" when the data point describes when a feature was made transitionable.

The `description` also has an optional suffix: `when x`, where `x` is a particular condition under which the feature is animatable and/or transitionable. For example — "`@keyframe` animatable and transitionable when setting `inset` properties".

This guideline was proposed in [#30417](https://github.com/mdn/browser-compat-data/pull/30417/).
