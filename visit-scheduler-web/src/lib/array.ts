export const filterMap = <T, U>(arr: T[], mapFn: (t: T) => U | null): U[] =>
  arr.reduce((acc, t) => {
    const u = mapFn(t);
    if (u === null) return acc;
    acc.push(u);
    return acc;
  }, [] as U[]);

export const arrayToRecord = <T, K extends string | number>(arr: T[], keyFn: (t: T) => K): Record<K, T> =>
  arr.reduce((acc, t) => {
    acc[keyFn(t)] = t;
    return acc;
  }, {} as Record<K, T>);
