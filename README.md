collada-dae-parser [![npm version](https://badge.fury.io/js/collada-dae-parser.svg)](http://badge.fury.io/js/collada-dae-parser) [![Build Status](https://travis-ci.org/chinedufn/collada-dae-parser.svg?branch=master)](https://travis-ci.org/chinedufn/collada-dae-parser)
===============

> Parse collada .dae file vertex positions, textures, normals and animations

[View live animated model demo](http://chinedufn.github.io/collada-dae-parser/)

![image](http://i.giphy.com/l46Ch6CIolihxVKWk.gif)

[View demo source](/demo)

## What does it do?

`collada-dae-parser` parses a [collada](https://www.khronos.org/collada/) file and outputs JSON. This is useful for displaying [skeletal animations](https://en.wikipedia.org/wiki/Skeletal_animation) in the browser.

`collada-dae-parser` is only concerned with giving you JSON. An animation system is outside of this modules scope, but [skeletal-animation-system](https://github.com/chinedufn/skeletal-animation-system) could be a useful start.

## To Install

```sh
# API
$ npm install --save collada-dae-parser
# CLI
$ npm install -g collada-dae-parser
```

## Making use of the parser

If you're unfamiliar with skeletal animation, the demo is a good starting point. Here's where we're [parsing our `collada` file and buffering our graphics data](https://github.com/chinedufn/collada-dae-parser/blob/master/demo/animated-model/3d-model/load-model.js). We're parsing at runtime in the demo, but in a real application you'd want to parse your collada files during a build step.

```sh
# Run the demo locally. Changes to the `src` and `demo` directories will live reload in your browser
# PRs and issues are welcome!
git clone https://github.com/chinedufn/collada-dae-parser
cd collada-dae-parser
npm install
npm run demo
```

## Collada Support

`collada-dae-parser` tries to be useful for WebGL games and interactive demos, but does not try to support the entire collada spec. If you're trying to parse a model
that is not supported, `collada-dae-parser` will try to let you know how to tweak it.

![image](https://cloud.githubusercontent.com/assets/2099811/19274522/621af72a-8f9e-11e6-969f-6f51b2f45a4c.png)

## CLI

Output stringified JSON to stdout

```sh
# parse from stdin
cat my-3d-model.dae | dae2json > parsed-model.json

# parse from file
dae2json my-3d-modal.dae > parsed-model.json
```

## API

### `parseDae(xmlFile)` -> `object`

This function returns the parsed collada object.

#### xmlFile

*Required*

Type: `string` or `Buffer`

Your collada file data. Not the filename, the file contents.

#### Returned Object

TODO: Document this

```js
var parseDae = require('collada-dae-parser')
var parsedCollada = parseDae(fs.readFileSync(fileName))
console.log(parsedCollada)
/*
  {
    jointNamePositionIndex: {...},
    jointInverseBindPoses: {...},
    keyframes: {...},
    vertexNormalIndices: [...],
    vertexNormals: [...],
    vertexPositionIndices: [...],
    vertexPositions: [...],
    vertexUVIndices: [...],
    vertexUVs: [...]
  }
*/
```

##### jointNamePositionIndex

Type: `Object`

lorem ipsum

##### jointInverseBindPoses

Type: `Object`

lorem ipsum

##### keyframes

Type: `Object`

lorem ipsum

##### vertexNormalIndices

Type: `Array`

lorem ipsum

##### vertexNormals

Type: `Array`

lorem ipsum

##### vertexPositionIndices

Type: `Array`

lorem ipsum

##### vertexPositions

Type: `Array`

lorem ipsum

##### vertexUVIndices

Type: `Array`

lorem ipsum

##### vertexUVs

Type: `Array`

lorem ipsum

## TODO:

- [x] src: basic cli (potentially pull into own repo, but start here)
- [x] src: Allow file buffer to be passed in
- [x] src: Factor in bind shape matrix
- [x] src: Stop exporting bind shape matrix
- [x] demo: fix normals in demo lighting
- [x] demo: toggle between 2 animations
- [x] src: Remove callback from API
- [x] warning: Throw descriptive error message if user attempts to export multiple geometries
- [x] A separate package that uses collada-dae-parser to implement a stateless skeletal animation system
- [ ] src / demo: add a textured demo model
- [ ] src: rounding values. Currently lots of .999999 and 1.000001
- [ ] src: All of the TODO: statements in code
- [ ] demo: full screen demo with controls overlay
- [ ] demo: Support mobile touch events
- [ ] demo: allow zoom in, zoom out in demo
- [ ] doc: Add a GIF of every test fixture animation and demo
- [ ] doc: Documentation
- [ ] warning: Somehow let the user know if their joints use non rigid transforms - until we actually support this
- [ ] warning: You didn't export a geometry. Link them to the documentation
- [ ] warning: If the base model or armature's location, translation and scale aren't 1.0 let user know that we don't support that. They should apply location, translation and scale before exporting
- [ ] research: Look into supporting library materials

## References

- waZim. (2010) ["Step by Step Skeletal Animation in C++ and OpenGL, Using COLLADA Part 1](http://www.wazim.com/Collada_Tutorial_1.htm) & [Part 2](http://www.wazim.com/Collada_Tutorial_2.htm)"
    - Heavily informed the initial parser
- Markus Ruh. (2012) [Vertex Skinning](http://ruh.li/AnimationVertexSkinning.html)
    - Heavily informed the vertex skinning in the initial demo vertex shader
- Jerimiah van Oosten. (2011) "[GPU Skinning of MD5 Models in OpenGL and Cg](http://www.3dgep.com/gpu-skinning-of-md5-models-in-opengl-and-cg/)"
    - Heavily informed the vertex skinning in the initial demo vertex shader

## See Also

- [load-collada-dae](https://github.com/chinedufn/load-collada-dae)
- [skeletal-animation-system](https://github.com/chinedufn/skeletal-animation-system)
- [wavefront-obj-parser](https://github.com/chinedufn/wavefront-obj-parser)

## Credits

- [Ben Houston](https://clara.io/user/bhouston) for the [3d male figure model](https://clara.io/view/d49ee603-8e6c-4720-bd20-9e3d7b13978a/webgl)

## License

MIT
