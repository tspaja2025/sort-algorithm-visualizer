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
  const algoRef = useRef<Algorithm | null>(null);

  // Keep latest algorithm instance in a ref so interval always sees it
  useEffect(() => {
    algoRef.current = algorithm;
  }, [algorithm]);

  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!running || !algoRef.current?.instance) return;

    intervalRef.current = setInterval(() => {
      const algo = algoRef.current;
      if (!algo?.instance) return;

      const steps = delay < 2 ? 100 - ((delay * 10 - 1) * 98) / 18 : 1;

      for (let i = 0; i < steps; i++) {
        const next = algo.instance.next();
        if (next.done) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setRunning(false);
          return;
        }
        if (next.value) updateBars(arrayToSort, next.value);
      }
    }, delay);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, delay, arrayToSort, updateBars, setRunning]);

  return intervalRef;
}
