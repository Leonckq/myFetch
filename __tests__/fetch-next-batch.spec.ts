/***************************************************
 * Created by nanyuantingfeng on 2020/9/16 17:36. *
 ***************************************************/
import fetch from 'isomorphic-fetch';

import nock from 'nock';
const BASE_HOST = 'http://127.0.0.1:3000';
const scope = nock(BASE_HOST);
import fetchNext from '../src/next/fetch-next';
import { __PARAMS__ } from '../src/helpers/location-url-params-util';
import { isFetchError } from '../src';

fetchNext.defaults.baseURL = BASE_HOST;

describe('fetch-next-batch.spec.ts', () => {
  beforeEach(() => {
    scope.get(/\/api\/a(\?.*)?/).reply(200, () => {
      return { value: { a: 'a' } };
    });
    scope.get(/\/api\/b(\?.*)?/).reply(200, () => {
      return { value: { a: 'b' } };
    });
    scope.get(/\/api\/c(\?.*)?/).reply(200, () => {
      return { value: { a: 'c' } };
    });
    scope.get(/\/api\/d(\?.*)?/).reply(200, () => {
      return { value: { a: 'd' } };
    });
    scope.get(/\/api\/e(\?.*)?/).reply(200, () => {
      return { value: { a: 'e' } };
    });
    scope.get(/\/api\/oerr(\?.*)?/).reply(200, () => {
      return { errorCode: 600, errorMessage: 'XXX' };
    });
    scope
      .persist()
      .get(/\/api\/xy(\?.*)?/)
      .reply(200, (uri) => {
        return { value: { x: uri } };
      });
    scope.post(/\/api\/merge\/rest([?].*)?/).reply(200, async (uri, body) => {
      let data = body as any[];
      if (typeof body === 'string') {
        data = JSON.parse(body as string);
      }
      const __patch_api = (url: string) => (url.startsWith('/api') ? url : '/api' + url);
      const result = await Promise.all(data.map((o: any) => fetch(BASE_HOST + __patch_api(o.url), o)));
      const dd = await Promise.all(result.map((d: Response) => d.json()));
      const dd2 = dd.map((o, i) => ({ id: data[i].id, data: JSON.stringify(o) }));
      return { items: dd2 };
    });
  });

  it('should fetch as parallels', async () => {
    const response = await fetch(BASE_HOST + '/api/merge/rest', {
      method: 'POST',
      body: JSON.stringify([
        { id: '1', url: '/api/a', method: 'GET' },
        { id: '2', url: '/api/b', method: 'GET' },
        { id: '3', url: '/api/c', method: 'GET' },
        { id: '4', url: '/api/d', method: 'GET' },
        { id: '5', url: '/api/e', method: 'GET' },
      ]),
    });
    const json = await response.json();
    expect(json).toEqual({
      items: [
        { id: '1', data: '{"value":{"a":"a"}}' },
        { id: '2', data: '{"value":{"a":"b"}}' },
        { id: '3', data: '{"value":{"a":"c"}}' },
        { id: '4', data: '{"value":{"a":"d"}}' },
        { id: '5', data: '{"value":{"a":"e"}}' },
      ],
    });
  });

  it('should fetch as batch', async () => {
    const responses = await fetchNext.batch([
      { id: '1', url: '/api/a', method: 'GET' },
      { id: '2', url: '/api/b', method: 'GET' },
      { id: '3', url: '/api/c', method: 'GET' },
      { id: '4', url: '/api/d', method: 'GET' },
      { id: '5', url: '/api/e', method: 'GET' },
    ]);
    const __oo = responses.map((d) => d.data)
    expect(__oo).toEqual([
      { value: { a: 'a' } },
      { value: { a: 'b' } },
      { value: { a: 'c' } },
      { value: { a: 'd' } },
      { value: { a: 'e' } },
    ]);
  });

  it('should fetch as batch no `/api`', async () => {
    const responses = await fetchNext.batch([
      { id: '1', url: '/a', method: 'GET' },
      { id: '2', url: '/b', method: 'GET' },
      { id: '3', url: '/c', method: 'GET' },
      { id: '4', url: '/d', method: 'GET' },
      { id: '5', url: '/e', method: 'GET' },
    ]);
    const __oo = await responses.map((d) => d.data)
    expect(__oo).toEqual([
      { value: { a: 'a' } },
      { value: { a: 'b' } },
      { value: { a: 'c' } },
      { value: { a: 'd' } },
      { value: { a: 'e' } },
    ]);
  });

  it('should fetch as batch with error', async () => {
    const responses = await fetchNext.batch([
      { id: '1', url: '/a', method: 'GET' },
      { id: '2', url: '/b', method: 'GET' },
      { id: '3', url: '/c', method: 'GET' },
      { id: '4', url: '/d', method: 'GET' },
      { id: '5', url: '/oerr', method: 'GET' },
    ]);

    const __oo = responses.map((d) => d.data);
    expect(__oo).toEqual([
      { value: { a: 'a' } },
      { value: { a: 'b' } },
      { value: { a: 'c' } },
      { value: { a: 'd' } },
      null,
    ]);

    expect(isFetchError(responses[responses.length - 1].error)).toBeTruthy();
  });

  it('should fetch as batch & build url', async () => {
    const responses = await fetchNext.batch([
      { url: '/api/xy/$aaa', params: { aaa: 999 } },
      { url: '/api/xy/[sss]', params: { aaa: 999, sss: 888 } },
      { url: '/api/xy/ccc', params: { aaa: 999, sss: 888, ccc: 777 } },
      { url: '/api/xy/$a/[bb]/d', params: { a: 999, bb: 888, d: 777 } },
      { url: '/api/xy/$a/[bb]/$d', params: { a: 999, bb: 888, d: 777 } },
    ]);
    const __oo = responses.map((d) => d.data);
    expect(__oo).toEqual([
      {
        value: {
          x: '/api/xy/$999',
        },
      },
      {
        value: {
          x: '/api/xy/[888]?aaa=999',
        },
      },
      {
        value: {
          x: '/api/xy/ccc?aaa=999&sss=888&ccc=777',
        },
      },
      {
        value: {
          x: '/api/xy/$999/[888]/d?d=777',
        },
      },
      {
        value: {
          x: '/api/xy/$999/[888]/$777',
        },
      },
    ]);
  });

  it('should fetch as batch & build url & `/api`', async () => {
    const responses = await fetchNext.batch([
      { url: '/xy/$aaa', params: { aaa: 999 } },
      { url: '/xy/[sss]', params: { aaa: 999, sss: 888 } },
      { url: '/xy/ccc', params: { aaa: 999, sss: 888, ccc: 777 } },
      { url: '/xy/$a/[bb]/d', params: { a: 999, bb: 888, d: 777 } },
      { url: '/xy/$a/[bb]/$d', params: { a: 999, bb: 888, d: 777 } },
    ]);
    const __oo = responses.map((d) => d.data);
    expect(__oo).toEqual([
      {
        value: {
          x: '/api/xy/$999',
        },
      },
      {
        value: {
          x: '/api/xy/[888]?aaa=999',
        },
      },
      {
        value: {
          x: '/api/xy/ccc?aaa=999&sss=888&ccc=777',
        },
      },
      {
        value: {
          x: '/api/xy/$999/[888]/d?d=777',
        },
      },
      {
        value: {
          x: '/api/xy/$999/[888]/$777',
        },
      },
    ]);
  });

  it('should fetch as batch & build url & `/api` & corpId', async () => {
    __PARAMS__.corpId = '&AADDDDDDD';
    const responses = await fetchNext.batch([
      { url: '/xy/$aaa', params: { aaa: 999 } },
      { url: '/xy/[sss]', params: { aaa: 999, sss: 888 } },
      { url: '/xy/ccc', params: { aaa: 999, sss: 888, ccc: 777 } },
      { url: '/xy/$a/[bb]/d', params: { a: 999, bb: 888, d: 777 } },
      { url: '/xy/$a/[bb]/$d', params: { a: 999, bb: 888, d: 777 } },
    ]);
    const __oo = responses.map((d) => d.data)
    expect(__oo).toEqual([
      {
        value: {
          x: '/api/xy/$999?corpId=%26AADDDDDDD',
        },
      },
      {
        value: {
          x: '/api/xy/[888]?corpId=%26AADDDDDDD&aaa=999',
        },
      },
      {
        value: {
          x: '/api/xy/ccc?corpId=%26AADDDDDDD&aaa=999&sss=888&ccc=777',
        },
      },
      {
        value: {
          x: '/api/xy/$999/[888]/d?corpId=%26AADDDDDDD&d=777',
        },
      },
      {
        value: {
          x: '/api/xy/$999/[888]/$777?corpId=%26AADDDDDDD',
        },
      },
    ]);
  });

  it('should fetch as combine', async () => {
    const s0 = fetchNext.combine({ url: '/api/a' });
    const s1 = fetchNext.combine({ url: '/api/b' });
    const s2 = fetchNext.combine({ url: '/api/c' });
    const s3 = fetchNext.combine({ url: '/api/d' });
    const s4 = fetchNext.combine({ url: '/api/e' });

    const data = await Promise.all([s0, s1, s2, s3, s4]);
    const __oo = data.map((d) => d.data)

    expect(__oo).toEqual([
      { value: { a: 'a' } },
      { value: { a: 'b' } },
      { value: { a: 'c' } },
      { value: { a: 'd' } },
      { value: { a: 'e' } },
    ]);
  });

  it('should fetch as combine with error', async () => {
    const s0 = fetchNext.combine({ url: '/api/a' });
    const s1 = fetchNext.combine({ url: '/api/oerr' });

    const data = await Promise.all([s0, s1]);
    const __oo = data.map((d) => d.data || d.error)

    expect(__oo[0]).toEqual({ value: { a: 'a' } });
    expect(isFetchError(__oo[1])).toBeTruthy();
  });
});
