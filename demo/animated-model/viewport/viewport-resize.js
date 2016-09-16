var window = require('global/window')
var document = require('global/document')

var MutationObserver = window.MutationObserver

module.exports = viewportResize

function viewportResize (AppState, canvas) {
  var observer = new MutationObserver(checkForCanvas.bind(null, AppState, canvas))
  observer.observe(document.body, {childList: true, subtree: true})

  window.addEventListener('resize', function () {
    console.log('resize')
    var positionInfo = canvas.getBoundingClientRect()
    canvas.height = positionInfo.height
    canvas.width = positionInfo.width
    AppState.set('viewport', {width: canvas.width, height: canvas.height})
  })
}

function checkForCanvas (AppState, canvas, mutationRecords) {
  // TODO: Remove this console.log once we know this isn't getting called over and over again
  console.log('mutation observed')
  mutationRecords.forEach(function (mutationRecord) {
    if (mutationRecord.addedNodes[0] === canvas) {
      var positionInfo = canvas.getBoundingClientRect()
      canvas.width = positionInfo.width
      canvas.height = positionInfo.height
      AppState.set('viewport', {width: canvas.width, height: canvas.height})
    }
  })
}
