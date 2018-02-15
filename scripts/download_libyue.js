#!/usr/bin/env node

const {download, mkdir} = require('./common')

const fs      = require('fs')
const path    = require('path')
const extract = require('extract-zip')

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
  const narch = process.env.npm_config_arch ? process.env.npm_config_arch
                                            : process.arch
  arch = {
    x64: 'x64',
    ia32: 'x86',
    arm: 'arm',
    arm64: 'arm64',
  }[narch]
}

const libyueDir = path.resolve('libyue')
const libyueChecksum = path.join(libyueDir, '.version')
const checksum = `${version}|${platform}|${arch}`
if (fs.existsSync(libyueChecksum) &&
    fs.readFileSync(libyueChecksum).toString() == checksum) {
  process.exit(0)
}

const mirror = 'https://github.com/yue/yue/releases/download'
const zipname = `libyue_${version}_${platform}_${arch}.zip`
const url = `${mirror}/${version}/${zipname}`

download(url, (response) => {
  mkdir(libyueDir)
  const zippath = path.join(libyueDir, zipname)
  response.on('end', () => {
    extract(zippath, {dir: libyueDir}, (error) => {
      fs.unlinkSync(zippath)
      fs.writeFileSync(libyueChecksum, checksum)
    })
  })
  response.pipe(fs.createWriteStream(zippath))
})
