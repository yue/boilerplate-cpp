#!/usr/bin/env node

require('./common')

const fs   = require('fs')
const path = require('path')

const downloadYue = require('download-yue')

if (process.argv.length < 3) {
  console.error('Usage: download_libyue version platform')
  process.exit(1)
}

let version  = process.argv[2]
let platform = process.argv[3]

if (!platform) {
  platform = {
    win32: 'win',
    linux: 'linux',
    darwin: 'mac',
  }[process.platform]
}

const libyueDir = path.resolve('libyue')
const libyueChecksum = path.join(libyueDir, '.version')
const checksum = `${version}|${platform}`
if (fs.existsSync(libyueChecksum) &&
    fs.readFileSync(libyueChecksum).toString() == checksum) {
  process.exit(0)
}

const filename = `libyue_${version}_${platform}.zip`
downloadYue('yue', version, filename, libyueDir).then(() => {
  fs.writeFileSync(libyueChecksum, checksum)
})
