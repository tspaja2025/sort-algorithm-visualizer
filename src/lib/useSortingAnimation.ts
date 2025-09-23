import { useEffect, useRef } from "react";
import type { Algorithm } from "@/lib/types";

export function useSortingAnimation(
	running: boolean,
	algorithm: Algorithm | null,
	delay: number,
	arrayToSort: number[],
	updateBars: (b: number[], p: { access: number[] }) => void,
	setRunning: (running: boolean) => void,
) {
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (intervalRef.current !== null) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		if (running && algorithm?.instance) {
			intervalRef.current = setInterval(() => {
				const steps = delay < 2 ? 100 - ((delay * 10 - 1) * 98) / 18 : 1;
				for (let i = 0; i < steps; i++) {
					const next = algorithm.instance!.next();
					if (next.done) {
						if (intervalRef.current) {
							clearInterval(intervalRef.current);
							intervalRef.current = null;
						}
						setRunning(false);
						break;
					}
					if (next.value) {
						updateBars(arrayToSort, next.value);
					}
				}
			}, delay);
		}

		return () => {
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [running, algorithm, delay, setRunning, updateBars, arrayToSort]);

	return intervalRef;
}
