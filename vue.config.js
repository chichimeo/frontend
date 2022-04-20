module.exports = {
  lintOnSave: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://10.3.145.108:8080/',
        changeOrigin: true
      }
    }
  }
}
