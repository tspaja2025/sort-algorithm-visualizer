import type { SortGenerator } from '@/lib/types';

const MIN_MERGE = 32;

function minRunLength(n: number): number {
  let r = 0;
  while (n >= MIN_MERGE) {
    r |= n & 1;
    n >>= 1;
  }
  return n + r;
}

function* insertionSort(
  arr: number[],
  start: number,
  end: number
): SortGenerator {
  for (let i = start + 1; i <= end; i++) {
    const temp = arr[i];
    let j = i - 1;
    while (j >= start && arr[j] > temp) {
      yield { access: [i, j] };
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = temp;
  }
}

function* countRunAndMakeAscending(arr: number[], start: number, n: number) {
  let runEnd = start + 1;
  if (runEnd === n) {
    return start;
  }

  yield { access: [start, runEnd] };
  if (arr[start] <= arr[runEnd]) {
    while (runEnd < n - 1 && arr[runEnd] <= arr[runEnd + 1]) {
      yield { access: [runEnd, runEnd + 1] };
      runEnd++;
    }
  } else {
    while (runEnd < n - 1 && arr[runEnd] > arr[runEnd + 1]) {
      yield { access: [runEnd, runEnd + 1] };
      runEnd++;
    }

    let left = start;
    let right = runEnd;
    while (left < right) {
      yield { access: [left, right] };
      [arr[left], arr[right]] = [arr[right], arr[left]];
      left++;
      right--;
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
  const left = arr.slice(start, mid + 1);
  const right = arr.slice(mid + 1, end + 1);

  let i = 0;
  let j = 0;
  let k = start;

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

export function* tim(arr: number[]): SortGenerator {
  const n = arr.length;
  if (n < 2) {
    return;
  }

  const minRun = minRunLength(n);
  const runStack: Array<[number, number]> = [];

  let current = 0;
  while (current < n) {
    const runEnd = yield* countRunAndMakeAscending(arr, current, n);
    let runLen = runEnd - current + 1;

    if (runLen < minRun) {
      const forceLen = Math.min(minRun, n - current);

      yield* insertionSort(arr, current, current + forceLen - 1);
      runLen = forceLen;
    }

    runStack.push([current, runLen]);

    while (runStack.length > 1) {
      const n = runStack.length;
      const [baseZ, lenZ] = runStack[n - 1];
      const [baseY, lenY] = runStack[n - 2];

      const shouldMerge =
        (n > 2 &&
          runStack[n - 3][1] <= runStack[n - 2][1] + runStack[n - 1][1]) ||
        lenY <= lenZ;

      if (!shouldMerge) break;

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

      yield* doMerge(arr, runStack, n - 2, n - 1);
    }

    current += runLen;
  }

  while (runStack.length > 1) {
    const n = runStack.length;

    yield* doMerge(arr, runStack, n - 2, n - 1);
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

  yield { access: [base1, base2] };
  yield* merge(arr, base1, base1 + len1 - 1, base1 + len1 + len2 - 1);

  runStack[i] = [base1, len1 + len2];
  runStack.splice(j, 1);
}
