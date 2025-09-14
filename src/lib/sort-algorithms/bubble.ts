import type { SortGenerator } from '@/lib/types';

export function* bubble(arr: number[]): SortGenerator {
  let n = arr.length;
  let swapped: boolean;

  do {
    swapped = false;
    let newN = 0;

    for (let j = 0; j < n - 1; j++) {
      yield { access: [j, j + 1] };

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        newN = j + 1;
      }
    }

    n = newN;
  } while (swapped && n > 1);
}
