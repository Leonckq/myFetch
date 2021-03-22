/***************************************************
 * Created by nanyuantingfeng on 2020/10/10 15:45. *
 ***************************************************/

import util from './config-cellar';

export const fixOrigin = (origin: string) => {
  if (util.urlPrefix) {
    if (util.urlPrefix.startsWith('/')) {
      return origin + util.urlPrefix;
    }

    return origin + '/' + util.urlPrefix;
  }

  return origin;
};
