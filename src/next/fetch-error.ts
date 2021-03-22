/***************************************************
 * Created by nanyuantingfeng on 2020/11/24 17:18. *
 ***************************************************/
import util from '../helpers/config-cellar';

export const _IS_FETCH_ERROR__ = Symbol.for('is_fetch_error');

export class FetchError extends Error {
  [_IS_FETCH_ERROR__] = _IS_FETCH_ERROR__;

  code: number;
  status: number;
  data: string;
  errorCode: number;
  errorDetail: string;
  errorMessage: string;
  msg: string;

  toString() {
    return this.msg;
  }

  constructor(obj: any) {
    super(obj.errorMessage);

    Object.keys(obj).forEach((key) => {
      // @ts-ignore
      this[key] = obj[key];
    });

    if (this.message === 'Failed to fetch') {
      this.message = util.checkNetworkMessage();
    }

    // 为了补丁前端消息访问逻辑
    this.msg = this.msg || this.message || this.errorMessage || this.errorDetail || this.data;
    this.status = Number(this.status || this.code || this.errorCode || 499);
  }
}

export function isFetchError(data: any) {
  return data[_IS_FETCH_ERROR__] === _IS_FETCH_ERROR__;
}
