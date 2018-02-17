#!/usr/bin/env node

const {spawnSync} = require('./common')

const name = require('../package.json').name
const config = process.argv[2] === 'Release' ? 'Release' : 'Debug'

if (process.platform == 'win32') {
  spawnSync(`out/${config}/${name}.exe`, [])
} else if (process.platform == 'darwin') {
  spawnSync(`out/${config}/${name}`, [])
} else {
  spawnSync(`out/${config}/${name}`, [])
}
