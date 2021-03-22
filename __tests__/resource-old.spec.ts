/***************************************************
 * Created by nanyuantingfeng on 2020/10/10 16:44. *
 ***************************************************/
import 'isomorphic-fetch';
import Resource from '../src/Resource';
import nock from 'nock';
import { isFetchError } from '../src';
const BASE_HOST = 'http://127.0.0.1:3000';
const scope = nock(BASE_HOST);
// @ts-ignore
global.alertMessage = () => {};

describe('resource-old.spec.ts', () => {
  beforeEach(() => {
    scope
      .get((uri) => uri.startsWith('/api/a/999'))
      .reply(200, () => {
        return { value: { acccccc: 'axxxx' } };
      });

    scope
      .get((uri) => uri.startsWith('/api/a/$999'))
      .reply(200, () => {
        return { value: { a: 'a' } };
      });

    scope
      .get((uri) => uri.startsWith('/api/a/[111,222,333]'))
      .reply(200, () => {
        return { items: [{ a: 'a' }, { b: 1 }], count: 30 };
      });

    scope.get((uri) => uri.startsWith('/api/b')).reply(204, () => ({}));
    scope
      .get((uri) => uri.startsWith('/api/err/0'))
      .reply(200, () => {
        return JSON.stringify({}) + 'x';
      });


    scope
      .post((uri) => uri.startsWith('/api/ppp/$MENU/actions/jwt'))
      .reply(200, () => {
        return JSON.stringify({ value : {KKK : 43}}) ;
      });
  });

  it('should be simple', async () => {
    const oo = await new Resource(BASE_HOST + '/api/a').GET('/999');
    expect(oo).toEqual({ value: { acccccc: 'axxxx' } });
  });

  it('should be patch id', async () => {
    const oo = await new Resource(BASE_HOST + '/api/a').GET('/$id', { id: 999, ddd: 78 });
    expect(oo).toEqual({ value: { a: 'a' } });
  });

  it('should be patch ids', async () => {
    const oo = await new Resource(BASE_HOST + '/api/a').GET('/[idsss]', { idsss: [111, 222, 333] });
    expect(oo).toEqual({ count: 30, items: [{ a: 'a' }, { b: 1 }] });
  });

  it('should be catch 204', async () => {
    const oo = await new Resource(BASE_HOST + '/api/b').GET();
    expect(oo).toEqual({});
  });

  it('should be catch a error', async () => {
    try {
      const oo = await new Resource(BASE_HOST + '/api/err/0').GET();
    } catch (e) {
      expect(isFetchError(e)).toBeTruthy();
    }
  });

  it('should be simple POST', async () => {
    const oo = await new Resource(BASE_HOST + '/api/ppp').POST('/$type/actions/jwt', { type : "MENU"});
    expect(oo).toEqual({ value: { KKK: 43 } });
  });
});
