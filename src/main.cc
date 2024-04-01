// This file is published under public domain.

#include "base/base_paths.h"
#include "base/command_line.h"
#include "base/cpu.h"
#include "base/path_service.h"
#include "nativeui/nativeui.h"

// Generated from the ENCRYPTION_KEY file.
#include "encryption_key.h"
static_assert(sizeof(ENCRYPTION_KEY) == 16, "ENCRYPTION_KEY must be 16 bytes");

// Path to app's asar archive.
static base::FilePath g_app_path;

// Handle custom protocol.
nu::ProtocolJob* CustomProtocolHandler(const std::string& url) {
  std::string path = url.substr(sizeof("boilerplate://app/") - 1);
  nu::ProtocolAsarJob* job = new nu::ProtocolAsarJob(g_app_path, path);
  job->SetDecipher(std::string(ENCRYPTION_KEY, sizeof(ENCRYPTION_KEY)),
                   std::string("yue is good lib!"));
  return job;
}

// An example native binding.
void ShowSysInfo(nu::Browser* browser, const std::string& request) {
  if (request == "cpu") {
    browser->ExecuteJavaScript(
        "window.report('" + base::CPU().cpu_brand() + "')", nullptr);
  }
}

#if defined(OS_WIN)
int WINAPI WinMain(HINSTANCE, HINSTANCE, LPSTR, int) {
  base::CommandLine::Init(0, nullptr);
#else
int main(int argc, const char *argv[]) {
  base::CommandLine::Init(argc, argv);
#endif

  // In Debug build, load from app.ear; in Release build, load from exe path.
#if defined(NDEBUG)
  base::PathService::Get(base::FILE_EXE, &g_app_path);
#else
  base::PathService::Get(base::DIR_EXE, &g_app_path);
#if defined(OS_WIN)
  g_app_path = g_app_path.DirName();
#endif
  g_app_path = g_app_path.Append(FILE_PATH_LITERAL("app.ear"));
#endif

  // Intialize GUI toolkit.
  nu::Lifetime lifetime;

  // Initialize the global instance of nativeui.
  nu::State state;

  // Create window with default options.
  scoped_refptr<nu::Window> window(new nu::Window(nu::Window::Options()));
  window->SetContentSize(nu::SizeF(400, 200));
  window->Center();

  // Quit when window is closed.
  window->on_close.Connect([](nu::Window*) {
    nu::MessageLoop::Quit();
  });

  // The content view.
  nu::Container* content_view = new nu::Container;
  window->SetContentView(content_view);

#ifndef NDEBUG
  // Browser toolbar.
  nu::Container* toolbar = new nu::Container;
  toolbar->SetStyle("flex-direction", "row", "padding", 5.f);
  content_view->AddChildView(toolbar);
  nu::Button* go_back = new nu::Button("<");
  go_back->SetEnabled(false);
  toolbar->AddChildView(go_back);
  nu::Button* go_forward = new nu::Button(">");
  go_forward->SetEnabled(false);
  go_forward->SetStyle("margin-right", 5.f);
  toolbar->AddChildView(go_forward);
  nu::Entry* address_bar = new nu::Entry;
  address_bar->SetStyle("flex", 1.f);
  toolbar->AddChildView(address_bar);
#endif

  // Create the webview.
  nu::Browser::Options options;
#ifndef NDEBUG
  options.devtools = true;
  options.context_menu = true;
#endif
  nu::Browser* browser(new nu::Browser(options));
  browser->SetStyle("flex", 1.f);
  content_view->AddChildView(browser);

#ifndef NDEBUG
  // Bind webview events to toolbar.
  browser->on_update_title.Connect([](nu::Browser* self,
                                      const std::string& title) {
    self->GetWindow()->SetTitle(title);
  });
  browser->on_update_command.Connect([=](nu::Browser* self) {
    go_back->SetEnabled(self->CanGoBack());
    go_forward->SetEnabled(self->CanGoForward());
    address_bar->SetText(self->GetURL());
  });
  browser->on_commit_navigation.Connect([=](nu::Browser* self,
                                            const std::string& url) {
    address_bar->SetText(url);
  });
  browser->on_finish_navigation.Connect([](nu::Browser* self,
                                           const std::string& url) {
    self->Focus();
  });

  // Bind toolbar events to browser.
  address_bar->on_activate.Connect([=](nu::Entry* self) {
    browser->LoadURL(self->GetText());
  });
  go_back->on_click.Connect([=](nu::Button* self) {
    browser->GoBack();
  });
  go_forward->on_click.Connect([=](nu::Button* self) {
    browser->GoForward();
  });
#endif

  // Set webview bindings and custom protocol.
  nu::Browser::RegisterProtocol("boilerplate", &CustomProtocolHandler);
  browser->SetBindingName("boilerplate");
  browser->AddBinding("showSysInfo", &ShowSysInfo);

  // Show window when page is loaded.
  int id = -1;
  id = browser->on_finish_navigation.Connect([=](nu::Browser* self,
                                                 const std::string& url) {
    self->GetWindow()->Activate();
    // Only activate for the first time.
    self->on_finish_navigation.Disconnect(id);
  });
  browser->LoadURL("boilerplate://app/index.html");

  // Enter message loop.
  nu::MessageLoop::Run();
  return 0;
}
