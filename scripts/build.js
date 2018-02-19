#!/usr/bin/env node

const {targetCpu, spawnSync} = require('./common')

const name = require('../package.json').name
const config = process.argv[2] ? process.argv[2] : 'Debug'

if (process.platform == 'win32') {
  const msbuild = 'C:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Community\\MSBuild\\15.0\\Bin\\MSBuild.exe'
  const platform = targetCpu == 'x64' ? 'x64' : 'Win32'
  process.exit(spawnSync(
      msbuild,
      [`${name}.sln`, `/p:Configuration=${config}`, `/p:Platform=${platform}`],
      {cwd: 'out'}).status)
} else if (process.platform == 'darwin') {
  process.exit(spawnSync(
      'xcodebuild',
      ['-configuration', config],
      {cwd: 'out'}).status)
} else {
  process.exit(spawnSync('make', [], {cwd: `out/${config}`}).status)
}
