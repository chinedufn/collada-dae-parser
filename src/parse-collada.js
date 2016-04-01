var parseXML = require('xml2js').parseString
// TODO: better name
var extractAnimation = require('./extract-animation.js')

module.exports = ParseCollada

// TODO:
// Parse LocRotScale animations
// Parse skeletal / skinning animations
// Use input, accessor, and param attributes instead of hard coding lookups
// Clean Up Code / less confusing var names
function ParseCollada (colladaXML, callback) {
  parseXML(colladaXML, function (err, result) {
    if (err) {
      console.log('error', err)
    }
    var parsedObject = {}
    var geometryMesh = result.COLLADA.library_geometries[0].geometry[0].mesh[0]
    var source = geometryMesh.source

    /* Vertex Positions, UVs, Normals */
    var polylistIndices = geometryMesh.polylist[0].p[0].split(' ')

    var vertexNormalIndices = []
    var vertexPositionIndices = []
    var vertexUVIndices = []
    polylistIndices.forEach(function (vertexIndex, positionInArray) {
      if (positionInArray % source.length === 0) {
        vertexPositionIndices.push(Number(vertexIndex))
      } else if (positionInArray % source.length === 1) {
        vertexNormalIndices.push(Number(vertexIndex))
      }
      if (source.length > 2 && positionInArray % source.length === 2) {
        vertexUVIndices.push(Number(vertexIndex))
      }
    })
    var vertexPositions = source[0].float_array[0]._.split(' ').map(Number)
    var vertexNormals = source[1].float_array[0]._.split(' ').map(Number)
    var vertexUVs = []
    // TODO: use input, semantics, source, offset, etc
    if (source[2]) {
      vertexUVs = source[2].float_array[0]._.split(' ').map(Number)
    }
    /* End Vertex Positions, UVs, Normals */

    /* Animations */
    // var locRotScaleAnimations = {}
    var keyframes
    var xAnimatedPositions
    var zAnimatedPositions
    // TODO: Figure out how to use interpolation/intangent/outtangent
    // Or... Do we even want to support that? Or linear only? Idk
    // but google probably does...
    if (result.COLLADA.library_animations) {
      var libraryAnimations = result.COLLADA.library_animations[0].animation

      libraryAnimations.forEach(function (animation) {
        var animationID = animation.$.id
          // X position animation
        if (animationID.indexOf('location_X') > -1) {
          var xPosLibraryAnimationSource = libraryAnimations[0].source
          keyframes = xPosLibraryAnimationSource[0].float_array[0]._.split(' ').map(Number)
          xAnimatedPositions = xPosLibraryAnimationSource[1].float_array[0]._.split(' ').map(Number)
        }
        // Z position animation
        if (animationID.indexOf('location_Z') > -1) {
          var zPosLibraryAnimationSource = libraryAnimations[2].source
          zAnimatedPositions = zPosLibraryAnimationSource[1].float_array[0]._.split(' ').map(Number)
        }
      })

      console.log(keyframes, xAnimatedPositions, zAnimatedPositions)

      parsedObject.keyframes = extractAnimation(libraryAnimations)
    }
    /* End Animations */

    // Return our parsed collada object
    parsedObject.vertexNormalIndices = vertexNormalIndices
    parsedObject.vertexNormals = vertexNormals
    parsedObject.vertexPositionIndices = vertexPositionIndices
    parsedObject.vertexPositions = vertexPositions
    if (source[2]) {
      parsedObject.vertexUVIndices = vertexUVIndices
      parsedObject.vertexUVs = vertexUVs
    }
    callback(null, parsedObject)
  })
}
