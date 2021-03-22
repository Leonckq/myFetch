/***************************************************
 * Created by nanyuantingfeng on 2020/10/9 11:01. *
 ***************************************************/
import { Next } from 'koa';
import { IFetchNextContext } from '../create-fetch-next';
import { FetchError } from '../fetch-error';

export async function mwErrorReport(context: IFetchNextContext, next: Next) {
  const _S = Date.now();
  await next();
  const _E = Date.now();

  if (_E - _S >= 3000) {
    console.warn(`发现一个缓慢接口: ${context.url}`);
  }

  if (context.error) context.error = new FetchError(context.error);
}
