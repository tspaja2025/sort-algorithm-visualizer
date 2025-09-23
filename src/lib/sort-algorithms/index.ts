import { RangeArraySizePowerOfTwo } from "@/components/sorting/RangeArraySizePowerOfTwo";
import { bitonic } from "@/lib/sort-algorithms/bitonic";
import { bogo } from "@/lib/sort-algorithms/bogo";
import { bubble } from "@/lib/sort-algorithms/bubble";
import { cocktail } from "@/lib/sort-algorithms/cocktail";
import { cycle } from "@/lib/sort-algorithms/cycle";
import { exchange } from "@/lib/sort-algorithms/exchange";
import { gnome } from "@/lib/sort-algorithms/gnome";
import { heap } from "@/lib/sort-algorithms/heap";
import { insertion } from "@/lib/sort-algorithms/insertion";
import { merge } from "@/lib/sort-algorithms/merge";
import { oddEven } from "@/lib/sort-algorithms/odd-even";
import { pancake } from "@/lib/sort-algorithms/pancake";
import { quick } from "@/lib/sort-algorithms/quick";
import { radixLSD } from "@/lib/sort-algorithms/radix-lsd";
import { radixMSD } from "@/lib/sort-algorithms/radix-msd";
import { selection } from "@/lib/sort-algorithms/selection";
import { shell } from "@/lib/sort-algorithms/shell";
import { stooge } from "@/lib/sort-algorithms/stooge";
import { tim } from "@/lib/sort-algorithms/tim";
import type { Algorithm } from "@/lib/types";

export const algorithms: Algorithm[][] = [
	[
		{
			name: "Bubble Sort",
			function: bubble,
		},
		{
			name: "Quick Sort",
			function: quick,
		},
		{
			name: "Shell Sort",
			function: shell,
		},
		{
			name: "Merge Sort",
			function: merge,
		},
		{
			name: "Insertion Sort",
			function: insertion,
		},
		{
			name: "Selection Sort",
			function: selection,
		},
		{
			name: "Radix LSD Sort",
			function: radixLSD,
		},
		{
			name: "Radix MSD Sort",
			function: radixMSD,
		},
		{
			name: "Heap Sort",
			function: heap,
		},
		{
			name: "Bitonic Sort",
			function: bitonic,
			arraySizeComponent: RangeArraySizePowerOfTwo,
		},
		{
			name: "Tim Sort",
			function: tim,
		},
		{
			name: "Gnome Sort",
			function: gnome,
		},
		{
			name: "Cycle Sort",
			function: cycle,
		},
		{
			name: "Cocktail Sort",
			function: cocktail,
		},
		{
			name: "Pancake Sort",
			function: pancake,
		},
	],
	[
		{
			name: "Stooge Sort",
			function: stooge,
		},
		{
			name: "Bogo Sort",
			function: bogo,
		},
		{
			name: "Exchange Sort",
			function: exchange,
		},
		{
			name: "Odd Even Sort",
			function: oddEven,
		},
	],
];
