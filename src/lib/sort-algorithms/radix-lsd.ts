import type { SortGenerator } from '@/lib/types';

function* getMax(arr: number[], n: number) {
  let mx = arr[0];
  for (let i = 1; i < n; i++) {
    yield { access: [i] };
    if (arr[i] > mx) mx = arr[i];
  }
  return mx;
}

function* countSort(arr: number[], n: number, exp: number, count: number[]): SortGenerator {
  const output = new Array(n);
  count.fill(0);

  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
    yield { access: [i] };
  }

  for (let i = 1; i < 10; i++) count[i] += count[i - 1];

  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[--count[digit]] = arr[i];
    yield { access: [i] };
  }

  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
    yield { access: [i] };
  }
}

export function* radixLSD(arr: number[]): SortGenerator {
  const len = arr.length;
  if (len <= 1) {
    yield { access: [] };
    return;
  }

  const m = yield* getMax(arr, len);
  const count = new Array(10);

  for (let exp = 1; Math.floor(m / exp) > 0; exp *= 10) {
    yield { access: [] };
    yield* countSort(arr, len, exp, count);
    yield { access: [] };
  }
}