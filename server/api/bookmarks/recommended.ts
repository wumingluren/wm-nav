import { defineEventHandler } from 'h3';
import { feishuService } from '~/server/services/feishu';

export default defineEventHandler(async (event) => {
  try {
    // 限制获取的书签数量为12个
    const bookmarks = await feishuService.getRecommendedBookmarks(16);
    return bookmarks;
  } catch (error) {
    console.error('获取推荐书签失败:', error);
    throw createError({
      statusCode: 500,
      message: `获取推荐书签失败: ${(error as Error).message}`
    });
  }
});