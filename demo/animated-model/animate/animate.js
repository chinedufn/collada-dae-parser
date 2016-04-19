module.exports = Animate

function Animate (AppState) {
  orbit(AppState)
}

function orbit (AppState) {
  var currentlyPressedKeys = AppState.get().currentlyPressedKeys

  var xRadians = AppState.get().orbit.xRadians
  var yRadians = AppState.get().orbit.yRadians

  if (currentlyPressedKeys[37]) {
    // Left arrow key
    yRadians -= 0.05
  } else if (currentlyPressedKeys[39]) {
    // Right arrow key
    yRadians += 0.05
  }

  if (currentlyPressedKeys[38]) {
    // Up arrow key
    xRadians += 0.03
    if (xRadians > Math.PI / 2) {
      xRadians = Math.PI / 2 * 0.9
    }
  } else if (currentlyPressedKeys[40]) {
    // Down arrow key
    xRadians -= 0.03
    if (xRadians < 0) {
      xRadians = 0
    }
  }

  AppState.set('orbit', {xRadians: xRadians, yRadians: yRadians})
}
