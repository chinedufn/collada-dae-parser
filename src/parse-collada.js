var xmlparser = require('xml-parser')
var parseLibraryGeometries = require('./library_geometries/parse-library-geometries.js')
var parseLibraryVisualScenes = require('./library_visual_scenes/parse-visual-scenes.js')
var parseLibraryControllers = require('./library_controllers/parse-library-controllers.js')
var parseSkeletalAnimations = require('./library_animations/parse-skeletal-animations.js')
var parseLocRotScaleAnim = require('./library_animations/parse-loc-rot-scale-anim.js')
var validateNoControlBones = require('./validation/no-control-bones.js')

module.exports = ParseCollada

// TODO:
// Use input, accessor, and param attributes instead of hard coding lookups
// Clean Up Code / less confusing var names
function ParseCollada (colladaXML) {
  var result = compactXML({}, xmlparser(colladaXML.toString()).root)
  result = { COLLADA: result.COLLADA[0] }

  var parsedObject = {}
  var parsedLibraryGeometries = parseLibraryGeometries(result.COLLADA.library_geometries)

  var visualSceneData = parseLibraryVisualScenes(result.COLLADA.library_visual_scenes)

  // The joint parents aren't actually joint parents so we get the joint parents..
  // This lib needs a refactor indeed
  // jointParents = {childBone: 'parentBone', anotherChild: 'anotherParent'}
  var jointParents
  if (Object.keys(visualSceneData.jointParents).length) {
    jointParents = Object.keys(visualSceneData.jointParents)
    .reduce(function (jointParents, jointName) {
      // JSON.stringify {foo: undefined} = {}, os we replace undefined with null
      // to make sure that we don't lose any keys
      jointParents[jointName] = visualSceneData.jointParents[jointName].parent || null
      return jointParents
    }, {})
  }

  var jointInverseBindPoses
  var controllerData
  if (result.COLLADA.library_controllers) {
    controllerData = parseLibraryControllers(result.COLLADA.library_controllers)
    if (controllerData.vertexJointWeights && Object.keys(controllerData.vertexJointWeights).length > 0) {
      parsedObject.vertexJointWeights = controllerData.vertexJointWeights
      parsedObject.jointNamePositionIndex = controllerData.jointNamePositionIndex
      parsedObject.jointInverseBindPoses = controllerData.jointInverseBindPoses
      jointInverseBindPoses = controllerData.jointInverseBindPoses

      // The parser only supports deformation bones. Control bones' affects must be baked in before exporting
      validateNoControlBones(Object.keys(visualSceneData.jointParents), Object.keys(jointInverseBindPoses))
    }
  }

  // TODO: Also parse interpolation/intangent/outtangent
  if (result.COLLADA.library_animations) {
    parsedObject.keyframes = parseLocRotScaleAnim(result.COLLADA.library_animations[0].animation)
    if (Object.keys(parsedObject.keyframes).length === 0) {
      delete parsedObject.keyframes
    }
    var keyframes = parseSkeletalAnimations(result.COLLADA.library_animations, jointInverseBindPoses, visualSceneData, controllerData.jointNamePositionIndex)
    if (Object.keys(keyframes).length > 0) {
      parsedObject.keyframes = keyframes
    }
  }

  // Return our parsed collada object
  parsedObject.vertexNormalIndices = parsedLibraryGeometries.vertexNormalIndices
  parsedObject.vertexNormals = parsedLibraryGeometries.vertexNormals
  parsedObject.vertexPositionIndices = parsedLibraryGeometries.vertexPositionIndices
  parsedObject.vertexPositions = parsedLibraryGeometries.vertexPositions
  if (controllerData.armatureName) {
    parsedObject.armatureName = controllerData.armatureName
  }
  if (jointParents) {
    parsedObject.jointParents = jointParents
  }
  if (parsedLibraryGeometries.vertexUVs.length > 0) {
    parsedObject.vertexUVIndices = parsedLibraryGeometries.vertexUVIndices
    parsedObject.vertexUVs = parsedLibraryGeometries.vertexUVs
  }
  return parsedObject
}

/**
 * We used to use a different XML parsing library. This recursively transforms
 * the data that we get from our new XML parser to match the old one. This is a
 * stopgap measure until we get around to changing the keys that we look while we parse to
 * the keys that the new parser expects
 */
function compactXML (res, xml) {
  var txt = Object.keys(xml.attributes).length === 0 && xml.children.length === 0
  var r = {}
  if (!res[xml.name]) res[xml.name] = []
  if (txt) {
    r = xml.content || ''
  } else {
    r.$ = xml.attributes
    r._ = xml.content || ''
    xml.children.forEach(function (ch) {
      compactXML(r, ch)
    })
  }
  res[xml.name].push(r)
  return res
}
