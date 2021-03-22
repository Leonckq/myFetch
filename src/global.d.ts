/***************************************************
 * Created by nanyuantingfeng on 2019/12/9 17:44. *
 ***************************************************/
declare const alertMessage: any;

interface IHWH5 {
  fetchInternet: typeof fetch;
}

interface Window {
  HWH5: IHWH5;
  __PLATFORM__: string;
  API_URL: string;
  alertMessage: any;
}

namespace global {
  const HWH5: IHWH5;
  const fetch: typeof fetch;
  const alertMessage: any;
}
