/***************************************************
 * Created by nanyuantingfeng on 2020/10/28 11:18. *
 ***************************************************/

export interface Deffer<T> {
  resolve: (value?: T | Promise<T>) => void;
  reject: (reason?: any) => void;
  promise: Promise<T>;
}

export function Deffer<T>(): Deffer<T> {
  let resolve: Deffer<T>['resolve'] = undefined;
  let reject: Deffer<T>['reject'] = undefined;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}
