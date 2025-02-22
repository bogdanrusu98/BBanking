const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // Prefixul pentru cererile tale
    createProxyMiddleware({
      target: 'https://api.deepseek.com', // URL-ul serverului API
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Elimină prefixul `/api` din cerere
      },
    })
  );
};