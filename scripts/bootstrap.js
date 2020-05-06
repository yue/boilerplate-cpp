#!/usr/bin/env node

const path = require('path')

const {targetCpu, cmake, mkdir, spawnSync} = require('./common')

mkdir('out')

if (process.platform === 'win32') {
  let generator = 'Visual Studio 15 2017'
  if (targetCpu == 'x64')
    generator += ' Win64'
  process.exit(spawnSync(cmake,
                         ['..', '-G', generator],
                         {cwd: 'out'}).status)
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
