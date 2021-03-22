/***************************************************
 * Created by nanyuantingfeng on 2020/10/10 10:42. *
 ***************************************************/
export default class InterceptorManager<T> {
  private handlers: Array<{ fulfilled: (data: T) => T | Promise<T>; rejected: (data: any) => T | Promise<T> }> = [];

  use(fulfilled: (data: T) => T | Promise<T>, rejected?: (data: any) => T | Promise<T>) {
    this.handlers.push({ fulfilled, rejected });
    return this.handlers.length - 1;
  }

  eject(index: number) {
    if (this.handlers[index]) {
      this.handlers[index] = null;
    }
  }

  invoke(data: T): Promise<T> {
    let p = Promise.resolve(data);
    this.handlers.filter(Boolean).forEach((fns) => {
      p = p.then(fns.fulfilled, fns.rejected);
    });
    return p;
  }
}
