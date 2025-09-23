import type { SortGenerator } from "@/lib/types";

function* flip(arr: number[], i: number) {
	let temp,
		start = 0;
	while (start < i) {
		yield { access: [start, i], sound: i };

		temp = arr[start];
		arr[start] = arr[i];
		arr[i] = temp;
		start++;
		i--;
	}
}

function* findMax(arr: number[], n: number) {
	let mi, i;
	for (mi = 0, i = 0; i < n; ++i) {
		yield { access: [i, mi], sound: i };

		if (arr[i] > arr[mi]) {
			mi = i;
		}
	}

	return mi;
}

export function* pancake(arr: number[]): SortGenerator {
	const n = arr.length;

	for (let curr_size = n; curr_size > 1; --curr_size) {
		const mi = yield* findMax(arr, curr_size);

		if (mi != curr_size - 1) {
			yield* flip(arr, mi);
			yield* flip(arr, curr_size - 1);
		}
	}
}
