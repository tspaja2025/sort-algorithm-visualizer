import type { SortGenerator } from '@/lib/types';

// export function* cocktail(a: number[]): SortGenerator {
//   let swapped = true;
//   let start = 0;
//   let end = a.length;

//   while (swapped == true) {
//     swapped = false;

//     for (let i = start; i < end - 1; ++i) {
//       yield { access: [i, i + 1] };
//       if (a[i] > a[i + 1]) {
//         const temp = a[i];
//         a[i] = a[i + 1];
//         a[i + 1] = temp;
//         swapped = true;
//       }
//     }

//     if (swapped == false) break;

//     swapped = false;
//     end = end - 1;

//     for (let i = end - 1; i >= start; i--) {
//       yield { access: [i, i + 1] };
//       if (a[i] > a[i + 1]) {
//         const temp = a[i];
//         a[i] = a[i + 1];
//         a[i + 1] = temp;
//         swapped = true;
//       }
//     }

//     start = start + 1;
//   }
// }

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
