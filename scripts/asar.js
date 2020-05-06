#!/usr/bin/env node

const crypto = require('crypto')
const fs = require('fs')
const asar = require('asar')

require('./common')

const key = fs.readFileSync('ENCRYPTION_KEY')
const iv = 'yue is good lib!'

if (process.argv.length != 4) {
  console.error('Usage: asar.js source target')
  process.exit(1)
}

const source = process.argv[2]
const target = process.argv[3]

function transform() {
  const cipher =  crypto.createCipheriv('aes-128-cbc', key, iv)
  cipher.setAutoPadding(true)
  return cipher
}

function appendMeta() {
  const stat = fs.statSync(target)
  const meta = Buffer.alloc(8 + 1 + 4)
  const asarSize = stat.size + meta.length
  meta.writeDoubleLE(asarSize, 0)
  meta.writeUInt8(2, 8)
  meta.write('ASAR', 9)
  fs.appendFileSync(target, meta)
}

asar.createPackageWithOptions(source, target, { transform }).then(appendMeta)
