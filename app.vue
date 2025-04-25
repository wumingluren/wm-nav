<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="container-custom py-4">
        <NuxtLink to="/" class="text-xl font-bold text-blue-600">無名导航</NuxtLink>
      </div>
    </header>
    
    <main class="flex-grow">
      <NuxtPage />
    </main>
    
    <footer class="bg-white border-t sticky bottom-0 z-10">
      <div class="container-custom py-4 text-center text-gray-500 text-sm">
        <p>© {{ new Date().getFullYear() }} 無名导航 - 一个简单高效的网站导航</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 全局配置
useHead({
  title: '無名导航',
  meta: [
    { name: 'description', content: '一个简单高效的网站导航' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
})
</script>
