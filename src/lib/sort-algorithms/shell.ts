import type { SortGenerator } from "@/lib/types";

export function* shell(arr: number[]): SortGenerator {
	const n = arr.length;

	for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
		for (let i = gap; i < n; i++) {
			const temp = arr[i];
			let j;
			for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
				arr[j] = arr[j - gap];

				yield { access: [i, j - gap] };
			}

			arr[j] = temp;

			yield { access: [i, j] };
		}
	}
}
