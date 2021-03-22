/***************************************************
 * Created by nanyuantingfeng on 2020/10/9 16:05. *
 ***************************************************/
import 'isomorphic-fetch';
import fetchNext from '../src/next/fetch-next';
import nock from 'nock';
const BASE_HOST = 'http://127.0.0.1:3000';
const scope = nock(BASE_HOST);

describe('fetch-next.spec.ts', () => {
  beforeEach(() => {
    scope
      .persist()
      .get((uri) => uri.startsWith('/api/a/999'))
      .reply(200, () => {
        return { value: { acccccc: 'axxxx' } };
      });

    scope
      .persist()
      .get((uri) => uri.startsWith('/api/skip/999'))
      .reply(200, () => {
        return { value: { acccccc: 'axxxx', id: Math.random() } };
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

  it('should be call interceptors', async () => {
    const rr: string[] = [];
    const nn: number[] = [];

    const id0 = fetchNext.interceptors.request.use((options) => {
      rr.push(options.url);
      return options;
    });
    const id1 = fetchNext.interceptors.response.use((data) => {
      nn.push(data.status);
      return data;
    });

    const oo1 = await fetchNext({
      url: BASE_HOST + '/api/a/[idsss]',
      params: { idsss: [111, 222, 333] },
    });

    expect(oo1.data).toEqual({ count: 30, items: [{ a: 'a' }, { b: 1 }] });
    expect(rr).toEqual([BASE_HOST + '/api/a/[idsss]']);
    expect(nn).toEqual([200]);

    fetchNext.interceptors.request.eject(id0);
    fetchNext.interceptors.response.eject(id1);

    const oo2 = await fetchNext({
      url: BASE_HOST + '/api/a/[idsss]',
      params: { idsss: [111, 222, 333] },
    });

    expect(oo2.data).toEqual({ count: 30, items: [{ a: 'a' }, { b: 1 }] });
    expect(rr).toEqual([BASE_HOST + '/api/a/[idsss]']);
    expect(nn).toEqual([200]);
  });

  it('should be simple', async () => {
    const oo = await fetchNext({
      url: BASE_HOST + '/api/a/999',
    });
    expect(oo.data).toEqual({ value: { acccccc: 'axxxx' } });
  });

  it('should be simple and cache', async () => {
    const oo = await Promise.all([
      fetchNext({
        url: BASE_HOST + '/api/a/999',
      }),
      fetchNext({
        url: BASE_HOST + '/api/a/999',
      }),
      fetchNext({
        url: BASE_HOST + '/api/a/999',
      }),
      fetchNext({
        url: BASE_HOST + '/api/a/999',
      }),
    ]);
    const _d = oo.map((d) => d.data);
    expect(_d).toEqual([
      { value: { acccccc: 'axxxx' } },
      { value: { acccccc: 'axxxx' } },
      { value: { acccccc: 'axxxx' } },
      { value: { acccccc: 'axxxx' } },
    ]);

    expect(_d[0]).not.toBe(_d[1]);
    expect(_d[1]).not.toBe(_d[2]);
    expect(_d[2]).not.toBe(_d[3]);
  });

  it('should be simple and skipCache', async () => {
    const oo = await Promise.all([
      fetchNext({
        url: BASE_HOST + '/api/skip/999',
        skipCache: false,
      }),
      fetchNext({
        url: BASE_HOST + '/api/skip/999',
        skipCache: false,
      }),
      fetchNext({
        url: BASE_HOST + '/api/skip/999',
        skipCache: true,
      }),
      fetchNext({
        url: BASE_HOST + '/api/skip/999',
        skipCache: false,
      }),
    ]);
    const _d = oo.map((d) => d.data);
    expect(_d[0]).toEqual(_d[1]);
    expect(_d[2]).not.toEqual(_d[3]);
  });

  it('should be simple and skipCache as oneByOne', async () => {
    const d0 = await fetchNext({
      url: BASE_HOST + '/api/skip/999',
      skipCache: true,
    });

    const d1 = await fetchNext({
      url: BASE_HOST + '/api/skip/999',
      skipCache: true,
    });

    const d2 = await fetchNext({
      url: BASE_HOST + '/api/skip/999',
      skipCache: false,
    });

    const d3 = await fetchNext({
      url: BASE_HOST + '/api/skip/999',
      skipCache: true,
    });

    expect(d0.data).not.toEqual(d1.data);
    expect(d1.data).toEqual(d2.data);
    expect(d2.data).not.toEqual(d3.data);
  });

  it('should be patch id', async () => {
    const oo = await fetchNext({
      url: BASE_HOST + '/api/a/$id',
      params: { id: 999, ddd: 78 },
    });
    expect(oo.data).toEqual({ value: { a: 'a' } });
  });

  it('should be patch ids', async () => {
    const oo = await fetchNext({
      url: BASE_HOST + '/api/a/[idsss]',
      params: { idsss: [111, 222, 333] },
    });
    expect(oo.data).toEqual({ count: 30, items: [{ a: 'a' }, { b: 1 }] });
  });

  it('should be catch 204', async () => {
    const oo = await fetchNext({
      url: BASE_HOST + '/api/b',
    });
    expect(oo.data).toEqual({});
    expect(oo.response.status).toBe(204);
  });

  it('should be catch a error', async () => {
    const oo = await fetchNext({
      url: BASE_HOST + '/api/err/0',
    });

    expect(oo.data).toBe(undefined);
    expect(oo.error.name).toBe('FetchError');
  });
});
