const fs = require('fs')
const path = require('path')
const https = require('https')
const {execSync, spawnSync} = require('child_process')

// Switch to root dir.
process.chdir(path.dirname(__dirname))

// The target cpu.
const narch = process.env.npm_config_arch ? process.env.npm_config_arch
                                          : process.arch
const targetCpu = {
  x64: 'x64',
  ia32: 'x86',
  arm: 'arm',
  arm64: 'arm64',
}[narch]

// Find the path of cmake.
const cmakeRoot = path.resolve('node_modules', 'cmake-binaries', 'bin2')
const cmake = {
  darwin: path.join(cmakeRoot, 'CMake.app', 'Contents', 'bin', 'cmake'),
  linux: path.join(cmakeRoot, 'bin', 'cmake'),
  win32: path.join(cmakeRoot, 'bin', 'cmake.exe'),
}[process.platform]

// Make dir and ignore error.
function mkdir(dir) {
  if (fs.existsSync(dir)) return
  mkdir(path.dirname(dir))
  fs.mkdirSync(dir)
}

// Helper around execSync.
const execSyncWrapper = (command, options = {}) => {
  // Print command output by default.
  if (!options.stdio)
    options.stdio = 'inherit'
  // Merge the custom env to global env.
  if (options.env)
    options.env = Object.assign(options.env, process.env)
  return execSync(command, options)
}

const spawnSyncWrapper = (exec, args, options = {}) => {
  // Print command output by default.
  if (!options.stdio)
    options.stdio = 'inherit'
  // Merge the custom env to global env.
  if (options.env)
    options.env = Object.assign(options.env, process.env)
  return spawnSync(exec, args, options)
}

// Export public APIs.
module.exports = {
  targetCpu,
  cmake,
  mkdir,
  execSync: execSyncWrapper,
  spawnSync: spawnSyncWrapper,
}
