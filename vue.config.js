const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
}),

function resolve(dir) {
  return path.join(__dirname, dir);
}

const path = require('path');

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
        .set('@', path.resolve(__dirname, 'src/'));
  },
};
