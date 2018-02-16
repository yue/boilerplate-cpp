#!/usr/bin/env node

const {spawnSync} = require('./common')

const name = require('../package.json').name
const config = process.argv[2] === 'Debug' ? 'Debug' : 'Release'

if (process.platform == 'win32') {
  spawnSync(`out/build/${config}/${name}.exe`, [])
} else {
  spawnSync(`out/${config}/${name}`, [])
}
