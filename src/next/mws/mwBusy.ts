/***************************************************
 * Created by nanyuantingfeng on 2020/9/30 18:04. *
 ***************************************************/
import { Next } from 'koa';
import MyFetchNextContext from '../my-fetch-context';
import util from '../../helpers/config-cellar';

let loadingProgress: number = 0;
let uid: string | number | undefined;

export async function mwBusy(context: MyFetchNextContext, next: Next) {
  if (loadingProgress === 0) {
    if (context.extra?.hiddenLoading === true) {
      uid = util.showLoading(context.extra?.msg);
    }
  }

  loadingProgress += 1;
  await next();
  loadingProgress -= 1;

  if (loadingProgress === 0) {
    if (uid !== undefined) {
      util.hideLoading(uid);
    }
  }
}
