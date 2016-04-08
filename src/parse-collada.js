var parseXML = require('xml2js').parseString
// TODO: better name
var extractAnimation = require('./extract-animation.js')
var parseLibraryGeometries = require('./library_geometries/parse-library-geometries.js')
var parseLibraryVisualScenes = require('./library_visual_scenes/parse-visual-scenes.js')
var parseLibraryControllers = require('./library_controllers/parse-library-controllers.js')
var parseLibraryAnimations = require('./library_animations/parse-library-animations.js')

module.exports = ParseCollada

// TODO:
// Parse skeletal / skinning animations
// Use input, accessor, and param attributes instead of hard coding lookups
// Clean Up Code / less confusing var names
function ParseCollada (colladaXML, callback) {
  parseXML(colladaXML, function (err, result) {
    if (err) { console.log(err) }

    var parsedObject = {}
    var parsedLibraryGeometries = parseLibraryGeometries(result.COLLADA.library_geometries)

    // TODO: Also parse interpolation/intangent/outtangent
    if (result.COLLADA.library_animations) {
      parsedObject.keyframes = extractAnimation(result.COLLADA.library_animations[0].animation)
      if (Object.keys(parsedObject.keyframes).length === 0) {
        delete parsedObject.keyframes
      }
      parseLibraryAnimations(result.COLLADA.library_animations)
    }

    var joints = parseLibraryVisualScenes(result.COLLADA.library_visual_scenes)
    if (joints.length > 0) {
      parsedObject.joints = joints
    }
    if (result.COLLADA.library_controllers) {
      parseLibraryControllers(result.COLLADA.library_controllers)
    }

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
