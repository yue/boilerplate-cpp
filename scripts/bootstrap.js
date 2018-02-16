#!/usr/bin/env node

const path = require('path')

const {targetCpu, cmake, mkdir, spawnSync} = require('./common')

mkdir('out')

if (process.platform == 'win32') {
  const arch = targetCpu == 'x64' ? 'Win64' : 'Win32'
  spawnSync(cmake, ['..', '-G', `Visual Studio 14 ${arch}`])
} else {
  mkdir('out/Release')
  spawnSync(cmake, ['-D', `CMAKE_BUILD_TYPE=Release`, '../..'], {cwd: 'out/Release'})
  mkdir('out/Debug')
  spawnSync(cmake, ['-D', `CMAKE_BUILD_TYPE=Debug`, '../..'], {cwd: 'out/Debug'})
}
