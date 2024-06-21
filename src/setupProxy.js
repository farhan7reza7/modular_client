const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      //target: "http://localhost:4000",
      target: "http://backend-dev.ap-northeast-3.elasticbeanstalk.com/",
      changeOrigin: true,
    })
  );
};
