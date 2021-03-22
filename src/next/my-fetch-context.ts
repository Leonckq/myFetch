/***************************************************
 * Created by nanyuantingfeng on 2020/10/9 11:31. *
 ***************************************************/
import { IFetchNextContext, IFetchNextOptions } from './create-fetch-next';
import isResponseErrorData from '../helpers/is-response-error-data';
import { FetchError } from './fetch-error';

export default class MyFetchNextContext implements IFetchNextContext {
  url: string;
  params: Record<string, any>;
  extra: any;
  join: any;

  data: any;
  error: any;
  options: RequestInit & { join?: string[]; body?: RequestInit['body'] | object | any };
  response: Response;
  __fetchNext__?: any;

  isBlob?: boolean;
  isText?: boolean;
  isBatch?: boolean;
  skipCache?: boolean;
  baseURL: string;

  constructor(o: IFetchNextOptions, fetchNext: any) {
    const { url, params, baseURL, isBlob, isText, isBatch, join, extra, skipCache, ...options } = o;
    this.url = url;
    this.params = params;
    this.options = options;
    this.isBlob = isBlob;
    this.isText = isText;
    this.isBatch = isBatch;
    this.join = join;
    this.extra = extra;
    this.skipCache = skipCache;
    this.baseURL = baseURL || fetchNext.defaults.baseURL || '';
    this.__fetchNext__ = fetchNext;
  }

  replace(data: any) {
    const ctx = new MyFetchNextContext(this, this.__fetchNext__);
    ctx.options = this.options;
    ctx.data = data;

    if (isResponseErrorData(data)) {
      ctx.error = data;
      ctx.data = null;
    }

    if (ctx.error) ctx.error = new FetchError(ctx.error);

    return ctx;
  }
}
