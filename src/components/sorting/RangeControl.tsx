"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RangeControlProps } from "@/lib/types";

export function RangeControl({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  displayValue,
}: RangeControlProps) {
  return (
    <div className="grid gap-2">
      <Label className="flex justify-between">
        <span>{label}</span>
        <span>{displayValue ?? value}</span>
      </Label>
      <Slider
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
      />
    </div>
  );
}
