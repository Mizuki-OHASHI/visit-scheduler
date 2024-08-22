export const filterMap = <T, U>(arr: T[], mapFn: (t: T) => U | null): U[] =>
  arr.reduce((acc, t) => {
    const u = mapFn(t);
    if (u === null) return acc;
    acc.push(u);
    return acc;
  }, [] as U[]);
