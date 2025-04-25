<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import 'floating-vue/dist/style.css';

// 定义网站类型接口
interface Site {
  id: string;
  title: string;
  url: string;
  category?: string;
  description?: string;
  tags?: string[];
}

const route = useRoute();
const router = useRouter();
const searchQuery = ref('');
const searchResults = ref<Site[]>([]);
const isLoading = ref(false);
const errorMessage = ref('');

// 从URL获取搜索关键词
onMounted(() => {
  const query = route.query.q as string;
  if (query) {
    searchQuery.value = query;
    performSearch();
  }
});

// 监听搜索关键词变化
watch(searchQuery, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    // 更新URL
    router.replace({ query: { q: newValue || undefined } });
    if (newValue) {
      performSearch();
    } else {
      searchResults.value = [];
    }
  }
});

// 执行搜索
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = '';
    // 调用搜索API
    const results = await $fetch<Site[]>(
      `/api/bookmarks/search?q=${encodeURIComponent(searchQuery.value)}`
    );
    searchResults.value = results;
  } catch (error) {
    console.error('搜索失败:', error);
    errorMessage.value = (error as Error).message;
    searchResults.value = [];
  } finally {
    isLoading.value = false;
  }
};

// 返回首页
const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <header class="mb-8">
        <div class="flex items-center mb-4">
          <button @click="goHome" class="mr-4 text-gray-600 hover:text-blue-600">
            <Icon name="heroicons:arrow-left" class="w-5 h-5" />
          </button>
          <h1 class="text-2xl font-bold text-gray-800">搜索结果</h1>
        </div>

        <!-- 搜索区域 -->
        <form @submit.prevent="performSearch" class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索网站..."
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :disabled="isLoading"
          />
          <button
            type="submit"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center p-2 text-gray-500 hover:text-blue-600"
            :disabled="isLoading"
          >
            <Icon v-if="!isLoading" name="heroicons:magnifying-glass" class="w-5 h-5" />
            <Icon v-else name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
          </button>
        </form>
      </header>

      <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 text-red-500 rounded-lg">
        {{ errorMessage }}
      </div>

      <!-- 搜索结果 -->
      <div class="mt-4">
        <div v-if="isLoading" class="text-center text-gray-500 mt-8">
          <Icon name="heroicons:arrow-path" class="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          <p class="mt-2">搜索中...</p>
        </div>

        <div
          v-else-if="searchResults.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          <SiteCard v-for="site in searchResults" :key="site.id" :site="site" />
        </div>

        <div v-else-if="searchQuery" class="text-center text-gray-500 mt-8">
          没有找到与 "{{ searchQuery }}" 相关的结果
        </div>

        <div v-else class="text-center text-gray-500 mt-8">请输入搜索关键词</div>
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
