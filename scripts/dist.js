#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const yazl = require('yazl')

const {targetCpu, execSync} = require('./common')

const {name, version} = require('../package.json')

// Release build.
execSync('node scripts/build.js Release')

// Path to generated exe.
const outpath = process.platform === 'win32' ? 'out/build/Release'
                                             : 'out/Release'
const exepath = process.platform === 'win32' ? `${outpath}/${name}.exe`
                                             : `${outpath}/${name}`

// Concat the exe and app.ear.
fs.appendFileSync(exepath, fs.readFileSync(`${outpath}/app.ear`))

// Create zip.
const zip = new yazl.ZipFile
zip.addFile('libyue/LICENSE', 'LICENSE')
zip.addFile(exepath, path.basename(exepath), { mode: parseInt("0100755", 8) })
zip.outputStream.pipe(fs.createWriteStream(`${name}-v${version}-${targetCpu}.zip`))
zip.end()
