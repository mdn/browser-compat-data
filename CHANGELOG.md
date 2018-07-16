# Changelog
All notable schema changes for this project will be documented in this file. Changes to the data, e.g. adding feature support, will _not_ be documented here.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]
### Changed
- Require `status` block for all data categories except `webextensions`. ([#2382])

## [0.0.42] - 2018-07-12
No schema changes.

## [0.0.41] - 2018-07-10
No schema changes.

## [0.0.40] - 2018-06-28
### Changed
- Standardize worker support info with the subfeature name `worker_support`. ([#2362])

## [0.0.39] - 2018-06-21
No schema changes.

## [0.0.38] - 2018-06-07
No schema changes.

## [0.0.37] - 2018-05-31
No schema changes.

## [0.0.36] - 2018-05-24
No schema changes.

## [0.0.35] - 2018-05-17
### Added
- Add a required `name` property to the browser schema. ([#2025])

## [0.0.34] - 2018-05-03
No schema changes.

## [0.0.33] - 2018-04-26
No schema changes.

## [0.0.32] - 2018-04-19
### Changed
- Disallow additional properties in release_statement. ([#1790])
- Make `prefix` and `alternative_name` mutually exclusive. ([#1836])

## [0.0.31] - 2018-04-12
### Added
- Begin tracking MathML data in the `mathml/` directory. ([#1740])

## [0.0.30] - 2018-04-05
No schema changes.

[#2382]: https://github.com/mdn/browser-compat-data/pull/2382
[#2362]: https://github.com/mdn/browser-compat-data/pull/2362
[#2025]: https://github.com/mdn/browser-compat-data/pull/2025
[#1836]: https://github.com/mdn/browser-compat-data/pull/1836
[#1790]: https://github.com/mdn/browser-compat-data/pull/1790
[#1740]: https://github.com/mdn/browser-compat-data/pull/1740

[Unreleased]: https://github.com/mdn/browser-compat-data/compare/v0.0.42...HEAD
[0.0.42]: https://github.com/mdn/browser-compat-data/compare/v0.0.41...v0.0.42
[0.0.41]: https://github.com/mdn/browser-compat-data/compare/v0.0.40...v0.0.41
[0.0.40]: https://github.com/mdn/browser-compat-data/compare/v0.0.39...v0.0.40
[0.0.39]: https://github.com/mdn/browser-compat-data/compare/v0.0.38...v0.0.39
[0.0.38]: https://github.com/mdn/browser-compat-data/compare/v0.0.37...v0.0.38
[0.0.37]: https://github.com/mdn/browser-compat-data/compare/v0.0.36...v0.0.37
[0.0.36]: https://github.com/mdn/browser-compat-data/compare/v0.0.35...v0.0.36
[0.0.35]: https://github.com/mdn/browser-compat-data/compare/v0.0.34...v0.0.35
[0.0.34]: https://github.com/mdn/browser-compat-data/compare/v0.0.33...v0.0.34
[0.0.33]: https://github.com/mdn/browser-compat-data/compare/v0.0.32...v0.0.33
[0.0.32]: https://github.com/mdn/browser-compat-data/compare/v0.0.31...v0.0.32
[0.0.31]: https://github.com/mdn/browser-compat-data/compare/v0.0.30...v0.0.31
[0.0.30]: https://github.com/mdn/browser-compat-data/compare/v0.0.29...v0.0.30
