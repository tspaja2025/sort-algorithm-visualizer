import type { SortGenerator } from "@/lib/types";

function* compAndSwap(
  arr: number[],
  i: number,
  j: number,
  dir: number,
): SortGenerator {
  if ((arr[i] > arr[j] && dir === 1) || (arr[i] < arr[j] && dir === 0)) {
    yield { access: [i, j] };

    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

function* bitonicMerge(
  arr: number[],
  low: number,
  cnt: number,
  dir: number,
): SortGenerator {
  if (cnt > 1) {
    const k = Math.floor(cnt / 2);

    for (let i = low; i < low + k; i++) {
      yield* compAndSwap(arr, i, i + k, dir);
    }

    yield* bitonicMerge(arr, low, k, dir);
    yield* bitonicMerge(arr, low + k, k, dir);
  }
}

function* sort(
  arr: number[],
  low: number,
  cnt: number,
  dir: number,
): SortGenerator {
  if (cnt > 1) {
    const k = Math.floor(cnt / 2);

    yield* sort(arr, low, k, 1);

    yield* sort(arr, low + k, k, 0);

    yield* bitonicMerge(arr, low, cnt, dir);
  }
}

export function* bitonic(arr: number[]): SortGenerator {
  yield* sort(arr, 0, arr.length, 1);
}
