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

// Took the library_animations in animetedLetterFXML and switched their order
var animatedLetterFSwappedAnimationOrderPath = path.resolve(__dirname, '../fixture/letter-f-animated-animation-order-switched.dae')
var animatedLetterFSwappedAnimationOrderXML = fs.readFileSync(animatedLetterFSwappedAnimationOrderPath)

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
  console.log(parsedSkeletonSkinnedCubes.jointParents)
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

/**
 * This is meant to handle an issue where Blender was
 * exporting the same joint name twice for my right side bones that were
 * duplicates of my original left side bones. Still not sure when/wju
 * this happens. Must have done something strange. Doesn't happen to
 * every model..
 *
 * We also test to make sure that switching the order of the joints in our library_animations doesn't break the parser
 * This is meant to handle an issue where the library animations were
 * not in the same order as defined in the library_controllers joints-array.
 * We previously expected the same order, but that won't always be the case
 */
test('Parse extra duplicated bone names at end of list, and also test switching library_animations joint order', function (t) {
  t.plan(1)
  t.deepEqual(parseCollada(animatedLetterFSwappedAnimationOrderXML), expectedAnimatedLetterF)
})
