var test = require('tape')

var child_process = require('child_process')
var fs = require('fs')
var path = require('path')
var stream = require('stream')

var parserCLI = path.resolve(__dirname, '../../bin/dae2json.js')

var blenderCubeAmimatedPath = path.resolve(__dirname, '../fixture/animated-blender-cube.dae')
var animatedColladaXML = fs.readFileSync(blenderCubeAmimatedPath).toString('utf8')
var expectedAnimatedCube = require('../expected/animated-blender-cube.js')

test('read file name', function (t) {
  t.plan(1)
  child_process.execFile(parserCLI, [blenderCubeAmimatedPath], function (err, stdout) {
    if (err) { t.fail(err) }
    t.deepEqual(expectedAnimatedCube, JSON.parse(stdout))
  })
})

test('read from stdin', function (t) {
  t.plan(1)

  var parsedJSON = ''

  var daeStream = new stream.Writable()
  daeStream._write = function (chunk, encoding, next) {
    parsedJSON += chunk
    next()
  }
  daeStream.on('finish', function () {
    t.deepEqual(expectedAnimatedCube, JSON.parse(parsedJSON))
  })

  var testStdin = child_process.spawn(parserCLI)

  testStdin.stdout.pipe(daeStream)
  testStdin.stdin.write(animatedColladaXML)
  testStdin.stdin.end()
})
