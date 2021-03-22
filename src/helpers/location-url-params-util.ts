/***************************************************
 * Created by nanyuantingfeng on 2020/10/10 15:26. *
 ***************************************************/
import QueryString from 'qs';

export const __PARAMS__: Partial<{
  corpId: string;
  ekbCorpId: string;
  accessToken: string;
  isAssistPlatform: string;
  lang: string;
  defaultLanguage: string;
}> = QueryString.parse(location.search.slice(1));

if (!__PARAMS__.corpId && __PARAMS__.ekbCorpId) {
  __PARAMS__.corpId = __PARAMS__.ekbCorpId;
}

if (!__PARAMS__.defaultLanguage) {
  __PARAMS__.defaultLanguage = 'zh-CN';
}

export function makeUrlParams(params: any) {
  return QueryString.stringify({ ...__PARAMS__, ...params });
}
