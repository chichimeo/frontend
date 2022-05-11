const path = require('path')

module.exports = {
  lintOnSave: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/',
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve('src'),
        'src': path.resolve('src'),
        'assets': path.resolve('src/assets'),
        'components': path.resolve('src/components'),
        'directives': path.resolve('src/directives')
      }
    },
    performance: {
      hints: false
    }
  }
}
