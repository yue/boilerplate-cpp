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
  std::string path = url.substr(sizeof("muban://app/") - 1);
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
  PathService::Get(base::FILE_EXE, &g_app_path);
#else
  PathService::Get(base::DIR_EXE, &g_app_path);
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

  // Create the webview.
  nu::Browser::RegisterProtocol("muban", &CustomProtocolHandler);
  scoped_refptr<nu::Browser> browser(new nu::Browser());
  browser->SetBindingName("muban");
  browser->AddBinding("showSysInfo", &ShowSysInfo);
  window->SetContentView(browser.get());

  // Show window when page is loaded.
  browser->on_finish_navigation.Connect([window](nu::Browser* browser,
                                                 const std::string& url) {
    window->Activate();
  });
  browser->LoadURL("muban://app/index.html");

  // Enter message loop.
  nu::MessageLoop::Run();
  return 0;
}
