/***************************************************
 * Created by nanyuantingfeng on 2020/9/24 12:39. *
 ***************************************************/
import batch from '../src/next/batch';

describe('batch.spec.ts', () => {
  it('should call batch in simple', async () => {
    const args = [] as any;

    function combine0(values: any[]): any[] {
      args.push(values);
      return values;
    }

    const ff = batch<any, any>(combine0);

    const o0 = ff({ a: 0 });
    const o1 = ff({ a: 1 });
    const o2 = ff({ a: 2 });
    const o3 = ff({ a: 3 });
    const o4 = ff({ a: 4 });
    const o5 = ff({ a: 5 });

    expect(args).toEqual([]);
    const data = await Promise.all([o0, o1, o2, o3, o4, o5]);
    expect(args).toEqual([[{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }]]);
    expect(data).toEqual([{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }]);
  });

  it('should call batch in timeout', async () => {
    const args = [] as any;

    function combine0(values: any[]): any[] {
      args.push(values);
      return values;
    }

    const ff = batch<any, any>(combine0);

    const o0 = ff({ a: 0 });
    const o1 = ff({ a: 1 });
    const o2 = ff({ a: 2 });
    await new Promise((resolve) => setTimeout(resolve, 20));
    const o3 = ff({ a: 3 });
    const o4 = ff({ a: 4 });
    const o5 = ff({ a: 5 });
    await new Promise((resolve) => setTimeout(resolve, 20));
    const data = await Promise.all([o0, o1, o2, o3, o4, o5]);
    expect(args).toEqual([
      [{ a: 0 }, { a: 1 }, { a: 2 }],
      [{ a: 3 }, { a: 4 }, { a: 5 }],
    ]);
    expect(data).toEqual([{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }]);
  });
});
