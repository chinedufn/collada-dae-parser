module.exports = InitMouseControls

function InitMouseControls (targets) {
  document.onclick = function (event) {
    targets.animation.emit('toggle')
  }
}
