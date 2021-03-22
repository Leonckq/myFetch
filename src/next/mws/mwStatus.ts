/***************************************************
 * Created by nanyuantingfeng on 2020/10/9 11:01. *
 ***************************************************/
import { Next } from 'koa';
import MyFetchNextContext from '../my-fetch-context';
import util from '../../helpers/config-cellar';

export async function mwStatus(context: MyFetchNextContext, next: Next) {
  await next();

  // 调用 fetch 失败后的保护措施.
  if (context.error || !context.response) return;

  const status = Number(context.response.status);

  switch (status) {
    case 0:
      context.error = { errorCode: 0, message: util.networkErrorMessage(), network: true };
      break;

    case 431:
    case 3840:
    case 1000431:
      // 华为we码中如果返回的是431时ios返回code为3840 或者 1000431，Android返回为431
      context.error = { errorCode: 431, message: '请先登录' };
      context.data = {};
      util.handleStatus431();
      break;

    case 207:
      // 华为we码中请求打印提醒接口时Android下直接catch到返回207，此时这里判断让其正常走流程
      context.data = { success: 1, errors: [] };
      break;

    case 204:
      context.data = {};
      break;

    case 700: // SMG
      context.error = { errorCode: 700 };
      context.data = {};
      util.handleStatus700();
      break;

    default:
      if (status >= 500 && status < 700) context.error = { errorCode: status };
      break;
  }
}
