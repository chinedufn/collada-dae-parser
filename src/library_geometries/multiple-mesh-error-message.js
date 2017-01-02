module.exports = generateMultipleMeshError

/*
 * We currently only support collada files with one mesh (geometry)
 *  Generate an error message when the collada data contains multiple
 *  geometries
 */
// TODO: Give a different error message if there are 0 meshes
//  ... it looks like you did not export a mesh ...
//  Add a test for this
function generateMultipleMeshError (numMeshes) {
  throw new Error(
    `
    It looks like you're trying to parse a model that has ${numMeshes} geometries.

    collada-dae-parser only supports collada files with 1 geometry.

    You might try opening your model in your favorite modeling tool and joining
    your geometries into one.

    Here's some documentation on how to do it in Blender:

    https://github.com/chinedufn/collada-dae-parser/blob/master/docs/blender-export/blender-export.md#multiple-meshes
    `
  )
}
