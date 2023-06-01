// {
//   "expo": {
//     "name": "Fleet",
//     "slug": "fleet",
//     "version": "1.0.0",
//     "orientation": "portrait",
//     "icon": "./assets/icon.png",
//     "userInterfaceStyle": "light",
//     "scheme": "com.natanaelvich.fleet",
//     "splash": {
//       "image": "./assets/splash.png",
//       "resizeMode": "cover",
//       "backgroundColor": "#202024"
//     },
//     "assetBundlePatterns": [
//       "**/*"
//     ],
//     "ios": {
//       "supportsTablet": true,
//       "bundleIdentifier": "com.natanaelvich.fleet"
//     },
//     "android": {
//       "adaptiveIcon": {
//         "foregroundImage": "./assets/adaptive-icon.png",
//         "backgroundColor": "#202024"
//       },
//       "package": "com.natanaelvich.fleet"
//     },
//     "web": {
//       "favicon": "./assets/favicon.png"
//     },
//     "extra": {
//       "eas": {
//         "projectId": "c4400ff3-56a2-482f-b56f-7e6e0be37ad3"
//       }
//     }
//   }
// }
const IS_DEV = process.env.APP_VARIANT === 'development'

export default {
  name: IS_DEV ? 'Fleet Dev' : 'Fleet',
  slug: IS_DEV ? 'fleet-dev' : 'fleet',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  scheme: 'com.natanaelvich.fleet',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#202024',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_DEV
      ? 'com.natanaelvich.fleet-dev'
      : 'com.natanaelvich.fleet',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#202024',
    },
    package: IS_DEV ? 'com.natanaelvich.fleet-dev' : 'com.natanaelvich.fleet',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    eas: {
      projectId: 'c4400ff3-56a2-482f-b56f-7e6e0be37ad3',
    },
  },
}
