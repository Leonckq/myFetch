/***************************************************
 * Created by nanyuantingfeng on 2020/10/10 16:44. *
 ***************************************************/
import 'isomorphic-fetch';
import Fetch from '../src/Fetch';
import nock from 'nock';
const BASE_HOST = 'http://127.0.0.1:3000';
const scope = nock(BASE_HOST);

describe('fetch-old.spec.ts', () => {
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
  });

  it('should be simple', async () => {
    const oo = await Fetch(BASE_HOST + '/api/a/999');
    expect(oo).toEqual({ value: { acccccc: 'axxxx' } });
  });

  it('should be patch id', async () => {
    const oo = await Fetch(BASE_HOST + '/api/a/$id', { id: 999, ddd: 78 });
    expect(oo).toEqual({ value: { a: 'a' } });
  });

  it('should be patch ids', async () => {
    const oo = await Fetch(BASE_HOST + '/api/a/[idsss]', { idsss: [111, 222, 333] });
    expect(oo).toEqual({ count: 30, items: [{ a: 'a' }, { b: 1 }] });
  });

  it('should be catch 204', async () => {
    const oo = await Fetch(BASE_HOST + '/api/b');
    expect(oo).toEqual({});
  });

  it('should be catch a error', async () => {
    try {
      const oo = await Fetch(BASE_HOST + '/api/err/0');
    } catch (e) {
      expect(e.name).toEqual('FetchError');
    }
  });
});
