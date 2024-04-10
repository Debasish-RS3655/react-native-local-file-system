# Read local file inside React Native
import any file inside react native just as you would in Node.js Fs. 

## files other than .html and .txt

inside metro.config, push the other file extensions
```
const { getDefaultConfig } = require('@expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// since the .txt extension is unknown to metro we need to tell it to recognize it
// also for the .html extension
config.resolver.assetExts.push('txt');
config.resolver.assetExts.push('html');

module.exports = config;
```


inside babel.config.js, add the other file types in the extensions field
```
module.exports = function (api) {
  api.cache(true);

  const presets = ['babel-preset-expo'];
  return {
    presets,
    plugins: [
      [
        "module-resolver",
        {
          "extensions": [".ts", ".tsx", ".native.ts", ".native.tsx", ".android.ts", ".android.tsx", ".ios.ts", ".ios.tsx", ".txt", ".html"],
          "alias": {
            "@src": "./src",
          },
        }
      ]
    ]
  };
};

```
