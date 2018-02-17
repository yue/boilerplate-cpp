#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const yazl = require('yazl')

const {targetCpu, execSync} = require('./common')

const {name, version} = require('../package.json')

// Release build.
execSync('node scripts/build.js Release')

// Path to generated exe.
const outpath = process.platform == 'linux' ? 'out/Release' : 'out'
const exepath = {
  win32: `${outpath}/Release/${name}.exe`,
  darwin: `${outpath}/Release/${name}`,
  linux: `${outpath}/${name}`,
}[process.platform]

// Concat the exe and app.ear.
fs.appendFileSync(exepath, fs.readFileSync(`${outpath}/app.ear`))

// Create zip.
const zip = new yazl.ZipFile
zip.addFile('libyue/LICENSE', 'LICENSE')
zip.addFile(exepath, path.basename(exepath), { mode: parseInt("0100755", 8) })
zip.outputStream.pipe(fs.createWriteStream(`${name}-v${version}-${targetCpu}.zip`))
zip.end()
