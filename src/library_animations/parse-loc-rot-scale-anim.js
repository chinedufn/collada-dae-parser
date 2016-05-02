module.exports = ExtractAnimation

// TODO: Don't hard code dimension detection
var xyzMap = { 0: 'x', 1: 'y', 2: 'z' }
function ExtractAnimation (libraryAnimations) {
  var allKeyframes = {}
  var numAnims = Object.keys(libraryAnimations).length

  for (var i = 0; i < numAnims; i++) {
    if (libraryAnimations[i].$.id.indexOf('location') !== -1 || libraryAnimations[i].$.id.indexOf('rotation') !== -1 || libraryAnimations[i].$.id.indexOf('scale') !== -1) {
      var animationSource = libraryAnimations[i].source

      var currentKeyframes = animationSource[0].float_array[0]._.split(' ').map(Number)
      var positions = animationSource[1].float_array[0]._.split(' ').map(Number)

      // TODO: Interpolation, intangent, outtangent? Or just expect linear?
      // Depends how much of collada spec we want to support

      var xyz = xyzMap[i % 3]

      Object.keys(currentKeyframes).forEach(function (aKeyframe, index) {
        var dimension
        if (i < 3) {
          dimension = 'location'
        } else if (i < 6) {
          dimension = 'rotation'
        } else {
          dimension = 'scale'
        }

        allKeyframes[currentKeyframes[index]] = allKeyframes[currentKeyframes[index]] || {}
        allKeyframes[currentKeyframes[index]][dimension] = allKeyframes[currentKeyframes[index]][dimension] || {}
        allKeyframes[currentKeyframes[index]][dimension][xyz] = positions[index]
      })
    }
  }

  return allKeyframes
}
