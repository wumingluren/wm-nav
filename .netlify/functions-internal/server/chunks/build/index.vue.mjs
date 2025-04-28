import __nuxt_component_0 from './index2.mjs';
import { _ as __nuxt_component_1 } from './SiteCard.vue.mjs';
import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper.mjs';
import '@iconify/utils/lib/css/icon';
import '@iconify/vue';
import './server.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const searchQuery = ref("");
    const isSearching = ref(false);
    const recommendedSites = ref([]);
    const isLoading = ref(true);
    const errorMessage = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      const _component_SiteCard = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 p-6" }, _attrs))} data-v-05d3a7d2><div class="max-w-4xl mx-auto" data-v-05d3a7d2><header class="mb-8 text-center" data-v-05d3a7d2><h1 class="text-3xl font-bold text-gray-800 mb-2" data-v-05d3a7d2>無名导航</h1><p class="text-gray-600" data-v-05d3a7d2>快速访问您收藏的网址</p></header><form class="relative" data-v-05d3a7d2><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="想找什么直接搜" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"${ssrIncludeBooleanAttr(isSearching.value) ? " disabled" : ""} data-v-05d3a7d2><button type="submit" class="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center p-2 text-gray-500 hover:text-blue-600"${ssrIncludeBooleanAttr(isSearching.value) ? " disabled" : ""} data-v-05d3a7d2>`);
      if (!isSearching.value) {
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
      _push(`</button></form>`);
      if (errorMessage.value) {
        _push(`<div class="mt-4 p-4 bg-red-50 text-red-500 rounded-lg" data-v-05d3a7d2>${ssrInterpolate(errorMessage.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-8" data-v-05d3a7d2><h2 class="text-xl font-semibold mb-4" data-v-05d3a7d2>推荐网站</h2>`);
      if (isLoading.value) {
        _push(`<div class="text-center text-gray-500 mt-4" data-v-05d3a7d2>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:arrow-path",
          class: "w-8 h-8 animate-spin text-blue-500 mx-auto"
        }, null, _parent));
        _push(`<p class="mt-2" data-v-05d3a7d2>加载中...</p></div>`);
      } else {
        _push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" data-v-05d3a7d2><!--[-->`);
        ssrRenderList(recommendedSites.value, (site) => {
          _push(ssrRenderComponent(_component_SiteCard, {
            key: site.id,
            site
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      if (!isLoading.value && recommendedSites.value.length === 0) {
        _push(`<div class="text-center text-gray-500 mt-4" data-v-05d3a7d2> 暂无推荐网站，请先添加一些书签 </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-05d3a7d2"]]);

export { index as default };
//# sourceMappingURL=index.vue.mjs.map
