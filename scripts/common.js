const fs = require('fs')
const path = require('path')
const https = require('https')
const {execSync, spawnSync} = require('child_process')

// Switch to root dir.
process.chdir(path.dirname(__dirname))

// Make dir and ignore error.
function mkdir(dir) {
  if (fs.existsSync(dir)) return
  mkdir(path.dirname(dir))
  fs.mkdirSync(dir)
}

// Helper to download an URL.
const download = (url, callback, log=true) => {
  https.get(url, (response) => {
    if (log) {
      process.stdout.write(`Downloading ${url} `)
    }
    if (response.statusCode == 302) {
      download(response.headers.location, callback, false)
      return
    }
    let length = 0
    response.on('end', () => {
      if (length > 0)
        process.stdout.write('.')
      console.log(' Done')
    })
    .on('data', (chunk) => {
      length += chunk.length
      while (length >= 1024 * 1024) {
        process.stdout.write('.')
        length %= 1024 * 1024
      }
    })
    callback(response)
  })
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
  mkdir,
  download,
  execSync: execSyncWrapper,
  spawnSync: spawnSyncWrapper,
}
