# muban

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

1. Clone the project.
2. Put your web app in `app/`.
3. Run `npm install`.
4. Check `out/` for result.

## Docs

* Architecture of Muban
* Add native bindings to web pages
* Custom protocols
* Yue documents (external link)

## License

Public domain.

## Limitations

Please consider following limitations before writing your app with Yue, some of
them are impossible to solve even in future versions.

### Webview

Due to using system webview, there is no way to choose browser engine or browser
version, so we can not control how web page is rendered or which HTML5 features
are available, thus the pain of browser compatibility.

The APIs provided in Yue are also highly limited to what system APIs have, and
we can only provide APIs based on existing system APIs.

### Source code protection

While the source code of your app is encrypted with a secure algorithm, there is
really nothing we can do to prevent a determined hacker to get the source code
from the executable files.

### Accessibility

On macOS and Linux, widgets of Yue are just wrappers of existing naitve widgets,
so you have the same level of accessibility with system toolkits.

However on Windows certain widgets (for example buttons) are windowless and do
not have accessibility implemented yet, while it is of high priority on my TODO
list, please only use the widgets with accessibility implemented (for example
webview and text editor) if this is important to you.
