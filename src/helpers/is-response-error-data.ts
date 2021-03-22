/***************************************************
 * Created by nanyuantingfeng on 2020/10/12 11:11. *
 ***************************************************/
export default function isResponseErrorData(data: any): boolean {
  return typeof data === 'object' && 'errorCode' in data && typeof data.errorCode === 'number' && data.errorCode !== 200;
}
