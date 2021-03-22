/***************************************************
 * Created by nanyuantingfeng on 2020/9/30 11:24. *
 ***************************************************/
import { parseURLParams } from '../src/helpers/parse-url-params';

describe('mwUrlParamsPatch.spec.ts', () => {
  it('should be parse url params by data', () => {
    expect(parseURLParams('/$a', { a: 0 })).toEqual('/$0');
    expect(parseURLParams('/$abc', { abc: '012' })).toEqual('/$012');
    expect(parseURLParams('/$abc', { abcd: '012' })).toEqual('/$abc');

    expect(parseURLParams('/$id', { id: 'XASDNJ' })).toEqual('/$XASDNJ');

    expect(parseURLParams('/[ids]', { a: 0 })).toEqual('/[ids]');
    expect(parseURLParams('/[icc]', { icc: [1, 2, 3] })).toEqual('/[1,2,3]');
    expect(parseURLParams('/a/d/d', { icc: [1, 2, 3] })).toEqual('/a/d/d');

    expect(parseURLParams('/$id3', { id: 'XASDNJ' })).toEqual('/$id3');
  });
});
