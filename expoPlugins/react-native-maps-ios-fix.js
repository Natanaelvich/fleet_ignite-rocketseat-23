const plugins = require('@expo/config-plugins')
const {
  mergeContents,
} = require('@expo/config-plugins/build/utils/generateCode')
const fs = require('fs')
const path = require('path')

module.exports = function withFlipper(config) {
  return plugins.withDangerousMod(config, [
    'ios',
    async (config) => {
      const filePath = path.join(
        config.modRequest.platformProjectRoot,
        'Podfile',
      )
      const contents = fs.readFileSync(filePath, 'utf-8')

      const enableFix = mergeContents({
        tag: 'react-native-maps ios fix',
        src: contents,
        newSrc: `  pod 'Google-Maps-iOS-Utils', :git => 'https://github.com/googlemaps/google-maps-ios-utils.git', :branch => 'main' `, // adding the line to point Google-Maps-iOS-Utils to the main branch
        anchor: /use_native_modules!/, // we find this line
        offset: -1, // we add it on the line before
        comment: '#',
      })

      if (!enableFix.didMerge) {
        console.log('ERROR: Cannot add react-native-maps-ios-fix to Podfile.')
        return config
      }

      fs.writeFileSync(filePath, enableFix.contents)

      return config
    },
  ])
}
