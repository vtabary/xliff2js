# @vtabary/xliff2js

Tools to manipulate XLIFF contents.

[![Build Status](https://travis-ci.org/vtabary/xliff2js.svg?branch=master)](https://travis-ci.org/vtabary/xliff2js)

## Installation

```sh
# Use npm
npm install @vtabary/xliff2js

# Or use yarn
yarn add @vtabary/xliff2js
```

## Class: XliffParser

Converts a XLIFF string into a JSON object.

### Usage

```js
var XliffParser = require('xliff2js').XliffParser;
var obj = new XliffParser().parse('</root><root>');
console.log(JSON.stringify(obj, undefined, 2));

// displays :
// { name: 'root', '$': {}, children: [] }
```

### constructor()

#### Options

No option available.

### #parse(xml: string): IXliff

#### Options

* `xml` an XLIFF valid as a string

## Class: XliffBuilder

Converts a JSON object to XLIFF string.

### Usage

```js
var XliffBuilder = require('xliff2js').XliffBuilder;
var str = new XliffBuilder({ pretty: true }).build({
  name: 'xliff',
  $: {},
  children: []
});
console.log(str);

// displays :
// '<?xml version="1.0"?><xliff/>'
```

### constructor(options)

#### Options

* `pretty` indents tags in result. Default: false.

### #build(object: IXliff): string

#### Options

* `object` a JSON object matching
