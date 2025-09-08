import type { SortGenerator } from '@/lib/types';

export function* cycle(arr: number[]): SortGenerator {
  const n = arr.length;

  for (let cycle_start = 0; cycle_start <= n - 2; cycle_start++) {
    let item = arr[cycle_start];

    let pos = cycle_start;
    for (let i = cycle_start + 1; i < n; i++) {
      yield { access: [cycle_start, i] };
      if (arr[i] < item) pos++;
    }

    if (pos == cycle_start) continue;

    while (item == arr[pos]) pos += 1;

    if (pos != cycle_start) {
      const temp = item;
      item = arr[pos];
      arr[pos] = temp;
    }

    while (pos != cycle_start) {
      pos = cycle_start;

      for (let i = cycle_start + 1; i < n; i++) {
        yield { access: [cycle_start, i] };
        if (arr[i] < item) pos += 1;
      }

      while (item == arr[pos]) pos += 1;

      if (item != arr[pos]) {
        const temp = item;
        item = arr[pos];
        arr[pos] = temp;
      }
    }
  }
}
