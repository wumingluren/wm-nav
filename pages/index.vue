<script setup lang="ts">
import { ref, onMounted } from 'vue';
import 'floating-vue/dist/style.css';

// 定义网站类型接口
interface Site {
  id: string;
  title: string;
  url: string;
  category?: string;
  description?: string;
  tags?: string[]; // 添加 tags 属性
}

const searchQuery = ref('');
const isSearching = ref(false);
const recommendedSites = ref<Site[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');

// 获取推荐网站数据
const fetchRecommendedSites = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    // 使用类型断言处理返回数据
    const data = await $fetch<Site[]>('/api/bookmarks/recommended');
    recommendedSites.value = data;
  } catch (error) {
    console.error('获取推荐网站失败:', error);
    errorMessage.value = (error as Error).message;
  } finally {
    isLoading.value = false;
  }
};

// 页面加载时获取推荐网站
onMounted(() => {
  fetchRecommendedSites();
});

const handleSearch = () => {
  if (!searchQuery.value.trim()) return;
  isSearching.value = true;
  // 跳转到搜索页面
  setTimeout(() => {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`);
    isSearching.value = false;
  }, 300);
};

// 移除 tagColors 相关代码
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <header class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">無名导航</h1>
        <p class="text-gray-600">快速访问您收藏的网址</p>
      </header>

      <!-- 搜索区域 -->
      <form @submit.prevent="handleSearch" class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="想找什么直接搜"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :disabled="isSearching"
        />
        <button
          type="submit"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center p-2 text-gray-500 hover:text-blue-600"
          :disabled="isSearching"
        >
          <Icon v-if="!isSearching" name="heroicons:magnifying-glass" class="w-5 h-5" />
          <Icon v-else name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
        </button>
      </form>

      <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 text-red-500 rounded-lg">
        {{ errorMessage }}
      </div>

      <!-- 推荐网站 -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold mb-4">推荐网站</h2>

        <div v-if="isLoading" class="text-center text-gray-500 mt-4">
          <Icon name="heroicons:arrow-path" class="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          <p class="mt-2">加载中...</p>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <SiteCard 
            v-for="site in recommendedSites" 
            :key="site.id" 
            :site="site"
          />
        </div>

        <div
          v-if="!isLoading && recommendedSites.length === 0"
          class="text-center text-gray-500 mt-4"
        >
          暂无推荐网站，请先添加一些书签
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
