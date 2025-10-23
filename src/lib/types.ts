import type { RangeArraySizePowerOfTwo } from "@/components/sorting/RangeArraySizePowerOfTwo";

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

export interface StoreState {
  arrayToSort: number[];
  running: boolean;
  sortTime: number;
  setSortTime: (time: number) => void;
  resetSortTime: () => void;
  setArrayToSort: (array: number[]) => void;
  setRunning: (running: boolean) => void;
  regenerateArray: (size: number) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

export type variantType =
  | "link"
  | "secondary"
  | "default"
  | "destructive"
  | "outline"
  | "ghost"
  | null
  | undefined;

export type RangeControlProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  displayValue?: string;
};

export type SortTimerProps = { time: number };

export type RangeArraySizePowerOfTwoProps = {
  size: number;
  setSizeAction: (value: number) => void;
};

export type ControlButtonsProps = {
  size: number;
  stepAction: () => void;
  resetAction: () => void;
};
