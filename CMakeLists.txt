cmake_minimum_required(VERSION 3.1)

# Makefiles do not work without a build type.
if((CMAKE_GENERATOR STREQUAL "Unix Makefiles") AND (NOT CMAKE_BUILD_TYPE))
  message(FATAL_ERROR "You must specify a build type.")
endif()

# Target macOS version, Have to set this before creating project.
set(CMAKE_OSX_DEPLOYMENT_TARGET 10.10)

# Project name and executable name.
project(muban)
set(APP_NAME "muban")

# Utility executable, not shipped in final product.
add_executable(bin2c src/bin2c.c)

# The main executable.
file(GLOB APP_SRC "src/*.h" "src/*.cc")
add_executable(${APP_NAME}
               ${APP_SRC} "${CMAKE_CURRENT_BINARY_DIR}/encryption_key.h")

# Convert the ENCRYPTION_KEY file into encryption_key.h
add_custom_command(OUTPUT ${CMAKE_CURRENT_BINARY_DIR}/encryption_key.h
                   COMMAND bin2c -c ENCRYPTION_KEY ${CMAKE_CURRENT_BINARY_DIR}/encryption_key.h
                   WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
                   DEPENDS bin2c ENCRYPTION_KEY)
target_include_directories(${APP_NAME} PRIVATE "${CMAKE_CURRENT_BINARY_DIR}")

# Get the absolute path the libyue.
get_filename_component(LIBYUE_DIR
                       "${CMAKE_SOURCE_DIR}/libyue"
                       ABSOLUTE)

# Add libyue to include dirs.
target_include_directories(${APP_NAME} PRIVATE "${LIBYUE_DIR}/include")

# Use C++14 standard.
set_target_properties(${APP_NAME} PROPERTIES
                      CXX_STANDARD 14
                      CXX_STANDARD_REQUIRED ON
                      CXX_EXTENSIONS ON)

# macOS configuration.
if(APPLE)
  find_library(APPKIT AppKit)
  find_library(IOKIT IOKit)
  find_library(SECURITY Security)
  find_library(WEBKIT WebKit)
  target_link_libraries(${APP_NAME}
                        ${APPKIT} ${IOKIT} ${SECURITY} ${WEBKIT}
                        optimized ${LIBYUE_DIR}/lib/libyue.a
                        debug ${LIBYUE_DIR}/lib/libyued.a)
  set_target_properties(${APP_NAME} PROPERTIES LINK_FLAGS
                        "-Wl,-dead_strip")
endif()

# win32 configuration
if(WIN32)
  target_compile_definitions(${APP_NAME} PUBLIC NOMINMAX UNICODE _UNICODE)
  set_property(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
               PROPERTY VS_STARTUP_PROJECT ${APP_NAME})
  set_target_properties(${APP_NAME} PROPERTIES LINK_FLAGS
                        "/DELAYLOAD:setupapi.dll \
                         /DELAYLOAD:powrprof.dll \
                         /DELAYLOAD:dwmapi.dll \
                         /SUBSYSTEM:WINDOWS")
  target_link_libraries(${APP_NAME}
                        setupapi.lib powrprof.lib ws2_32.lib dbghelp.lib
                        shlwapi.lib version.lib winmm.lib psapi.lib dwmapi.lib
                        propsys.lib comctl32.lib gdi32.lib gdiplus.lib
                        urlmon.lib
                        optimized ${LIBYUE_DIR}/lib/libyue.lib
                        debug ${LIBYUE_DIR}/lib/libyued.lib)
  foreach(flag_var
           CMAKE_CXX_FLAGS CMAKE_CXX_FLAGS_DEBUG CMAKE_CXX_FLAGS_RELEASE
           CMAKE_CXX_FLAGS_MINSIZEREL CMAKE_CXX_FLAGS_RELWITHDEBINFO)
    string(REPLACE "/MD" "-MT" ${flag_var} "${${flag_var}}")
  endforeach()
endif()

# Linux configuration
if(UNIX AND NOT APPLE)
  find_package(PkgConfig)
  pkg_search_module(GTK3 REQUIRED gtk+-3.0)
  pkg_search_module(X11 REQUIRED x11)
  target_include_directories(${APP_NAME} PUBLIC
                             ${GTK3_INCLUDE_DIRS} ${X11_INCLUDE_DIRS})
  target_compile_options(${APP_NAME} PUBLIC
                         ${GTK3_CFLAGS_OTHER} ${X11_CFLAGS_OTHER})
  target_link_libraries(${APP_NAME}
                        optimized ${LIBYUE_DIR}/lib/libyue.a
                        debug ${LIBYUE_DIR}/lib/libyued.a
                        pthread dl atomic ${GTK3_LIBRARIES} ${X11_LIBRARIES})
  set_target_properties(${APP_NAME} PROPERTIES LINK_FLAGS
                        "-fdata-sections -ffunction-sections -Wl,--gc-section")
endif()
