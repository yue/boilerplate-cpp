#!/usr/bin/env node

const {targetCpu, spawnSync} = require('./common')

const name = require('../package.json').name
const config = process.argv[2] === 'Debug' ? 'Debug' : 'Release'

if (process.platform == 'win32') {
  const platform = targetCpu == 'x64' ? 'Win64' : 'Win32'
  const msbuild = 'C:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Community\\MSBuild\\15.0\\Bin\\MSBuild.exe'
  spawnSync(msbuild,
            [`${name}.sln`, `/p:Configuration=${config}`, `/p:Platform=${platform}`],
            {cwd: 'out'})
} else {
  spawnSync('make', [], {cwd: `out/${config}`})
}
