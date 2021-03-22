/***************************************************
 * Created by nanyuantingfeng on 2020/10/9 11:00. *
 ***************************************************/
import { Next } from 'koa';
import MyFetchNextContext from '../my-fetch-context';
import isResponseErrorData from '../../helpers/is-response-error-data';

export async function mwResult(context: MyFetchNextContext, next: Next) {
  if (context.options.body) {
    if (typeof context.options.body === 'object') {
      context.options.body = JSON.stringify(context.options.body);
    }
  }

  await next();

  if (context.error) return;

  if (context.response.status === 204) {
    context.data = {};
    return;
  }

  if (context.response.status === 200 || context.response.ok) {
    try {
      if (context.isBlob) {
        context.data = await context.response.blob();
      } else if (context.isText) {
        context.data = await context.response.text();
      } else {
        context.data = await context.response.json();
      }

      if (isResponseErrorData(context.data)) {
        context.error = context.data;
        context.data = null;
      }
    } catch (e) {
      context.error = e;
    }
  } else {
    try {
      const text = await context.response.text();
      context.error = {
        errorCode: context.response.status,
        status: context.response.status,
        msg: text,
        message: text,
      };
    } catch (e) {
      context.error = e;
    }
  }
}
