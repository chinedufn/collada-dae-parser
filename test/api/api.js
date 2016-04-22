var fs = require('fs')
var path = require('path')

var test = require('tape')
var parseCollada = require('../../')

var colladaFilePath = path.resolve(__dirname, '../fixture/textured-blender-default-cube.dae')
var tbdcColladaXML = fs.readFileSync(colladaFilePath).toString()
var expectedTBDC = require('../expected/textured-blender-default-cube.js')

var blenderCubeAmimatedPath = path.resolve(__dirname, '../fixture/animated-blender-cube.dae')
var animatedColladaXML = fs.readFileSync(blenderCubeAmimatedPath).toString()
var expectedAnimatedCube = require('../expected/animated-blender-cube.js')

var skeletonSkinnedCubesPath = path.resolve(__dirname, '../fixture/two-skinned-cubes.dae')
var skeletonSkinnedCubesXML = fs.readFileSync(skeletonSkinnedCubesPath).toString()
var expectedSkinnedCube = require('../expected/two-skinned-cube.js')

var animatedLetterFPath = path.resolve(__dirname, '../fixture/letter-f-animated.dae')
var animatedLetterFXML = fs.readFileSync(animatedLetterFPath).toString()
var expectedAnimatedLetterF = require('../expected/animated-letter-f.js')

var parentChildChildLetterFPath = path.resolve(__dirname, '../fixture/parent-child-child-letter-f.dae')
var parentChildChildLetterFXML = fs.readFileSync(parentChildChildLetterFPath).toString()
var expectedParentChildChildF = require('../expected/parent-child-child-letter-f.js')

test('Parse a default blender cube with an added texture', function (t) {
  t.plan(1)
  parseCollada(tbdcColladaXML, function (err, parsedCube) {
    if (err) {
      t.fail()
    }
    t.deepEqual(parsedCube, expectedTBDC)
  })
})

test('Parse a default blender cube with an animation', function (t) {
  t.plan(1)
  parseCollada(animatedColladaXML, function (err, parsedAnimatedCube) {
    if (err) {
      t.fail()
    }
    t.deepEqual(parsedAnimatedCube, expectedAnimatedCube)
  })
})

test('Parse two blender cubes animated with bones and skinning', function (t) {
  t.plan(1)
  parseCollada(skeletonSkinnedCubesXML, function (err, parsedSkeletonSkinnedCubes) {
    if (err) {
      t.fail()
    }
    t.deepEqual(parsedSkeletonSkinnedCubes, expectedSkinnedCube)
    t.end()
  })
})

test('Parse animated letter F with parent and child bone', function (t) {
  t.plan(1)
  parseCollada(animatedLetterFXML, function (err, parsedAnimatedLetterF) {
    if (err) { t.fail() }
    t.deepEqual(parsedAnimatedLetterF, expectedAnimatedLetterF)
    t.end()
  })
})

test('Parse with parent -> child -> child joint relationship', function (t) {
  t.plan(1)
  parseCollada(parentChildChildLetterFXML, function (err, parsedParentChildChildF) {
    if (err) { t.fail() }
    t.deepEqual(parsedParentChildChildF, expectedParentChildChildF)
    t.end()
  })
})
