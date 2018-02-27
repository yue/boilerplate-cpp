# Muban

A template of the [Yue library](https://github.com/yue/yue) for building
cross-platform desktop apps with system webview and native GUI widgets.

## Features

* Quickly build desktop apps with HTML and JavaScript.
* Generate single-file executables for macOS/Linux/Windows.
* Source code encryptions.
* Use system webviews to minimize binary size.
* Use native GUI widgets to extend the UI.
* Extremely easy to add C++ native bindings to web pages.
* Custom protocols in webview.

## How to use

1. Clone the project
2. Put your web app in `app/`
3. `npm install` to build
4. `npm start` to start the app
5. `npm run dist` to create distribution

## Screenshots (in Debug mode)

|  macOS            |    Linux          |  Windows          |
| ----------------- | ----------------- | ----------------- |
| ![][mac-browser]  | ![][linux-browser] | ![][win-browser]  |

## Docs

* [Architecture of Muban](https://github.com/yue/muban/blob/master/docs/architecture.md)
* [Add native bindings to web pages](https://github.com/yue/muban/blob/master/docs/native_bindings.md)
* [Custom protocol](https://github.com/yue/muban/blob/master/docs/custom_protocol.md)
* [Yue documents (external link)](http://libyue.com/docs/v0.3.1/cpp/)

## License

Public domain.

## Contributions

Since this project mostly serves as a template with minimal features, pull
requests to add new features might be rejected.

## Limitations

Please consider following limitations before writing your app with Yue, some of
them are impossible to solve even in future versions.

### Webview

Due to using system webview, there is no way to choose browser engine or browser
version, so we can not control how web page is rendered or which HTML5 features
are available, thus the pain of browser compatibility.

The good news is, because Yue uses `webkit2gtk` on Linux and `WKWebView` on
macOS, you can at least expect modern web engines on these two platforms.

The APIs provided in Yue are also highly limited to what system APIs have, and
we can only provide APIs based on existing system APIs.

### Source code protection

While the source code of your app is encrypted with a secure algorithm, there is
really nothing we can do to prevent a determined hacker to get the source code
from the executable files.

### Accessibility

On macOS and Linux, widgets of Yue are just wrappers of existing native widgets,
so you have the same level of accessibility with system toolkits.

However on Windows certain widgets (for example buttons) are windowless and do
not have accessibility implemented yet, while it is of high priority on my TODO
list, please only use the widgets with accessibility implemented (for example
webview and text editor) if this is important to you.

[mac-browser]: https://user-images.githubusercontent.com/639601/36703168-bcaedb8e-1b9d-11e8-8260-89eef8157adc.png
[win-browser]: https://user-images.githubusercontent.com/639601/36703170-bd14f70c-1b9d-11e8-91d8-86664431970c.png
[linux-browser]: https://user-images.githubusercontent.com/639601/36703169-bceaeafc-1b9d-11e8-9cd4-70a030d9ebe5.png
