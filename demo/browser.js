var mount = document.createElement('div')

var incompleteWarning = document.createElement('span')
incompleteWarning.innerHTML = 'incomplete. work in progress'

document.body.appendChild(incompleteWarning)
document.body.appendChild(mount)

var texturedBlenderDefaultCube = require('./textured-blender-fault-cube/blender-cube.js')().element
mount.insertBefore(texturedBlenderDefaultCube, mount.children[0])
