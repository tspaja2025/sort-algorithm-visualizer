import type { SortGenerator } from '@/lib/types';

function* isSorted(arr: number[]) {
  for (let i = 1; i < arr.length; i++) {
    yield { access: [i] };
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

function* shuffle(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    const ind = Math.floor(Math.random() * arr.length);
    yield { access: [arr.length - i - 1, ind] };

    const temp = arr[arr.length - i - 1];
    arr[arr.length - i - 1] = arr[ind];
    arr[ind] = temp;
  }
}

export function* bogo(a: number[]): SortGenerator {
  let sorted = yield* isSorted(a);

  while (!sorted) {
    yield* shuffle(a);

    sorted = yield* isSorted(a);
  }
}
