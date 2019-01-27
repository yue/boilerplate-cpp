#!/usr/bin/env node

const {targetCpu} = require('./common')

const fs   = require('fs')
const path = require('path')

const downloadYue = require('download-yue')

if (process.argv.length < 3) {
  console.error('Usage: download_libyue version platform arch')
  process.exit(1)
}

let version  = process.argv[2]
let platform = process.argv[3]
let arch     = process.argv[4]

if (!platform) {
  platform = {
    win32: 'win',
    linux: 'linux',
    darwin: 'mac',
  }[process.platform]
}

if (!arch) {
  arch = targetCpu
}

const libyueDir = path.resolve('libyue')
const libyueChecksum = path.join(libyueDir, '.version')
const checksum = `${version}|${platform}|${arch}`
if (fs.existsSync(libyueChecksum) &&
    fs.readFileSync(libyueChecksum).toString() == checksum) {
  process.exit(0)
}

const filename = `libyue_${version}_${platform}_${arch}.zip`
downloadYue('yue', version, filename, libyueDir).then(() => {
  fs.writeFileSync(libyueChecksum, checksum)
})
