import type { SortGenerator } from "@/lib/types";

export function* gnome(arr: number[]): SortGenerator {
	const n = arr.length;
	if (n <= 1) return;

	let pos = 0;
	let lastUnsorted = n;

	while (pos < lastUnsorted) {
		if (pos === 0 || arr[pos] >= arr[pos - 1]) {
			yield { access: [pos], comparison: pos > 0 ? [pos, pos - 1] : undefined };
			pos++;
		} else {
			yield { access: [pos, pos - 1], comparison: [pos, pos - 1], swap: true };
			[arr[pos], arr[pos - 1]] = [arr[pos - 1], arr[pos]];

			// If we swap at the end, we can reduce the search range
			if (pos === lastUnsorted - 1) {
				lastUnsorted--;
			}

			pos = Math.max(0, pos - 1);
		}
	}
}
