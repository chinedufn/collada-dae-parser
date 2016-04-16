var transpose = require('gl-mat4/transpose')
// var mat4Multiply = require('gl-mat4/multiply')

module.exports = ParseLibraryAnimations

// TODO: parse interpolation
// TODO: Don't hard code attribute location
// TODO: Don't assume that joint animations are in order
function ParseLibraryAnimations (library_animations) {
  var animations = library_animations[0].animation
  var allKeyframes = {}

  // TODO: This is a temporary manual insert of the two skinned cube
  // inverse bind matrices. This fixes the animation!!
  // Now we need to get this in via code
  /*
  var count = 0
  var invBinds = [
    [1, 0, 0, -2.800068, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0.01319289, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1]
  ]
  */

  animations.forEach(function (anim, index) {
    if (anim.$.id.indexOf('pose_matrix') !== -1) {
      var currentKeyframes = anim.source[0].float_array[0]._.split(' ').map(Number)

      var currentJointPoseMatrices = anim.source[1].float_array[0]._.split(' ').map(Number)
      currentKeyframes.forEach(function (_, index) {
        allKeyframes[currentKeyframes[index]] = allKeyframes[currentKeyframes[index]] || []
        var currentJointMatrix = currentJointPoseMatrices.slice(16 * index, 16 * index + 16)
        // Turn our row major matrix into a column major matrix. OpenGL uses column major
        // mat4Multiply(currentJointMatrix, invBinds[count], currentJointMatrix)
        transpose(currentJointMatrix, currentJointMatrix)
        allKeyframes[currentKeyframes[index]].push(currentJointMatrix)
      })
    }
  })

  return allKeyframes
}
