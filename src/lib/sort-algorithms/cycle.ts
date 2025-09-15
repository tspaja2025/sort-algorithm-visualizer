import type { SortGenerator } from '@/lib/types';

export function* cycle(arr: number[]): SortGenerator {
  const n = arr.length;

  for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
    // Store the current item once
    const currentItem = arr[cycleStart];
    let pos = cycleStart;

    // Single pass to count smaller elements
    for (let i = cycleStart + 1; i < n; i++) {
      yield { access: [i], comparison: [i] };
      if (arr[i] < currentItem) {
        pos++;
      }
    }

    // Skip if already in position
    if (pos === cycleStart) {
      continue;
    }

    // Skip duplicates efficiently
    while (pos < n && currentItem === arr[pos]) {
      pos++;
    }

    if (pos > cycleStart && pos < n) {
      // Rotate items in the cycle
      let item = currentItem;
      let currentPos = pos;

      do {
        // Store next item before overwriting
        const nextItem = arr[currentPos];
        arr[currentPos] = item;
        yield { access: [currentPos], swap: true };

        item = nextItem;
        currentPos = cycleStart;

        // Find new position for the current item
        for (let i = cycleStart + 1; i < n; i++) {
          yield { access: [i], comparison: [i] };
          if (arr[i] < item) {
            currentPos++;
          }
        }

        // Skip duplicates
        while (currentPos < n && item === arr[currentPos]) {
          currentPos++;
        }
      } while (currentPos !== pos);

      // Place the last item
      arr[pos] = item;
      yield { access: [pos], swap: true };
    }
  }
}
