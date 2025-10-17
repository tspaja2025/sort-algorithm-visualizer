import type { SortGenerator } from "@/lib/types";

export function* cocktail(arr: number[]): SortGenerator {
  let start = 0;
  let end = arr.length - 1;
  let swapped = true;

  while (swapped && start < end) {
    swapped = false;
    let lastSwap = start;

    // Forward pass
    for (let i = start; i < end; i++) {
      yield { access: [i, i + 1], comparison: [i, i + 1] };

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
        lastSwap = i;
      }
    }

    if (!swapped) break;
    end = lastSwap;
    swapped = false;

    // Backward pass
    for (let i = end; i > start; i--) {
      yield { access: [i, i - 1], comparison: [i, i - 1] };

      if (arr[i] < arr[i - 1]) {
        [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
        swapped = true;
        lastSwap = i;
      }
    }

    start = lastSwap;
  }
}
