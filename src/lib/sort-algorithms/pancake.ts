import type { ProgressIndicator, SortGenerator } from "@/lib/types";

export function* pancake(arr: number[]): SortGenerator {
  const stats = { comparisons: 0, swaps: 0 };

  function* findMax(n: number): Generator<ProgressIndicator, number, unknown> {
    let mi = 0;
    for (let i = 1; i < n; i++) {
      stats.comparisons++;
      yield { access: [i, mi], comparison: [i, mi], stats: { ...stats } };
      if (arr[i] > arr[mi]) mi = i;
    }
    return mi;
  }

  function* flip(end: number): SortGenerator {
    for (let start = 0; start < end; start++, end--) {
      stats.swaps++;
      yield { access: [start, end], swap: true, stats: { ...stats } };
      [arr[start], arr[end]] = [arr[end], arr[start]];
    }
  }

  for (let curr = arr.length; curr > 1; curr--) {
    const mi = yield* findMax(curr);
    if (mi === curr - 1) {
      continue;
    }
    yield* flip(mi);
    yield* flip(curr - 1);
  }
}
