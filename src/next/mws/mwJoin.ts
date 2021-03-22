/***************************************************
 * Created by nanyuantingfeng on 2020/10/9 15:31. *
 ***************************************************/
import { Next } from 'koa';
import MyFetchNextContext from '../my-fetch-context';
import { joiningURL } from '../../helpers/joining-url';

export async function mwJoin(context: MyFetchNextContext, next: Next) {
  if (context.join) {
    let _join = context.join;
    _join.unshift('');
    _join = _join.map(encodeURIComponent);
    context.url = joiningURL(context.url, _join.join('&join=').slice(1));
  }

  await next();
}
