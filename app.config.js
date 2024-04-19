export default  {
  "expo": {
    "name": "Connect",
    "slug": "signal-clone",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon1.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#381fd1"
    },
    "plugins" : [
      "@react-native-google-signin/google-signin"
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
      "googleServicesFile": "./google-services.json"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "bfb07209-f56a-40e5-8dd3-c8931a1c904f"
      }
    }
  }
}
