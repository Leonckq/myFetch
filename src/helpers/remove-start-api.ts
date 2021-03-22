/***************************************************
 * Created by nanyuantingfeng on 2020/11/6 17:10. *
 ***************************************************/
export function removeStartAPI(url: string) {
  if (url.startsWith('/api/')) {
    return url.slice(4);
  }
  return url;
}
