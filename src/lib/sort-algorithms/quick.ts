import type { SortGenerator } from "@/lib/types";

const INSERTION_THRESHOLD = 16;

// Median-of-three pivot selection
function getPivot(items: number[], left: number, right: number): number {
	const mid = Math.floor((left + right) / 2);

	// Sort the three values and return the median
	if (items[left] > items[mid]) {
		[items[left], items[mid]] = [items[mid], items[left]];
	}
	if (items[left] > items[right]) {
		[items[left], items[right]] = [items[right], items[left]];
	}
	if (items[mid] > items[right]) {
		[items[mid], items[right]] = [items[right], items[mid]];
	}

	return items[mid];
}

function* insertionSortRange(
	items: number[],
	left: number,
	right: number,
): SortGenerator {
	for (let i = left + 1; i <= right; i++) {
		const key = items[i];
		let j = i - 1;

		while (j >= left) {
			yield { access: [j, i] };
			if (items[j] <= key) break;
			items[j + 1] = items[j];
			j--;
		}
		items[j + 1] = key;
		yield { access: [j + 1] };
	}
}

function* partition(
	items: number[],
	left: number,
	right: number,
): Generator<{ access: number[] }, number> {
	const pivot = getPivot(items, left, right);
	let i = left - 1;
	let j = right + 1;

	while (true) {
		do {
			i++;
			yield { access: [i] };
		} while (items[i] < pivot);

		do {
			j--;
			yield { access: [j] };
		} while (items[j] > pivot);

		if (i >= j) {
			return j;
		}

		[items[i], items[j]] = [items[j], items[i]];
		yield { access: [i, j] };
	}
}

function* qc(items: number[], left: number, right: number): SortGenerator {
	// Use iterative approach with manual stack to avoid recursion limits
	const stack: number[] = [];
	stack.push(left);
	stack.push(right);

	while (stack.length > 0) {
		const high = stack.pop()!;
		const low = stack.pop()!;

		if (high - low <= INSERTION_THRESHOLD) {
			yield* insertionSortRange(items, low, high);
			continue;
		}

		const pivotIndex = yield* partition(items, low, high);

		// Push the larger partition first to limit stack size
		if (pivotIndex - low > high - pivotIndex - 1) {
			if (low < pivotIndex) {
				stack.push(low);
				stack.push(pivotIndex);
			}
			if (pivotIndex + 1 < high) {
				stack.push(pivotIndex + 1);
				stack.push(high);
			}
		} else {
			if (pivotIndex + 1 < high) {
				stack.push(pivotIndex + 1);
				stack.push(high);
			}
			if (low < pivotIndex) {
				stack.push(low);
				stack.push(pivotIndex);
			}
		}
	}
}

export function* quick(arr: number[]): SortGenerator {
	if (arr.length <= 1) return;

	// Shuffle the array to avoid worst-case scenarios
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
		yield { access: [i, j] };
	}

	yield* qc(arr, 0, arr.length - 1);
}
