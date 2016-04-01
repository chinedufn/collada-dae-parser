var parseXML = require('xml2js').parseString
// TODO: better name
var extractAnimation = require('./extract-animation.js')
var parseLibraryGeometries = require('./library_geometries/parse-library-geometries.js')

module.exports = ParseCollada

// TODO:
// Parse LocRotScale animations
// Parse skeletal / skinning animations
// Use input, accessor, and param attributes instead of hard coding lookups
// Clean Up Code / less confusing var names
function ParseCollada (colladaXML, callback) {
  parseXML(colladaXML, function (err, result) {
    if (err) { console.log(err) }
    var parsedObject = {}
    var parsedLibraryGeometries = parseLibraryGeometries(result.COLLADA.library_geometries)

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
    parsedObject.vertexNormalIndices = parsedLibraryGeometries.vertexNormalIndices
    parsedObject.vertexNormals = parsedLibraryGeometries.vertexNormals
    parsedObject.vertexPositionIndices = parsedLibraryGeometries.vertexPositionIndices
    parsedObject.vertexPositions = parsedLibraryGeometries.vertexPositions
    if (parsedLibraryGeometries.vertexUVs.length > 0) {
      parsedObject.vertexUVIndices = parsedLibraryGeometries.vertexUVIndices
      parsedObject.vertexUVs = parsedLibraryGeometries.vertexUVs
    }
    callback(null, parsedObject)
  })
}
