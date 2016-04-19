var mount = document.createElement('div')

var incompleteWarning = document.createElement('span')
incompleteWarning.innerHTML = 'incomplete. work in progress'

document.body.appendChild(incompleteWarning)
document.body.appendChild(mount)

var app = require('./animated-model/app.js')().element
mount.insertBefore(app, mount.children[0])
