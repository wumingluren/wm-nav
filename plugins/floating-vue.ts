import { defineNuxtPlugin } from '#app';
import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(FloatingVue, {
    // 全局配置
    distance: 10, // 提示框与目标元素的距离

    // 主题配置
    themes: {
      tooltip: {
        // 显示/隐藏延迟
        delay: {
          show: 300,
          hide: 100,
        },
        // 提示框位置
        placement: 'top',
        // 提示框内容最大宽度
        maxWidth: 300,
        // 是否自动调整位置
        autoHide: true,
        // 是否启用HTML内容
        html: true,
      },
    },
  });
});
