#!/usr/bin/env node

const {targetCpu, spawnSync} = require('./common')

const os = require('os')
const path = require('path')

const name = require('../package.json').name
const config = process.argv[2] ? process.argv[2] : 'Debug'

if (process.platform == 'win32') {
  const vsPaths = [
    'C:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Community\\MSBuild\\15.0\\Bin',
    'C:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Enterprise\\MSBuild\\15.0\\Bin',
    process.env.PATH
  ]
  const env = Object.assign(process.env, {PATH: vsPaths.join(path.delimiter)})
  const platform = targetCpu == 'x64' ? 'x64' : 'Win32'
  process.exit(spawnSync(
    'msbuild',
    [name + '.sln',
     '/m:' + os.cpus().length,
     '/p:Configuration=' + config,
     '/p:Platform=' + platform],
    {cwd: 'out', env}).status)
} else {
  process.exit(spawnSync(
    'make',
    ['-j', os.cpus().length],
    {cwd: `out/${config}`}).status)
}
