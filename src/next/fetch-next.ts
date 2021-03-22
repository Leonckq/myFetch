/***************************************************
 * Created by nanyuantingfeng on 2020/10/9 11:13. *
 ***************************************************/
import { createFetchNext, IFetchInstance, IFetchNext } from './create-fetch-next';
import { useFetchInstance } from '../helpers/use-fetch-instance';
import { mwURLParamsPatch } from './mws/mwURLParamsPatch';
import { mwResult } from './mws/mwResult';
import { mwBusy } from './mws/mwBusy';
import { mwStatus } from './mws/mwStatus';
import { mwErrorReport } from './mws/mwErrorReport';
import { mwCache } from './mws/mwCache';
import { mwJoin } from './mws/mwJoin';
import { mwBatch } from './mws/mwBatch';

import MyFetchNextContext from './my-fetch-context';
/****** Batch API *******************************************************************************/
import { createBatchFetch, IBatchRequestOption } from './create-batch-fetch';
import batch from './batch';

interface IFetchNextCombine extends IFetchNext<MyFetchNextContext> {
  batch(requests: IBatchRequestOption[]): Promise<MyFetchNextContext[]>;
  combine(request: IBatchRequestOption): Promise<MyFetchNextContext>;
  fetch: typeof fetch;
}

export const fetchNext = createFetchNext<IFetchInstance, MyFetchNextContext>(useFetchInstance()) as IFetchNextCombine;

fetchNext.defaults.createContext = (o, fetchNext) => new MyFetchNextContext(o, fetchNext);

// must be set `mwBusy` -> `mwCache`.
// if `mwCache` -> `mwBusy`
// If the cache is captured, the `loading state` will be eaten by the cache.
fetchNext.use(mwURLParamsPatch, mwJoin, mwBatch, mwBusy, mwCache, mwErrorReport, mwResult, mwStatus);

const __batch_fetch = createBatchFetch({ fetch: fetchNext, url: '/api/merge/rest' });
const __combine_fetch = batch(__batch_fetch);

fetchNext.batch = (requests: IBatchRequestOption[]): Promise<MyFetchNextContext[]> => __batch_fetch(requests);
fetchNext.combine = (request: IBatchRequestOption): Promise<MyFetchNextContext> => __combine_fetch(request);
fetchNext.fetch = async (url: string, options?: any): Promise<Response> => {
  const context = await fetchNext({ url, ...options });
  const response = context.response;
  response.json = () => context.data;
  return response;
};

export default fetchNext;
