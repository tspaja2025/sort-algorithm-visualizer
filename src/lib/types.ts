import type { RangeArraySizePowerOfTwo } from '@/components/sorting/RangeArraySizePowerOfTwo';

export type SortElement = {
  value: number;
  access: boolean;
};

export type SortContext = {
  updateBars: (b: SortElement[]) => void;
  isStopped: () => boolean;
  delayValue: () => number;
};

export type ProgressIndicator = {
  access: number[]; // list of processing indexes
};

export type SortGenerator = Generator<ProgressIndicator, void, unknown>;

export interface Algorithm {
  name: string;
  function: (array: number[]) => SortGenerator;
  arraySizeComponent?: typeof RangeArraySizePowerOfTwo;
  instance?: SortGenerator;
}
