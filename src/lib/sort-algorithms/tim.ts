import type { ProgressIndicator, SortGenerator } from "@/lib/types";

const MIN_MERGE = 32;

function minRunLength(n: number): number {
  let r = 0;
  while (n >= MIN_MERGE) {
    r |= n & 1;
    n >>= 1;
  }
  return n + r;
}

function* binaryInsertionSort(
  arr: number[],
  start: number,
  end: number,
): SortGenerator {
  for (let i = start + 1; i <= end; i++) {
    const key = arr[i];
    let j = i - 1;

    // Find insertion point using binary search
    let left = start;
    let right = i - 1;
    while (left <= right) {
      const mid = (left + right) >> 1;
      yield { access: [i, mid], comparison: [i, mid] };
      if (arr[mid] <= key) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    // Shift elements and insert
    const insertPos = left;
    for (j = i; j > insertPos; j--) {
      arr[j] = arr[j - 1];
      yield { access: [j, j - 1], swap: true };
    }
    arr[insertPos] = key;
    yield { access: [insertPos] };
  }
}

function* countRunAndMakeAscending(
  arr: number[],
  start: number,
  end: number,
): Generator<ProgressIndicator, number> {
  if (start >= end) return start;

  let runEnd = start;

  // Handle descending runs
  if (arr[start] > arr[start + 1]) {
    // Descending run
    while (runEnd < end && arr[runEnd] > arr[runEnd + 1]) {
      yield { access: [runEnd + 1], comparison: [runEnd, runEnd + 1] };
      runEnd++;
    }
    // Reverse the run in place
    let left = start;
    let right = runEnd;
    while (left < right) {
      [arr[left], arr[right]] = [arr[right], arr[left]];
      yield { access: [left, right], swap: true };
      left++;
      right--;
    }
  } else {
    // Ascending run
    while (runEnd < end && arr[runEnd] <= arr[runEnd + 1]) {
      yield { access: [runEnd, runEnd + 1], comparison: [runEnd, runEnd + 1] };
      runEnd++;
    }
  }

  return runEnd;
}

function* merge(
  arr: number[],
  start: number,
  mid: number,
  end: number,
): SortGenerator {
  const left = arr.slice(start, mid + 1);
  const right = arr.slice(mid + 1, end + 1);

  // Yield initial array copies for visualizatino
  for (let i = start; i <= end; i++) {
    yield { access: [i] };
  }

  let i = 0,
    j = 0,
    k = start;

  while (i < left.length && j < right.length) {
    yield { access: [k], comparison: [start + i, mid + 1 + j] };

    if (left[i] <= right[j]) {
      arr[k] = left[i++];
    } else {
      arr[k] = right[j++];
    }
    k++;
  }

  // Copy remaining elements
  while (i < left.length) {
    arr[k++] = left[i++];
    yield { access: [k - 1] };
  }

  while (j < right.length) {
    arr[k++] = right[j++];
    yield { access: [k - 1] };
  }
}

function* mergeRuns(
  arr: number[],
  runStack: Array<[number, number]>,
  i: number,
): SortGenerator {
  const [base1, len1] = runStack[i];
  const [base2, len2] = runStack[i + 1];
  const end = base1 + len1 + len2 - 1;

  yield* merge(arr, base1, base1 + len1 - 1, end);
  runStack[i] = [base1, len1 + len2];
  runStack.splice(i + 1, 1);
}

function* mergeCollapse(
  arr: number[],
  runStack: Array<[number, number]>,
): SortGenerator {
  while (runStack.length > 1) {
    const n = runStack.length;

    // Check sorting merge conditions
    if (
      n >= 3 &&
      runStack[n - 3][1] <= runStack[n - 2][1] + runStack[n - 1][1]
    ) {
      if (runStack[n - 3][1] < runStack[n - 1][1]) {
        yield* mergeRuns(arr, runStack, n - 3);
      } else {
        yield* mergeRuns(arr, runStack, n - 2);
      }
    } else if (runStack[n - 2][1] <= runStack[n - 1][1]) {
      yield* mergeRuns(arr, runStack, n - 2);
    } else {
      break;
    }
  }
}

export function* tim(arr: number[]): SortGenerator {
  const n = arr.length;
  if (n < 2) return;

  const minRun = minRunLength(n);
  const runStack: Array<[number, number]> = [];
  let current = 0;

  while (current < n) {
    const runEnd = yield* countRunAndMakeAscending(arr, current, n - 1);
    let runLength = runEnd - current + 1;

    // Extend short runs with binary insertion sort
    if (runLength < minRun) {
      const targetLength = Math.min(minRun, n - current);
      yield* binaryInsertionSort(arr, current, current + targetLength - 1);
      runLength = targetLength;
    }

    runStack.push([current, runLength]);
    yield* mergeCollapse(arr, runStack);

    current += runLength;
  }

  // Merge all remaining runs
  while (runStack.length > 1) {
    yield* mergeRuns(arr, runStack, runStack.length - 2);
  }
}
