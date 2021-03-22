import { prefixOrigin } from './helpers/prefix-origin';
import { makeUrlParams, __PARAMS__ } from './helpers/location-url-params-util';

import { configure, FetchConfiguration } from './helpers/config-cellar';
import { prefixURL } from './helpers/prefix-url';
import { fixOrigin } from './helpers/fix-origin';
import { fetchNext } from './next/fetch-next';
import { reportError } from './helpers/report-error';
import { IBatchRequestOption } from './next/create-batch-fetch';
import { isFetchError } from './next/fetch-error';
import { buildSSE } from './helpers/build-sse';

export { FetchConfiguration };

export interface FetchOptions extends RequestInit {
  isBlob?: boolean;
  isText?: boolean;
  isBatch?: boolean;
  join?: string | string[];
  skipCache?: boolean;
  body?: RequestInit['body'] | object | any;
}

export interface FetchExtraOptions {
  hiddenLoading?: boolean;
  msg?: string;
  hiddenMsg?: boolean;
}

export interface FetchError extends Error {
  network?: boolean;
  msg: string;
  status: number;
  category?: string;
  code?: number | string;
  data?: any;
  requestParams?: any;
}

export async function Fetch(url: string, params: any = {}, options: FetchOptions = {}, extra: FetchExtraOptions = {}) {
  const { isBlob, isText, isBatch, join, skipCache, ...others } = options;

  // PATCH OLD JOIN API
  let __join = join ? [].concat(join) : [];
  Object.keys(params || {})
    .filter((name) => /join\$[0-9]+/.test(name))
    .forEach((name) => {
      __join = __join.concat(params[name]);
      delete params[name];
    });

  const ctx = await fetchNext({
    url,
    params,
    extra,
    isBatch,
    isBlob,
    isText,
    join: __join,
    skipCache,
    ...others,
  });

  if (ctx.error) {
    if ('hiddenMsg' in extra) ctx.error.hiddenMsg = extra.hiddenMsg;
    return Fetch.handleError(ctx.error) || Promise.reject(ctx.error);
  }

  return ctx.data;
}

Fetch.configure = configure;
Fetch.prefixOrigin = prefixOrigin;
Fetch.prefixURL = prefixURL;
Fetch.fixOrigin = fixOrigin;
Fetch.makeUrlParams = makeUrlParams;
Fetch.reportError = reportError;
Fetch.isFetchError = isFetchError;

export { prefixOrigin, configure, prefixURL, fixOrigin, makeUrlParams, reportError };

export const GET = (Fetch.GET = (url: string, params?: any, options?: FetchOptions, others?: FetchError) => {
  return Fetch(
    url,
    params,
    {
      method: 'GET',
      ...options,
    },
    others,
  );
});

export const POST = (Fetch.POST = (url: string, params?: any, options?: FetchOptions, others?: FetchError) => {
  return Fetch(
    url,
    params,
    {
      method: 'POST',
      ...options,
    },
    others,
  );
});

export const PUT = (Fetch.PUT = (url: string, params?: any, options?: FetchOptions, others?: FetchError) => {
  return Fetch(
    url,
    params,
    {
      method: 'PUT',
      ...options,
    },
    others,
  );
});

export const DELETE = (Fetch.DELETE = (url: string, params?: any, options?: FetchOptions, others?: FetchError) => {
  return Fetch(
    url,
    params,
    {
      method: 'DELETE',
      ...options,
    },
    others,
  );
});

export const SSE = (Fetch.SSE = (_url: string, params?: any) => {
  return buildSSE(_url, params);
});

export const Blob = (Fetch.Blob = (url: string, params: any, options: FetchOptions, others?: FetchError) => {
  options.isBlob = true;
  return POST(url, params, options, others);
});

export const Batch = (Fetch.Batch = (requests: IBatchRequestOption[]) => {
  return fetchNext.batch(requests).then((ctx_s) => ctx_s.map((ctx) => ctx.data || ctx.error));
});

export const Combine = (Fetch.Combine = (request: IBatchRequestOption | string) => {
  if (typeof request === 'string') request = { url: request };
  return fetchNext.combine(request).then((ctx) => {
    if (ctx.error) return Promise.reject(ctx.error);
    return ctx.data;
  });
});

Fetch.handleError = (error: FetchError): any => Promise.reject(error);

Fetch.urlParams = __PARAMS__;

Fetch.corpId = __PARAMS__.corpId as string;
Fetch.ekbCorpId = __PARAMS__.ekbCorpId as string;
Fetch.accessToken = __PARAMS__.accessToken as string;
Fetch.isAssistPlatform = __PARAMS__.isAssistPlatform as any;
Fetch.lang = __PARAMS__.lang as string;
Fetch.defaultLanguage = 'zh-CN';

Object.defineProperty(Fetch, 'corpId', {
  get(): any {
    return __PARAMS__.corpId;
  },
  set(v: any) {
    __PARAMS__.corpId = v;
  },
});
Object.defineProperty(Fetch, 'ekbCorpId', {
  get(): any {
    return __PARAMS__.ekbCorpId;
  },
  set(v: any) {
    __PARAMS__.ekbCorpId = v;
  },
});
Object.defineProperty(Fetch, 'accessToken', {
  get(): any {
    return __PARAMS__.accessToken;
  },
  set(v: any) {
    __PARAMS__.accessToken = v;
  },
});
Object.defineProperty(Fetch, 'isAssistPlatform', {
  get(): any {
    return __PARAMS__.isAssistPlatform;
  },
  set(v: any) {
    __PARAMS__.isAssistPlatform = v;
  },
});
Object.defineProperty(Fetch, 'lang', {
  get(): any {
    return __PARAMS__.lang;
  },
  set(v: any) {
    __PARAMS__.lang = v;
  },
});
Object.defineProperty(Fetch, 'defaultLanguage', {
  get(): any {
    return __PARAMS__.defaultLanguage || 'zh-CN';
  },
  set(v: any) {
    __PARAMS__.lang = v;
  },
});

Fetch.agentId = undefined as string;
Fetch.userId = undefined as string;
Fetch.wxCorpId = undefined as string;
Fetch.staffSetting = undefined as any;

export default Fetch;
