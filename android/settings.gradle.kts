pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
    plugins {
        id("dev.flutter.flutter-gradle-plugin") version "1.0.0" apply false
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

include(":app")

// Set up the Flutter SDK path
val flutterSdkPath = providers.gradleProperty("flutter.sdk")
    .orElse(System.getenv("FLUTTER_ROOT") ?: "")
    .get()

// The apply() line has been removed
apply(from = "$flutterSdkPath/packages/flutter_tools/gradle/app_plugin_loader.gradle")
// Remove the manual apply() call at the end
