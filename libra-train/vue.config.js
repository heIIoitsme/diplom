const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    webSocketServer: false,
    port: 8080, // Убедитесь, что используете правильный порт
    open: true, // Открыть в браузере автоматически
  },
  chainWebpack: (config) => {
    config.module
      .rule('fonts')
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 10000,
        name: 'fonts/[name].[hash:7].[ext]',
      });
  },
});