import type { SortGenerator } from '@/lib/types';

export function* gnome(arr: number[]): SortGenerator {
  const n = arr.length;
  let index = 0;

  while (index < n) {
    if (index == 0 || arr[index] >= arr[index - 1]) {
      yield { access: [index] };
      index++;
    } else {
      yield { access: [index, index - 1] };
      let temp = 0;
      temp = arr[index];
      arr[index] = arr[index - 1];
      arr[index - 1] = temp;
      index--;
    }
  }
}
