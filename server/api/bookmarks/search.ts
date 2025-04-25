import { defineEventHandler, getQuery } from 'h3';
import { feishuService } from '~/server/services/feishu';

export default defineEventHandler(async event => {
  try {
    // 从查询参数中获取搜索关键词
    const query = getQuery(event);
    const searchTerm = query.q as string;

    if (!searchTerm) {
      return [];
    }

    // 调用飞书服务的搜索方法
    const results = await feishuService.searchBookmarks(searchTerm);
    return results;
  } catch (error) {
    console.error('搜索书签失败:', error);
    throw createError({
      statusCode: 500,
      message: `搜索书签失败: ${(error as Error).message}`,
    });
  }
});
