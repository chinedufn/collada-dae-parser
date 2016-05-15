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
- [x] fix normals in demo lighting
- [ ] add a textured complex demo model
- [ ] allow zoom in, zoom out in demo
- [x] Factor in bind shape matrix
- [x] Stop exporting bind shape matrix
- [ ] toggle between 2 animations
- [ ] multiple animations in demo
- [ ] full screen demo with controls overlay
- [ ] All of the TODO: statements in code
- [ ] Allow file buffer to be passed in
- [ ] Add a GIF of every test fixture animation and demo
- [ ] Documentation / references

- We might want another module to export the raw useful data.. Then we can transform it / add opinions higher up.

## References

- waZim. (2010) ["Step by Step Skeletal Animation in C++ and OpenGL, Using COLLADA Part 1](http://www.wazim.com/Collada_Tutorial_1.htm) & [Part 2](http://www.wazim.com/Collada_Tutorial_2.htm)"
    - Heavily informed the initial parser
- Markus Ruh. (2012) [Vertex Skinning](http://ruh.li/AnimationVertexSkinning.html)
    - Heavily informed the vertex skinning in the initial demo vertex shader
- Jerimiah van Oosten. (2011) "[GPU Skinning of MD5 Models in OpenGL and Cg](http://www.3dgep.com/gpu-skinning-of-md5-models-in-opengl-and-cg/)"
    - Heavily informed the vertex skinning in the initial demo vertex shader

## See Also

- [wavefront-obj-parser](https://github.com/chinedufn/wavefront-obj-parser)

## License

MIT
