collada-dae-parser [![npm version](https://badge.fury.io/js/collada-dae-parser.svg)](http://badge.fury.io/js/collada-dae-parser) [![Build Status](https://travis-ci.org/chinedufn/collada-dae-parser.svg?branch=master)](https://travis-ci.org/chinedufn/collada-dae-parser)
===============

> Parse collada .dae file vertex positions, textures, normals and animations

[View live demo](http://chinedufn.github.io/collada-dae-parser/)

## WIP

This package is a work in progress so check back later.

Will be adding an api, cli, and example gh-pages

## To Install

```sh
$ npm install --save collada-dae-parser
```

## Usage

## CLI

## API

### `parseDae(xmlString, callback)` -> `object`

#### xmlString

*Required*

Type: `string`

Your collada file as a string

#### callback

*Required*

Type: `function`

```js
function (err, parsedDaeObject) {
  console.log(parsedDaeObject)
  /*
  {
    bindShapeMatrix: [...],
    keyframes: {...},
    vertexNormalIndices: [...],
    vertexNormals: [...],
    vertexPositionIndices: [...],
    vertexPositions: [...],
    vertexUVIndices: [...],
    vertexUVs: [...]
    // The rest is TODO
  }
  */
}
```

## TODO:

- [ ] basic cli (potentially pull into own repo, but start here)
- [ ] rounding values. Currently lots of .999999 and 1.000001
- [ ] fix normals in demo lighting
- [ ] add a textured T-Rex demo model
- [ ] All of the TODO: statements in code
- [ ] Allow file buffer to be passed in
- [ ] Documentation / references
- [ ] Then v1.0.0 !

## See Also

- [wavefront-obj-parser](https://github.com/chinedufn/wavefront-obj-parser)

## License

MIT
