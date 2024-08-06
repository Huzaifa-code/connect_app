export default  {
  "expo": {
    "name": "Connect",
    "slug": "signal-clone",
    "version": "2.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon1.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#381fd1"
    },
    "plugins" : [
      "@react-native-google-signin/google-signin",
      "expo-secure-store",
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
          "recordAudioAndroid": true
        }
      ],
      "@stream-io/video-react-native-sdk",
      [
        "@config-plugins/react-native-webrtc",
        {
          // optionally you can add your own explanations for permissions on iOS
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone"
        }
      ],
      // 'expo-build-properties',
      // {
      //   android: {
      //     extraMavenRepos: ['../../node_modules/@notifee/react-native/android/libs'],
      //   }
      // },
    ],
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "host.expo.iosbuild",
      "googleServicesFile": process.env.GOOGLE_SERVICES_INFOPLIST,
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon1.png",
        "backgroundColor": "#381fd1"
      },
      "package": "com.huzaifa_037.connect",
      // "googleServicesFile": process.env.GOOGLE_SERVICES_JSON,
      "googleServicesFile": "./google-services.json",
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.CHANGE_NETWORK_STATE",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.RECORD_AUDIO",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.BLUETOOTH",
        "android.permission.BLUETOOTH_CONNECT",
        "android.permission.POST_NOTIFICATIONS",
        "android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION"
      ],
      "plugins" : [
        "expo-build-properties",
        {
          "android": {
            "minSdkVersion": 24,
            "compileSdkVersion": 34,
            "targetSdkVersion": 33
          }
        }
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "bfb07209-f56a-40e5-8dd3-c8931a1c904f"
      }
    },
    "packagerOpts": {
      "config": "metro.config.js"
    },
  }
}
