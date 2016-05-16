var mount = document.createElement('div')

var incompleteWarning = document.createElement('span')
var sourceLink = document.createElement('a')
sourceLink.href = 'https://github.com/chinedufn/collada-dae-parser'
sourceLink.innerHTML = 'View source on GitHub'

incompleteWarning.innerHTML = 'Work in progress. - Parse collada .dae files for viewing 3d model animations in the browser. - Rotate camera using arrow keys. - '
incompleteWarning.appendChild(sourceLink)

document.body.appendChild(incompleteWarning)
document.body.appendChild(mount)

var app = require('./animated-model/app.js')().element
mount.insertBefore(app, mount.children[0])
