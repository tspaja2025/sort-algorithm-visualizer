import type { SortGenerator } from '@/lib/types';

function* mergeSort(
  arr: number[],
  l: number,
  m: number,
  r: number
): SortGenerator {
  const n1 = m - l + 1;
  const n2 = r - m;

  const left = new Array(n1);
  const right = new Array(n2);

  for (let i = 0; i < n1; i++) {
    left[i] = arr[l + i];
  }
  for (let j = 0; j < n2; j++) {
    right[j] = arr[m + 1 + j];
  }

  let i = 0;

  let j = 0;

  let k = l;

  while (i < n1 && j < n2) {
    yield { access: [k] };
    if (left[i] <= right[j]) {
      arr[k] = left[i];
      i++;
    } else {
      arr[k] = right[j];
      j++;
    }
    k++;
  }

  while (i < n1) {
    arr[k] = left[i];
    yield { access: [k] };
    i++;
    k++;
  }

  while (j < n2) {
    arr[k] = right[j];
    yield { access: [k] };
    j++;
    k++;
  }
}

function* mergeSortStart(arr: number[], l: number, r: number): SortGenerator {
  if (l < r) {
    const m = l + Math.floor((r - l) / 2);
    yield* mergeSortStart(arr, l, m);
    yield* mergeSortStart(arr, m + 1, r);
    yield* mergeSort(arr, l, m, r);
  }
}

export function* merge(arr: number[]): SortGenerator {
  yield* mergeSortStart(arr, 0, arr.length - 1);
}
