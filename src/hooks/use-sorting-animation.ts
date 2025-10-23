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
  const frameRef = useRef<number | null>(null);
  const algoRef = useRef<Algorithm | null>(null);

  useEffect(() => {
    algoRef.current = algorithm;
  }, [algorithm]);

  useEffect(() => {
    if (!running || !algoRef.current?.instance) return;
    const algo = algoRef.current;

    const step = () => {
      const steps = delay < 2 ? 100 - ((delay * 10 - 1) * 98) / 18 : 1;
      for (let i = 0; i < steps; i++) {
        const next = algo!.instance!.next();
        if (next.done) {
          setRunning(false);
          return;
        }
        if (next.value) updateBars(arrayToSort, next.value);
      }
      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current!);
  }, [running, delay, arrayToSort, updateBars, setRunning]);
}
