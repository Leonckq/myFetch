/***************************************************
 * Created by nanyuantingfeng on 2020/11/10 20:08. *
 ***************************************************/

export function deepClone(data: Record<string, any>): Record<string, any> {
  return typeof data === 'object' ? JSON.parse(JSON.stringify(data)) : data;
}
