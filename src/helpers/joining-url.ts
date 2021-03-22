/***************************************************
 * Created by nanyuantingfeng on 2020/10/10 18:19. *
 ***************************************************/

export function joiningURL(url: string, qS: string) {
  if (!qS) return url;

  if (url.indexOf('?') > -1) {
    return url + '&' + qS;
  }

  return url + '?' + qS;
}
