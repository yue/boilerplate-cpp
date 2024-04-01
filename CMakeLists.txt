cmake_minimum_required(VERSION 3.13)

if(APPLE)
  # Target macOS version.
  set(CMAKE_OSX_DEPLOYMENT_TARGET 11.0)
elseif(WIN32)
  # Use Windows 10 SDK.
  set(CMAKE_SYSTEM_VERSION 10.0)
endif()

# Project name and executable name.
project(boilerplate)
set(APP_NAME "boilerplate")

# The main executable.
file(GLOB SRC_FILES "src/*.h" "src/*.cc")
add_executable(${APP_NAME}
               ${SRC_FILES} "${CMAKE_CURRENT_BINARY_DIR}/encryption_key.h")
if(WIN32)
  target_sources(${APP_NAME} PRIVATE "src/exe.rc" "src/exe.manifest")
endif()

# Link with Yue.
add_subdirectory(libyue)
target_link_libraries(${APP_NAME} Yue)

# Convert the ENCRYPTION_KEY file into encryption_key.h
add_custom_command(OUTPUT "${CMAKE_CURRENT_BINARY_DIR}/encryption_key.h"
                   COMMAND node scripts/bin2c.js ENCRYPTION_KEY "${CMAKE_CURRENT_BINARY_DIR}/encryption_key.h"
                   WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
                   DEPENDS "${CMAKE_CURRENT_SOURCE_DIR}/ENCRYPTION_KEY")
target_include_directories(${APP_NAME} PRIVATE "${CMAKE_CURRENT_BINARY_DIR}")

# Package the app into asar format.
file(GLOB APP_FILES "app/[_a-z]*")
add_custom_command(OUTPUT "${CMAKE_CURRENT_BINARY_DIR}/app.ear"
                   COMMAND node scripts/asar.js app "${CMAKE_CURRENT_BINARY_DIR}/app.ear"
                   WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
                   DEPENDS ${APP_FILES} "${CMAKE_CURRENT_SOURCE_DIR}/ENCRYPTION_KEY")
add_custom_target(ASAR ALL DEPENDS "${CMAKE_CURRENT_BINARY_DIR}/app.ear")
add_dependencies(${APP_NAME} ASAR)
