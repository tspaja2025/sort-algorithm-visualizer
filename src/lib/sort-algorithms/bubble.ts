import type { SortGenerator } from "@/lib/types";

export function* bubble(arr: number[]): SortGenerator {
  const n = arr.length;
  if (n <= 1) return;

  let lastUnsorted = n - 1;
  let sorted = false;
  let pass = 0;

  while (!sorted && lastUnsorted > 0) {
    pass++;
    sorted = true;
    let lastSwap = 0;

    for (let i = 0; i < lastUnsorted; i++) {
      yield {
        access: [i, i + 1],
        comparison: [i, i + 1],
        stats: { pass, lastUnsorted },
      };

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        sorted = false;
        lastSwap = i;
      }
    }

    lastUnsorted = lastSwap;

    yield {
      access: [],
      stats: { pass, lastUnsorted, sorted: sorted },
    };
  }
}
