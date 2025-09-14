'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useStore } from '@/lib/store';

export function RangeArraySize({ size, setSize }) {
  const { running } = useStore();

  const handleSizeChange = (value: number[]) => {
    setSize(value[0]);
  };

  return (
    <div className="grid gap-2">
      <Label className="flex w-full justify-between">
        <span>Array size</span>
        <span>{size} bars</span>
      </Label>
      <Slider
        id="size"
        disabled={running}
        max={1024}
        min={2}
        value={[size]}
        onValueChange={handleSizeChange}
      />
    </div>
  );
}
