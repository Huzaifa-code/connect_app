# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep '**/*.class'
-keep class java.lang.invoke.StringConcatFactory { *; }
-dontwarn java.lang.invoke.StringConcatFactory
-keep class com.facebook.react.** { *; }
-keep class expo.modules.** { *; }
-keep class com.google.gson.** { *; }

# 100ms proguard rules
-keep class org.webrtc.** { *; }
-keep class live.hms.video.** { *; }



# Add any project specific keep options here:

# @generated begin expo-build-properties - expo prebuild (DO NOT MODIFY)

-keep class org.webrtc.** { *; }

# @generated end expo-build-properties