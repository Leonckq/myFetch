/***************************************************
 * Created by nanyuantingfeng on 2020/10/9 12:37. *
 ***************************************************/
import { Next } from 'koa';
import LRUCache from '@ekuaibao/lru-cache';
import { IFetchNextContext } from '../create-fetch-next';
import { Deffer } from '../../helpers/deffer';
import { deepClone } from '../../helpers/deep-clone';

const cache = new LRUCache({ max: 32, maxAge: 5000 });

const pendingCache = new Map<string, Deffer<any>>();

export async function mwCache(context: IFetchNextContext, next: Next) {
  const __is_need_cache = context.options.method === 'GET';
  const __cache_id = context.url;
  const __is_skip_cache = context.skipCache === true;

  if (__is_need_cache && !__is_skip_cache) {
    if (pendingCache.has(__cache_id)) {
      const deffer = pendingCache.get(__cache_id);
      const data = await deffer.promise;
      context.data = deepClone(data);
      return;
    }

    const data = cache.get(__cache_id);
    if (data) {
      context.data = deepClone(data);
      return;
    }

    pendingCache.set(__cache_id, Deffer());
  }

  await next();

  if (__is_need_cache) {
    cache.set(__cache_id, context.data);
    if (pendingCache.has(__cache_id)) {
      const deffer = pendingCache.get(__cache_id);
      deffer.resolve(cache.get(__cache_id));
      pendingCache.delete(__cache_id);
    }
  }
}
