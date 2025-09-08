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

function* countSort(arr: number[], n: number, exp: number): SortGenerator {
  const output = new Array(n);
  const count = new Array(10);

  let i;
  for (let i = 0; i < 10; i++) count[i] = 0;

  for (i = 0; i < n; i++) {
    const x = Math.floor(arr[i] / exp) % 10;
    count[x]++;
    yield { access: [i] };
  }

  for (i = 1; i < 10; i++) count[i] += count[i - 1];

  for (i = n - 1; i >= 0; i--) {
    const x = Math.floor(arr[i] / exp) % 10;
    output[count[x] - 1] = arr[i];
    count[x]--;
    yield { access: [i] };
  }

  for (i = 0; i < n; i++) {
    arr[i] = output[i];
    yield { access: [i] };
  }
}

export function* radixLSD(arr: number[]): SortGenerator {
  const len = arr.length;

  const m = yield* getMax(arr, len);

  for (let exp = 1; Math.floor(m / exp) > 0; exp *= 10) {
    yield { access: [] };
    yield* countSort(arr, len, exp);
    yield { access: [] };
  }
}
