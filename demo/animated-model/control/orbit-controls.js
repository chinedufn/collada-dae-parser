module.exports = InitOrbitControls

function InitOrbitControls (AppState) {
  document.onkeyup = function (event) {
    handleKey(AppState, event, false)
  }
  document.onkeydown = function (event) {
    handleKey(AppState, event, true)
  }
}

function handleKey (AppState, event, pressed) {
  AppState.set('currentlyPressedKeys.' + event.keyCode, pressed)
}
