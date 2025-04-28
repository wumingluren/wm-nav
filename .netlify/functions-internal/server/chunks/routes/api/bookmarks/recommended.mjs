import { d as defineEventHandler, c as createError } from '../../../_/nitro.mjs';
import { f as feishuService } from '../../../_/feishu.mjs';
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

const recommended = defineEventHandler(async (event) => {
  try {
    const bookmarks = await feishuService.getRecommendedBookmarks(16);
    return bookmarks;
  } catch (error) {
    console.error("\u83B7\u53D6\u63A8\u8350\u4E66\u7B7E\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      message: `\u83B7\u53D6\u63A8\u8350\u4E66\u7B7E\u5931\u8D25: ${error.message}`
    });
  }
});

export { recommended as default };
//# sourceMappingURL=recommended.mjs.map
