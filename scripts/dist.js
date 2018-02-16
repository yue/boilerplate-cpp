#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const yazl = require('yazl')

const {targetCpu} = require('./common')

const {name, version} = require('../package.json')
const config = process.argv[2] === 'Debug' ? 'Debug' : 'Release'

const zip = new yazl.ZipFile
zip.addFile('libyue/LICENSE', 'LICENSE')

if (process.platform == 'win32') {
  zip.addFile(`out/build/${config}/${name}.exe`, `${name}.exe`)
} else {
  zip.addFile(`out/${config}/${name}`, name, { mode: parseInt("0100755", 8) })
}

zip.outputStream.pipe(fs.createWriteStream(`${name}-v${version}-${targetCpu}.zip`))
zip.end()
