const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  transpileDependencies: true,
  
  chainWebpack: config => {
    config.resolve.alias
        .set('@', path.resolve(__dirname, 'src/'));
  },
  
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // 将Element UI单独打包
          elementUI: {
            name: 'chunk-elementUI',
            priority: 20,
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            chunks: 'all'
          },
          // 将highlight.js单独打包
          highlight: {
            name: 'chunk-highlight',
            priority: 20,
            test: /[\\/]node_modules[\\/]highlight\.js[\\/]/,
            chunks: 'all'
          },
          // 将markdown相关库单独打包
          markdown: {
            name: 'chunk-markdown',
            priority: 20,
            test: /[\\/]node_modules[\\/](markdown-it|vue-marked|markdown-it-highlightjs)[\\/]/,
            chunks: 'all'
          },
          // 将Vue相关库单独打包
          vue: {
            name: 'chunk-vue',
            priority: 20,
            test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
            chunks: 'all'
          },
          // 将其他第三方库打包
          vendor: {
            name: 'chunk-vendor',
            priority: 10,
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            minChunks: 1
          },
          // 公共代码
          common: {
            name: 'chunk-common',
            priority: 5,
            minChunks: 2,
            chunks: 'all',
            enforce: true
          }
        },
        // 设置单个chunk的最大大小为1MB
        maxSize: 1024 * 1024,
        // 设置单个chunk的最小大小
        minSize: 20000
      }
    },
    // 性能配置，当文件超过1MB时给出警告
    performance: {
      maxAssetSize: 1024 * 1024,
      maxEntrypointSize: 1024 * 1024,
      hints: 'warning'
    }
  },
  
  // 生产环境配置
  productionSourceMap: false,
  
  // CSS相关配置
  css: {
    extract: {
      ignoreOrder: true
    }
  }
};
