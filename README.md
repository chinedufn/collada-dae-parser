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

## CLI

Output stringified JSON to stdout

```sh
# parse from stdin
cat my-3d-model.dae | dae2json > parsed-model.json

# parse from file
dae2json my-3d-modal.dae > parsed-model.json
```

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
  }
  */
}
```

## TODO:

- [x] basic cli (potentially pull into own repo, but start here)
- [ ] rounding values. Currently lots of .999999 and 1.000001
- [ ] fix normals in demo lighting
- [ ] add a textured complex demo model
- [ ] allow zoom in, zoom out in demo
- [ ] test parser against mirrored blender collada exports (had an issue with a mirrored T-Rex model)
- [ ] toggle animation on and off
- [ ] multiple animations in demo
- [ ] full screen demo with controls overlayed
- [ ] All of the TODO: statements in code
- [ ] Allow file buffer to be passed in
- [ ] Add a GIF of every test fixture animation
- [ ] Documentation / references
- [ ] Then v1.0.0 !

## See Also

- [wavefront-obj-parser](https://github.com/chinedufn/wavefront-obj-parser)

## License

MIT
