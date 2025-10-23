import { useEffect, useRef } from "react";

export function useSortTimer(
  running: boolean,
  setSortTime: (n: number) => void,
  resetSortTime: () => void,
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      resetSortTime();
      startRef.current = Date.now();
      timerRef.current = setInterval(() => {
        if (startRef.current) setSortTime(Date.now() - startRef.current);
      }, 10);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, setSortTime, resetSortTime]);
}
