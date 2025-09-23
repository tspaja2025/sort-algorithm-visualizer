"use client";

import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export function ControlButtons({
	size,
	stepAction,
	resetAction,
}: {
	size: number;
	stepAction: () => void;
	resetAction: () => void;
}) {
	const { arrayToSort, running, setRunning, setArrayToSort, regenerateArray } =
		useStore();

	const start = () => {
		setRunning(!running);
	};

	const reverse = () => {
		const newArray = [...arrayToSort].reverse();
		setArrayToSort(newArray);
		resetAction();
	};

	const shuffleClick = () => {
		regenerateArray(size);
		resetAction();
	};

	const oddsEvens = () => {
		const sorted = [...arrayToSort].sort((a, b) => a - b);
		return sorted.reduce<[number[], number[]]>(
			([odds, evens], v) => {
				v % 2 === 0 ? evens.push(v) : odds.push(v);
				return [odds, evens];
			},
			[[], []],
		);
	};

	const valley = () => {
		const [odds, evens] = oddsEvens();
		const newArray = [...odds.reverse(), ...evens];
		setArrayToSort(newArray);
		resetAction();
	};

	const mountain = () => {
		const [odds, evens] = oddsEvens();
		const newArray = [...odds, ...evens.reverse()];
		setArrayToSort(newArray);
		resetAction();
	};

	return (
		<div className="grid grid-cols-3 gap-2">
			<Button variant={running ? "secondary" : "default"} onClick={start}>
				{running ? "Stop" : "Start"}
			</Button>
			<Button onClick={stepAction}>Step</Button>
			<Button onClick={shuffleClick}>Shuffle</Button>
			<Button onClick={reverse}>Reverse</Button>
			<Button onClick={valley}>Valley</Button>
			<Button onClick={mountain}>Mountain</Button>
		</div>
	);
}
