/***************************************************
 * Created by nanyuantingfeng on 2020/10/10 11:01. *
 ***************************************************/
import compose, { Middleware } from 'koa-compose';

export default class MiddlewareManager<Cx> {
  private middlewares: Array<Middleware<Cx>> = [];

  constructor(mw: Middleware<Cx>) {
    this.middlewares.push(mw);
  }

  use(...middlewares: Middleware<Cx>[]) {
    const _DEF = this.middlewares.pop();
    this.middlewares.push(...middlewares);
    this.middlewares.push(_DEF);
    return () => {
      this.middlewares = this.middlewares.filter((mw) => !middlewares.includes(mw));
    };
  }

  async invoke(context: Cx): Promise<Cx> {
    const fn = compose<Cx>(this.middlewares);
    await fn(context);
    return context;
  }
}
