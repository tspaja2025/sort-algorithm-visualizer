"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { AlgorithmSelector } from "@/components/sorting/AlgorithmSelector";
import { BarsRender } from "@/components/sorting/BarsRender";
import { ControlButtons } from "@/components/sorting/ControlButtons";
import { RangeControl } from "@/components/sorting/RangeControl";
import { SortTimer } from "@/components/sorting/SortTimer";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSortTimer } from "@/hooks/use-sort-timer";
import { useSortingAnimation } from "@/hooks/use-sorting-animation";
import { CONFIG } from "@/lib/config";
import { generateArray, slugify } from "@/lib/helpers";
import { algorithms } from "@/lib/sort-algorithms";
import { computeRealDelay } from "@/lib/sort-utils";
import { useStore } from "@/lib/store";
import type { Algorithm, SortElement } from "@/lib/types";

export function SortingVisualizer() {
  const [size, setSize] = useState(300);
  const [delay, setDelay] = useState(2);
  const [bars, setBars] = useState<SortElement[]>([]);
  const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    arrayToSort,
    running,
    sortTime,
    setRunning,
    regenerateArray,
    setSortTime,
    resetSortTime,
  } = useStore();

  const algorithmMap = useMemo(
    () => new Map(algorithms.flat().map((a) => [slugify(a.name), a])),
    [],
  );

  const updateBars = useCallback(
    (b: number[], p: { access: number[] }) =>
      setBars(b.map((v, i) => ({ value: v, access: p.access.includes(i) }))),
    [],
  );

  const reset = useCallback(() => {
    setRunning(false);
    if (algorithm)
      setAlgorithm({ ...algorithm, instance: algorithm.function(arrayToSort) });
    setBars(arrayToSort.map((v) => ({ value: v, access: false })));
  }, [algorithm, arrayToSort, setRunning]);

  const step = useCallback(async () => {
    if (!algorithm?.instance) return;
    setRunning(false);
    await new Promise((r) => setTimeout(r, 50));
    const next = algorithm.instance.next();
    if (!next.done && next.value) updateBars(arrayToSort, next.value);
  }, [algorithm, arrayToSort, updateBars, setRunning]);

  useSortTimer(running, setSortTime, resetSortTime);

  const selectAlgorithm = useCallback(
    (algo: Algorithm, updateUrl = true) => {
      setRunning(false);
      requestAnimationFrame(() => {
        setAlgorithm({ ...algo, instance: algo.function(arrayToSort) });
        setBars(arrayToSort.map((v) => ({ value: v, access: false })));
        if (updateUrl) {
          const params = new URLSearchParams(searchParams);
          params.set("algorithm", slugify(algo.name));
          router.replace(`?${params}`, { scroll: false });
        }
      });
    },
    [arrayToSort, router, searchParams, setRunning],
  );

  useEffect(() => {
    const selected = searchParams.get("algorithm");
    const algo = selected ? algorithmMap.get(selected) : algorithms[0][0];
    if (algo) selectAlgorithm(algo, false);
  }, [searchParams, algorithmMap, selectAlgorithm]);

  useEffect(() => {
    if (size !== arrayToSort.length) {
      regenerateArray(size);
      if (algorithm)
        setAlgorithm({
          ...algorithm,
          instance: algorithm.function(generateArray(size)),
        });
    }
  }, [size, arrayToSort.length, regenerateArray, algorithm]);

  useSortingAnimation(
    running,
    algorithm,
    delay,
    arrayToSort,
    updateBars,
    setRunning,
  );

  const arraySizeComponent = algorithm?.arraySizeComponent ? (
    <algorithm.arraySizeComponent size={size} setSizeAction={setSize} />
  ) : (
    <RangeControl
      label="Array size"
      value={size}
      onChange={setSize}
      min={CONFIG.limits.minSize}
      max={CONFIG.limits.maxSize}
      disabled={running}
      displayValue={`${size} bars`}
    />
  );

  return (
    <div className="font-sans grid h-screen gap-2 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Algorithm Visualizer</CardTitle>
          <CardDescription>
            <SortTimer time={sortTime} />
          </CardDescription>
          <CardAction className="flex items-center gap-2">
            <DarkModeToggle />
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
            <RangeControl
              label="Delay"
              value={delay}
              onChange={setDelay}
              min={CONFIG.limits.minDelay}
              max={CONFIG.limits.maxDelay}
              step={1}
              displayValue={`${computeRealDelay(delay)} ms`}
            />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
