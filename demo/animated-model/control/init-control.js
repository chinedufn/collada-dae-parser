var initOrbitControls = require('./orbit-controls.js')
var initMouseControls = require('./mouse-control.js')

module.exports = InitControl

function InitControl (AppState) {
  var targets = AppState.get().targets

  initOrbitControls(AppState)
  initMouseControls(targets)
}
