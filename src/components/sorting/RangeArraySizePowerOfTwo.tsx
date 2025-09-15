'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function RangeArraySizePowerOfTwo({ 
  size, 
  setSizeAction 
}: { 
  size: number;
  setSizeAction: (value: number) => void;
}) {
  const steps = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
  const { running } = useStore();

  // Find the closest power of two to the current size
  const currentSize = steps.reduce((prev, curr) =>
    Math.abs(curr - size) < Math.abs(prev - size) ? curr : prev
  );

  function handleSizeChange(value: number) {
    if (!running) {
      setSizeAction(value);
    }
  }

  return (
    <div className="mb-2 w-full space-y-2">
      <Label className="flex items-center justify-between">
        <span>Array size</span>
        <span className="text-sm text-muted-foreground">{currentSize} bars</span>
      </Label>

      <div className="flex flex-wrap gap-1">
        {steps.map((value) => (
          <Button
            key={value}
            variant={currentSize === value ? 'default' : 'outline'}
            size="sm"
            className="h-6 px-2 text-xs"
            disabled={running}
            onClick={() => handleSizeChange(value)}
            aria-label={value.toString()}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
}