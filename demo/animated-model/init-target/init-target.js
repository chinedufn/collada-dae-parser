module.exports = InitTarget

function InitTarget (AppState) {
  return {
    animation: require('../animate/animation-target.js')(AppState)
    // mouse: require('../control/mouse-target.js')(AppState),
    // touch: require('../control/touch-target.js')(AppState)
  }
}
