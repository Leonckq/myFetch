/***************************************************
 * Created by nanyuantingfeng on 2020/10/10 16:44. *
 ***************************************************/
import 'isomorphic-fetch';
import 'event-source/global';
import { buildSSE } from '../src/helpers/build-sse';

describe('sse-old.spec.ts', () => {
  it('should be sse', async () => {
    const source = await buildSSE('/adadjas/sss/$d', { d: 1234 });
    expect(source.url).toEqual('/adadjas/sss/$1234');
    source.close()

    const source2 = buildSSE('/adadjas/sss/$d', { d: 1234, accessToken: 'NASBDJD' });
    expect(source2.url).toEqual('/adadjas/sss/$1234?accessToken=NASBDJD');
    source2.close()
  });
});
