#!/usr/bin/env node

const path = require('path')

const {targetCpu, cmake, mkdir, spawnSync} = require('./common')

mkdir('out')

if (process.platform == 'win32') {
  process.exit(spawnSync(cmake,
                         ['-S', '.', '-B', 'out',
                          '-G', 'Visual Studio 19 2022',
                          '-A', targetCpu == 'x64' ? 'x64' : 'Win32']).status)
} else {
  mkdir('out/Release')
  let code = spawnSync(cmake,
                       ['-D', `CMAKE_BUILD_TYPE=Release`, '../..'],
                       {cwd: 'out/Release'}).status
  if (code != 0)
    process.exit(code)
  mkdir('out/Debug')
  process.exit(spawnSync(cmake,
                         ['-D', `CMAKE_BUILD_TYPE=Debug`, '../..'],
                         {cwd: 'out/Debug'}).status)
}
