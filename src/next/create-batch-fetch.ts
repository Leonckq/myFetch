/***************************************************
 * Created by nanyuantingfeng on 2020/9/24 13:09. *
 ***************************************************/
import { IFetchNext, IFetchNextContext } from './create-fetch-next';

export interface IBatchRequestOption {
  id?: string;
  url: string;
  params?: Record<string, any>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: RequestInit['body'] | object | any;
}

export const createBatchFetch = <C extends IFetchNextContext>(options: { fetch: IFetchNext<C>; url: string }) => async (
  requests: IBatchRequestOption[],
): Promise<C[]> => {
  const { fetch, url } = options;
  const ctx = await fetch({ url, isBatch: true, method: 'POST', body: requests as any });
  return ctx.data;
};
