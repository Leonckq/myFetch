/***************************************************
 * Created by nanyuantingfeng on 2020/9/24 12:29. *
 ***************************************************/
import { Deffer } from '../helpers/deffer';

export function batch<T, R>(handler: (values: T[]) => R[] | PromiseLike<R[]>, timeout = 16) {
  let isCaching = false;
  let queue: T[] = [];
  let defferQueue: Deffer<R>[] = [];
  return (value: T) => {
    const deffer = Deffer<R>();
    queue.push(value);
    defferQueue.push(deffer);

    if (isCaching) {
      return deffer.promise;
    }

    isCaching = true;
    setTimeout(async () => {
      const __defferQueue = defferQueue;
      const __queue = queue;
      isCaching = false;
      queue = [];
      defferQueue = [];
      try {
        const data = await handler(__queue);
        for (let i = 0; i < __defferQueue.length; i++) __defferQueue[i].resolve(data[i]);
      } catch (e) {
        for (let i = 0; i < __defferQueue.length; i++) __defferQueue[i].reject(e);
      }
    }, timeout);
    return deffer.promise;
  };
}

export default batch;
