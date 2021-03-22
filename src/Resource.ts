/**************************************************
 * Created by nanyuantingfeng on 8/16/16 17:24.
 **************************************************/
import { Fetch } from './Fetch';

function handleError(handler: Function, others: any = {}) {
  const { hiddenMsg } = others;
  if (hiddenMsg) return null;
  let errorHandler = handler || alertMessage;
  return (e: any) => {
    if (e.status === 403) {
      errorHandler(e.message || e.msg);
    }
    return Promise.reject(e);
  };
}

export class Resource {
  private readonly path: string;
  private readonly version: string;

  constructor(path: string, version?: string) {
    this.path = path;
    this.version = version;
  }

  query = (ename?: string, qs?: any, errHandler?: Function, others?: any) => {
    const { path } = this._parse(ename, {}, qs);
    const { skipCache } = others || {};
    return Fetch.GET(path, qs, { skipCache }, others).catch(handleError(errHandler));
  };

  create = (ename: string, data?: any, qs = {}, errHandler?: Function, others: any = {}) => {
    const { path, body } = this._parse(ename, data, qs);
    return Fetch.POST(
      path,
      qs,
      {
        body: body,
      },
      others,
    ).catch(handleError(errHandler, others));
  };

  update = (ename: string, data?: any, qs: any = {}, errHandler?: Function) => {
    let { path, body } = this._parse(ename, data, qs);
    return Fetch.PUT(path, qs, {
      body: body,
    }).catch(handleError(errHandler));
  };

  remove = (ename: string, qs = {}, errHandler?: Function) => {
    let { path } = this._parse(ename, null, qs);
    return Fetch.DELETE(path, qs).catch(handleError(errHandler));
  };

  GET = this.query;

  POST = this.create;

  PUT = this.update;

  DELETE = this.remove;

  private _parse(ename: string, body: any = {}, qs: any = {}) {
    let path = this.path;
    ename = ename || '';
    if (typeof ename === 'string') {
      path += ename;
    } else {
      qs = body;
      body = ename;
    }

    return { path, body };
  }

  url(ename: string, body: any = {}, qs: any = {}) {
    return this._parse(ename, body, qs);
  }

  combineGET(ename?: string, qs?: any, errHandler?: Function) {
    const { path } = this._parse(ename, {}, qs);
    return Fetch.Combine({ url: path, params: qs }).catch(handleError(errHandler));
  }
}

export default Resource;
