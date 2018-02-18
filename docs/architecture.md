# Architecture of Muban

Muban is a C++ project using CMake for building, Node.js is also used for build
scripts.

## Source code structure

* `app/` - The web app.
* `src/` - The C++ code for creating window and load the web app.
* `libyue/` - Downloaded static libraries of `Yue`.
* `node_modules/` - Third party Node.js modules installed by `npm`.
* `scripts/` - Scripts for building the project.
* `out/` - Store generated binary files.
* `CMakeLists.txt` - The CMake configuration for buliding the project.
* `ENCRYPTION_KEY` - The 16 bytes key used for encrypting the web app.

## Building

While it is possible to only use `cmake` to build this project, there are `npm`
scripts defined to make the buliding easier.

### `npm run build`

Calls `scripts/build.js` to build Debug version.

### `npm run dist`

Calls `scripts/dist.js` to build the Release version and archives the generated
binary into a zip file.

### `npm install`

Installs all dependencies and build Debug version.

### `npm start`

Calls `scripts/run.js` to start the Debug version.

## Packaging

In order to generate a single-file executable, the `app/` files are archived
using [asar](https://github.com/electron/asar) format, and then concatenated
to the final executable file.

To make it hard to get the source code of the web app, the `app/` files are
encrypted with AES. When developing your own app, you should change the content
of `ENCRYPTION_KEY` to your own key.

The packaging part is done in the `scripts/asar.js` script.
