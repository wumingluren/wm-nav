// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/icon', '@nuxt/image', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css', 'floating-vue/dist/style.css'],
  app: {
    head: {
      title: '無名导航',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '一个简单高效的無名导航' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  // 设置默认路由为导航首页
  routeRules: {
    // '/': { index: true }
    '/': { ssr: true },
  },
  runtimeConfig: {
    // 服务器端可用的私有键
    FEISHU_APP_ID: process.env.FEISHU_APP_ID,
    FEISHU_APP_SECRET: process.env.FEISHU_APP_SECRET,
    FEISHU_BASE_ID: process.env.FEISHU_BASE_ID,
    FEISHU_TABLE_ID: process.env.FEISHU_TABLE_ID,
    // 公共键（也会暴露给客户端）
    public: {
      // 如果需要在客户端使用某些配置，可以放在这里
    },
  },
  nitro: {
    preset: 'netlify',
    output: {
      // dir: '.output',
      // serverDir: '.output/server',
      publicDir: '.output/public'
    }
  },
});
