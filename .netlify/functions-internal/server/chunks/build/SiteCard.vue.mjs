import { defineComponent, computed, resolveDirective, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrGetDirectiveProps, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SiteCard",
  __ssrInlineRender: true,
  props: {
    site: {}
  },
  setup(__props) {
    const props = __props;
    function getTitle(site) {
      if (!site.title || site.title === "无标题") {
        return site.url.replace(/^https?:\/\//, "").split("/")[0];
      }
      return site.title;
    }
    const tagColors = computed(() => {
      const colors = /* @__PURE__ */ new Map();
      const colorPalette = [
        { bg: "bg-blue-100", text: "text-blue-600" },
        { bg: "bg-green-100", text: "text-green-600" },
        { bg: "bg-red-100", text: "text-red-600" },
        { bg: "bg-yellow-100", text: "text-yellow-600" },
        { bg: "bg-purple-100", text: "text-purple-600" },
        { bg: "bg-pink-100", text: "text-pink-600" },
        { bg: "bg-indigo-100", text: "text-indigo-600" },
        { bg: "bg-teal-100", text: "text-teal-600" },
        { bg: "bg-orange-100", text: "text-orange-600" },
        { bg: "bg-cyan-100", text: "text-cyan-600" }
      ];
      if (props.site.tags) {
        props.site.tags.forEach((tag) => {
          if (!colors.has(tag)) {
            const hashCode = tag.split("").reduce((acc, char) => {
              return char.charCodeAt(0) + ((acc << 5) - acc);
            }, 0);
            const index = Math.abs(hashCode) % colorPalette.length;
            colors.set(tag, colorPalette[index]);
          }
        });
      }
      return colors;
    });
    function getTagColor(tag) {
      return tagColors.value.get(tag) || { bg: "bg-gray-100", text: "text-gray-600" };
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_tooltip = resolveDirective("tooltip");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200" }, _attrs))} data-v-3c3e6b53><a${ssrRenderAttrs(mergeProps({
        href: _ctx.site.url,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "block"
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, _ctx.site.description)))} data-v-3c3e6b53><h4 class="text-lg font-medium text-primary mb-2 hover:underline truncate" data-v-3c3e6b53>${ssrInterpolate(getTitle(_ctx.site))}</h4><p class="text-sm text-gray-500 truncate mb-2" data-v-3c3e6b53>${ssrInterpolate(_ctx.site.url)}</p>`);
      if (_ctx.site.tags && _ctx.site.tags.length > 0) {
        _push(`<div class="flex flex-wrap gap-1 mt-2" data-v-3c3e6b53><!--[-->`);
        ssrRenderList(_ctx.site.tags, (tag) => {
          _push(`<span class="${ssrRenderClass([[getTagColor(tag).bg, getTagColor(tag).text], "px-2 py-0.5 text-xs rounded-full"])}" data-v-3c3e6b53>${ssrInterpolate(tag)}</span>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</a></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SiteCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3c3e6b53"]]);

export { __nuxt_component_1 as _ };
//# sourceMappingURL=SiteCard.vue.mjs.map
