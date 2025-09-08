import type { SortGenerator } from '@/lib/types';

function* partition(items: number[], left: number, right: number) {
  const pivot = items[Math.floor((right + left) / 2)];
  let i = left;
  let j = right;
  while (i <= j) {
    while (items[i] < pivot) {
      i++;
      yield { access: [i, j] };
    }
    while (items[j] > pivot) {
      j--;
      yield { access: [i, j] };
    }
    if (i <= j) {
      const temp = items[i];
      items[i] = items[j];
      items[j] = temp;
      i++;
      j--;
    }
    yield { access: [i, j] };
  }
  return i;
}

function* qc(items: number[], left: number, right: number): SortGenerator {
  let index;
  if (items.length > 1) {
    index = yield* partition(items, left, right);
    if (left < index - 1) {
      yield* qc(items, left, index - 1);
    }
    if (index < right) {
      yield* qc(items, index, right);
    }
  }
}

export function* quick(arr: number[]): SortGenerator {
  yield* qc(arr, 0, arr.length - 1);
}
