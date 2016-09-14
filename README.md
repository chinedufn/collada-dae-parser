collada-dae-parser [![npm version](https://badge.fury.io/js/collada-dae-parser.svg)](http://badge.fury.io/js/collada-dae-parser) [![Build Status](https://travis-ci.org/chinedufn/collada-dae-parser.svg?branch=master)](https://travis-ci.org/chinedufn/collada-dae-parser)
===============

> Parse collada .dae file vertex positions, textures, normals and animations

[View live animated model demo](http://chinedufn.github.io/collada-dae-parser/)

![image](http://i.giphy.com/l46Ch6CIolihxVKWk.gif)

[View demo source](/demo)

## What does it do?

`collada-dae-parser` parses a [collada](https://www.khronos.org/collada/) file and outputs JSON. This is useful for displaying [skeletal animations](https://en.wikipedia.org/wiki/Skeletal_animation) in the browser. 

`collada-dae-parser` is only concerned with giving you JSON. An animation system is outside of this modules scope.

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

```js
var parseDae = require('collada-dae-parser')
var parsedCollada = parseDae(fs.readFileSync(fileName))
console.log(parsedCollada)
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
```

## TODO:

- [x] src: basic cli (potentially pull into own repo, but start here)
- [x] src: Allow file buffer to be passed in
- [x] src: Factor in bind shape matrix
- [x] src: Stop exporting bind shape matrix
- [x] demo: fix normals in demo lighting
- [x] src: Remove callback from API
- [ ] src / demo: add a textured demo model
- [ ] src: rounding values. Currently lots of .999999 and 1.000001
- [ ] src: All of the TODO: statements in code
- [ ] demo: full screen demo with controls overlay
- [ ] demo: toggle between 2 animations
- [ ] demo: Support mobile touch events
- [ ] demo: allow zoom in, zoom out in demo
- [ ] doc: Add a GIF of every test fixture animation and demo
- [ ] doc: Documentation

- [ ] A separate package that uses collada-dae-parser to implement a stateless skeletal animation system

## References

- waZim. (2010) ["Step by Step Skeletal Animation in C++ and OpenGL, Using COLLADA Part 1](http://www.wazim.com/Collada_Tutorial_1.htm) & [Part 2](http://www.wazim.com/Collada_Tutorial_2.htm)"
    - Heavily informed the initial parser
- Markus Ruh. (2012) [Vertex Skinning](http://ruh.li/AnimationVertexSkinning.html)
    - Heavily informed the vertex skinning in the initial demo vertex shader
- Jerimiah van Oosten. (2011) "[GPU Skinning of MD5 Models in OpenGL and Cg](http://www.3dgep.com/gpu-skinning-of-md5-models-in-opengl-and-cg/)"
    - Heavily informed the vertex skinning in the initial demo vertex shader

## See Also

- [wavefront-obj-parser](https://github.com/chinedufn/wavefront-obj-parser)
- 

## Credits

- [Ben Houston](https://clara.io/user/bhouston) for the [3d male figure model](https://clara.io/view/d49ee603-8e6c-4720-bd20-9e3d7b13978a/webgl)

## License

MIT
