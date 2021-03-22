/***************************************************
 * Created by nanyuantingfeng on 2020/10/10 12:17. *
 ***************************************************/
export function useFetchInstance(): typeof fetch {
  // @ts-ignore
  if (global.HWH5) {
    // @ts-ignore
    return global.HWH5.fetchInternet;
  }

  // @ts-ignore
  return global.fetch;
}
