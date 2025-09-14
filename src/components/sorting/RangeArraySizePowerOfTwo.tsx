'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function RangeArraySizePowerOfTwo({ size }: { size: number }) {
  const steps = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];

  const { running } = useStore();

  // Set initial size to closest power of two
  if (!steps.includes(size)) {
    size = steps.reduce((prev, curr) =>
      Math.abs(curr - size) < Math.abs(prev - size) ? curr : prev
    );
  }

  function setSize(value: number) {
    if (!running) {
      size = value;
    }
  }
  return (
    <div className="mb-2 w-full space-y-2">
      <Label className="flex items-center justify-between">
        <span>Array size</span>
        <span className="text-sm text-muted-foreground">{size} bars</span>
      </Label>

      <div className="flex flex-wrap gap-1">
        {steps.map((value, index) => (
          <Button
            variant={size === value ? 'default' : 'outline'}
            size="sm"
            className="h-6 px-2 text-xs"
            disabled={running}
            onClick={() => setSize(value)}
            aria-label={value.toString()}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
}
