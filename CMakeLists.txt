cmake_minimum_required(VERSION 3.4)

# Target macOS version, Have to set this before creating project.
set(CMAKE_OSX_DEPLOYMENT_TARGET 10.10)

# Project name and executable name.
project(muban)
set(APP_NAME "muban")

# The main executable.
file(GLOB SRC_FILES "src/*.h" "src/*.cc" "src/*.rc" "src/*.xml" "src/*.ico")
add_executable(${APP_NAME}
               ${SRC_FILES} "${CMAKE_CURRENT_BINARY_DIR}/encryption_key.h")

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
