module.exports = ParseLibraryAnimations

// TODO: parse interpolation. Don't hard code attribute location
function ParseLibraryAnimations (library_animations) {
  var animations = library_animations[0].animation
  animations.forEach(function (anim, index) {
    if (anim.$.id.indexOf('pose_matrix') !== -1) {
      console.log(anim.$.id)
      var currentKeyframes = anim.source[0].float_array[0]._.split(' ').map(Number)
      console.log(currentKeyframes)
      var currentJointPoseMatrices = anim.source[1].float_array[0]._.split(' ').map(Number)
      currentKeyframes.forEach(function (_, index) {
        console.log(currentJointPoseMatrices.slice(16 * index, 16 * index + 16))
      })
    }
  })
}
