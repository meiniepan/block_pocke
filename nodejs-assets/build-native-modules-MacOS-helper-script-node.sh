#!/bin/bash
      # Helper script for Gradle to call node on macOS in case it is not found
      export PATH=$PATH:/Users/sam/.nvm/versions/node/v8.12.0/lib/node_modules/npm/node_modules/npm-lifecycle/node-gyp-bin:/Users/sam/Public/trustpocket/node_modules/nodejs-mobile-react-native/node_modules/.bin:/Users/sam/Public/trustpocket/node_modules/.bin:/Users/sam/.nvm/versions/node/v8.12.0/bin:/usr/local/eosio/bin/:/Users/sam/.jenv/shims:/Users/sam/.jenv/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/go/bin:/Applications/Android Studio.app/Contents/gradle/gradle-4.4/bin:/Volumes/Sam/Android/sdk/tools:/Volumes/Sam/Android/sdk/platform-tools
      node $@
    