import { $fetch } from 'ofetch';

// 飞书多维表格API接口

// 定义飞书配置接口
interface FeishuConfig {
  appId: string;
  appSecret: string;
  baseId: string;
  tableId: string;
}

// 定义飞书API响应类型
interface FeishuTokenResponse {
  code: number;
  msg?: string;
  tenant_access_token?: string;
}

interface FeishuTableResponse {
  code: number;
  msg?: string;
  data?: {
    items?: Array<{
      record_id?: string;
      fields: {
        标题?: string;
        网址?: string | { link: string };
        标签?: string[] | string;
        简介?: string | Array<{ text: string }>;
        创建时间?: string;
      };
    }>;
    total?: number;
  };
}

interface FeishuFieldsResponse {
  code: number;
  msg?: string;
  data?: {
    items?: Array<{
      field_name: string;
      property?: {
        options?: Array<{ name: string }>;
      };
    }>;
  };
}

// 飞书服务类
export class FeishuService {
  private config: FeishuConfig;
  private accessToken: string | null = null;
  private tokenExpireTime: number = 0;

  constructor(config: FeishuConfig) {
    this.config = config;
  }

  /**
   * 获取飞书访问令牌
   * @returns 获取令牌是否成功
   */
  private async getAccessToken(): Promise<boolean> {
    try {
      const response = await $fetch<FeishuTokenResponse>(
        'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
        {
          method: 'POST',
          body: {
            app_id: this.config.appId,
            app_secret: this.config.appSecret,
          },
        }
      );

      if (response.code === 0 && response.tenant_access_token) {
        this.accessToken = response.tenant_access_token;
        return true;
      } else {
        console.error('获取访问令牌失败:', response.msg);
        this.accessToken = null;
        return false;
      }
    } catch (error) {
      console.error('获取访问令牌失败:', error);
      this.accessToken = null;
      return false;
    }
  }

  /**
   * 测试飞书多维表格连接
   * @returns 包含连接测试结果的对象，success表示是否成功，message包含详细信息
   */
  public async testConnection(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      if (!(await this.getAccessToken())) {
        return { success: false, message: '获取访问令牌失败' };
      }

      const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.config.baseId}/tables/${this.config.tableId}/records?page_size=1`;

      const response = await $fetch<FeishuTableResponse>(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.code !== 0) {
        throw new Error(response.msg || '多维表格访问失败');
      }

      return { success: true, message: '连接测试成功，多维表格访问正常' };
    } catch (error) {
      return {
        success: false,
        message: `连接测试失败: ${(error as Error).message}`,
      };
    }
  }

  /**
   * 从飞书多维表格获取数据
   * @param searchTerm 搜索关键词
   * @returns 返回符合条件的记录数组
   */
  public async getTableData(searchTerm = ''): Promise<any[]> {
    try {
      if (!(await this.getAccessToken())) {
        throw new Error('获取访问令牌失败');
      }

      const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.config.baseId}/tables/${this.config.tableId}/records`;

