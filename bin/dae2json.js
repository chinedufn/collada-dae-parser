#!/usr/bin/env node

var dae2json = require('../')

// var meow = require('meow')
var fs = require('fs')
var path = require('path')

var filename = process.argv[2]

// If a filename was specified, read it and write to stdout
if (filename) {
  var daeString = fs.readFileSync(path.resolve(process.cwd(), filename)).toString()
  writeParsedJSON(dae2json(daeString))
}

// If no filename was specified, read from stdin and write to stdout
if (!filename) {
  var bufferedDaeString = ''
  process.stdin.on('data', function (chunk) {
    bufferedDaeString += chunk
  })
  process.stdin.on('end', function () {
    writeParsedJSON(dae2json(bufferedDaeString))
  })
}

function writeParsedJSON (parsedJSON) {
  console.log(JSON.stringify(parsedJSON))
}
