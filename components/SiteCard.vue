<script setup lang="ts">
import { computed } from 'vue';

// 定义网站类型接口
interface Site {
  id: string;
  title: string;
  url: string;
  category?: string;
  description?: string;
  tags?: string[];
}

// 定义组件的属性
const props = defineProps<{
  site: Site;
}>();

// 确保标题和URL显示正确
function getTitle(site: Site): string {
  if (!site.title || site.title === '无标题') {
    return site.url.replace(/^https?:\/\//, '').split('/')[0];
  }
  return site.title;
}

// 为标签生成随机颜色
const tagColors = computed(() => {
  const colors = new Map();

  // 预定义一些柔和的颜色
  const colorPalette = [
    { bg: 'bg-blue-100', text: 'text-blue-600' },
    { bg: 'bg-green-100', text: 'text-green-600' },
    { bg: 'bg-red-100', text: 'text-red-600' },
    { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    { bg: 'bg-purple-100', text: 'text-purple-600' },
    { bg: 'bg-pink-100', text: 'text-pink-600' },
    { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    { bg: 'bg-teal-100', text: 'text-teal-600' },
    { bg: 'bg-orange-100', text: 'text-orange-600' },
    { bg: 'bg-cyan-100', text: 'text-cyan-600' },
  ];

  // 为每个标签分配一个颜色
  if (props.site.tags) {
    props.site.tags.forEach(tag => {
      if (!colors.has(tag)) {
        // 使用标签字符串的哈希值来确定颜色，确保相同标签始终获得相同颜色
        const hashCode = tag.split('').reduce((acc, char) => {
          return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        const index = Math.abs(hashCode) % colorPalette.length;
        colors.set(tag, colorPalette[index]);
      }
    });
  }

  return colors;
});

// 获取标签的颜色
function getTagColor(tag: string) {
  return tagColors.value.get(tag) || { bg: 'bg-gray-100', text: 'text-gray-600' };
}
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
    <a
      :href="site.url"
      target="_blank"
      rel="noopener noreferrer"
      class="block"
      v-tooltip="site.description"
    >
      <h4 class="text-lg font-medium text-primary mb-2 hover:underline truncate">
        {{ getTitle(site) }}
      </h4>
      <p class="text-sm text-gray-500 truncate mb-2">{{ site.url }}</p>

      <div v-if="site.tags && site.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
        <span
          v-for="tag in site.tags"
          :key="tag"
          class="px-2 py-0.5 text-xs rounded-full"
          :class="[getTagColor(tag).bg, getTagColor(tag).text]"
        >
          {{ tag }}
        </span>
      </div>
    </a>
  </div>
</template>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>