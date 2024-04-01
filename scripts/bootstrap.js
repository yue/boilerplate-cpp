#!/usr/bin/env node

const path = require('path')

const {targetCpu, mkdir, spawnSync} = require('./common')

const cmake = path.resolve('node_modules', '@yogalayout', 'cmake-bin', 'bin', 'cmake')

mkdir('out')

if (process.platform == 'win32') {
  process.exit(spawnSync(process.execPath,
                         [cmake, '-S', '.', '-B', 'out',
                          '-G', 'Visual Studio 17 2022',
                          '-A', targetCpu == 'x64' ? 'x64' : 'Win32']).status)
} else {
  mkdir('out/Release')
  let code = spawnSync(process.execPath,
                       [cmake, '-D', `CMAKE_BUILD_TYPE=Release`, '../..'],
                       {cwd: 'out/Release'}).status
  if (code != 0)
    process.exit(code)
  mkdir('out/Debug')
  process.exit(spawnSync(process.execPath,
                         [cmake, '-D', `CMAKE_BUILD_TYPE=Debug`, '../..'],
                         {cwd: 'out/Debug'}).status)
}
