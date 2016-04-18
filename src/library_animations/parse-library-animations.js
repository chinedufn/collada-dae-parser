var mat4Multiply = require('gl-mat4/multiply')
var mat4Scale = require('gl-mat4/scale')
var mat4Transpose = require('gl-mat4/transpose')

module.exports = ParseLibraryAnimations

// TODO: parse interpolation
// TODO: Don't hard code attribute location
// TODO: Don't assume that joint animations are in order
// TODO: Inefficient. use depth first traversal
function ParseLibraryAnimations (library_animations, jointBindPoses, visualSceneData) {
  var animations = library_animations[0].animation
  var allKeyframes = {}
  var keyframeJointMatrices = {}
  var jointRelationships = visualSceneData.jointRelationships
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
        // TODO: Seems like we need to apply library visual scene top level node
        // transformations to our top level joints
        if (!jointRelationships[animatedJointName].parent) {
          mat4Scale(currentJointMatrix, currentJointMatrix, armatureScale)
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

        var currentJointMatrix = keyframeJointMatrices[currentKeyframe][animatedJointName]
        // Needed new reference var because we were accidentally mutating our currentJointMatrix
        var jointWorldMatrix = currentJointMatrix.slice(0)

        // Multiply by parent world matrix
        var parentWorldMatrix = getParentWorldMatrix(animatedJointName, currentKeyframe, jointRelationships, keyframeJointMatrices)
        if (parentWorldMatrix) {
          // TODO: No idea why switching the multiplication order here worked.
          // Maybe something to do with fact that we're transposing? Not sure...
          // Typically supposed to be parentWorldMatrix * currentJointMatrix I believe
          mat4Multiply(jointWorldMatrix, jointWorldMatrix, parentWorldMatrix)
        }

        // Multiply our joint's inverse bind matrix
        mat4Multiply(jointWorldMatrix, jointBindPoses[animatedJointName], jointWorldMatrix)

        // Turn our row major matrix into a column major matrix. OpenGL uses column major
        mat4Transpose(jointWorldMatrix, jointWorldMatrix)

        // Trim to 6 significant figures (Maybe even 6 is more than needed?)
        jointWorldMatrix = jointWorldMatrix.map(function (val) {
          return parseFloat(val.toFixed(6))
        })

        allKeyframes[currentKeyframe].push(jointWorldMatrix)
      })
    }
  })

  return allKeyframes
}

// TODO: Test with parent -> child -> child relationship to be sure this works
// TODO: Refactor. Depth first traversal might make all of this less hacky
function getParentWorldMatrix (jointName, keyframe, jointRelationships, keyframeJointMatrices) {
  // Just a placeholder parameter for gl-matrix multiply
  var _ = []
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
