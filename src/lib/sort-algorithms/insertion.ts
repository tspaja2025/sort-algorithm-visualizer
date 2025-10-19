import type { SortGenerator } from "@/lib/types";

export function* insertion(arr: number[]): SortGenerator {
  for (let i = 1; i < arr.length; i++) {
    const currentValue = arr[i];
    let j = i - 1;
    for (j; j >= 0 && arr[j] > currentValue; j--) {
      arr[j + 1] = arr[j];

      yield { access: [i, j] };
    }
    arr[j + 1] = currentValue;

    yield { access: [i, j + 1] };
  }
}
