/***************************************************
 * Created by nanyuantingfeng on 2020/10/9 10:59. *
 ***************************************************/
import { Next } from 'koa';
import QueryString from 'qs';
import MyFetchNextContext from '../my-fetch-context';
import { parseURLParams } from '../../helpers/parse-url-params';
import { isSameOrigin } from '../../helpers/origin-util';
import { prefixURL } from '../../helpers/prefix-url';
import { __PARAMS__ } from '../../helpers/location-url-params-util';
import { joiningURL } from '../../helpers/joining-url';
import { uuid } from '../../helpers/uuid';

export async function mwURLParamsPatch(context: MyFetchNextContext, next: Next) {
  context.params = context.params || {};

  context.url = parseURLParams(context.url, context.params, context.options?.body as object);
  context.params.corpId = context.params.corpId || __PARAMS__.ekbCorpId || __PARAMS__.corpId;
  context.params.accessToken = context.params.accessToken || __PARAMS__.accessToken;
  context.url = joiningURL(context.url, QueryString.stringify(context.params).trim());

  if (context.baseURL) {
    if (context.url.startsWith('/')) {
      context.url = context.baseURL + context.url;
    }
  }

  context.url = prefixURL(context.url);

  context.options.method = context.options.method || 'GET';

  context.options.headers = {
    ['content-type']: 'application/json',
    ['accept']: 'application/json',
    ['requestid']: uuid(),
    ...context.options?.headers,
  };

  if (isSameOrigin(context.url)) {
    context.options.credentials = 'include';
  }

  if (context.params.accessToken) {
    context.options.headers = {
      ['cookie']: `ekb-access-token=${context.params.accessToken}`,
      ['accesstoken']: context.params.accessToken,
      ...context.options.headers,
    };
  }

  await next();
}
