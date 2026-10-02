# Data guidelines for CSS features

This file contains guidelines that are specific to the CSS features (`css/`).

## Animatable and transitionable

Use the key name `is_animatable` to capture data describing when a feature was made `@keyframe` animatable and transitionable. If a browser supports the feature as exclusively `@keyframe` animatable or exclusively transitionable, then set `partial_implementation` to `true`.

Such features should have the `description` field set to ``"`@keyframe` animatable and transitionable"``.

The `description` can have an optional parenthetical suffix: `(x)`, where `x` is a particular condition under which the feature is animatable and/or transitionable. For example — ``"`@keyframe` animatable and transitionable (when setting `inset` properties)"``.

This guideline was proposed in [#30417](https://github.com/mdn/browser-compat-data/pull/30417/).

## Contexts and layout modes

Different contexts or layout modes can mean different support data depending on how the CSS features are used.

Use a sub-feature like `context_grid` with description text `Supported in Grid Layout` to record data about a feature's support in Grid Layout mode.

For example, the `align-self` CSS property has Grid Layout mode support, recorded like this:

```json
{
  "css": {
    "properties": {
      "align-self": {
        "__compat": {},
        "context_grid": {
          "__compat": {
            "description": "Supported in Grid Layout",
            "support": {}
          }
        }
      }
    }
  }
}
```

As it is the case with any CSS property, its values are recorded at the top-level of the CSS property data and not nested inside the `context_grid` sub-feature.

If a CSS property value is already supported but a new context adds new meaning to CSS property value, the value is not recorded separately either. The information about the new context support can be obtained from the `context_grid` key.

However, if the contextual value support is different to that context's support, record a sub-feature like `stretch_in_flex` inside the `context_flex` feature.

For example, the `align-self` property has this data structure:

- css.properties.align-self
  - context_flex
    - stretch_in_flex (different to the original stretch as well as different to context_flex)
  - context_grid
  - context_position_absolute
  - (... other values)
  - stretch (the original stretch implementation)
