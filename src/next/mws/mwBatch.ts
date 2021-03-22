/***************************************************
 * Created by nanyuantingfeng on 2020/11/6 17:48. *
 ***************************************************/
import { Next } from 'koa';
import QueryString from 'qs';
import MyFetchNextContext from '../my-fetch-context';
import { joiningURL } from '../../helpers/joining-url';
import { IBatchRequestOption } from '../create-batch-fetch';
import { parseURLParams } from '../../helpers/parse-url-params';
import { removeStartAPI } from '../../helpers/remove-start-api';

// must be after `mwURLParamsPatch`
// because deps on `context.params.corpId`
export async function mwBatch(context: MyFetchNextContext, next: Next) {
  let __ids;

  if (context.isBatch === true) {
    const corpId = context.params.corpId;
    let requests = context.options.body as IBatchRequestOption[];

    requests = requests.map((request, index) => {
      const __is_object_body = typeof request.body === 'object';
      request.url = parseURLParams(request.url, request.params, __is_object_body ? request.body : null);
      if (__is_object_body) request.body = JSON.stringify(request.body);

      request.url = joiningURL(
        removeStartAPI(request.url),
        QueryString.stringify({ corpId, ...request.params }).trim(),
      );

      request.method = request.method ?? (request.body ? 'POST' : 'GET');
      // 此处使用 `string` 为ID , 即使使用 number,
      // 在接口返回后都会重新变成`string`.
      // 因此在此处使用类型转换.
      request.id = request.id ?? String(index);
      return request;
    });

    context.options.body = requests;
    __ids = requests.map((d) => d.id);
  }

  await next();

  if (context.error) return;

  if (context.isBatch === true) {
    const __items = context.data.items;
    context.data = __ids.map((id) => {
      const _d = __items.find((d: any) => String(d.id) === id);

      if (!_d) {
        return context.replace({
          errorCode: 699,
          errorMessage: `没有返回数据 : ${id}`,
        });
      }

      try {
        const obj = JSON.parse(_d.data);
        return context.replace(obj);
      } catch (e) {
        return context.replace({
          errorCode: 699,
          errorMessage: `返回的数据不符合JSON规范 : ${id}`,
        });
      }
    });
  }
}
