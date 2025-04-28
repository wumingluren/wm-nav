import { d as defineEventHandler, a as getQuery, c as createError } from '../../../_/nitro.mjs';
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

const search = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const searchTerm = query.q;
    if (!searchTerm) {
      return [];
    }
    const results = await feishuService.searchBookmarks(searchTerm);
    return results;
  } catch (error) {
    console.error("\u641C\u7D22\u4E66\u7B7E\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      message: `\u641C\u7D22\u4E66\u7B7E\u5931\u8D25: ${error.message}`
    });
  }
});

export { search as default };
//# sourceMappingURL=search.mjs.map
