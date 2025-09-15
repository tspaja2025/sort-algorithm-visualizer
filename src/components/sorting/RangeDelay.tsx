'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useCallback, useMemo } from 'react';

export function RangeDelay({
  delay,
  setDelayAction,
}: {
  delay: number;
  setDelayAction: (value: number) => void;
}) {
  const delayFactors: { max: number; factor: number; precise?: boolean }[] = [
    { max: 20, factor: 1 / 10, precise: true },
    { max: 30, factor: 1 / 5 },
    { max: 40, factor: 1 / 4 },
    { max: 50, factor: 1 / 3 },
    { max: 60, factor: 1 / 2 },
    { max: 70, factor: 1 },
    { max: 80, factor: 1.5 },
    { max: 90, factor: 3 },
    { max: Infinity, factor: 5 },
  ];

  const getRealDelay = useCallback(
    (sliderValue: number) => {
      for (const { max, factor, precise } of delayFactors) {
        if (sliderValue <= max) {
          return precise
            ? Math.round(sliderValue * factor * 10) / 10
            : Math.round(sliderValue * factor);
        }
      }
      return sliderValue;
    },
    [delayFactors]
  );

  const realDelay = useMemo(() => getRealDelay(delay), [delay, getRealDelay]);

  const handleDelayChange = (value: number[]) => {
    setDelayAction(value[0]);
  };

  return (
    <div className="grid gap-2">
      <Label className="flex w-full justify-between">
        <span className="label-text">Delay</span>
        <span className="label-text-alt">{realDelay} ms</span>
      </Label>
      <Slider
        id="delay"
        max={100}
        min={0}
        step={1}
        value={[delay]}
        onValueChange={handleDelayChange}
      />
    </div>
  );
}
