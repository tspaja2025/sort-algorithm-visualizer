import type { SortGenerator } from '@/lib/types';

const MIN_MERGE = 32;
const MIN_GALLOP = 7;

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
  end: number
): SortGenerator {
  for (let i = start + 1; i <= end; i++) {
    const temp = arr[i];
    let left = start;
    let right = i - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      yield { access: [i, mid] };
      if (arr[mid] <= temp) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    for (let j = i; j > left; j--) {
      arr[j] = arr[j - 1];
      yield { access: [j, j - 1] };
    }
    arr[left] = temp;
    yield { access: [left] };
  }
}

function* countRunAndMakeAscending(arr: number[], start: number, n: number) {
  if (start >= n - 1) return start;

  let runEnd = start + 1;
  yield { access: [start, runEnd] };

  if (arr[start] > arr[runEnd]) {
    // Descending run
    while (runEnd < n - 1 && arr[runEnd] > arr[runEnd + 1]) {
      yield { access: [runEnd, runEnd + 1] };
      runEnd++;
    }
    // Reverse the run
    let left = start;
    let right = runEnd;
    while (left < right) {
      yield { access: [left, right] };
      [arr[left], arr[right]] = [arr[right], arr[left]];
      left++;
      right--;
    }
  } else {
    // Ascending run
    while (runEnd < n - 1 && arr[runEnd] <= arr[runEnd + 1]) {
      yield { access: [runEnd, runEnd + 1] };
      runEnd++;
    }
  }

  return runEnd;
}

function* merge(
  arr: number[],
  start: number,
  mid: number,
  end: number
): SortGenerator {
  const len1 = mid - start + 1;
  const len2 = end - mid;
  const left = new Array(len1);
  const right = new Array(len2);

  for (let i = 0; i < len1; i++) {
    left[i] = arr[start + i];
    yield { access: [start + i] };
  }
  for (let j = 0; j < len2; j++) {
    right[j] = arr[mid + 1 + j];
    yield { access: [mid + 1 + j] };
  }

  let i = 0,
    j = 0,
    k = start;

  while (i < len1 && j < len2) {
    yield { access: [k] };
    if (left[i] <= right[j]) {
      arr[k++] = left[i++];
    } else {
      arr[k++] = right[j++];
    }
  }

  while (i < len1) {
    yield { access: [k] };
    arr[k++] = left[i++];
  }

  while (j < len2) {
    yield { access: [k] };
    arr[k++] = right[j++];
  }
}

function* doMerge(
  arr: number[],
  runStack: Array<[number, number]>,
  i: number,
  j: number
): SortGenerator {
  const [base1, len1] = runStack[i];
  const [base2, len2] = runStack[j];

  yield* merge(arr, base1, base1 + len1 - 1, base1 + len1 + len2 - 1);
  runStack[i] = [base1, len1 + len2];
  runStack.splice(j, 1);
}

function* manageRunStack(
  arr: number[],
  runStack: Array<[number, number]>
): SortGenerator {
  while (runStack.length > 1) {
    const n = runStack.length;
    const [baseY, lenY] = runStack[n - 2];
    const [baseZ, lenZ] = runStack[n - 1];

    if (n > 2) {
      const [baseX, lenX] = runStack[n - 3];
      if (lenX <= lenY + lenZ) {
        if (lenX < lenZ) {
          yield* doMerge(arr, runStack, n - 3, n - 2);
        } else {
          yield* doMerge(arr, runStack, n - 2, n - 1);
        }
        continue;
      }
    }

    if (lenY <= lenZ) {
      yield* doMerge(arr, runStack, n - 2, n - 1);
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
    const runEnd = yield* countRunAndMakeAscending(arr, current, n);
    let runLen = runEnd - current + 1;

    if (runLen < minRun) {
      const forceLen = Math.min(minRun, n - current);
      yield* binaryInsertionSort(arr, current, current + forceLen - 1);
      runLen = forceLen;
    }

    runStack.push([current, runLen]);
    yield* manageRunStack(arr, runStack);
    current += runLen;
  }

  while (runStack.length > 1) {
    yield* doMerge(arr, runStack, runStack.length - 2, runStack.length - 1);
  }
}
