# Custom protocol

To load the web app from `asar` archive, custom protocols are used instead of
the `file://` protocol.

## How to define custom protocol

In Yue custom protocols are defined with the `nu::Browser::RegisterProtocol`
API, which should be called with the scheme's name and a handler.

The handler is called whenever a request using the registered custom scheme is
initalized, and the handler should should return an instance of the
`nu::ProtocolJob` class.

## Protocol jobs

The `nu::ProtocolJob` class is a pure virtual class that can not be created
directly, you must create its sub-classes instead. Currently following types of
protocol job can be created:

* `ProtocolStringJob` - Use string as response.
* `ProtocolErrorJob` - Abort the request with error.
* `ProtocolFileJob` - Read a file as response.
* `ProtocolAsarJob` - Read a file from `asar` archive as response.

It is also possible to declare a custom class that derives from `ProtocolJob`,
but it is not recommended for now since the whole API is experimental and will
change in future.
