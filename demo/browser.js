var mount = document.createElement('div')
mount.style.width = '100%'
mount.style.height = '100%'

var incompleteWarning = document.createElement('span')
incompleteWarning.style.position = 'fixed'
incompleteWarning.style.backgroundColor = 'white'
incompleteWarning.style.width = '90%'
incompleteWarning.style.margin = '0 auto'

var sourceLink = document.createElement('a')
sourceLink.href = 'https://github.com/chinedufn/collada-dae-parser'
sourceLink.innerHTML = 'View source on GitHub'

incompleteWarning.innerHTML = 'Work in progress. - Parse collada .dae files for viewing 3d model animations in the browser. - Rotate camera using arrow keys. - '
incompleteWarning.appendChild(sourceLink)

document.body.appendChild(incompleteWarning)
document.body.appendChild(mount)

document.querySelector('html').style.height = '100%'
document.body.style.height = '100%'
document.body.style.margin = 0

var app = require('./animated-model/app.js')().element
mount.insertBefore(app, mount.children[0])
