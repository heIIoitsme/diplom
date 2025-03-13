const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    webSocketServer: false,
    port: 8080, // Убедитесь, что используете правильный порт
    open: true, // Открыть в браузере автоматически
  },
  chainWebpack: (config) => {
    // Удаляем стандартное правило для шрифтов
    config.module.rules.delete('fonts')

    // Добавляем новое правило с использованием asset modules
    config.module
      .rule('fonts')
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
      .type('asset/resource')
      .set('generator', {
        filename: 'fonts/[name][ext][query]' // Формат имени файла
      })
  },
});