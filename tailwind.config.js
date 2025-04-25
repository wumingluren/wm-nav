/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        // 添加主题色 
        primary: { 
          DEFAULT: "#409EFF", 
          light: "#66b1ff", // 浅色版本，用于hover效果 
          dark: "#337ecc", // 深色版本，可用于active效果 
        },
      },
      // 明确设置 ring 颜色 
      ringColor: { 
        DEFAULT: "rgb(147 197 253 / 0.5)", // 默认 ring 颜色 
        primary: "#409EFF", // 主题色 ring 
      },
    },
  },
  fontFamily: {
    sans: ["Inter var", "sans-serif"],
  },
}
