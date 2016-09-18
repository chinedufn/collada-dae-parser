var EventEmitter = require('events')

var animationDictionary = {
  'bend': [0, 4],
  'jump': [4, 9]
}

module.exports = InitAnimationTarget

function InitAnimationTarget (AppState) {
  var AnimationTarget = new EventEmitter()
  AnimationTarget.on('toggle', ToggleAnimation.bind(null, AppState))

  return AnimationTarget
}

// We have two animations
//  This switches from one animation to the other
function ToggleAnimation (AppState) {
  var state = AppState.get()
  if (
    state.currentAnimation[0] === animationDictionary.bend[0] &&
    state.currentAnimation[1] === animationDictionary.bend[1]
  ) {
    state.currentAnimation = animationDictionary.jump
  } else {
    state.currentAnimation = animationDictionary.bend
  }

  AppState.set(state)
}
