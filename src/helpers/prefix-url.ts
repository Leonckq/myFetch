/***************************************************
 * Created by nanyuantingfeng on 2020/10/10 15:44. *
 ***************************************************/
import util from './config-cellar';

export const prefixURL = (url: string) => {
  if (util.urlPrefix) {
    if (url.startsWith('/api')) {
      return util.urlPrefix + url;
    }
  }
  // 华为引入url 处理
  if (!window.HWH5) {
    return url;
  }
  // 引入 window.API_URL  华为环境url

  let API_URL = window.API_URL;
  return url.indexOf('api') === -1 ? url : '/' === url.slice(0, 1) ? API_URL + url : API_URL + '/' + url;
};
