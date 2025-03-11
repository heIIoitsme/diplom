const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    webSocketServer: false,
    port: 8080, // Убедитесь, что используете правильный порт
    open: true, // Открыть в браузере автоматически
  }
});