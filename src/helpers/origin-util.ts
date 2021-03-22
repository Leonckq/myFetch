/***************************************************
 * Created by nanyuantingfeng on 2020/10/10 15:14. *
 ***************************************************/
const el = document.createElement('a');

export const origin = (() => {
  el.href = document.baseURI;
  return el.origin;
})();

export function isSameOrigin(url: string): boolean {
  el.href = url;
  return el.origin === origin;
}
