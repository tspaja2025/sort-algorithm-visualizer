import type { SortGenerator } from "@/lib/types";

// Insertion sort for small subarrays
function* insertionSort(arr: number[], l: number, r: number): SortGenerator {
  for (let i = l + 1; i <= r; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= l) {
      yield { access: [j, i] };
      if (arr[j] > key) {
        arr[j + 1] = arr[j];
        yield { access: [j + 1], value: arr[j] };
        j--;
      } else {
        break;
      }
    }
    arr[j + 1] = key;
    yield { access: [j + 1], value: key };
  }
}

// Merge two sorted halves
function* mergeSort(
  arr: number[],
  temp: number[],
  l: number,
  m: number,
  r: number,
): SortGenerator {
  let i = l;
  let j = m + 1;
  let k = l;

  while (i <= m && j <= r) {
    yield { access: [i, j] };
    if (arr[i] <= arr[j]) {
      temp[k] = arr[i];
      yield { access: [k], value: arr[i] };
      i++;
    } else {
      temp[k] = arr[j];
      yield { access: [k], value: arr[j] };
      j++;
    }
    k++;
  }

  while (i <= m) {
    temp[k] = arr[i];
    yield { access: [k], value: arr[i] };
    i++;
    k++;
  }

  while (j <= r) {
    temp[k] = arr[j];
    yield { access: [k], value: arr[j] };
    j++;
    k++;
  }

  for (let t = l; t <= r; t++) {
    arr[t] = temp[t];
    yield { access: [t], value: temp[t] };
  }
}

// Recursive merge sort with insertion sort fallback
function* mergeSortStart(
  arr: number[],
  temp: number[],
  l: number,
  r: number,
): SortGenerator {
  // Use insertion sort for small subarrays
  if (r - l <= 16) {
    yield* insertionSort(arr, l, r);
    return;
  }

  if (l < r) {
    const m = l + Math.floor((r - l) / 2);
    yield* mergeSortStart(arr, temp, l, m);
    yield* mergeSortStart(arr, temp, m + 1, r);
    yield* mergeSort(arr, temp, l, m, r);
  }
}

export function* merge(arr: number[]): SortGenerator {
  const temp = new Array(arr.length);
  yield* mergeSortStart(arr, temp, 0, arr.length - 1);
}
