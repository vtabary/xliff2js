# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Support `#` character as interpolation string in addition to `<x id="INTERPOLATION" />` tag in ICU messages plural forms

## [0.6.0] - 2023-07-13

### Fixed

- Build XLIFF using properly given plural key at parse time

## [0.5.2] - 2023-04-28

### Added

- Export IXliffPlural interface in public api

## [0.5.1] - 2023-04-27

### Fixed

- Update IXliffTarget to restore the name

## [0.5.0] - 2023-04-27

### BREAKING CHANGES

- Plural source and target are now parsed into a IXliffPlural

### Changed

- Use fast-xml-parser instead of xml-builder

## [0.4.0] - 2023-04-27

### Changed

- Use fast-xml-parser instead of sax

## [0.3.1] - 2023-04-27

### Fixed

- NPM package was missing the dist files

## [0.3.0] - 2023-04-26

### Added

- Add ability to determine builder options to format the build result

## [0.2.1] - 06/10/2019

### Fixed

- Add missing properties on XLIFF interfaces

## [0.2.0] - 05/10/2019

### Added

- Add a interface IXliff to describe the xliff file structure

## [0.1.0] - 04/10/2019

### Added

- Add the XliffParser class
- Add the XliffBuilder class
