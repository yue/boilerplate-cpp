# Add native bindings to web pages

While due to limitations of system webview APIs, we are unable to provide direct
acess to web pages' DOM trees, but it is still possible to provide a way to
invoke native code from web pages, and post messages native code to web pages.

## Native bindings

By calling the `nu::Browser::AddBinding` API, you can bind arbitrary C++ to
web pages as long as the C++ parameters can be converted from JavaScript
automatically.

For example adding a `window.storeIntRecord` binding:

```c++
void StoreIntRecord(const std::string& key, int value) {
  LOG(ERROR) << "Adding record: " << key << " " << value;
}

browser->AddBinding("storeIntRecord", &StoreIntRecord);
```

Under the hood, each JavaScript argument is converted to [`base::Value`][value]
first, and then converted to the C++ types defined in the binding's prototype.
So the parameters of the binding must be convertable from the
[`base::Value`][value], otherwise Yue would not be able to do automatic
conversion and compilation error would happen.

If you would like to use a custom type as binding's parameter, you can use
[`base::Value`][value] as parameter directly:

```c++
void StoreRecord(const std::string& key, base::Value value) {
  LOG(ERROR) << "Adding record: " << key << " " << value;
}

browser->AddBinding("storeRecord", &StoreRecord);
```

You can also use `nu::Browser*` as a parameter, which would be assigned with
a pointer to the browser calling the binding, and it would not interrupt the
automatic conversion of other parameters.

## Binding name

By default the native bindings are added to the `window` object, by calling the
`nu::Browser::SetBindingName(name)` API, you can direct Yue to add the bindings
to the `window[name]` object instead.

## Native bindings are called asynchronously

Due to the multi-processes architecture used by WebKit2 engine, the native
bindings are not called from web pages in the same process. Whenever you call a
native binding from the web page, internally a inter-process-message will be
sent and the native bindings are called asynchronously.

So it is impossible for native bindings to return values to web pages, the only
way for communication is to send a message back by calling the
`nu::Browser::ExecuteJavaScript` API:

```c++
void Ping(nu::Browser* browser) {
  browser->ExecuteJavaScript("window.pong()", nullptr /* callback */);
}

browser->AddBinding("ping", &Ping);
```


```js
window.pong = function() {
  console.log('pong')
}
window.ping()
```

## Lambda functions

It is also possible to pass a C++ lambda function as native binding:

```c++
browser->AddBinding("lambda", [](base::Value arg) {
  LOG(ERROR) << arg;
});
```

But note that the lambda must have NO captures, because we have to deduce the
type of arguments at compile-time, and we are unable to do so for lambdas with
captures.

## Handle arbitrary arguments

The `AddBinding` API can automatically convert arguments to C++ types, however
if you want to handle the arguments yourself, you can use the
`nu::Browser::AddRawBinding` API to set a binding that accepts a single
[`base::Value`][value] argument, which is a list converted from JavaScript's
`arguments` object:

```c++
browser->AddRawBinding("long", [](nu::Browser*, base::Value args) {
  LOG(ERROR) << "Length of arguments: " << args.GetList().size();
});
```

[value]: https://cs.chromium.org/chromium/src/base/values.h?sq=package:chromium
