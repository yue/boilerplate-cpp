#!/usr/bin/env node

const crypto = require('crypto')
const fs = require('fs')
const asar = require('asar')

const key = Buffer.alloc(16, 'sad turtle')
const iv = 'brave new world!'

const target = `${__dirname}/docs.ear`

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

asar.createPackageWithOptions(`${__dirname}/out/Dist/docs`,
                              target,
                              { transform },
                              appendMeta)
