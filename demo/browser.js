var mount = document.createElement('div')
mount.style.width = '100%'
mount.style.height = '100%'

var incompleteWarning = document.createElement('span')
incompleteWarning.style.position = 'fixed'
incompleteWarning.style.backgroundColor = 'white'
incompleteWarning.style.width = '90%'
incompleteWarning.style.margin = '0 auto'

// Add fork me on GitHub ribbon
var forkMeOnGitHub = document.createElement('a')
forkMeOnGitHub.href = 'https://github.com/chinedufn/collada-dae-parser'
var ribbonImage = document.createElement('img')
ribbonImage.style.position = 'absolute'
ribbonImage.style.top = 0
ribbonImage.style.right = 0
ribbonImage.style.border = 0
ribbonImage.src = 'https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67'
ribbonImage.alt = 'Fork me on GitHub'
// <a href="https://github.com/you"><img style="position: absolute; top: 0; right: 0; border: 0;" src="" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"></a>
forkMeOnGitHub.appendChild(ribbonImage)

incompleteWarning.innerHTML = 'Work in progress. - Parse collada .dae files for viewing 3d model animations in the browser. - Rotate camera using arrow keys. - '

document.body.appendChild(incompleteWarning)
document.body.appendChild(mount)
document.body.appendChild(forkMeOnGitHub)

document.querySelector('html').style.height = '100%'
document.body.style.height = '100%'
document.body.style.margin = 0

var app = require('./animated-model/app.js')().element
mount.insertBefore(app, mount.children[0])
