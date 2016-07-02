var fs = require('fs')
var path = require('path')

var test = require('tape')
var parseCollada = require('../../')

var colladaFilePath = path.resolve(__dirname, '../fixture/textured-blender-default-cube.dae')
var tbdcColladaXML = fs.readFileSync(colladaFilePath)
var expectedTBDC = require('../expected/textured-blender-default-cube.js')

var blenderCubeAmimatedPath = path.resolve(__dirname, '../fixture/animated-blender-cube.dae')
var animatedColladaXML = fs.readFileSync(blenderCubeAmimatedPath)
var expectedAnimatedCube = require('../expected/animated-blender-cube.js')

var skeletonSkinnedCubesPath = path.resolve(__dirname, '../fixture/two-skinned-cubes.dae')
var skeletonSkinnedCubesXML = fs.readFileSync(skeletonSkinnedCubesPath)
var expectedSkinnedCube = require('../expected/two-skinned-cube.js')

var animatedLetterFPath = path.resolve(__dirname, '../fixture/letter-f-animated.dae')
var animatedLetterFXML = fs.readFileSync(animatedLetterFPath)
var expectedAnimatedLetterF = require('../expected/animated-letter-f.js')

var parentChildChildLetterFPath = path.resolve(__dirname, '../fixture/parent-child-child-letter-f.dae')
var parentChildChildLetterFXML = fs.readFileSync(parentChildChildLetterFPath)
var expectedParentChildChildF = require('../expected/parent-child-child-letter-f.js')

test('Parse a default blender cube', function (t) {
  t.plan(1)
  var parsedCube = parseCollada(tbdcColladaXML)
  t.deepEqual(parsedCube, expectedTBDC)
})

test('Parse a default blender cube with an animation', function (t) {
  t.plan(1)
  var parsedAnimatedCube = parseCollada(animatedColladaXML)
  t.deepEqual(parsedAnimatedCube, expectedAnimatedCube)
})

test('Parse two blender cubes animated with bones and skinning', function (t) {
  t.plan(1)
  var parsedSkeletonSkinnedCubes = parseCollada(skeletonSkinnedCubesXML)
  t.deepEqual(parsedSkeletonSkinnedCubes, expectedSkinnedCube)
})

test('Parse animated letter F with parent and child bone', function (t) {
  t.plan(1)
  var parsedAnimatedLetterF = parseCollada(animatedLetterFXML)
  t.deepEqual(parsedAnimatedLetterF, expectedAnimatedLetterF)
})

test('Parse with parent -> child -> child joint relationship', function (t) {
  t.plan(1)
  var parsedParentChildChildF = parseCollada(parentChildChildLetterFXML)
  t.deepEqual(parsedParentChildChildF, expectedParentChildChildF)
})
