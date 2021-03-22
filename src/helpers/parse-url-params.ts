/***************************************************
 * Created by nanyuantingfeng on 2020/10/10 12:07. *
 ***************************************************/
function replace(data: Record<string, any>, arg: string, bool: boolean) {
  const value = data?.[arg];
  if (value !== undefined && value !== null) {
    delete data?.[arg];
    return bool ? `$` + value : `[${value}]`;
  }
  return null;
}

export function parseURLParams(url: string, params: Record<string, any>, params2?: Record<string, any>) {
  return url.replace(/\$([a-zA-Z0-9_]+)|\[([a-zA-Z0-9_]+)]/g, (m, id, ids) => {
    const arg = id || ids;

    const result = replace(params, arg, !!id);
    if (result) return result;

    if (params2 && typeof params2 === 'object') {
      const result = replace(params2, arg, !!id);
      if (result) return result;
    }

    return id ? `$` + id : `[${ids}]`;
  });
}
