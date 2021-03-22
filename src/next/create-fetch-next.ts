/***************************************************
 * Created by nanyuantingfeng on 2020/9/30 15:50. *
 ***************************************************/
import { Middleware } from 'koa-compose';
import InterceptorManager from './interceptor-manager';
import MiddlewareManager from './middleware-manager';
export type IFetchInstance = typeof fetch;

export interface IFetchNextOptions extends RequestInit {
  url: string;
  baseURL?: string;
  params?: Record<string, any>;
  body?: RequestInit['body'] | object | any;

  isBlob?: boolean;
  isText?: boolean;
  isBatch?: boolean;
  skipCache?: boolean;

  join?: any;
  extra?: any;
}

export interface IFetchNextContext {
  options: RequestInit;

  url: string;
  baseURL?: string;
  params: Record<string, any>;

  isBlob?: boolean;
  isText?: boolean;
  isBatch?: boolean;
  skipCache?: boolean;

  join?: any;
  extra?: any;

  data?: any;
  response?: Response;
  error?: any;
  replace?: (options: any) => ThisType<this>;
  __fetchNext__?: IFetchNext<any>;
}

export interface IFetchNext<C> {
  (options: IFetchNextOptions): Promise<C>;

  use(...middlewares: Middleware<C>[]): () => void;

  defaults: {
    baseURL: string;
    createContext(options: IFetchNextOptions, fetchNext?: IFetchNext<C>): C;
  };

  interceptors: {
    request: InterceptorManager<IFetchNextOptions>;
    response: InterceptorManager<Response>;
  };
}

export function createFetchNext<T extends IFetchInstance, C extends IFetchNextContext>(fetch: T): IFetchNext<C> {
  const requestInterceptorManager = new InterceptorManager<IFetchNextOptions>();
  const responseInterceptorManager = new InterceptorManager<Response>();

  async function mwFetch(context: IFetchNextContext) {
    try {
      const response = await fetch(context.url, context.options);
      context.response = await responseInterceptorManager.invoke(response);
    } catch (e) {
      context.error = e;
    }
  }

  const middlewareManager = new MiddlewareManager<C>(mwFetch);

  async function fetch_next(options: IFetchNextOptions): Promise<C> {
    options = await requestInterceptorManager.invoke(options);
    const context = fetch_next.defaults.createContext(options, fetch_next as any);
    return middlewareManager.invoke(context);
  }

  fetch_next.use = middlewareManager.use.bind(middlewareManager);

  fetch_next.defaults = {} as any;

  fetch_next.defaults.createContext = (fetchNextOptions: IFetchNextOptions, fetchNext?: IFetchNext<C>) => {
    const {
      url,
      params,
      baseURL,
      isText,
      isBlob,
      join,
      extra,
      isBatch,
      skipCache,
      ...options
    } = fetchNextOptions;

    return {
      url,
      params,
      baseURL,
      isText,
      isBlob,
      join,
      extra,
      isBatch,
      options,
      skipCache,
      __fetchNext__: fetchNext,
    } as C;
  };

  fetch_next.interceptors = {
    request: requestInterceptorManager,
    response: responseInterceptorManager,
  };

  return fetch_next;
}
