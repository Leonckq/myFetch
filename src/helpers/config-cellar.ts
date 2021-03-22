/***************************************************
 * Created by nanyuantingfeng on 2020/10/10 15:34. *
 ***************************************************/

export interface FetchConfiguration {
  hideLoading: (uid: string | number | undefined) => void;
  showLoading: (msg: any) => string | number | undefined;
  handleStatus431: () => void;
  handleStatus700: () => void;
  networkErrorMessage: () => string;
  checkNetworkMessage: () => string;
  urlPrefix?: string;
  getStaffId: () => string;
}

const noop: any = (): any => undefined;

let __config__: FetchConfiguration = {
  hideLoading: noop,
  showLoading: noop,
  handleStatus431: noop,
  handleStatus700: noop,
  networkErrorMessage: () => '网络无法访问，请检查网络设置',
  checkNetworkMessage: () => '请检查网络',
  urlPrefix: '',
  getStaffId: () => '',
};

export const configure = (config: FetchConfiguration) => {
  __config__ = { ...__config__, ...config };
};

export default __config__;
