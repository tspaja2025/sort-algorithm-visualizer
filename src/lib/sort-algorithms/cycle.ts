import type { SortGenerator } from "@/lib/types";

export function* cycle(arr: number[]): SortGenerator {
	const n = arr.length;

	// Early return for empty or single-element arrays
	if (n <= 1) return;

	for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
		let item = arr[cycleStart];

		// Find where to put the item
		let pos = cycleStart;
		for (let i = cycleStart + 1; i < n; i++) {
			yield { access: [i], comparison: [i] };
			if (arr[i] < item) {
				pos++;
			}
		}

		// If the item is already in the right place, continue
		if (pos === cycleStart) {
			continue;
		}

		// Skip duplicates
		while (pos < n && item === arr[pos]) {
			pos++;
		}

		// Put the item in its correct position
		if (pos !== cycleStart) {
			[arr[pos], item] = [item, arr[pos]];
			yield { access: [pos], swap: true };
		}

		// Rotate the rest of the cycle
		while (pos !== cycleStart) {
			pos = cycleStart;

			// Find where to put the current item
			for (let i = cycleStart + 1; i < n; i++) {
				yield { access: [i], comparison: [i] };
				if (arr[i] < item) {
					pos++;
				}
			}

			// Skip duplicates
			while (pos < n && item === arr[pos]) {
				pos++;
			}

			// Put the item in its correct position if it's not already there
			if (item !== arr[pos]) {
				[arr[pos], item] = [item, arr[pos]];
				yield { access: [pos], swap: true };
			}
		}
	}
}
