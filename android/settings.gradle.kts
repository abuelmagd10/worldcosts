pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

// This is the correct way to include Flutter in a Kotlin DSL settings file
include(":app")
apply(from = "C:\\Users\\abuel\\AppData\\Local\\flutter\\packages\\flutter_tools\\gradle\\app_plugin_loader.gradle")
