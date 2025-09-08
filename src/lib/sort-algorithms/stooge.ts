import type { SortGenerator } from '@/lib/types';

function* sort(arr: number[], l: number, h: number): SortGenerator {
  if (l >= h) {
    return;
  }

  if (arr[l] > arr[h]) {
    [arr[l], arr[h]] = [arr[h], arr[l]];
    yield { access: [l, h] };
  }

  if (h - l + 1 > 2) {
    const t = Math.floor((h - l + 1) / 3);

    yield* sort(arr, l, h - t);

    yield* sort(arr, l + t, h);

    yield* sort(arr, l, h - t);
  }
}

export function* stooge(arr: number[]): SortGenerator {
  yield* sort(arr, 0, arr.length - 1);
}
