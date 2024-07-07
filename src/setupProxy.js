const { createProxyMiddleware } = require("http-proxy-middleware");
const { apiUrl } = require("./config");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: apiUrl,
      //target: "http://localhost:8080",
      //target: "http://localhost:4000",

      //target: "http://backend-dev.ap-northeast-3.elasticbeanstalk.com/",
      changeOrigin: true,
    })
  );
};
