/***************************************************
 * Created by nanyuantingfeng on 2020/12/4 09:56. *
 ***************************************************/
import QueryString from 'qs';
import { prefixURL } from './prefix-url';
import { isSameOrigin } from './origin-util';
import { __PARAMS__ } from './location-url-params-util';
import { joiningURL } from './joining-url';
import { parseURLParams } from './parse-url-params';

function buildOptions(url: string, params: any, options?: any) {
  url = parseURLParams(url, params);
  options = Object.assign({}, options);

  if (typeof options.body === 'object') {
    options.body = JSON.stringify(options.body);
  }

  if (isSameOrigin(url)) {
    options.credentials = 'include';
    params = params || {};
    if (!params.corpId && __PARAMS__.ekbCorpId) {
      params.corpId = __PARAMS__.ekbCorpId;
    }
  }

  url = prefixURL(joiningURL(url, QueryString.stringify(params)));

  //兼容老的 join [] 方式
  if (options.join) {
    options.join.unshift('');
    options.join = options.join.map(encodeURIComponent);
    url = joiningURL(url, options.join.join('&join=').slice(1));
  }

  options.headers = {
    ['content-type']: 'application/json',
    ['accept']: 'application/json',
    ...options.headers,
    ...(__PARAMS__.accessToken && {
      cookie: `ekb-access-token=${__PARAMS__.accessToken}`,
      accesstoken: __PARAMS__.accessToken,
    }),
  };

  return { url, options };
}

export function buildSSE(_url: string, params?: any) {
  const { url } = buildOptions(_url, params, {});
  const source = new EventSource(url);
  source.addEventListener('error', (e) => {
    console.log('SSE error', (e as any).target.url);
    source.close();
  });
  return source;
}
