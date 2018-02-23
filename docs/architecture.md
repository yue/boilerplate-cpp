# Architecture of Muban

Muban is a C++ project using CMake for building, Node.js is also used for the
build scripts.

## Source code structure

* `app/` - The web app.
* `src/` - The C++ code for creating window and loading the web app.
* `libyue/` - Downloaded static libraries of `Yue`.
* `node_modules/` - Third party Node.js modules installed by `npm`.
* `scripts/` - Scripts for building the project.
* `out/` - Store generated binary files.
* `CMakeLists.txt` - The CMake configuration for buliding the project.
* `ENCRYPTION_KEY` - The 16 bytes key used for encrypting the web app.

## System requirements

The Yue library requires C++14 for building, so newer toolchains are required.

* Linux:
  * GCC >=6 or clang
  * libstdc++6 or newer
  * libwebkit2gtk >= 2.8
  * Node.js >= 8
* macOS:
  * Xcode >= 8.3
  * The OS X 10.12 SDK
  * Node.js >= 8
* Windows:
  * Visual Studio 2017 Update 3.2 with the 15063 (Creators Update) Windows SDK
  * An x64 machine with Node.js x64 >= 8 installed.

Note that on Linux due to using libstdc++6 and libwebkit2gtk 2.8, the generated
binary can only run on newer distributions, e.g. at least Ubuntu 16.04 and
Debian Stretch.

On macOS due to using the `WKWebView` API, only macOS 10.10 and later are
supported.

On Windows currently Windows Vista and later are supported. It should be
possible to support Windows XP with some efforts, but it is not on our roadmap.

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

## Debugging

By default the app is built in Debug mode, which has devtools and builtin
context menu enabled, with a toolbar on the top of the webview. The debugging
features are removed when buliding Release version with `npm run dist`.

Note that devtools are currently only available on Linux and macOS.

## IDE support

With the power of `cmake`, on macOS a Xcode project will be generated, and on
Windows a Visual Studio 2017 solution will be generated. So you can develop your
application with the IDEs on macOS and Windows.

Also note that due to limitations of `cmake`, we can only build for one CPU
architecture per one IDE solution, it is not possible to build for both `x86`
and `x64` within the same IDE solution.

## Cross compilation

I haven't figured out the proper way of doing cross compilation on Linux with
`cmake`, so on Linux currently you can only build for `x86` on a `x86` machine,
and so are the other architectures.

For Windows you can set the `npm_config_arch` environment variable to specify
the architecture to build for (`x64` or `ia32`), if not set the target
architecture would be determined by the value of `process.arch` from Node.js.

For macOS only `x64` target is supported.

## Packaging

In order to generate a single-file executable, the `app/` files are archived
using [asar](https://github.com/electron/asar) format, and then concatenated
to the final executable file.

To make it hard to get the source code of the web app, the `app/` files are
encrypted with AES. When developing your own app, you should change the content
of `ENCRYPTION_KEY` to your own key.

The packaging part is done in the `scripts/asar.js` script.