      const response = await $fetch<FeishuTableResponse>(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.code === 0) {
        const records = response.data?.items || [];

        // 如果有搜索词，过滤结果
        if (searchTerm) {
          return records
            .filter(item => {
              const fields = item.fields;
              return (
                (fields.标题 && String(fields.标题).toLowerCase().includes(searchTerm)) ||
                (fields.简介 && String(fields.简介).toLowerCase().includes(searchTerm)) ||
                (fields.标签 &&
                  (Array.isArray(fields.标签)
                    ? fields.标签.some(tag => tag.toLowerCase().includes(searchTerm))
                    : String(fields.标签).toLowerCase().includes(searchTerm)))
              );
            })
            .map(item => this.formatBookmark(item));
        }

        return records.map(item => this.formatBookmark(item));
      } else {
        console.error('获取表格数据失败:', response);
        throw new Error(`获取表格数据失败: ${response.msg}`);
      }
    } catch (error) {
      console.error('获取表格数据错误:', error);
      throw error;
    }
  }

  /**
   * 检查URL是否已存在于多维表格中
   * @param url 要检查的URL地址
   * @returns 返回布尔值，true表示URL已存在，false表示不存在
   */
  public async isUrlExists(url: string): Promise<boolean> {
    if (!(await this.getAccessToken())) {
      throw new Error('获取访问令牌失败');
    }

    const requestUrl = `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.config.baseId}/tables/${this.config.tableId}/records/search`;

    const requestBody = {
      filter: {
        conjunction: 'and',
        conditions: [
          {
            field_name: '网址',
            operator: 'is',
            value: [url],
          },
        ],
      },
    };

    const response = await $fetch<FeishuTableResponse>(requestUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    if (response.code !== 0) {
      throw new Error(response.msg || '检查URL失败');
    }

    return (response.data?.total || 0) > 0;
  }

  /**
   * 保存书签到飞书多维表格
   * @param bookmark 要保存的书签对象，包含标题、URL和标签
   * @returns 返回飞书API的响应数据
   */
  public async saveBookmark(bookmark: { title: string; url: string; tags?: string }): Promise<any> {
    if (!bookmark?.title || !bookmark?.url) {
      throw new Error('书签标题和网址不能为空');
    }

    // 检查URL是否已存在
    const exists = await this.isUrlExists(bookmark.url);
    if (exists) {
      throw new Error('该网址已经存在');
    }

    // 处理标签，将#分隔的标签转换为数组
    let tags: string[] = [];
    if (bookmark.tags) {
      tags = bookmark.tags.split('#').filter(tag => tag.trim() !== '');
    }

    const requestBody = {
      fields: {
        标题: bookmark.title,
        网址: {
          link: bookmark.url,
        },
        // 如果有标签，则添加到请求中
        ...(tags.length > 0 && { 标签: tags }),
      },
    };

    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.config.baseId}/tables/${this.config.tableId}/records`;

    const response = await $fetch<FeishuTableResponse>(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    if (response.code !== 0) {
      throw new Error(response.msg || '保存失败');
    }

    return response;
  }

  /**
   * 搜索书签
   * @param query 搜索关键词
   * @returns 返回匹配的书签数组
   */
  public async searchBookmarks(query: string): Promise<any[]> {
    if (!(await this.getAccessToken())) {
      throw new Error('获取访问令牌失败');
    }

    const conditions = [
      {
        field_name: '标题',
        operator: 'contains',
        value: [query],
      },
      {
        field_name: '网址',
        operator: 'contains',
        value: [query],
      },
      // 增加标签搜索条件
      {
        field_name: '标签公式',
        operator: 'contains',
        value: [query],
      },
    ];

    const requestBody = {
      filter: {
        conjunction: 'or',
        conditions: conditions,
      },
      page_size: 100,
    };

    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.config.baseId}/tables/${this.config.tableId}/records/search`;

    const response = await $fetch<FeishuTableResponse>(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    if (response.code !== 0) {
      console.error('搜索书签API错误:', response);
      throw new Error(response.msg || '搜索书签失败');
    }

    return (response.data?.items || []).map(item => this.formatBookmark(item));
  }

  /**
   * 获取推荐书签
   * @param limit 获取的书签数量限制
   * @returns 返回推荐的书签数组
   */
  public async getRecommendedBookmarks(limit = 12): Promise<any[]> {
    try {
      if (!(await this.getAccessToken())) {
        throw new Error('获取访问令牌失败');
      }

      // 1. 先获取标签字段的所有选项
      const tagsOptions = await this.fetchTagsOptions();

      if (!tagsOptions || tagsOptions.length === 0) {
        console.log('没有找到标签选项，将获取最新的书签');
        // 如果没有标签选项，则获取最新的书签
        return await this.fetchLatestBookmarks(limit);
      }

      // 2. 随机选择1-3个标签
      const selectedTags = this.getRandomTags(tagsOptions, Math.floor(Math.random() * 3) + 1);

      // 3. 使用选中的标签查询书签
      const bookmarks = await this.fetchBookmarksByTags(selectedTags);

      // 4. 如果获取的书签不足指定条数，补充最新的书签
      if (bookmarks.length < limit) {
        const latestBookmarks = await this.fetchLatestBookmarks(limit - bookmarks.length);

        // 合并并去重
        const allBookmarks = [...bookmarks];
        for (const bookmark of latestBookmarks) {
          if (!allBookmarks.some(b => b.id === bookmark.id)) {
            allBookmarks.push(bookmark);
          }
        }

        return allBookmarks;
      }

      // 5. 如果书签超过指定条数，随机选择指定条数
      if (bookmarks.length > limit) {
        return this.getRandomBookmarks(bookmarks, limit);
      }

      return bookmarks;
    } catch (error) {
      console.error('获取推荐书签失败:', error);
      throw error;
    }
  }

  /**
   * 获取标签字段的所有选项
   * @returns 返回标签选项的字符串数组
   */
  private async fetchTagsOptions(): Promise<string[]> {
    try {
      const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.config.baseId}/tables/${this.config.tableId}/fields`;

      const response = await $fetch<FeishuFieldsResponse>(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.code === 0) {
        // 查找标签字段
        const tagField = response.data?.items?.find(field => field.field_name === '标签');

        if (!tagField || !tagField.property || !tagField.property.options) {
          return [];
        }

        // 返回标签选项
        return tagField.property.options.map(option => option.name);
      } else {
        console.error('获取字段失败:', response);
        return [];
      }
    } catch (error) {
      console.error('获取标签选项失败:', error);
      return [];
    }
  }

  /**
   * 随机选择标签
   * @param tags 所有可选标签的数组
   * @param count 需要选择的标签数量
   * @returns 返回随机选择的标签数组
   */
  private getRandomTags(tags: string[], count: number): string[] {
    const shuffled = [...tags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, tags.length));
  }

  /**
   * 根据标签获取书签
   * @param tags 要搜索的标签数组
   * @returns 返回包含指定标签的书签数组
   */
  private async fetchBookmarksByTags(tags: string[]): Promise<any[]> {
    try {
      const conditions = tags.map(tag => ({
        field_name: '标签',
        operator: 'contains',
        value: [tag],
      }));

      const requestBody = {
        filter: {
          conjunction: 'or',
          conditions: conditions,
        },
        page_size: 100, // 飞书单次查询限制
      };

      const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.config.baseId}/tables/${this.config.tableId}/records/search`;

      const response = await $fetch<FeishuTableResponse>(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      if (response.code === 0) {
        return (response.data?.items || []).map(item => this.formatBookmark(item));
      } else {
        console.error('根据标签获取书签失败:', response);
        return [];
      }
    } catch (error) {
      console.error('根据标签获取书签错误:', error);
      return [];
    }
  }

  /**
   * 获取最新的书签
   * @param limit 获取的书签数量限制
   * @returns 返回最新的书签数组
   */
  private async fetchLatestBookmarks(limit = 12): Promise<any[]> {
    try {
      const requestBody = {
        sort: [
          {
            field_name: '创建时间',
            desc: true,
          },
        ],
      };

      const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${this.config.baseId}/tables/${this.config.tableId}/records/search?page_size=${limit}`;

      const response = await $fetch<FeishuTableResponse>(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      if (response.code === 0) {
        return (response.data?.items || []).map(item => this.formatBookmark(item));
      } else {
        console.error('获取最新书签失败:', response);
        return [];
      }
    } catch (error) {
      console.error('获取最新书签错误:', error);
      return [];
    }
  }

  /**
   * 随机选择书签
   * @param bookmarks 所有书签的数组
   * @param count 需要选择的书签数量
   * @returns 返回随机选择的书签数组
   */
  private getRandomBookmarks(bookmarks: any[], count: number): any[] {
    const shuffled = [...bookmarks].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, bookmarks.length));
  }

  /**
   * 格式化书签数据
   * @param item 飞书多维表格返回的记录项
   * @returns 格式化后的书签对象
   */
  private formatBookmark(item: any): any {
    // 处理标题字段
    let title = '无标题';
    if (item.fields.标题) {
      if (Array.isArray(item.fields.标题)) {
        title = item.fields.标题.map((t: any) => t.text || '').join('');
      } else if (typeof item.fields.标题 === 'string') {
        title = item.fields.标题;
      }
    }

    // 处理标签字段
    let tags: string[] = [];
    if (item.fields.标签) {
      if (Array.isArray(item.fields.标签)) {
        tags = item.fields.标签;
      } else if (typeof item.fields.标签 === 'string') {
        tags = item.fields.标签.split(',');
      }
    }

    // 处理网址字段
    let url = '';
    if (item.fields.网址) {
      if (typeof item.fields.网址 === 'object' && item.fields.网址.link) {
        url = item.fields.网址.link;
      } else if (typeof item.fields.网址 === 'string') {
        url = item.fields.网址;
      }
    }

    // 处理简介字段
    let description = '';
    if (item.fields.简介) {
      if (Array.isArray(item.fields.简介)) {
        description = item.fields.简介.map((d: any) => d.text || '').join('');
      } else if (typeof item.fields.简介 === 'string') {
        description = item.fields.简介;
      }
    }

    // 返回格式化后的书签对象
    return {
      id: item.record_id || `id-${Math.random().toString(36).substr(2, 9)}`,
      title: title,
      url: url,
      category: tags.length > 0 ? tags[0] : '未分类',
      description: description,
      tags: tags,
      createdTime: item.fields.创建时间 || new Date().toISOString(),
    };
  }
}

// 创建飞书服务实例
export const feishuService = new FeishuService({
  appId: process.env.FEISHU_APP_ID!,
  appSecret: process.env.FEISHU_APP_SECRET!,
  baseId: process.env.FEISHU_BASE_ID!,
  tableId: process.env.FEISHU_TABLE_ID!,
});
