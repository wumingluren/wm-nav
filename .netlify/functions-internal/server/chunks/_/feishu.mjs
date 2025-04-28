import { $ as $fetch } from './nitro.mjs';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class FeishuService {
  constructor(config) {
    __publicField(this, "config");
    __publicField(this, "accessToken", null);
    __publicField(this, "tokenExpireTime", 0);
    this.config = config;
  }
  /**
   * 获取飞书访问令牌
   * @returns 获取令牌是否成功
   */
  async getAccessToken() {
    try {
      const response = await $fetch(
        "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
        {
          method: "POST",
          body: {
            app_id: this.config.appId,
            app_secret: this.config.appSecret
          }
        }
      );
      if (response.code === 0 && response.tenant_access_token) {
        this.accessToken = response.tenant_access_token;
        return true;
      } else {
        console.error("\u83B7\u53D6\u8BBF\u95EE\u4EE4\u724C\u5931\u8D25:", response.msg);
        this.accessToken = null;
        return false;
      }
    } catch (error) {
      console.error("\u83B7\u53D6\u8BBF\u95EE\u4EE4\u724C\u5931\u8D25:", error);
      this.accessToken = null;
      return false;
    }
  }
  /**
   * 测试飞书多维表格连接
   * @returns 包含连接测试结果的对象，success表示是否成功，message包含详细信息
   */
  async testConnection() {
    try {
      if (!await this.getAccessToken()) {
        return { success: false, message: "\u83B7\u53D6\u8BBF\u95EE\u4EE4\u724C\u5931\u8D25" };
      }
      const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.config.baseId}/tables/${this.config.tableId}/records?page_size=1`;
      const response = await $fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json"
        }
      });
      if (response.code !== 0) {
        throw new Error(response.msg || "\u591A\u7EF4\u8868\u683C\u8BBF\u95EE\u5931\u8D25");
      }
      return { success: true, message: "\u8FDE\u63A5\u6D4B\u8BD5\u6210\u529F\uFF0C\u591A\u7EF4\u8868\u683C\u8BBF\u95EE\u6B63\u5E38" };
    } catch (error) {
      return {
        success: false,
        message: `\u8FDE\u63A5\u6D4B\u8BD5\u5931\u8D25: ${error.message}`
      };
    }
  }
  /**
   * 从飞书多维表格获取数据
   * @param searchTerm 搜索关键词
   * @returns 返回符合条件的记录数组
   */
  async getTableData(searchTerm = "") {
    var _a;
    try {
      if (!await this.getAccessToken()) {
        throw new Error("\u83B7\u53D6\u8BBF\u95EE\u4EE4\u724C\u5931\u8D25");
      }
      const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.config.baseId}/tables/${this.config.tableId}/records`;
      const response = await $fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json"
        }
      });
      if (response.code === 0) {
        const records = ((_a = response.data) == null ? void 0 : _a.items) || [];
        if (searchTerm) {
          return records.filter((item) => {
            const fields = item.fields;
            return fields.\u6807\u9898 && String(fields.\u6807\u9898).toLowerCase().includes(searchTerm) || fields.\u7B80\u4ECB && String(fields.\u7B80\u4ECB).toLowerCase().includes(searchTerm) || fields.\u6807\u7B7E && (Array.isArray(fields.\u6807\u7B7E) ? fields.\u6807\u7B7E.some((tag) => tag.toLowerCase().includes(searchTerm)) : String(fields.\u6807\u7B7E).toLowerCase().includes(searchTerm));
          }).map((item) => this.formatBookmark(item));
        }
        return records.map((item) => this.formatBookmark(item));
      } else {
        console.error("\u83B7\u53D6\u8868\u683C\u6570\u636E\u5931\u8D25:", response);
        throw new Error(`\u83B7\u53D6\u8868\u683C\u6570\u636E\u5931\u8D25: ${response.msg}`);
      }
    } catch (error) {
      console.error("\u83B7\u53D6\u8868\u683C\u6570\u636E\u9519\u8BEF:", error);
      throw error;
    }
  }
  /**
   * 检查URL是否已存在于多维表格中
   * @param url 要检查的URL地址
   * @returns 返回布尔值，true表示URL已存在，false表示不存在
   */
  async isUrlExists(url) {
    var _a;
    if (!await this.getAccessToken()) {
      throw new Error("\u83B7\u53D6\u8BBF\u95EE\u4EE4\u724C\u5931\u8D25");
    }
    const requestUrl = `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.config.baseId}/tables/${this.config.tableId}/records/search`;
    const requestBody = {
      filter: {
        conjunction: "and",
        conditions: [
          {
            field_name: "\u7F51\u5740",
            operator: "is",
            value: [url]
          }
        ]
      }
    };
    const response = await $fetch(requestUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json"
      },
      body: requestBody
    });
    if (response.code !== 0) {
      throw new Error(response.msg || "\u68C0\u67E5URL\u5931\u8D25");
    }
    return (((_a = response.data) == null ? void 0 : _a.total) || 0) > 0;
  }
  /**
   * 保存书签到飞书多维表格
   * @param bookmark 要保存的书签对象，包含标题、URL和标签
   * @returns 返回飞书API的响应数据
   */
  async saveBookmark(bookmark) {
    if (!(bookmark == null ? void 0 : bookmark.title) || !(bookmark == null ? void 0 : bookmark.url)) {
      throw new Error("\u4E66\u7B7E\u6807\u9898\u548C\u7F51\u5740\u4E0D\u80FD\u4E3A\u7A7A");
    }
    const exists = await this.isUrlExists(bookmark.url);
    if (exists) {
      throw new Error("\u8BE5\u7F51\u5740\u5DF2\u7ECF\u5B58\u5728");
    }
    let tags = [];
    if (bookmark.tags) {
      tags = bookmark.tags.split("#").filter((tag) => tag.trim() !== "");
    }
    const requestBody = {
      fields: {
        \u6807\u9898: bookmark.title,
        \u7F51\u5740: {
          link: bookmark.url
        },
        // 如果有标签，则添加到请求中
        ...tags.length > 0 && { \u6807\u7B7E: tags }
      }
    };
    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.config.baseId}/tables/${this.config.tableId}/records`;
    const response = await $fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json"
      },
      body: requestBody
    });
    if (response.code !== 0) {
      throw new Error(response.msg || "\u4FDD\u5B58\u5931\u8D25");
    }
    return response;
  }
  /**
   * 搜索书签
   * @param query 搜索关键词
   * @returns 返回匹配的书签数组
   */
  async searchBookmarks(query) {
    var _a;
    if (!await this.getAccessToken()) {
      throw new Error("\u83B7\u53D6\u8BBF\u95EE\u4EE4\u724C\u5931\u8D25");
    }
    const conditions = [
      {
        field_name: "\u6807\u9898",
        operator: "contains",
        value: [query]
      },
      {
        field_name: "\u7F51\u5740",
        operator: "contains",
        value: [query]
      },
      // 增加标签搜索条件
      {
        field_name: "\u6807\u7B7E\u516C\u5F0F",
        operator: "contains",
        value: [query]
      }
    ];
    const requestBody = {
      filter: {
        conjunction: "or",
        conditions
      },
      page_size: 100
    };
    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.config.baseId}/tables/${this.config.tableId}/records/search`;
    const response = await $fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json"
      },
      body: requestBody
    });
    if (response.code !== 0) {
      console.error("\u641C\u7D22\u4E66\u7B7EAPI\u9519\u8BEF:", response);
      throw new Error(response.msg || "\u641C\u7D22\u4E66\u7B7E\u5931\u8D25");
    }
    return (((_a = response.data) == null ? void 0 : _a.items) || []).map((item) => this.formatBookmark(item));
  }
  /**
   * 获取推荐书签
   * @param limit 获取的书签数量限制
   * @returns 返回推荐的书签数组
   */
  async getRecommendedBookmarks(limit = 12) {
    try {
      if (!await this.getAccessToken()) {
        throw new Error("\u83B7\u53D6\u8BBF\u95EE\u4EE4\u724C\u5931\u8D25");
      }
      const tagsOptions = await this.fetchTagsOptions();
      if (!tagsOptions || tagsOptions.length === 0) {
        console.log("\u6CA1\u6709\u627E\u5230\u6807\u7B7E\u9009\u9879\uFF0C\u5C06\u83B7\u53D6\u6700\u65B0\u7684\u4E66\u7B7E");
        return await this.fetchLatestBookmarks(limit);
      }
      const selectedTags = this.getRandomTags(tagsOptions, Math.floor(Math.random() * 3) + 1);
      const bookmarks = await this.fetchBookmarksByTags(selectedTags);
      if (bookmarks.length < limit) {
        const latestBookmarks = await this.fetchLatestBookmarks(limit - bookmarks.length);
        const allBookmarks = [...bookmarks];
        for (const bookmark of latestBookmarks) {
          if (!allBookmarks.some((b) => b.id === bookmark.id)) {
            allBookmarks.push(bookmark);
          }
        }
        return allBookmarks;
      }
      if (bookmarks.length > limit) {
        return this.getRandomBookmarks(bookmarks, limit);
      }
      return bookmarks;
    } catch (error) {
      console.error("\u83B7\u53D6\u63A8\u8350\u4E66\u7B7E\u5931\u8D25:", error);
      throw error;
    }
  }
  /**
   * 获取标签字段的所有选项
   * @returns 返回标签选项的字符串数组
   */
  async fetchTagsOptions() {
    var _a, _b;
    try {
      const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.config.baseId}/tables/${this.config.tableId}/fields`;
      const response = await $fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json"
        }
      });
      if (response.code === 0) {
        const tagField = (_b = (_a = response.data) == null ? void 0 : _a.items) == null ? void 0 : _b.find((field) => field.field_name === "\u6807\u7B7E");
        if (!tagField || !tagField.property || !tagField.property.options) {
          return [];
        }
        return tagField.property.options.map((option) => option.name);
      } else {
        console.error("\u83B7\u53D6\u5B57\u6BB5\u5931\u8D25:", response);
        return [];
      }
    } catch (error) {
      console.error("\u83B7\u53D6\u6807\u7B7E\u9009\u9879\u5931\u8D25:", error);
      return [];
    }
  }
  /**
   * 随机选择标签
   * @param tags 所有可选标签的数组
   * @param count 需要选择的标签数量
   * @returns 返回随机选择的标签数组
   */
  getRandomTags(tags, count) {
    const shuffled = [...tags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, tags.length));
  }
  /**
   * 根据标签获取书签
   * @param tags 要搜索的标签数组
   * @returns 返回包含指定标签的书签数组
   */
  async fetchBookmarksByTags(tags) {
    var _a;
    try {
      const conditions = tags.map((tag) => ({
        field_name: "\u6807\u7B7E",
        operator: "contains",
        value: [tag]
      }));
      const requestBody = {
        filter: {
          conjunction: "or",
          conditions
        },
        page_size: 100
        // 飞书单次查询限制
      };
      const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.config.baseId}/tables/${this.config.tableId}/records/search`;
      const response = await $fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json"
        },
        body: requestBody
      });
      if (response.code === 0) {
        return (((_a = response.data) == null ? void 0 : _a.items) || []).map((item) => this.formatBookmark(item));
      } else {
        console.error("\u6839\u636E\u6807\u7B7E\u83B7\u53D6\u4E66\u7B7E\u5931\u8D25:", response);
        return [];
      }
    } catch (error) {
      console.error("\u6839\u636E\u6807\u7B7E\u83B7\u53D6\u4E66\u7B7E\u9519\u8BEF:", error);
      return [];
    }
  }
  /**
   * 获取最新的书签
   * @param limit 获取的书签数量限制
   * @returns 返回最新的书签数组
   */
  async fetchLatestBookmarks(limit = 12) {
    var _a;
    try {
      const requestBody = {
        sort: [
          {
            field_name: "\u521B\u5EFA\u65F6\u95F4",
            desc: true
          }
        ]
      };
      const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.config.baseId}/tables/${this.config.tableId}/records/search?page_size=${limit}`;
      const response = await $fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json"
        },
        body: requestBody
      });
      if (response.code === 0) {
        return (((_a = response.data) == null ? void 0 : _a.items) || []).map((item) => this.formatBookmark(item));
      } else {
        console.error("\u83B7\u53D6\u6700\u65B0\u4E66\u7B7E\u5931\u8D25:", response);
        return [];
      }
    } catch (error) {
      console.error("\u83B7\u53D6\u6700\u65B0\u4E66\u7B7E\u9519\u8BEF:", error);
      return [];
    }
  }
  /**
   * 随机选择书签
   * @param bookmarks 所有书签的数组
   * @param count 需要选择的书签数量
   * @returns 返回随机选择的书签数组
   */
  getRandomBookmarks(bookmarks, count) {
    const shuffled = [...bookmarks].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, bookmarks.length));
  }
  /**
   * 格式化书签数据
   * @param item 飞书多维表格返回的记录项
   * @returns 格式化后的书签对象
   */
  formatBookmark(item) {
    let title = "\u65E0\u6807\u9898";
    if (item.fields.\u6807\u9898) {
      if (Array.isArray(item.fields.\u6807\u9898)) {
        title = item.fields.\u6807\u9898.map((t) => t.text || "").join("");
      } else if (typeof item.fields.\u6807\u9898 === "string") {
        title = item.fields.\u6807\u9898;
      }
    }
    let tags = [];
    if (item.fields.\u6807\u7B7E) {
      if (Array.isArray(item.fields.\u6807\u7B7E)) {
        tags = item.fields.\u6807\u7B7E;
      } else if (typeof item.fields.\u6807\u7B7E === "string") {
        tags = item.fields.\u6807\u7B7E.split(",");
      }
    }
    let url = "";
    if (item.fields.\u7F51\u5740) {
      if (typeof item.fields.\u7F51\u5740 === "object" && item.fields.\u7F51\u5740.link) {
        url = item.fields.\u7F51\u5740.link;
      } else if (typeof item.fields.\u7F51\u5740 === "string") {
        url = item.fields.\u7F51\u5740;
      }
    }
    let description = "";
    if (item.fields.\u7B80\u4ECB) {
      if (Array.isArray(item.fields.\u7B80\u4ECB)) {
        description = item.fields.\u7B80\u4ECB.map((d) => d.text || "").join("");
      } else if (typeof item.fields.\u7B80\u4ECB === "string") {
        description = item.fields.\u7B80\u4ECB;
      }
    }
    return {
      id: item.record_id || `id-${Math.random().toString(36).substr(2, 9)}`,
      title,
      url,
      category: tags.length > 0 ? tags[0] : "\u672A\u5206\u7C7B",
      description,
      tags,
      createdTime: item.fields.\u521B\u5EFA\u65F6\u95F4 || (/* @__PURE__ */ new Date()).toISOString()
    };
  }
}
const feishuService = new FeishuService({
  appId: process.env.FEISHU_APP_ID,
  appSecret: process.env.FEISHU_APP_SECRET,
  baseId: process.env.FEISHU_BASE_ID,
  tableId: process.env.FEISHU_TABLE_ID
});

export { feishuService as f };
//# sourceMappingURL=feishu.mjs.map
