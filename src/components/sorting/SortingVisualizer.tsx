'use client';

import { AlgorithmSelector } from '@/components/sorting/AlgorithmSelector';
import { BarsRender } from '@/components/sorting/BarsRender';
import { ControlButtons } from '@/components/sorting/ControlButtons';
import { RangeArraySize } from '@/components/sorting/RangeArraySize';
import { RangeDelay } from '@/components/sorting/RangeDelay';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { algorithms } from '@/lib/sort-algorithms/index';
import type { Algorithm, SortElement } from '@/lib/types';
import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSortingAnimation } from '@/lib/useSortingAnimation';
import { DarkMode } from '@/components/darkMode';
import { SortTimer } from '@/components/sorting/SortTimer';

export default function SortingVisualizer() {
  const [size, setSize] = useState(300);
  const [delay, setDelay] = useState(2);
  const [bars, setBars] = useState<SortElement[]>([]);
  const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    arrayToSort,
    running,
    setRunning,
    regenerateArray: storeRegenerateArray,
    sortTime,
    setSortTime,
    resetSortTime,
  } = useStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Timer logic
  useEffect(() => {
    if (running) {
      // Start timer
      resetSortTime();
      startTimeRef.current = Date.now();

      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setSortTime(Date.now() - startTimeRef.current);
        }
      }, 10); // Update every 10ms for smooth display
    } else {
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (startTimeRef.current) {
        setSortTime(Date.now() - startTimeRef.current);
        startTimeRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [running, setSortTime, resetSortTime]);

  // Reset timer when algorithm changes or array is reset
  useEffect(() => {
    resetSortTime();
  }, [algorithm, arrayToSort, resetSortTime]);

  // Memoize updateBars to prevent infinite re-renders
  const updateBars = useCallback((b: number[], p: { access: number[] }) => {
    setBars(
      [...b].map((v, i) => ({
        value: v,
        access: p.access.includes(i),
      }))
    );
  }, []); // Empty dependency array since it doesn't depend on any state

  // Memoize reset function
  const reset = useCallback(() => {
    setRunning(false);
    if (algorithm) {
      setAlgorithm({ ...algorithm, instance: algorithm.function(arrayToSort) });
    }
    setBars(arrayToSort.map((v) => ({ value: v, access: false })));
  }, [algorithm, arrayToSort, setRunning]);

  // Memoize step function
  const step = useCallback(async () => {
    if (running) {
      setRunning(false);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    if (!algorithm?.instance) return;

    const next = algorithm.instance.next();
    if (!next.done && next.value) {
      updateBars(arrayToSort, next.value);
    }
  }, [running, algorithm, arrayToSort, updateBars, setRunning]);

  // Memoize selectAlgorithm
  const selectAlgorithm = useCallback(
    (algo: Algorithm, updateUrl = true) => {
      setRunning(false);
      setAlgorithm({ ...algo, instance: algo.function(arrayToSort) });
      setBars(arrayToSort.map((v) => ({ value: v, access: false })));

      if (updateUrl) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('algorithm', algo.name.toLowerCase().replace(/ /g, '-'));
        router.replace(`?${params.toString()}`, { scroll: false });
      }
    },
    [arrayToSort, setRunning, searchParams, router]
  );

  // Initial setup effect - runs only once
  useEffect(() => {
    const barsContainer = document.getElementById('bars-container');
    if (barsContainer) {
      barsContainer.style.height = `${barsContainer.offsetHeight}px`;
    }

    const selectedAlgorithm = searchParams.get('algorithm');

    if (!selectedAlgorithm) {
      selectAlgorithm(algorithms[0][0], false);
    } else {
      const algo = algorithms
        .flat()
        .find(
          (a) => a.name.toLowerCase().replace(/ /g, '-') === selectedAlgorithm
        );

      if (algo) {
        selectAlgorithm(algo, false);
      }
    }
  }, [searchParams, selectAlgorithm]);

  // Effect for size changes
  useEffect(() => {
    if (size !== arrayToSort.length) {
      storeRegenerateArray(size);
      if (algorithm) {
        setAlgorithm({
          ...algorithm,
          instance: algorithm.function(arrayToSort),
        });
      }
    }
  }, [size, arrayToSort.length, storeRegenerateArray, algorithm, arrayToSort]);

  // Main animation effect - fixed dependencies
  useSortingAnimation(
    running,
    algorithm,
    delay,
    arrayToSort,
    updateBars,
    setRunning
  );

  // Memoize the array size component to prevent unnecessary re-renders
  const arraySizeComponent = useMemo(() => {
    return algorithm?.arraySizeComponent ? (
      <algorithm.arraySizeComponent size={size} setSizeAction={setSize} />
    ) : (
      <RangeArraySize size={size} setSizeAction={setSize} />
    );
  }, [algorithm, size]);

  return (
    <div className="grid h-screen gap-2 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Algorithm Visualizer</CardTitle>
          <CardDescription>
            <SortTimer time={sortTime} />
          </CardDescription>
          <CardAction className="flex items-center gap-2">
            <DarkMode />
            <AlgorithmSelector
              selectAlgorithmAction={selectAlgorithm}
              selectedAlgorithm={algorithm}
            />
          </CardAction>
        </CardHeader>
        <CardContent id="bars-container" className="flex min-h-80 flex-grow">
          <BarsRender bars={bars} />
        </CardContent>
        <CardFooter className="gap-2">
          <div className="flex-1">
            <ControlButtons resetAction={reset} size={size} stepAction={step} />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            {arraySizeComponent}
            <RangeDelay delay={delay} setDelayAction={setDelay} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
