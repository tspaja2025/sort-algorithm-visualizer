import type { SortGenerator } from "@/lib/types";

function swap(arr: number[], i: number, j: number) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

function* heapify(arr: number[], n: number, i: number): SortGenerator {
  while (true) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < n) {
      yield { access: [l, largest] };
      if (arr[l] > arr[largest]) {
        largest = l;
      }
    }

    if (r < n) {
      yield { access: [r, largest] };
      if (arr[r] > arr[largest]) {
        largest = r;
      }
    }

    if (largest === i) break;

    yield { access: [i, largest] };
    swap(arr, i, largest);

    i = largest; // continue sifting down
  }
}

export function* heap(arr: number[]): SortGenerator {
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(arr, n, i);
  }

  // Extract elements one by one
  for (let i = n - 1; i > 0; i--) {
    yield { access: [0, i] };
    swap(arr, 0, i);

    yield* heapify(arr, i, 0);
  }
}
