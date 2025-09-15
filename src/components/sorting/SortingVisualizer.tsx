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
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { algorithms } from '@/lib/sort-algorithms/index';
import type { Algorithm, SortElement } from '@/lib/types';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SortingVisualizer() {
    const [size, setSize] = useState(300);
    const [delay, setDelay] = useState(2);
    const [bars, setBars] = useState<SortElement[]>([]);
    const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const {
        arrayToSort,
        running,
        setRunning,
        regenerateArray: storeRegenerateArray,
    } = useStore();

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
        updateBars(arrayToSort, { access: [] });
        setRunning(false);
        if (algorithm) {
            algorithm.instance = algorithm.function(arrayToSort);
        }
    }, [algorithm, arrayToSort, updateBars, setRunning]);

    // Memoize regenerateArray
    const regenerateArray = useCallback(() => {
        storeRegenerateArray(size);
        reset();
    }, [size, storeRegenerateArray, reset]);

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
            reset();
            setAlgorithm({ ...algo, instance: algo.function(arrayToSort) });

            if (updateUrl) {
                const params = new URLSearchParams(searchParams.toString());
                params.set('algorithm', algo.name.toLowerCase().replace(/ /g, '-'));
                router.replace(`?${params.toString()}`, { scroll: false });
            }
        },
        [arrayToSort, reset, searchParams, router]
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
            regenerateArray();
        }
    }, [size, arrayToSort.length, regenerateArray]);

    // Main animation effect - fixed dependencies
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
                        reset();
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
    }, [running, algorithm, delay, reset, updateBars, arrayToSort]);

    // Memoize the array size component to prevent unnecessary re-renders
    const arraySizeComponent = useMemo(() => {
        return algorithm?.arraySizeComponent ? (
            <algorithm.arraySizeComponent
                size={size}
                setSizeAction={setSize}
            />
        ) : (
            <RangeArraySize size={size} setSizeAction={setSize} />
        );
    }, [algorithm, size]);

    return (
        <div className="grid h-screen grid-rows-[auto_1fr_auto] gap-2 p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Algorithm Visualizer</CardTitle>
                    <CardAction>
                        <AlgorithmSelector
                            selectAlgorithmAction={selectAlgorithm}
                            selectedAlgorithm={algorithm}
                        />
                    </CardAction>
                </CardHeader>
            </Card>

            <Card>
                <CardContent id="bars-container" className="flex min-h-80 flex-grow">
                    <BarsRender bars={bars} />
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex gap-2">
                    <div className="flex-1">
                        <ControlButtons resetAction={reset} size={size} stepAction={step} />
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                        {arraySizeComponent}
                        <RangeDelay delay={delay} setDelayAction={setDelay} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}