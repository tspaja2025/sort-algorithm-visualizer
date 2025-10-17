import type { SortGenerator } from "@/lib/types";

const MAX_ATTEMPTS = 20000;

function* isSorted(
  arr: number[],
): Generator<{ access: number[]; comparison: number[] }, boolean> {
  for (let i = 1; i < arr.length; i++) {
    yield { access: [i - 1, i], comparison: [i - 1, i] };
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

function* fisherYatesShuffle(arr: number[]): Generator<{ access: number[] }> {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    yield { access: [i, j] };
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export function* bogo(arr: number[]): SortGenerator {
  if (arr.length <= 1) return;

  let attempts = 0;
  let sorted = yield* isSorted(arr);

  yield { access: [], stats: { attempts, sorted } };

  while (!sorted && attempts < MAX_ATTEMPTS) {
    attempts++;
    yield* fisherYatesShuffle(arr);
    sorted = yield* isSorted(arr);
    yield { access: [], stats: { attempts, sorted } };
  }

  if (attempts >= MAX_ATTEMPTS) {
    yield { access: [], warning: `Maximum attempts (${MAX_ATTEMPTS}) reached` };
  } else {
    yield { access: [], message: `Sorted in ${attempts} attempts!` };
  }
}
