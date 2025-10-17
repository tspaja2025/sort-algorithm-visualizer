import type { SortGenerator } from "@/lib/types";

export function* oddEven(arr: number[]): SortGenerator {
  const n = arr.length;

  let isSorted = false;

  while (!isSorted) {
    isSorted = true;
    let temp = 0;

    for (let i = 1; i <= n - 2; i = i + 2) {
      yield { access: [i, i + 1] };
      if (arr[i] > arr[i + 1]) {
        temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        isSorted = false;
      }
    }

    for (let i = 0; i <= n - 2; i = i + 2) {
      yield { access: [i, i + 1] };
      if (arr[i] > arr[i + 1]) {
        temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        isSorted = false;
      }
    }
  }
}
