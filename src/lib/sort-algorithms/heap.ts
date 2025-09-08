import type { SortGenerator } from '@/lib/types';

function* heapify(arr: number[], N: number, i: number): SortGenerator {
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;

  if (l < N && arr[l] > arr[largest]) {
    yield { access: [l, largest] };
    largest = l;
  }

  if (r < N && arr[r] > arr[largest]) {
    yield { access: [r, largest] };
    largest = r;
  }

  if (largest != i) {
    yield { access: [i, largest] };
    const swap = arr[i];
    arr[i] = arr[largest];
    arr[largest] = swap;

    yield* heapify(arr, N, largest);
  }
}

export function* heap(arr: number[]): SortGenerator {
  const N = arr.length;

  for (let i = Math.floor(N / 2) - 1; i >= 0; i--) {
    yield* heapify(arr, N, i);
  }

  for (let i = N - 1; i > 0; i--) {
    yield { access: [0, i] };

    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;

    yield* heapify(arr, i, 0);
  }
}
