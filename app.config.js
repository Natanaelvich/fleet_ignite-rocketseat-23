const IS_DEV = process.env.APP_VARIANT === 'development'

export default {
  name: IS_DEV ? 'Fleet Dev' : 'Fleet',
  slug: 'fleet',
  version: '1.0.0',
  orientation: 'portrait',
  icon: IS_DEV ? './assets/icon-dev.png' : './assets/icon.png',
  userInterfaceStyle: 'light',
  scheme: IS_DEV ? 'com.natanaelvich.fleetdev' : 'com.natanaelvich.fleet',
  splash: {
    image: IS_DEV ? './assets/splash-dev.png' : './assets/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#202024',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_DEV
      ? 'com.natanaelvich.fleet-dev'
      : 'com.natanaelvich.fleet',
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: IS_DEV
        ? './assets/adaptive-icon-dev.png'
        : './assets/adaptive-icon.png',
      backgroundColor: '#202024',
    },
    package: IS_DEV ? 'com.natanaelvich.fleetdev' : 'com.natanaelvich.fleet',
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID,
      },
    },
  },
  web: {
    favicon: IS_DEV ? './assets/favicon-dev.png' : './assets/favicon.png',
  },
  extra: {
    eas: {
      projectId: 'c4400ff3-56a2-482f-b56f-7e6e0be37ad3',
    },
  },
}
