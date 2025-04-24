const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === "production" ? "/bmapweb/" : "/",
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/styles/base.scss";`,
      },
    },
  },
});
