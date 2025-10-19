import type { ProgressIndicator, SortGenerator } from "@/lib/types";

function* getMax(
  arr: number[],
  n: number,
): Generator<ProgressIndicator, number> {
  let mx = arr[0];
  let idx = 0;
  for (let i = 1; i < n; i++) {
    yield { access: [i], comparison: [idx, i] };
    if (arr[i] > mx) {
      mx = arr[i];
      idx = i;
      yield { access: [i] };
    }
  }
  return mx;
}

function* countSort(
  arr: number[],
  n: number,
  exp: number,
  count: number[],
  output: number[],
): SortGenerator {
  count.fill(0);

  // Count occurrences
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
    yield { access: [i] };
  }

  // Compute prefix sums
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
    yield { access: [i] };
  }

  // Build output array (stable)
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[--count[digit]] = arr[i];
    yield {
      access: [i],
    };
  }

  // Copy back
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
    yield { access: [i], swap: true };
  }
}

export function* radixLSD(arr: number[]): SortGenerator {
  const len = arr.length;
  if (len <= 1) {
    yield { access: [] };
    return;
  }

  const m = yield* getMax(arr, len);
  const count = new Array(10);
  const output = new Array(len);

  for (let exp = 1; Math.floor(m / exp) > 0; exp *= 10) {
    yield* countSort(arr, len, exp, count, output);
  }
}
