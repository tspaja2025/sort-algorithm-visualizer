import type { SortGenerator } from '@/lib/types';

function* getMax(arr: number[], n: number) {
  let mx = arr[0];
  for (let i = 1; i < n; i++) {
    yield { access: [i] };
    if (arr[i] > mx) {
      mx = arr[i];
    }
  }
  return mx;
}

function* countSortMSD(
  arr: number[],
  exp: number,
  start: number,
  end: number
): SortGenerator {
  const n = end - start + 1;
  const output = new Array(n);
  const count = new Array(10).fill(0);

  for (let i = start; i <= end; i++) {
    const x = Math.floor(arr[i] / exp) % 10;
    count[x]++;
    yield { access: [i] };
  }

  for (let i = 1; i < 10; i++) count[i] += count[i - 1];

  for (let i = end; i >= start; i--) {
    const x = Math.floor(arr[i] / exp) % 10;
    output[--count[x]] = arr[i];
    yield { access: [i] };
  }

  for (let i = 0; i < n; i++) {
    arr[start + i] = output[i];
    yield { access: [start + i] };
  }
}

function* radixSortMSDUtil(
  arr: number[],
  exp: number,
  start: number,
  end: number
): SortGenerator {
  if (start >= end) return;

  yield* countSortMSD(arr, exp, start, end);

  const buckets = new Array(10).fill(0);
  for (let i = start; i <= end; i++) {
    const x = Math.floor(arr[i] / exp) % 10;
    buckets[x]++;
  }

  let s = start;
  for (let i = 0; i < 10; i++) {
    if (buckets[i] > 1) {
      yield* radixSortMSDUtil(arr, exp / 10, s, s + buckets[i] - 1);
    }
    s += buckets[i];
  }
}

export function* radixMSD(arr: number[]): SortGenerator {
  const len = arr.length;

  const m = yield* getMax(arr, len);

  let exp = 1;
  while (Math.floor(m / exp) > 0) {
    exp *= 10;
  }
  exp /= 10;

  yield* radixSortMSDUtil(arr, exp, 0, len - 1);
}
