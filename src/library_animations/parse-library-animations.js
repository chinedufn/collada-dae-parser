var mat4Create = require('gl-mat4/create')
var mat4Copy = require('gl-mat4/copy')
var transpose = require('gl-mat4/transpose')
var mat4Multiply = require('gl-mat4/multiply')

module.exports = ParseLibraryAnimations

// TODO: parse interpolation
// TODO: Don't hard code attribute location
// TODO: Don't assume that joint animations are in order
// TODO: Extend joint info into one param and pass in
// TODO: Extremely inefficient
function ParseLibraryAnimations (library_animations, jointBindPoses, jointRelationships, orderedJointNames) {
  var animations = library_animations[0].animation
  var allKeyframes = {}
  var keyframeJointMatrices = {}

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
        // TODO: Seems like we need to apply library visual scene top level node
        // transformations to our top level joints
        if (animationIndex === 0) {
          require('gl-mat4/scale')(currentJointMatrix, currentJointMatrix, [4.154898, 4.154898, 4.154898])
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
        allKeyframes[currentKeyframes[keyframeIndex]] = allKeyframes[currentKeyframes[keyframeIndex]] || []

        var currentJointMatrix = keyframeJointMatrices[currentKeyframes[keyframeIndex]][animatedJointName]
        var bar = mat4Create()
        // require('gl-mat4/scale')(currentJointMatrix, currentJointMatrix, [4.154898, 4.154898, 4.154898])

        // Multiply by parent world matrix
        var parentWorldMatrix = getParentWorldMatrix(animatedJointName, currentKeyframes[keyframeIndex], jointRelationships, keyframeJointMatrices)
        if (parentWorldMatrix) {
          // TODO: No idea why switching the multiplication order here worked.
          // Maybe something to do with fact that we're transposing? Not sure...
          // Typically supposed to be parentWorldMatrix * currentJointMatrix I believe
          mat4Multiply(bar, currentJointMatrix, parentWorldMatrix)
        } else {
          bar = mat4Copy(bar, currentJointMatrix)
        }

        // Multiply our joint's inverse bind matrix
        mat4Multiply(bar, jointBindPoses[animatedJointName], bar)

        // Turn our row major matrix into a column major matrix. OpenGL uses column major
        transpose(bar, bar)
        allKeyframes[currentKeyframes[keyframeIndex]].push(bar)
      })
    }
  })

  if (orderedJointNames) {
    orderedJointNames.forEach(function (jointName) {
      jointRelationships[jointName].parent
    })
  }

  return allKeyframes
}

// TODO: Test with parent -> child -> child relationship to be sure this works
// TODO: Refactor. Depth first traversal might make all of this less hacky
function getParentWorldMatrix (jointName, keyframe, jointRelationships, keyframeJointMatrices) {
  var _ = mat4Create()
  var parentJointName = jointRelationships[jointName].parent
  if (parentJointName) {
    var parentJointMatrix = keyframeJointMatrices[keyframe][parentJointName]
    var parentWorldMatrix
    if (jointRelationships[parentJointName].parent) {
      parentWorldMatrix = mat4Multiply(_, getParentWorldMatrix(parentJointName, keyframe, jointRelationships, keyframeJointMatrices), parentJointMatrix)
    }
    return parentWorldMatrix || parentJointMatrix
  }
  return
}
