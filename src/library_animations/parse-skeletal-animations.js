var mat4Multiply = require('gl-mat4/multiply')
var mat4Scale = require('gl-mat4/scale')
var mat4Transpose = require('gl-mat4/transpose')

module.exports = parseLibraryAnimations

/**
 * Parse skinned animations from the libraryAnimations section of the collada file.
 * We only handle skinned animations here, regular location/rotation/scale animations
 * that apply to the entire mesh are handled in parse-loc-rot-scale.js
 * tl;dr if your model has animated bones/joints then that gets handled here
 *
 * TODO: parse interpolation? or just only support linear interpolation?
 * TODO: Don't hard code attribute location
 * TODO: Make use of require('local-bone-to-world-bone')
 */
function parseLibraryAnimations (libraryAnimations, jointInverseBindPoses, visualSceneData, jointNamePositionIndex) {
  var animations = libraryAnimations[0].animation
  var allKeyframes = {}
  var keyframeJointMatrices = {}
  var jointParents = visualSceneData.jointParents
  var armatureScale = visualSceneData.armatureScale

  // First pass.. get all the joint matrices
  animations.forEach(function (anim, animationIndex) {
    if (anim.$.id.indexOf('pose_matrix') !== -1) {
      // TODO: Is this the best way to get an animations joint target?
      var animatedJointName = anim.channel[0].$.target.split('/')[0]

      var currentKeyframes = anim.source[0].float_array[0]._.split(' ').map(Number)

      var currentJointPoseMatrices = anim.source[1].float_array[0]._.split(' ').map(Number)

      currentKeyframes.forEach(function (_, keyframeIndex) {
        keyframeJointMatrices[currentKeyframes[keyframeIndex]] = keyframeJointMatrices[currentKeyframes[keyframeIndex]] || {}
        var currentJointMatrix = currentJointPoseMatrices.slice(16 * keyframeIndex, 16 * keyframeIndex + 16)
        if (!jointParents[animatedJointName].parent) {
          // apply library visual scene transformations to top level parent joint(s)
          if (armatureScale) {
            mat4Scale(currentJointMatrix, currentJointMatrix, armatureScale)
          }
        }

        keyframeJointMatrices[currentKeyframes[keyframeIndex]][animatedJointName] = currentJointMatrix
      })
    }
  })
  // Second pass.. Calculate world matrices
  animations.forEach(function (anim, animationIndex) {
    if (anim.$.id.indexOf('pose_matrix') !== -1) {
      var animatedJointName = anim.channel[0].$.target.split('/')[0]
      var currentKeyframes = anim.source[0].float_array[0]._.split(' ').map(Number)
      currentKeyframes.forEach(function (_, keyframeIndex) {
        var currentKeyframe = currentKeyframes[keyframeIndex]
        allKeyframes[currentKeyframes[keyframeIndex]] = allKeyframes[currentKeyframe] || []

        // Multiply by parent world matrix
        var jointWorldMatrix = getParentWorldMatrix(animatedJointName, currentKeyframe, jointParents, keyframeJointMatrices)

        // Multiply our joint's inverse bind matrix
        mat4Multiply(jointWorldMatrix, jointInverseBindPoses[jointNamePositionIndex[animatedJointName]], jointWorldMatrix)

        // Turn our row major matrix into a column major matrix. OpenGL uses column major
        mat4Transpose(jointWorldMatrix, jointWorldMatrix)

        // Trim to 6 significant figures (Maybe even 6 is more than needed?)
        jointWorldMatrix = jointWorldMatrix.map(function (val) {
          return parseFloat(val.toFixed(6))
        })

        allKeyframes[currentKeyframe][jointNamePositionIndex[animatedJointName]] = jointWorldMatrix
      })
    }
  })

  return allKeyframes
}

// TODO: Refactor. Depth first traversal might make all of this less hacky
function getParentWorldMatrix (jointName, keyframe, jointParents, keyframeJointMatrices) {
  // child -> parent -> parent -> ...
  var jointMatrixTree = foo(jointName, keyframe, jointParents, keyframeJointMatrices)
  // TODO: Revisit this. Thrown in to pass tests. Maybe just return `jointMatrix`
  // when there aren't any parent matrices to factor in
  var worldMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
  jointMatrixTree.forEach(function (jointMatrix) {
    // TODO: Still not sure why we multiply in this order
    mat4Multiply(worldMatrix, worldMatrix, jointMatrix)
  })
  return worldMatrix
}

// TODO: Clean up... well.. at least it works now :sweat_smile:
function foo (jointName, keyframe, jointParents, keyframeJointMatrices) {
  var jointMatrix = keyframeJointMatrices[keyframe][jointName]
  var parentJointName = jointParents[jointName].parent
  if (parentJointName) {
    return [jointMatrix].concat(foo(parentJointName, keyframe, jointParents, keyframeJointMatrices))
  }
  return [jointMatrix]
}
