import type { RangeArraySizePowerOfTwo } from '@/components/sorting/RangeArraySizePowerOfTwo';

export type BarsRenderProps = {
  bars: SortElement[];
  spaceWidth?: number;
  backgroundColor?: string;
  colors?: {
    accessed: string;
    sorted: string;
    default: string;
  };
  transitionSpeed?: number;
};

export type AlgorithmSelectorProps = {
  selectAlgorithmAction: (algo: Algorithm) => void;
  selectedAlgorithm: Algorithm | null;
};

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
  access: number[];
  comparison?: number[];
  value?: number;
  stats?: object;
  warning?: string;
  message?: string;
  swap?: boolean;
};

export type SortGenerator = Generator<ProgressIndicator, void, unknown>;

export interface Algorithm {
  name: string;
  function: (array: number[]) => SortGenerator;
  arraySizeComponent?: typeof RangeArraySizePowerOfTwo;
  instance?: SortGenerator;
}
