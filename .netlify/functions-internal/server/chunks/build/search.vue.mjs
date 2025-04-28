import __nuxt_component_0 from './index2.mjs';
import { _ as __nuxt_component_1 } from './SiteCard.vue.mjs';
import { defineComponent, ref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { a as useRoute, b as useRouter } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper.mjs';
import '@iconify/utils/lib/css/icon';
import '@iconify/vue';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:url';
import 'ipx';
import 'node:fs';
import 'node:path';
import 'vue-router';
import 'floating-vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "search",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    const router = useRouter();
    const searchQuery = ref("");
    const searchResults = ref([]);
    const isLoading = ref(false);
    const errorMessage = ref("");
    watch(searchQuery, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        router.replace({ query: { q: newValue || void 0 } });
        if (newValue) {
          performSearch();
        } else {
          searchResults.value = [];
        }
      }
    });
    const performSearch = async () => {
      if (!searchQuery.value.trim()) {
        searchResults.value = [];
        return;
      }
      try {
        isLoading.value = true;
        errorMessage.value = "";
        const results = await $fetch(
          `/api/bookmarks/search?q=${encodeURIComponent(searchQuery.value)}`
        );
        searchResults.value = results;
      } catch (error) {
        console.error("搜索失败:", error);
        errorMessage.value = error.message;
        searchResults.value = [];
      } finally {
        isLoading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      const _component_SiteCard = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 p-6" }, _attrs))} data-v-5e6d4553><div class="max-w-4xl mx-auto" data-v-5e6d4553><header class="mb-8" data-v-5e6d4553><div class="flex items-center mb-4" data-v-5e6d4553><button class="mr-4 text-gray-600 hover:text-blue-600" data-v-5e6d4553>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons:arrow-left",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</button><h1 class="text-2xl font-bold text-gray-800" data-v-5e6d4553>搜索结果</h1></div><form class="relative" data-v-5e6d4553><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="搜索网站..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-5e6d4553><button type="submit" class="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center p-2 text-gray-500 hover:text-blue-600"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-5e6d4553>`);
      if (!isLoading.value) {
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:magnifying-glass",
          class: "w-5 h-5"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:arrow-path",
          class: "w-5 h-5 animate-spin"
        }, null, _parent));
      }
      _push(`</button></form></header>`);
      if (errorMessage.value) {
        _push(`<div class="mt-4 p-4 bg-red-50 text-red-500 rounded-lg" data-v-5e6d4553>${ssrInterpolate(errorMessage.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-4" data-v-5e6d4553>`);
      if (isLoading.value) {
        _push(`<div class="text-center text-gray-500 mt-8" data-v-5e6d4553>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:arrow-path",
          class: "w-8 h-8 animate-spin text-blue-500 mx-auto"
        }, null, _parent));
        _push(`<p class="mt-2" data-v-5e6d4553>搜索中...</p></div>`);
      } else if (searchResults.value.length > 0) {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" data-v-5e6d4553><!--[-->`);
        ssrRenderList(searchResults.value, (site) => {
          _push(ssrRenderComponent(_component_SiteCard, {
            key: site.id,
            site
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else if (searchQuery.value) {
        _push(`<div class="text-center text-gray-500 mt-8" data-v-5e6d4553> 没有找到与 &quot;${ssrInterpolate(searchQuery.value)}&quot; 相关的结果 </div>`);
      } else {
        _push(`<div class="text-center text-gray-500 mt-8" data-v-5e6d4553>请输入搜索关键词</div>`);
      }
      _push(`</div></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/search.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const search = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5e6d4553"]]);

export { search as default };
//# sourceMappingURL=search.vue.mjs.map
