#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

if (process.argv.length != 4) {
  console.error('Usage: bin2c.js source target')
  process.exit(1)
}

const source = process.argv[2]
const target = process.argv[3]

const hexChar = ['0', '1', '2', '3', '4', '5', '6', '7','8', '9', 'A', 'B', 'C', 'D', 'E', 'F']

const bin = fs.readFileSync(source)
let c = `static const char ${path.basename(source)}[] = {\n`
for (let i = 0; i < bin.length; ++i) {
  const b = bin[i]
  c += '0x' + hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f]
  if ((i + 1) % 8 == 0)
    c += ',\n'
  else
    c += ', '
}
c += '};'

fs.writeFileSync(target, c);
