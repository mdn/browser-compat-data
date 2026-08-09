# Data guidelines for CSS features

This file contains guidelines that are specific to CSS features (`css/`).

## CSS feature categories

BCD records CSS compatibility data in four categories:

- at-rules (`css/at-rules/`)
- properties (`css/properties/`)
- selectors (`css/selectors/`)
- types (`css/types/`)

Record a CSS construct as a BCD feature when it represents a meaningful browser compatibility feature.

A CSS construct being defined as a grammar production or named type in a specification is not, by itself, sufficient reason to create a BCD feature.

## CSS types

Record a CSS type as a feature when it has an independently meaningful compatibility story.

For example, reusable types such as `<length>` and `<basic-shape>` have their own compatibility data. Components of these types can also be recorded when they have independently observable support.

A CSS type may be used by multiple properties. Do not duplicate compatibility data for a type under every property that accepts it.

When a CSS type is used by a property, add a subfeature under the property only when there is a meaningful compatibility distinction that cannot be represented by the parent feature or the standalone type.

## Syntax and grammar constructs

Do not create BCD features solely to represent syntax or grammar constructs.

A type-like grammar construct that is only used as part of one property's syntax does not necessarily need its own entry in `css/types/`.

Do not represent a syntax construct unless there are material differences in browser support for that syntax. If such differences exist, represent the behavioral difference as a subfeature of the relevant CSS feature.

## CSS values and functions

CSS values and functions can be represented as subfeatures of their parent type or property when they have independently observable compatibility.

For example, `<basic-shape>` has subfeatures such as `circle()`, `ellipse()`, `path()`, `rect()`, and `shape()`. These functions can have their own compatibility data when their support differs from the parent type or when they have a distinct compatibility story.

Likewise, individual values or syntax variants can be recorded directly under a property when they have meaningful compatibility differences.

Avoid adding an intermediate syntax or type feature merely to group values that have no independent compatibility story.

## Context-dependent support

When a CSS feature has different support depending on the property or context in which it is used, record the compatibility difference at the appropriate feature level.

For example, if a value is initially supported only for one property and later supported more broadly, record the relevant support difference on the appropriate subfeature and use notes or `partial_implementation` where applicable.

Do not mark a general CSS type as fully supported based only on support in one consuming property.

## Testing CSS support

Do not equate parser acceptance with complete support for a CSS feature.

A browser accepting a value in a CSS property may only demonstrate that the value is recognized syntactically. It does not necessarily demonstrate that the feature has its specified behavior.

When compatibility cannot be established from existing data, use appropriate implementation evidence or a collector test to verify support.

For example, when investigating a CSS type used by a property, test the behavior that the type provides rather than only checking whether the browser accepts the value.

## Named values

When individual CSS keywords or values have meaningful compatibility differences, they may be recorded as direct subfeatures of the relevant property, at-rule, selector, or type.

Do not introduce an additional type or syntax layer solely to group values when the intermediate feature has no independent compatibility story.

## Examples

### `<length>`

`<length>` is a reusable CSS type with its own compatibility data. Individual length units such as `rem` and `Q` can also have their own data because their support differs independently.

### `<basic-shape>`

`<basic-shape>` is a reusable type with independently supported functions such as `circle()`, `path()`, `rect()`, and `shape()`. These functions can have their own compatibility data when their support differs.

### `:nth-child()`

`:nth-child()` has subfeatures for independently supported behavior such as `of <selector>` syntax.

### `@container`

`@container` contains independently supported capabilities such as scroll-state queries and style queries. These can be represented as subfeatures because their support differs from the base at-rule.

### `<animation-action>`

The `<animation-action>` syntax used by `animation-trigger` illustrates when not to create a separate BCD feature. In the discussion of [#29034](https://github.com/mdn/browser-compat-data/pull/29034), maintainers concluded that the syntax itself should not be represented unless there are material differences in browser support for the syntax.

The individual keywords can instead be represented directly under the `animation-trigger` property when useful.

This guideline is based in part on the discussions in [#28838](https://github.com/mdn/browser-compat-data/issues/28838), [#28913](https://github.com/mdn/browser-compat-data/issues/28913), [#29034](https://github.com/mdn/browser-compat-data/pull/29034), and [#6349](https://github.com/mdn/browser-compat-data/issues/6349).
