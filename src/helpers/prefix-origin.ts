/***************************************************
 * Created by nanyuantingfeng on 2020/10/10 12:12. *
 ***************************************************/
export const prefixOrigin = (url: string): string => {
  if (url.startsWith('http')) {
    return url;
  }

  let { origin, pathname } = location;
  let fixed = pathname.slice(0, pathname.indexOf('/web'));
  url = (fixed + '/' + url)
    .replace(/\/\/\//g, '/')
    .replace(/\.\/\//g, '/')
    .replace(/\/\//g, '/')
    .replace(/\/\.\//g, '/');
  return origin + url;
};
